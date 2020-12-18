import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  containerButtonPadraoTemp: {
    borderWidth: 0,
    backgroundColor: '#00BFFF',
    width: 60,
    height: 60,
    borderRadius: 60,
    alignSelf: 'center',
    position: 'absolute',
    alignItems: 'center',
    marginTop: Dimensions.get("window").height * 0.75,
    justifyContent: 'center',
    right: 40
  },
});
export default styles;

