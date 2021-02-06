import { Dimensions, StyleSheet } from 'react-native';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export default StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 2.5,
  },
  max: {
    flex: 1,
  },
  inputBox: {
    marginTop: 20,
    paddingHorizontal: 10,
    flex: 1,
    // marginBottom: 100,
  },
  inputContainer: {
    marginVertical: 5,
  },
  input: {
    paddingVertical: 10,
    height: 80,
    borderWidth: 1,
    borderColor: '#3f3f3f',
    backgroundColor: '#f9f9f9',
    padding: 5,
    color: '#777777',
  },
  btnInputs: {
    flexGrow: 0.5,
    justifyContent: 'center',
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 150,
  },
  remoteContainer: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
  roleText: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
  },
});
