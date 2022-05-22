import { Platform } from "react-native";

const HORIZONTAL_SPACING_BASE = Platform.OS === "web" ? 4 : 2;
const VERTICAL_SPACING_BASE = 4;

const lightColors = {
  primaryBackground: "#ffffff",
  secondaryBackground: "#ffffff",
  primaryForeground: "#4395f8",
  secondaryForeground: "#8442bd",
  foregroundContrast: "white",
  primaryText: "#000000",
  secondaryText: "#7e7e7e",
  hairline: "#dfdfdf",
  grey0: "#fafafa",
  grey3: "#f5f5f5",
  grey6: "#d6d6d6",
  grey9: "#939393",
  red: "#ea0606",
};

const EarthMMOTheme = {
  colors: {
    light: lightColors,
    "no-preference": lightColors,
    dark: {
      primaryBackground: "#000000",
      secondaryBackground: "#000000",
      primaryForeground: "#4395f8",
      secondaryForeground: "#8442bd",
      foregroundContrast: "white",
      primaryText: "white",
      secondaryText: "#dddddd",
      hairline: "#303030",
      grey0: "#0a0a0a",
      grey3: "#2a2a2a",
      grey6: "#f5f5f5",
      grey9: "#eaeaea",
      red: "#ea0606",
    },
  },
  spaces: {
    horizontal: {
      s: 2 * HORIZONTAL_SPACING_BASE,
      m: 4 * HORIZONTAL_SPACING_BASE,
      l: 6 * HORIZONTAL_SPACING_BASE,
      xl: 8 * HORIZONTAL_SPACING_BASE,
    },
    vertical: {
      s: 2 * VERTICAL_SPACING_BASE,
      m: 4 * VERTICAL_SPACING_BASE,
      l: 6 * VERTICAL_SPACING_BASE,
      xl: 8 * VERTICAL_SPACING_BASE,
    },
  },
  fontSizes: {
    xxs: 8,
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeights: {
    s: "400",
    m: "600",
    l: "800",
  },
  //icons: icons,
  // color, font size, space / margin / padding, vstack / hstack
  button: {
    borderRadius: 8,
  },
};

export default EarthMMOTheme;
