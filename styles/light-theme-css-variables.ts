import { themeLight } from '@lidofinance/lido-ui';

// Light-only replacement for LidoUIHead's theme CSS: no dark blocks and no
// theme-detection script, so a dark cookie / dark OS theme can't flash the UI
// before hydration. Mirrors lido-ui's generate-css-color-variables output.
const toRgbChannels = (color: string): number[] | null => {
  if (/^#[\da-fA-F]{3}$/.test(color)) {
    return [color[1] + color[1], color[2] + color[2], color[3] + color[3]].map(
      (channel) => parseInt(channel, 16),
    );
  }
  if (/^#[\da-fA-F]{6}$/.test(color)) {
    return [color.slice(1, 3), color.slice(3, 5), color.slice(5, 7)].map(
      (channel) => parseInt(channel, 16),
    );
  }
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) {
    return color
      .replace(/^.*\((.*)\).*$/, '$1')
      .split(',')
      .slice(0, 3)
      .map((channel) => parseInt(channel, 10));
  }
  return null;
};

const lightColorVariables = Object.entries(themeLight.colors)
  .map(([colorName, colorValue]) => {
    const rgbChannels = toRgbChannels(colorValue);
    if (rgbChannels) {
      return `--lido-color-${colorName}: ${colorValue};\n--lido-rgb-${colorName}: ${rgbChannels.join(',')};\n`;
    }
    return `--lido-color-${colorName}: ${colorValue};\n`;
  })
  .join('');

export const lightThemeGlobalCss = `html {\n${lightColorVariables}}`;
