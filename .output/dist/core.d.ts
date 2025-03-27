import type { Color } from 'ora';
import type { Type } from './typings';
export declare class Logger {
    private _text;
    private _textStyles;
    private _prefix;
    private _prefixStyles;
    private _data;
    private _displayTime;
    private _displayData;
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
    private _isVisible;
    constructor(prefixStyles: Type.Styles);
    static stylesMap: Record<Type.Type | string, Type.Styles>;
    static getLoggerInstance(type: Type.Type, styles?: Type.Styles): Logger;
    static type(type: Type.Type, styles?: Type.Styles): Logger;
    static get stream(): StreamLogger;
    static toStream(type: Type.Type): StreamLogger;
    static get plain(): Logger;
    static get info(): Logger;
    static get warn(): Logger;
    static get error(): Logger;
    static get debug(): Logger;
    static get success(): Logger;
    static get failure(): Logger;
    private setDividerProperties;
    divider(char?: string, length?: number, styles?: Type.Styles): void;
    styles(styles: Type.Styles): this;
    prependDivider(char?: string, length?: number, styles?: Type.Styles): this;
    appendDivider(char?: string, length?: number, styles?: Type.Styles): this;
    time(isDisplay?: boolean): this;
    text(text: string, styles?: Type.Styles): this;
    prefix(prefix: string, styles?: Type.Styles): this;
    data(data: any, displayData?: boolean): this;
    private formatText;
    private formatPrefix;
    print(isVisible?: boolean): void;
    toString(): string;
}
export declare class StreamLogger {
    state: 'start' | 'stop' | 'succeed' | 'fail' | undefined;
    private spinner;
    private delay;
    private text;
    private color;
    private detail;
    private prefixText;
    private textStyles;
    private detailStyles;
    private prefixTextStyles;
    constructor(prefixText?: string, prefixTextStyles?: Type.Styles);
    private create;
    private capitalize;
    private decorateText;
    /**
     * Sets the text for the spinner
     * @param text Text to display
     * @param styles Optional styling for the text
     * @returns This StreamLogger instance for chaining
     */
    setText(text?: string, styles?: Type.Styles): this;
    /**
     * Sets the detail text displayed below the main spinner text
     * @param detail Detail text to display
     * @param styles Optional styling for the detail text
     * @returns This StreamLogger instance for chaining
     */
    setDetail(detail?: string, styles?: Type.Styles): this;
    /**
     * Sets a delay before updating the spinner
     * @param delay Delay in milliseconds
     * @returns This StreamLogger instance for chaining
     */
    setDelay(delay: number): this;
    /**
     * Updates the spinner with current text and detail
     * @returns Promise that resolves after the delay (if any)
     */
    update(): Promise<void>;
    /**
     * Sets the state of the spinner
     * @param state State to set (start, stop, succeed, fail)
     * @returns This StreamLogger instance for chaining
     */
    setState(state: 'start' | 'stop' | 'succeed' | 'fail'): this;
    /**
     * Sets the color of the spinner
     * @param color Color to set the spinner to
     * @returns This StreamLogger instance for chaining
     */
    setColor(color: Color): this;
    /**
     * Apply Logger type styles to this StreamLogger
     * @param type The logger type to use for styling
     * @returns This StreamLogger instance for chaining
     */
    withType(type: Type.Type): this;
    private changeState;
    private stop;
    private destroy;
    private succeed;
    private fail;
}
