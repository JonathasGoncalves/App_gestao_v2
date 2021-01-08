import { Dimensions, StyleSheet, PixelRatio } from 'react-native';

var FONT_SIZE_TITULOS = 20;
var FONT_SIZE_TEXT = 18;
var FONT_SIZE_LIST = 18;
var FONT_SIZE_CARD = 16;
var MARGIN_PADRAO_LATERAL = 10;
var MARGIN_LABEL = 5;
var MARGIN_MAIOR_LATERAL = 20;
var INPUT_HEIGHT = 70;
var BUTTON_WIDTH = 200;
var MARGIN_TOP = 30;
var MARGIN_TOP_CARD = 20;
var MARGIN_TOP_ITEN = 10;

if (PixelRatio.get() <= 2) {
  FONT_SIZE_TEXT = 16;
  FONT_SIZE_TITULOS = 18;
  FONT_SIZE_LIST = 14;
  FONT_SIZE_CARD = 14;
  MARGIN_PADRAO_LATERAL = 5;
  MARGIN_LABEL = 3;
  INPUT_HEIGHT = 50;
  BUTTON_WIDTH = 170;
  MARGIN_TOP = 20;
  MARGIN_MAIOR_LATERAL = 18;
  MARGIN_TOP_CARD = 15;
  MARGIN_TOP_ITEN = 5;
}

const styles = StyleSheet.create({
  viewRow: {
    marginBottom: MARGIN_TOP_ITEN,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textLabel: {
    marginLeft: MARGIN_PADRAO_LATERAL,
    fontSize: FONT_SIZE_CARD,
    fontWeight: 'bold',
    color: 'black'
  },
  textInput: {
    marginLeft: MARGIN_LABEL,
    fontSize: FONT_SIZE_CARD,
    color: 'black'
  },
  viewColunn: {

  },
  viewCard: {
    marginTop: MARGIN_TOP_CARD,
    borderBottomWidth: 0.5
  },
  searchBarCont: {
    backgroundColor: 'white',
    borderWidth: 0,
    height: INPUT_HEIGHT - 15
  },
  searchBar: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    height: INPUT_HEIGHT,
    marginLeft: MARGIN_PADRAO_LATERAL,
    marginRight: MARGIN_PADRAO_LATERAL
  },
});

export default styles;