// Example Vite configuration for excluding chalk from builds
// Copy this file to your project root as vite.config.js

import { defineConfig } from 'vite'

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  const isBrowser = process.env.TARGET === 'browser'
  const isServerless = process.env.TARGET === 'serverless'
  
  return {
    // Build configuration
    build: {
      // Target configuration
      target: isBrowser ? 'es2015' : 'node14',
      
      // Minification
      minify: isProduction ? 'terser' : false,
      
      // Terser options for production builds
      terserOptions: isProduction ? {
        compress: {
          drop_console: isServerless, // Remove console.log in serverless builds
          drop_debugger: true,
        },
      } : {},
      
      // Rollup options
      rollupOptions: {
        // External dependencies - don't bundle these
        external: (id) => {
          // Always exclude chalk and ora for browser builds
          if (isBrowser) {
            return ['chalk', 'ora'].includes(id)
          }
          
          // For serverless, exclude optional dependencies to reduce bundle size
          if (isServerless) {
            return ['chalk', 'ora'].includes(id)
          }
          
          // For Node.js builds, you can choose to include or exclude
          // Excluding reduces bundle size but requires runtime installation
          return ['chalk', 'ora'].includes(id)
        },
        
        // Output configuration
        output: {
          // Global variables for UMD builds
          globals: {
            'chalk': 'chalk',
            'ora': 'ora'
          },
          
          // Manual chunks for code splitting (disable for serverless)
          manualChunks: isServerless ? undefined : {
            vendor: ['@shermant/logger']
          }
        }
      },
      
      // Library mode configuration (if building a library)
      lib: isBrowser ? {
        entry: 'src/index.ts',
        name: 'ShermanLogger',
        formats: ['es', 'umd'],
        fileName: (format) => `sherman-logger.${format}.js`
      } : undefined
    },
    
    // Define global constants
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.TARGET': JSON.stringify(process.env.TARGET || 'node'),
      // Disable chalk in browser builds
      '__DISABLE_CHALK__': isBrowser
    },
    
    // Resolve configuration
    resolve: {
      // Alias configuration for replacing dependencies
      alias: isBrowser ? {
        // Replace chalk with a stub for browser builds
        'chalk': new URL('./stubs/chalk-stub.js', import.meta.url).pathname
      } : {},
      
      // Fallback configuration for browser builds
      fallback: isBrowser ? {
        'chalk': false,
        'ora': false,
        'process': false,
        'util': false
      } : {}
    },
    
    // Optimization configuration
    optimizeDeps: {
      // Include dependencies that should be pre-bundled
      include: isBrowser ? [] : ['@shermant/logger'],
      
      // Exclude dependencies from pre-bundling
      exclude: ['chalk', 'ora']
    },
    
    // Development server configuration
    server: {
      // CORS configuration for development
      cors: true,
      
      // Port configuration
      port: 3000,
      
      // Open browser automatically
      open: isBrowser
    }
  }
})

// Example package.json scripts to use with this configuration:
/*
{
  "scripts": {
    "dev": "vite",
    "build": "npm run build:node && npm run build:browser && npm run build:serverless",
    "build:node": "vite build --mode production",
    "build:browser": "TARGET=browser vite build --mode production",
    "build:serverless": "TARGET=serverless vite build --mode production",
    "preview": "vite preview"
  }
}
*/

// Example chalk stub file (create as stubs/chalk-stub.js):
/*
// stubs/chalk-stub.js
export default new Proxy({}, {
  get(target, prop) {
    if (typeof prop === 'string') {
      return (text) => text // Return text as-is without styling
    }
    return target[prop]
  }
})

// Or a more sophisticated stub:
const chalkStub = {
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
  
  // Style methods
  bold: (text) => text,
  dim: (text) => text,
  italic: (text) => text,
  underline: (text) => text,
  strikethrough: (text) => text,
  
  // Background methods
  bgBlack: (text) => text,
  bgRed: (text) => text,
  bgGreen: (text) => text,
  bgYellow: (text) => text,
  bgBlue: (text) => text,
  bgMagenta: (text) => text,
  bgCyan: (text) => text,
  bgWhite: (text) => text
}

// Make all methods chainable
Object.keys(chalkStub).forEach(key => {
  const originalMethod = chalkStub[key]
  chalkStub[key] = function(text) {
    const result = originalMethod(text)
    // Return an object with all chalk methods for chaining
    return Object.assign(() => result, chalkStub)
  }
})

export default chalkStub
*/