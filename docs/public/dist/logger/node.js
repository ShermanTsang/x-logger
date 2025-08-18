/**
 * Node Logger - Node.js-specific logger implementation with Chalk integration
 */
import { safeConsoleLog } from '../utils';
import { BaseLogger, BaseStreamLogger } from './base';
// Lazy-loaded modules for Node.js
let chalk = null;
let ora = null;
let modulesLoaded = false;
async function loadNodeModules() {
    if (!modulesLoaded) {
        try {
            // Only import Node.js modules in Node.js environments
            const [chalkModule, oraModule] = await Promise.all([
                import('chalk'),
                import('ora'),
            ]);
            chalk = chalkModule.default;
            ora = oraModule.default;
            modulesLoaded = true;
        }
        catch (error) {
            safeConsoleLog('Failed to load Node.js modules:', error);
            modulesLoaded = true; // Mark as loaded even if failed to prevent retries
        }
    }
}
// Initialize modules for Node.js
loadNodeModules();
/**
 * Node.js-specific logger implementation with Chalk styling support
 */
export class NodeLogger extends BaseLogger {
    constructor(prefixStyles) {
        super(prefixStyles);
    }
    static getLoggerInstance(type, styles) {
        styles && (NodeLogger.stylesMap[type] = styles);
        const instance = new this(NodeLogger.stylesMap[type]);
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.assign(callable, instance);
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return callable;
    }
    static type(type, styles) {
        if (type in NodeLogger && styles) {
            if (chalk) {
                safeConsoleLog(chalk.yellow.underline(`Logger type "${String(type)}" is preset. Add custom getter will override the preset.`));
            }
            else {
                safeConsoleLog(`Logger type "${String(type)}" is preset. Add custom getter will override the preset.`);
            }
        }
        if (styles) {
            NodeLogger.stylesMap[type] = styles;
            // Track registered custom types
            if (!NodeLogger.registeredTypes.includes(String(type))) {
                NodeLogger.registeredTypes.push(String(type));
            }
        }
        const loggerInstance = NodeLogger.getLoggerInstance(type, styles);
        Object.defineProperty(NodeLogger, type, {
            get() {
                return loggerInstance;
            },
            configurable: true,
            enumerable: true,
        });
        return loggerInstance;
    }
    static get stream() {
        return new NodeStreamLogger();
    }
    static get plain() {
        const instance = new NodeLogger(NodeLogger.stylesMap.plain);
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.assign(callable, instance);
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return callable;
    }
    static get info() {
        const instance = new NodeLogger(NodeLogger.stylesMap.info);
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.assign(callable, instance);
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return callable;
    }
    static get warn() {
        const instance = new NodeLogger(NodeLogger.stylesMap.warn);
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.assign(callable, instance);
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return callable;
    }
    static get error() {
        const instance = new NodeLogger(NodeLogger.stylesMap.error);
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.assign(callable, instance);
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return callable;
    }
    static get debug() {
        const instance = new NodeLogger(NodeLogger.stylesMap.debug);
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.assign(callable, instance);
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return callable;
    }
    static get success() {
        const instance = new NodeLogger(NodeLogger.stylesMap.success);
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.assign(callable, instance);
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return callable;
    }
    static get failure() {
        const instance = new NodeLogger(NodeLogger.stylesMap.failure);
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.assign(callable, instance);
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return callable;
    }
    decorateText(content, styles) {
        let formattedContent = content || '';
        if (formattedContent) {
            if (chalk) {
                // Node.js environment with chalk - handle [[text]] pattern
                formattedContent = formattedContent.replace(/\[\[(.+?)\]\]/g, chalk.underline.yellow('$1'));
            }
            else {
                // Fallback - just remove brackets
                formattedContent = formattedContent.replace(/\[\[(.+?)\]\]/g, '$1');
            }
        }
        return this.getStyledChalkInstance(styles, formattedContent);
    }
    printOutput(output) {
        safeConsoleLog(output);
    }
    printDivider(text, styles) {
        safeConsoleLog(this.getStyledChalkInstance(styles, text));
    }
    toStream(prefix, prefixStyles) {
        const streamLogger = new NodeStreamLogger(prefix, prefixStyles);
        if (this._text) {
            streamLogger.text(this._text, this._textStyles);
        }
        if (this._detail) {
            streamLogger.detail(this._detail, this._detailStyles);
        }
        if (this._data) {
            streamLogger.data(this._data);
        }
        return streamLogger;
    }
    getStyledChalkInstance(styles = [], text) {
        if (chalk) {
            return styles.reduce((accumulator, chalkStyleDescriptor) => {
                if (chalkStyleDescriptor in chalk) {
                    return chalk[chalkStyleDescriptor](accumulator);
                }
                return accumulator;
            }, text);
        }
        return text;
    }
}
/**
 * Node.js-specific stream logger with Ora spinner support
 */
