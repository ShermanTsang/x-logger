/**
 * Base Logger - Abstract foundation for platform-specific logger implementations
 */
import type { Type } from '../typings';
/**
 * Abstract base class for all logger implementations
 * Provides common functionality and defines the interface for platform-specific loggers
 */
export declare abstract class BaseLogger {
    static readonly [Symbol.hasInstance]: (instance: any) => any;
    static registeredTypes: string[];
    protected _text: string | null;
    protected _textStyles: Type.Styles;
    protected _detail: string | null;
    protected _detailStyles: Type.Styles;
    protected _prefix: string | null;
    protected _prefixStyles: Type.Styles;
    protected _data: any;
    protected _displayTime: boolean;
    protected _loggerType: 'normal' | 'stream';
    private _prependDivider;
    private _prependDividerStyles;
    private _prependDividerLength;
    private _prependDividerChar;
    private _appendDivider;
    private _appendDividerStyles;
    private _appendDividerChar;
    private _appendDividerLength;
    private _singleDivider;
    private _singleDividerStyles;
    private _singleDividerChar;
    private _singleDividerLength;
    protected _isValid: boolean;
    constructor(prefixStyles?: Type.Styles);
    /**
     * Creates a clone of the current logger instance
     */
    private clone;
    static stylesMap: Record<Type.Type | string, Type.Styles>;
    abstract decorateText(content: string, styles?: Type.Styles): string;
    abstract printOutput(output: string): void;
    abstract printDivider(text: string, styles: Type.Styles): void;
    private setDividerProperties;
    divider(char?: string, length?: number, styles?: Type.Styles): this;
    styles(styles: Type.Styles): this;
    prependDivider(char?: string, length?: number, styles?: Type.Styles): this;
    appendDivider(char?: string, length?: number, styles?: Type.Styles): this;
    time(isDisplay?: boolean): this;
    /**
     * Sets the validity condition for the logger
     * When set to false, all logger operations will be skipped
     * @param isValid - Whether the logger should execute operations (default: true)
     * @returns Cloned logger instance for method chaining
     */
    valid(isValid?: boolean): this;
    get formattedTime(): string;
    text(...args: any[]): this;
    get formattedText(): string;
    detail(detail: string, styles?: Type.Styles): this;
    get formattedDetail(): string;
    prefix(prefix: string, styles?: Type.Styles): this;
    get formattedPrefix(): string;
    data(...dataItems: any[]): this;
    get formattedData(): string;
    private formatSingleDataItem;
    protected composeMainOutput(): string;
    print(isValid?: boolean): void;
    protected capitalize(text: string): string;
    get [Symbol.toStringTag](): string;
    /**
     * Gets the type of this logger instance
     */
    get type(): string;
    toString(): string;
    toObject(): {
        prefix: string | null;
        text: string | null;
        detail: string | null;
        data: any;
        displayTime: boolean;
        loggerType: "normal" | "stream";
        prefixStyles: Type.Styles;
        textStyles: Type.Styles;
        detailStyles: Type.Styles;
    };
    /**
     * Creates a stream logger instance
     */
    abstract toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger | import('../typings').BrowserStreamLogger;
}
/**
 * Abstract base class for stream loggers
 */
export declare abstract class BaseStreamLogger extends BaseLogger {
    protected _state: 'start' | 'stop' | 'succeed' | 'fail' | undefined;
    protected _delay: number;
    _prefix: string | null;
    _prefixStyles: Type.Styles;
    _text: string | null;
    _detail: string | null;
    _textStyles: Type.Styles;
    _detailStyles: Type.Styles;
    _loggerType: 'normal' | 'stream';
    constructor(prefix?: string, prefixStyles?: Type.Styles);
    abstract initializeStream(): void;
    abstract updateStream(output: string): Promise<void> | void;
    abstract finalizeStream(state: Type.StreamLoggerState, output: string): Promise<void> | void;
    text(...args: any[]): this;
    detail(detail?: string, styles?: Type.Styles): this;
    delay(delay: number): this;
    /**
     * Sets the validity condition for the stream logger
     * When set to false, all logger operations will be skipped
     * @param isValid - Whether the logger should execute operations (default: true)
     * @returns Current logger instance for method chaining
     */
    valid(isValid?: boolean): this;
    state(state: 'start' | 'stop' | 'succeed' | 'fail'): this;
    update(): this;
    asyncUpdate(delay?: number): Promise<void>;
    private updateState;
    private asyncUpdateState;
    succeed(output?: string): this;
    fail(output?: string): this;
    start(output?: string): this;
    stop(output?: string): this;
}
