// Ensure window is available in test environments
let window: Window & typeof globalThis
let document: Document

// Global type declarations for browser compatibility and testing
declare global {
  interface GlobalThis {
    window?: Window & typeof globalThis
    document?: Document
    [key: string]: any
  }

  // Extend Navigator interface for testing
  interface Navigator {
    [key: string]: any
  }
}

// Augment the globalThis object to allow index access
declare const globalThis: GlobalThis & {
  [key: string]: any
}

export {}
