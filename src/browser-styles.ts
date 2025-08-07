/**
 * Browser console styling mappings for cross-platform text styling
 */

/**
 * Maps style names to CSS properties for browser console styling
 */
export const browserStylesMap: Record<string, string> = {
  // Colors
  black: 'color: #000000',
  red: 'color: #ff0000',
  green: 'color: #008000',
  yellow: 'color: #ffff00',
  blue: 'color: #0000ff',
  magenta: 'color: #ff00ff',
  cyan: 'color: #00ffff',
  white: 'color: #ffffff',
  gray: 'color: #808080',
  grey: 'color: #808080',

  // Bright colors
  redBright: 'color: #ff5555',
  greenBright: 'color: #55ff55',
  yellowBright: 'color: #ffff55',
  blueBright: 'color: #5555ff',
  magentaBright: 'color: #ff55ff',
  cyanBright: 'color: #55ffff',
  whiteBright: 'color: #ffffff',

  // Background colors
  bgBlack: 'background-color: #000000; color: #ffffff',
  bgRed: 'background-color: #ff0000; color: #ffffff',
  bgGreen: 'background-color: #008000; color: #ffffff',
  bgYellow: 'background-color: #ffff00; color: #000000',
  bgBlue: 'background-color: #0000ff; color: #ffffff',
  bgMagenta: 'background-color: #ff00ff; color: #ffffff',
  bgCyan: 'background-color: #00ffff; color: #000000',
  bgWhite: 'background-color: #ffffff; color: #000000',

  // Bright background colors
  bgRedBright:
    'background-color: #ff5555; color: #ffffff; padding: 2px 4px; border-radius: 3px',
  bgGreenBright:
    'background-color: #55ff55; color: #000000; padding: 2px 4px; border-radius: 3px',
  bgYellowBright:
    'background-color: #ffff55; color: #000000; padding: 2px 4px; border-radius: 3px',
  bgBlueBright:
    'background-color: #5555ff; color: #ffffff; padding: 2px 4px; border-radius: 3px',
  bgMagentaBright:
    'background-color: #ff55ff; color: #ffffff; padding: 2px 4px; border-radius: 3px',
  bgCyanBright:
    'background-color: #55ffff; color: #000000; padding: 2px 4px; border-radius: 3px',
  bgWhiteBright:
    'background-color: #ffffff; color: #000000; padding: 2px 4px; border-radius: 3px',

  // Text decorations
  bold: 'font-weight: bold',
  dim: 'opacity: 0.5',
  italic: 'font-style: italic',
  underline: 'text-decoration: underline',
  strikethrough: 'text-decoration: line-through',
}
