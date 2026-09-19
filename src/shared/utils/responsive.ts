// src/shared/utils/responsive.ts

import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// Design reference size.
// You can use the same base you designed your UI around.
const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

export const scale = (size: number) => {
  return (width / DESIGN_WIDTH) * size;
};

export const verticalScale = (size: number) => {
  return (height / DESIGN_HEIGHT) * size;
};

export const moderateScale = (size: number, factor: number = 0.5) => {
  return size + (scale(size) - size) * factor;
};

export const fontScale = (size: number) => {
  return moderateScale(size, 0.4);
};

export const radius = (size: number) => {
  return moderateScale(size, 0.5);
};

export const wp = (percentage: number) => {
  return (width * percentage) / 100;
};

export const hp = (percentage: number) => {
  return (height * percentage) / 100;
};

export const normalizeFont = (size: number) => {
  const scaled = fontScale(size);

  return PixelRatio.roundToNearestPixel(scaled);
};
