import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
  ClientRole,
  ChannelProfile,
} from 'react-native-agora';

import requestCameraAndAudioPermission from './components/Permission';
import styles from './components/Style';

/**
 * @property appId Agora App ID
 * @property token Token for the channel;
 * @property isHost Boolean value to select between broadcaster and audience
 * @property channelName Channel Name for the current session
 * @property joinSucceed State variable for storing success
 * @property peerIds Array for storing connected peers
 */
interface State {
  appId: string;
  token: string;
  isHost: boolean;
  channelName: string;
  joinSucceed: boolean;
  peerIds: number[];
  hideInput: boolean;
}

export default class App extends Component<null, State> {
  _engine?: RtcEngine;

  constructor(props) {
    super(props);
    this.state = {
      appId: 'd6bf148cb466406aaa5495b40d0d5ce6',
      token:
        '006d6bf148cb466406aaa5495b40d0d5ce6IADRJbyYUpZGSQ8NO2AaXEBDXG9u8mlWfeFNGcxTuQw3EQJkFYoAAAAAEABoKgnHW54cYAEAAQBbnhxg',
      isHost: true,
      channelName: 'channel-x',
      joinSucceed: false,
      peerIds: [],
      hideInput: true,
    };
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }
  }

  componentDidMount() {
    this.init();
  }

  /**
   * @name init
   * @description Function to initialize the Rtc Engine, attach event listeners and actions
   */
  init = async () => {
    const { appId } = this.state;
    this._engine = await RtcEngine.create(appId);
    await this._engine.enableVideo();
    await this._engine?.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await this._engine?.setClientRole(
      this.state.isHost ? ClientRole.Broadcaster : ClientRole.Audience
    );

    this._engine.addListener('Warning', (warn) => {
      console.log('Warning', warn);
    });

    this._engine.addListener('Error', (err) => {
      console.log('Error', err);
    });

    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      const { peerIds } = this.state;
      // If new user
      if (peerIds.indexOf(uid) === -1) {
        this.setState({
          // Add peer ID to state array
          peerIds: [...peerIds, uid],
        });
      }
    });

    this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      const { peerIds } = this.state;
      this.setState({
        // Remove peer ID from state array
        peerIds: peerIds.filter((id) => id !== uid),
      });
    });

    // If Local user joins RTC channel
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      this.setState({
        joinSucceed: true,
      });
    });
  };

  /**
   * @name toggleRoll
   * @description Function to toggle the roll between broadcaster and audience
   */
  toggleRoll = async () => {
    // Join Channel using null token and channel name
    this.setState(
      {
        isHost: !this.state.isHost,
      },
      async () => {
        await this._engine?.setClientRole(
          this.state.isHost ? ClientRole.Broadcaster : ClientRole.Audience
        );
      }
    );
  };

  /**
   * @name startCall
   * @description Function to start the call
   */
  startCall = async () => {
    // Join Channel using null token and channel name
    await this._engine?.joinChannel(
      this.state.token,
      this.state.channelName,
      null,
      0
    );
  };

  /**
   * @name endCall
   * @description Function to end the call
   */
  endCall = async () => {
    await this._engine?.leaveChannel();
    this.setState({ peerIds: [], joinSucceed: false });
  };

  _renderVideos = () => {
    const { joinSucceed } = this.state;
    return joinSucceed ? (
      <View style={styles.fullView}>
        {this.state.isHost ? (
          <RtcLocalView.SurfaceView
            style={styles.max}
            channelId={this.state.channelName}
            renderMode={VideoRenderMode.Hidden}
          />
        ) : (
          <></>
        )}
        {this._renderRemoteVideos()}
      </View>
    ) : null;
  };

  _renderRemoteVideos = () => {
    const { peerIds } = this.state;
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={styles.contentContainer}
        horizontal={true}
      >
        {peerIds.map((value) => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={this.state.channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
              key={value}
            />
          );
        })}
      </ScrollView>
    );
  };

  _renderInputs = () => {
    return (
      <View style={styles.inputBox}>
        <View style={styles.inputContainer}>
          <Text>App ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter.."
            multiline
            numberOfLines={20}
            value={this.state.appId}
            onChangeText={(txt) => this.setState({ appId: txt })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Channel Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter.."
            multiline
            numberOfLines={20}
            value={this.state.channelName}
            onChangeText={(txt) => this.setState({ channelName: txt })}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Temp Token:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter.."
            multiline
            numberOfLines={20}
            value={this.state.token}
            onChangeText={(txt) => this.setState({ token: txt })}
          />
        </View>
        <View style={styles.btnInputs}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ hideInput: !this.state.hideInput })}
          >
            <Text style={styles.buttonText}> Save </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return this.state.hideInput ? (
      this._renderInputs()
    ) : (
      <SafeAreaView style={styles.max}>
        <View style={styles.max}>
          <View style={styles.max}>
            <Text style={styles.roleText}>
              {' '}
              You're {this.state.isHost ? 'a broadcaster' : 'the audience'}
            </Text>
            <View style={styles.buttonHolder}>
              <TouchableOpacity onPress={this.toggleRoll} style={styles.button}>
                <Text style={styles.buttonText}> Toggle Role </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.startCall} style={styles.button}>
                <Text style={styles.buttonText}> Start Call </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.endCall} style={styles.button}>
                <Text style={styles.buttonText}> End Call </Text>
              </TouchableOpacity>
            </View>
            {this._renderVideos()}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
