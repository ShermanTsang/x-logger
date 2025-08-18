/**
 * Browser Logger - Browser-specific logger implementation with CSS styling
 */
import type { BrowserStreamLogger as IBrowserStreamLogger, Type } from '../typings';
import { BaseLogger } from './base';
/**
 * Browser-specific logger implementation with CSS styling support
 */
export declare class BrowserLogger extends BaseLogger {
    constructor(prefixStyles?: Type.Styles);
    static getLoggerInstance(type: Type.Type, styles?: Type.Styles): import('../typings').CallableLogger;
    static type(type: Type.Type, styles?: Type.Styles): import('../typings').CallableLogger;
    static get stream(): BrowserStreamLogger;
    static get plain(): import('../typings').CallableLogger;
    static get info(): import('../typings').CallableLogger;
    static get warn(): import('../typings').CallableLogger;
    static get error(): import('../typings').CallableLogger;
    static get debug(): import('../typings').CallableLogger;
    static get success(): import('../typings').CallableLogger;
    static get failure(): import('../typings').CallableLogger;
    toStream(prefix?: string, prefixStyles?: Type.Styles): BrowserStreamLogger;
    decorateText(content: string, styles?: Type.Styles): string;
    printOutput(output: string): void;
    printDivider(text: string, styles: Type.Styles): void;
    private getStyledText;
}
/**
 * Browser-specific stream logger with CSS-styled console output
 * Note: Stream operations return void in browser environments as interactive streaming is not supported
 */
export declare class BrowserStreamLogger extends BaseLogger implements IBrowserStreamLogger {
    protected _state: 'start' | 'stop' | 'succeed' | 'fail' | undefined;
    protected _delay: number;
    _loggerType: 'normal' | 'stream';
    constructor(prefix?: string, prefixStyles?: Type.Styles);
    initializeStream(): void;
    updateStream(output: string): void;
    finalizeStream(state: Type.StreamLoggerState, output: string): void;
    prefix(prefix: string, styles?: Type.Styles): this;
    text(text?: string, styles?: Type.Styles): this;
    detail(detail?: string, styles?: Type.Styles): this;
    data(data: any): this;
    delay(_delay: number): this;
    asyncUpdate(_delay?: number): Promise<void>;
    state(state: 'start' | 'stop' | 'succeed' | 'fail'): this;
    update(): void;
    succeed(output?: string): this;
    fail(output?: string): this;
    start(output?: string): this;
    stop(output?: string): this;
    decorateText(content: string, styles?: Type.Styles): string;
    printOutput(output: string): void;
    printDivider(text: string, styles: Type.Styles): void;
    toStream(prefix?: string, prefixStyles?: Type.Styles): BrowserStreamLogger;
    private getStyledText;
}
