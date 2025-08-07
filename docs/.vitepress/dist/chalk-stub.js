// Chalk stub for browser environments
// This file provides a lightweight replacement for chalk that returns plain text

// Simple proxy-based stub that returns text as-is
const chalkStub = new Proxy({}, {
  get(target, prop) {
    if (typeof prop === 'string') {
      // Return a function that just returns the text without styling
      return function(text) {
        // Support chaining by returning another proxy
        const result = String(text)
        return new Proxy(() => result, {
          get: () => chalkStub[prop],
          apply: () => result
        })
      }
    }
    return target[prop]
  }
})

// Alternative: Explicit method implementation
const explicitChalkStub = {
  // Color methods
  black: (text) => text,
  red: (text) => text,
  green: (text) => text,
  yellow: (text) => text,
  blue: (text) => text,
  magenta: (text) => text,
  cyan: (text) => text,
  white: (text) => text,
  gray: (text) => text,
  grey: (text) => text,
  
  // Bright colors
  blackBright: (text) => text,
  redBright: (text) => text,
  greenBright: (text) => text,
  yellowBright: (text) => text,
  blueBright: (text) => text,
  magentaBright: (text) => text,
  cyanBright: (text) => text,
  whiteBright: (text) => text,
  
  // Background colors
  bgBlack: (text) => text,
  bgRed: (text) => text,
  bgGreen: (text) => text,
  bgYellow: (text) => text,
  bgBlue: (text) => text,
  bgMagenta: (text) => text,
  bgCyan: (text) => text,
  bgWhite: (text) => text,
  bgGray: (text) => text,
  bgGrey: (text) => text,
  
  // Bright background colors
  bgBlackBright: (text) => text,
  bgRedBright: (text) => text,
  bgGreenBright: (text) => text,
  bgYellowBright: (text) => text,
  bgBlueBright: (text) => text,
  bgMagentaBright: (text) => text,
  bgCyanBright: (text) => text,
  bgWhiteBright: (text) => text,
  
  // Style methods
  bold: (text) => text,
  dim: (text) => text,
  italic: (text) => text,
  underline: (text) => text,
  strikethrough: (text) => text,
  inverse: (text) => text,
  hidden: (text) => text,
  visible: (text) => text,
  reset: (text) => text
}

// Make methods chainable for the explicit stub
Object.keys(explicitChalkStub).forEach(key => {
  const originalMethod = explicitChalkStub[key]
  explicitChalkStub[key] = function(text) {
    const result = originalMethod(text)
    // Return a chainable object
    const chainable = Object.assign(() => result, explicitChalkStub)
    chainable.toString = () => result
    return chainable
  }
})

// Export the proxy-based stub (recommended for smaller bundle size)
export default chalkStub

// Uncomment the line below to use the explicit stub instead
// export default explicitChalkStub

// Usage examples:
// import chalk from './chalk-stub.js'
// 
// console.log(chalk.red('This will be plain text'))
// console.log(chalk.bold.blue('This will also be plain text'))
// console.log(chalk.bgRed.white('No styling applied'))