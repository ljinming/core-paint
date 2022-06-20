export const rgbToHex = (r: number, g: number, b: number, a?: number) => {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${
    a === 1 ? "" : toHex(Math.floor(a * 255))
  }`;
};
export const toHex = (n: number) => `${n > 15 ? "" : 0}${n.toString(16)}`;
