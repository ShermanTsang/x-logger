/**
 * Node Logger - Node.js-specific logger implementation with Chalk integration
 */
import type { Ora } from 'ora';
import type { Type } from '../typings';
import { BaseLogger, BaseStreamLogger } from './base';
/**
 * Node.js-specific logger implementation with Chalk styling support
 */
export declare class NodeLogger extends BaseLogger {
    constructor(prefixStyles?: Type.Styles);
    static getLoggerInstance(type: Type.Type, styles?: Type.Styles): import('../typings').CallableLogger;
    static type(type: Type.Type, styles?: Type.Styles): import('../typings').CallableLogger;
    static get stream(): NodeStreamLogger;
    static get plain(): import('../typings').CallableLogger;
    static get info(): import('../typings').CallableLogger;
    static get warn(): import('../typings').CallableLogger;
    static get error(): import('../typings').CallableLogger;
    static get debug(): import('../typings').CallableLogger;
    static get success(): import('../typings').CallableLogger;
    static get failure(): import('../typings').CallableLogger;
    decorateText(content: string, styles?: Type.Styles): string;
    printOutput(output: string): void;
    printDivider(text: string, styles: Type.Styles): void;
    toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger;
    private getStyledChalkInstance;
}
/**
 * Node.js-specific stream logger with Ora spinner support
 */
export declare class NodeStreamLogger extends BaseStreamLogger {
    protected _spinner: Ora | undefined;
    private _isInitialized;
    private _initializationPromise;
    constructor(prefix?: string, prefixStyles?: Type.Styles);
    private initializeStreamAsync;
    private ensureInitialized;
    initializeStream(): void;
    updateStream(output: string): Promise<void>;
    finalizeStream(state: Type.StreamLoggerState, output: string): Promise<void>;
    prefix(prefix: string, styles?: Type.Styles): this;
    decorateText(content: string, styles?: Type.Styles): string;
    printOutput(output: string): void;
    printDivider(text: string, styles: Type.Styles): void;
    toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger;
    private getStyledChalkInstance;
}