export class NodeStreamLogger extends BaseStreamLogger {
    _spinner = undefined;
    _isInitialized = false;
    _initializationPromise;
    constructor(prefix, prefixStyles) {
        super(prefix, prefixStyles);
        // Initialize stream after ensuring modules are loaded
        this._initializationPromise = this.initializeStreamAsync();
    }
    async initializeStreamAsync() {
        // Wait for modules to load before initializing
        await loadNodeModules();
        if (ora) {
            // Node.js environment with ora
            this._spinner = ora({
                text: this._prefix ? this.decorateText(this._prefix, this._prefixStyles) : '',
                color: 'cyan',
                discardStdin: false, // Fix for Windows hanging issue (ora v4+)
                hideCursor: true,
            });
            this._spinner?.start();
        }
        this._isInitialized = true;
    }
    async ensureInitialized() {
        if (!this._isInitialized) {
            await this._initializationPromise;
        }
    }
    initializeStream() {
        if (ora) {
            // Node.js environment with ora
            this._spinner = ora({
                text: this._prefix ? this.decorateText(this._prefix, this._prefixStyles) : '',
                color: 'cyan',
                discardStdin: false, // Fix for Windows hanging issue (ora v4+)
                hideCursor: true,
            });
            this._spinner?.start();
        }
        else {
            // Node.js fallback without ora
            this._spinner = undefined;
        }
    }
    async updateStream(output) {
        await this.ensureInitialized();
        if (this._spinner) {
            this._spinner.text = output;
        }
        // Note: No fallback needed here as spinner should be available after initialization
        // If ora is not available, the spinner will be undefined and no update is needed
    }
    async finalizeStream(state, output) {
        await this.ensureInitialized();
        if (this._spinner) {
            // Node.js environment with spinner
            switch (state) {
                case 'start':
                    this._spinner.start(output);
                    break;
                case 'stop':
                    this._spinner.stop();
                    this._spinner = undefined;
                    break;
                case 'succeed':
                    // succeed() automatically stops the spinner
                    this._spinner.succeed(output);
                    this._spinner = undefined;
                    break;
                case 'fail':
                    // fail() automatically stops the spinner
                    this._spinner.fail(output);
                    this._spinner = undefined;
                    break;
            }
        }
        else {
            // Node.js fallback without spinner
            switch (state) {
                case 'start':
                    safeConsoleLog(`[STREAM STARTED] ${output}`);
                    break;
                case 'stop':
                    safeConsoleLog(`[STREAM STOPPED] ${output}`);
                    break;
                case 'succeed':
                    safeConsoleLog(`✓ [STREAM SUCCESS] ${output}`);
                    break;
                case 'fail':
                    safeConsoleLog(`✗ [STREAM FAILED] ${output}`);
                    break;
            }
        }
    }
    prefix(prefix, styles) {
        this._prefix = prefix;
        styles && (this._prefixStyles = styles);
        if (this._spinner) {
            this._spinner.prefixText = this.decorateText(this._prefix, this._prefixStyles);
        }
        return this;
    }
    decorateText(content, styles) {
        let formattedContent = content || '';
        if (formattedContent) {
            if (chalk) {
                // Node.js environment with chalk - handle [[text]] pattern
                formattedContent = formattedContent.replace(/\[\[(.+?)\]\]/g, chalk.underline.yellow('$1'));
            }
            else {
                // Fallback - just remove brackets
                formattedContent = formattedContent.replace(/\[\[(.+?)\]\]/g, '$1');
            }
        }
        return this.getStyledChalkInstance(styles, formattedContent);
    }
    printOutput(output) {
        safeConsoleLog(output);
    }
    printDivider(text, styles) {
        safeConsoleLog(this.getStyledChalkInstance(styles, text));
    }
    toStream(prefix, prefixStyles) {
        if (prefix || prefixStyles) {
            return new NodeStreamLogger(prefix, prefixStyles);
        }
        return this;
    }
    getStyledChalkInstance(styles = [], text) {
        if (chalk) {
            return styles.reduce((accumulator, chalkStyleDescriptor) => {
                if (chalkStyleDescriptor in chalk) {
                    return chalk[chalkStyleDescriptor](accumulator);
                }
                return accumulator;
            }, text);
        }
        return text;
    }
}
