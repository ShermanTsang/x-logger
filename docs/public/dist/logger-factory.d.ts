/**
 * Logger Factory - Automatically selects the appropriate logger implementation based on environment
 */
import type { BaseLogger as IBaseLogger, BaseStreamLogger as IBaseStreamLogger, Type, CallableLogger } from './typings';
import { BrowserStreamLogger } from './logger/browser';
import type { BaseLogger, BaseStreamLogger } from './logger/base';
/**
 * Factory class that creates the appropriate logger instance based on the current environment
 */
export declare class LoggerFactory {
    /**
     * Creates a logger instance appropriate for the current environment
     */
    static createLogger(prefixStyles?: Type.Styles): BaseLogger;
    /**
     * Creates a stream logger instance appropriate for the current environment
     */
    static createStreamLogger(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger | BrowserStreamLogger;
    /**
     * Creates a logger instance with valid condition
     */
    static valid(isValid?: boolean): CallableLogger;
    /**
     * Gets a logger instance for a specific type
     */
    static getLoggerInstance(type: Type.Type, styles?: Type.Styles): CallableLogger;
    /**
     * Creates and registers a custom logger type
     */
    static type(type: Type.Type, styles?: Type.Styles): CallableLogger;
    /**
     * Gets a stream logger instance
     */
    static get stream(): BaseStreamLogger | BrowserStreamLogger;
    /**
     * Gets predefined logger types - can be used as both getters and methods
     */
    static get plain(): CallableLogger;
    static get info(): CallableLogger;
    static get warn(): CallableLogger;
    static get error(): CallableLogger;
    static get debug(): CallableLogger;
    static get success(): CallableLogger;
    static get failure(): CallableLogger;
}
/**
 * Unified Logger class that provides the same API as the original Logger
 * but uses the factory pattern internally to select the appropriate implementation
 */
export declare class Logger implements IBaseLogger {
    private _instance;
    static stylesMap: any;
    static readonly [Symbol.hasInstance]: (instance: any) => any;
    constructor(prefixStyles?: Type.Styles);
    static getLoggerInstance(type: Type.Type, styles?: Type.Styles): CallableLogger;
    static valid(isValid?: boolean): CallableLogger;
    static type(type: Type.Type, styles?: Type.Styles): CallableLogger;
    static get stream(): BaseStreamLogger | BrowserStreamLogger;
    static get plain(): CallableLogger;
    static get info(): CallableLogger;
    static get warn(): CallableLogger;
    static get error(): CallableLogger;
    static get debug(): CallableLogger;
    static get success(): CallableLogger;
    static get failure(): CallableLogger;
    text(...args: any[]): this;
    detail(detail: string, styles?: Type.Styles): this;
    prefix(prefix: string, styles?: Type.Styles): this;
    data(data: any): this;
    time(isDisplay?: boolean): this;
    styles(styles: Type.Styles): this;
    divider(char?: string, length?: number, styles?: Type.Styles): this;
    prependDivider(char?: string, length?: number, styles?: Type.Styles): this;
    appendDivider(char?: string, length?: number, styles?: Type.Styles): this;
    print(isValid?: boolean): void;
    toString(): string;
    toObject(): this;
    toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger | BrowserStreamLogger;
    valid(isValid?: boolean): this;
    decorateText(content: string, styles?: Type.Styles): string;
    printOutput(output: string): void;
    printDivider(text: string, styles: Type.Styles): void;
    [key: string]: any;
}
/**
 * Unified StreamLogger class that provides the same API as the original StreamLogger
 * but uses the factory pattern internally to select the appropriate implementation
 */
export declare class StreamLogger implements IBaseStreamLogger {
    private _instance;
    constructor(prefix?: string, prefixStyles?: Type.Styles);
    static create(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger | BrowserStreamLogger;
    text(...args: any[]): this;
    detail(detail?: string, styles?: Type.Styles): this;
    prefix(prefix: string, styles?: Type.Styles): this;
    data(data: any): this;
    time(isDisplay?: boolean): this;
    styles(styles: Type.Styles): this;
    divider(char?: string, length?: number, styles?: Type.Styles): this;
    prependDivider(char?: string, length?: number, styles?: Type.Styles): this;
    appendDivider(char?: string, length?: number, styles?: Type.Styles): this;
    print(isValid?: boolean): void;
    toString(): string;
    toObject(): this;
    toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger | BrowserStreamLogger;
    decorateText(content: string, styles?: Type.Styles): string;
    printOutput(output: string): void;
    printDivider(text: string, styles: Type.Styles): void;
    delay(delay: number): this;
    state(state: 'start' | 'stop' | 'succeed' | 'fail'): this;
    update(): this;
    asyncUpdate(delay?: number): Promise<void>;
    valid(isValid?: boolean): this;
    initializeStream(): void;
    updateStream(output: string): Promise<void> | void;
    finalizeStream(state: 'start' | 'stop' | 'succeed' | 'fail', output: string): Promise<void> | void;
    succeed(output?: string): this;
    fail(output?: string): this;
    start(output?: string): this;
    stop(output?: string): this;
    [key: string]: any;
}
