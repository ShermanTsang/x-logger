// node_modules/chalk/source/vendor/ansi-styles/index.js
var assembleStyles = function () {
  const codes = new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`,
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false,
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false,
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round(((red - 8) / 247) * 24) + 232;
        }
        return (
          16 +
          36 * Math.round((red / 255) * 5) +
          6 * Math.round((green / 255) * 5) +
          Math.round((blue / 255) * 5)
        );
      },
      enumerable: false,
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString]
            .map((character) => character + character)
            .join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [(integer >> 16) & 255, (integer >> 8) & 255, integer & 255];
      },
      enumerable: false,
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false,
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = (remainder % 6) / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result =
          30 +
          ((Math.round(blue) << 2) |
            (Math.round(green) << 1) |
            Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false,
    },
    rgbToAnsi: {
      value: (red, green, blue) =>
        styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false,
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false,
    },
  });
  return styles;
};
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 =
  (offset = 0) =>
  (code) =>
    `\x1B[${code + offset}m`;
var wrapAnsi256 =
  (offset = 0) =>
  (code) =>
    `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m =
  (offset = 0) =>
  (red, green, blue) =>
    `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    blackBright: [90, 39],
    gray: [90, 39],
    grey: [90, 39],
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39],
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    bgGrey: [100, 49],
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49],
  },
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/index.js
import process from "node:process";
import os from "node:os";
import tty from "node:tty";

var hasFlag = function (
  flag,
  argv = globalThis.Deno ? globalThis.Deno.args : process.argv,
) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return (
    position !== -1 &&
    (terminatorPosition === -1 || position < terminatorPosition)
  );
};
var envForceColor = function () {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0
      ? 1
      : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
};
var translateLevel = function (level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3,
  };
};
var _supportsColor = function (
  haveStream,
  { streamIsTTY, sniffFlags = true } = {},
) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== undefined) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (
      hasFlag("color=16m") ||
      hasFlag("color=full") ||
      hasFlag("color=truecolor")
    ) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === undefined) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (process.platform === "win32") {
    const osRelease = os.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if ("GITHUB_ACTIONS" in env || "GITEA_ACTIONS" in env) {
      return 3;
    }
    if (
      [
        "TRAVIS",
        "CIRCLECI",
        "APPVEYOR",
        "GITLAB_CI",
        "BUILDKITE",
        "DRONE",
      ].some((sign) => sign in env) ||
      env.CI_NAME === "codeship"
    ) {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt(
      (env.TERM_PROGRAM_VERSION || "").split(".")[0],
      10,
    );
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (
    /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)
  ) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
};

function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options,
  });
  return translateLevel(level);
}

var { env } = process;
var flagForceColor;
if (
  hasFlag("no-color") ||
  hasFlag("no-colors") ||
  hasFlag("color=false") ||
  hasFlag("color=never")
) {
  flagForceColor = 0;
} else if (
  hasFlag("color") ||
  hasFlag("colors") ||
  hasFlag("color=true") ||
  hasFlag("color=always")
) {
  flagForceColor = 1;
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
  stderr: createSupportsColor({ isTTY: tty.isatty(2) }),
};
var supports_color_default = supportsColor;

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue +=
      string.slice(endIndex, gotCR ? index - 1 : index) +
      prefix +
      (gotCR ? "\r\n" : "\n") +
      postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var createChalk = function (options) {
  return chalkFactory(options);
};
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = ["ansi", "ansi", "ansi256", "ansi16m"];
var styles2 = Object.create(null);
var applyOptions = (object, options = {}) => {
  if (
    options.level &&
    !(
      Number.isInteger(options.level) &&
      options.level >= 0 &&
      options.level <= 3
    )
  ) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === undefined ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk = (...strings) => strings.join(" ");
  applyOptions(chalk, options);
  Object.setPrototypeOf(chalk, createChalk.prototype);
  return chalk;
};
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(
        this,
        createStyler(style.open, style.close, this[STYLER]),
        this[IS_EMPTY],
      );
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    },
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  },
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(
        ansi_styles_default.rgbToAnsi256(...arguments_),
      );
    }
    return ansi_styles_default[type].ansi(
      ansi_styles_default.rgbToAnsi(...arguments_),
    );
  }
  if (model === "hex") {
    return getModelAnsi(
      "rgb",
      level,
      type,
      ...ansi_styles_default.hexToRgb(...arguments_),
    );
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level } = this;
      return function (...arguments_) {
        const styler = createStyler(
          getModelAnsi(model, levelMapping[level], "color", ...arguments_),
          ansi_styles_default.color.close,
          this[STYLER],
        );
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    },
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level } = this;
      return function (...arguments_) {
        const styler = createStyler(
          getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_),
          ansi_styles_default.bgColor.close,
          this[STYLER],
        );
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    },
  };
}
var proto = Object.defineProperties(() => {}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    },
  },
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === undefined) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent,
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) =>
    applyStyle(
      builder,
      arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "),
    );
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === undefined) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== undefined) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// src/core.ts
var getStyledChalkInstance = function (styles3 = [], text) {
  return styles3.reduce((accumulator, currentStyle) => {
    return source_default[currentStyle](accumulator);
  }, text);
};

class Logger {
  _message = "";
  _messageStyles = [];
  _tag = null;
  _tagStyles = [];
  _data;
  _displayTime = false;
  _prependDivider = false;
  _prependDividerStyles = [];
  _prependDividerLength = 1;
  _prependDividerChar = "-";
  _appendDivider = false;
  _appendDividerStyles = [];
  _appendDividerChar = "-";
  _appendDividerLength = 1;
  _singleDivider = false;
  _singleDividerStyles = [];
  _singleDividerChar = "-";
  _singleDividerLength = 1;

  constructor(tagStyles) {
    this._tagStyles = tagStyles;
  }

  static stylesMap = {
    info: ["bgBlueBright"],
    warn: ["bgYellowBright"],
    error: ["bgRedBright"],
    debug: ["bgCyanBright"],
    success: ["bgGreenBright"],
    failure: ["bgRedBright"],
    plain: ["white"],
  };

  static getLoggerInstance(type, styles3) {
    styles3 && (Logger.stylesMap[type] = styles3);
    return new this(Logger.stylesMap[type]);
  }

  static type(type, styles3) {
    if (type in Logger && styles3) {
      console.log(
        source_default.yellow.underline(
          `Logger type "${String(type)}" is preset. Add custom getter will override the preset.`,
        ),
      );
    }
    const loggerInstance = Logger.getLoggerInstance(type, styles3);
    Object.defineProperty(Logger, type, {
      get() {
        return loggerInstance;
      },
      configurable: true,
      enumerable: true,
    });
    return loggerInstance;
  }

  static get plain() {
    return this.getLoggerInstance("plain");
  }

  static get info() {
    return this.getLoggerInstance("info");
  }

  static get warn() {
    return this.getLoggerInstance("warn");
  }

  static get error() {
    return this.getLoggerInstance("error");
  }

  static get debug() {
    return this.getLoggerInstance("debug");
  }

  static get success() {
    return this.getLoggerInstance("success");
  }

  static get failure() {
    return this.getLoggerInstance("failure");
  }

  setDividerProperties(type, char, length, styles3) {
    const prefix =
      type === "prepend"
        ? "_prependDivider"
        : type === "append"
          ? "_appendDivider"
          : "_singleDivider";
    this[`${prefix}`] = true;
    this[`${prefix}Char`] = char || this[`${prefix}Char`];
    this[`${prefix}Styles`] = styles3 || this[`${prefix}Styles`];
    this[`${prefix}Length`] =
      length || (char && char.length === 1 ? 40 : this[`${prefix}Length`]);
  }

  divider(char, length, styles3 = ["gray"]) {
    this.setDividerProperties("single", char, length, styles3);
    this.print();
  }

  prependDivider(char, length, styles3) {
    this.setDividerProperties("prepend", char, length, styles3);
    return this;
  }

  appendDivider(char, length, styles3) {
    this.setDividerProperties("append", char, length, styles3);
    return this;
  }

  displayTime(isShow) {
    this._displayTime = isShow;
    return this;
  }

  message(message, styles3) {
    this._message = message;
    styles3 && (this._messageStyles = styles3);
    return this;
  }

  tag(tag, styles3) {
    this._tag = tag;
    styles3 && (this._tagStyles = styles3);
    return this;
  }

  data(data) {
    this._data = data;
    return this;
  }

  formatMessage() {
    let formattedMessage = this._message;
    if (formattedMessage) {
      formattedMessage = formattedMessage.replace(
        /\[\[(.+?)\]\]/g,
        source_default.underline.yellow("$1"),
      );
    }
    return getStyledChalkInstance(this._messageStyles, formattedMessage);
  }

  formatTag() {
    if (!this._tag) {
      return "";
    }
    const tag = this._tag.trim();
    const unifiedTag = ` ${tag.charAt(0).toUpperCase()}${tag.slice(1)} `;
    return getStyledChalkInstance(this._tagStyles, unifiedTag);
  }

  print() {
    if (this._singleDivider) {
      console.log(
        getStyledChalkInstance(
          this._singleDividerStyles,
          this._singleDividerChar.repeat(this._singleDividerLength),
        ),
      );
      return;
    }
    const tag = this.formatTag();
    const message = this.formatMessage();
    const time = this._displayTime
      ? source_default.gray(new Date().toLocaleTimeString())
      : "";
    if (this._prependDivider) {
      console.log(
        getStyledChalkInstance(
          this._prependDividerStyles,
          this._prependDividerChar.repeat(this._prependDividerLength),
        ),
      );
    }
    const output = `${time} ${tag} ${message}`.trim();
    console.log(output);
    if (this._appendDivider) {
      console.log(
        getStyledChalkInstance(
          this._appendDividerStyles,
          this._appendDividerChar.repeat(this._appendDividerLength),
        ),
      );
    }
    if (this._data) {
      console.log(this._data);
    }
  }
}

// src/wrapper.ts
var loggerProxy = new Proxy(Logger, {
  get(target, prop, receiver) {
    if (!(prop in target)) {
      return function (...args) {
        const [customType, styles3] = [prop, args[0]];
        if (styles3 && typeof styles3 === "object") {
          Logger.type(customType, styles3);
          return Logger.getLoggerInstance(customType, styles3);
        } else {
          throw new TypeError(
            `Invalid arguments for adding a new logger getter.`,
          );
        }
      };
    }
    return Reflect.get(target, prop, receiver);
  },
});
export { loggerProxy as logger, Logger };
