/**
 * Logger Factory - Automatically selects the appropriate logger implementation based on environment
 */
import { isBrowser, isNode } from './utils';
import { NodeLogger, NodeStreamLogger } from './logger/node';
import { BrowserLogger, BrowserStreamLogger } from './logger/browser';
/**
 * Factory class that creates the appropriate logger instance based on the current environment
 */
export class LoggerFactory {
    /**
     * Creates a logger instance appropriate for the current environment
     */
    static createLogger(prefixStyles) {
        if (isBrowser) {
            return new BrowserLogger(prefixStyles);
        }
        else if (isNode) {
            return new NodeLogger(prefixStyles);
        }
        else {
            // Fallback to Node logger for unknown environments
            return new NodeLogger(prefixStyles);
        }
    }
    /**
     * Creates a stream logger instance appropriate for the current environment
     */
    static createStreamLogger(prefix, prefixStyles) {
        if (isBrowser) {
            return new BrowserStreamLogger(prefix, prefixStyles);
        }
        else if (isNode) {
            return new NodeStreamLogger(prefix, prefixStyles);
        }
        else {
            // Fallback to Node stream logger for unknown environments
            return new NodeStreamLogger(prefix, prefixStyles);
        }
    }
    /**
     * Creates a logger instance with valid condition
     */
    static valid(isValid = true) {
        const logger = LoggerFactory.createLogger();
        return logger.valid(isValid);
    }
    /**
     * Gets a logger instance for a specific type
     */
    static getLoggerInstance(type, styles) {
        if (isBrowser) {
            return BrowserLogger.getLoggerInstance(type, styles);
        }
        else if (isNode) {
            return NodeLogger.getLoggerInstance(type, styles);
        }
        else {
            // Fallback to Node logger for unknown environments
            return NodeLogger.getLoggerInstance(type, styles);
        }
    }
    /**
     * Creates and registers a custom logger type
     */
    static type(type, styles) {
        if (isBrowser) {
            return BrowserLogger.type(type, styles);
        }
        else if (isNode) {
            return NodeLogger.type(type, styles);
        }
        else {
            // Fallback to Node logger for unknown environments
            return NodeLogger.type(type, styles);
        }
    }
    /**
     * Gets a stream logger instance
     */
    static get stream() {
        return this.createStreamLogger();
    }
    /**
     * Gets predefined logger types - can be used as both getters and methods
     */
    static get plain() {
        const instance = this.getLoggerInstance('plain');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance));
    }
    static get info() {
        const instance = this.getLoggerInstance('info');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance));
    }
    static get warn() {
        const instance = this.getLoggerInstance('warn');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance));
    }
    static get error() {
        const instance = this.getLoggerInstance('error');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance));
    }
    static get debug() {
        const instance = this.getLoggerInstance('debug');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance));
    }
    static get success() {
        const instance = this.getLoggerInstance('success');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance));
    }
    static get failure() {
        const instance = this.getLoggerInstance('failure');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance));
    }
}
/**
 * Unified Logger class that provides the same API as the original Logger
 * but uses the factory pattern internally to select the appropriate implementation
 */
export class Logger {
    _instance;
    static stylesMap = LoggerFactory.getLoggerInstance('info').constructor.stylesMap;
    // Make instanceof work with platform-specific logger instances
    static [Symbol.hasInstance] = (instance) => {
        return instance && typeof instance === 'object' && instance._isShermanLogger === true;
    };
    constructor(prefixStyles) {
        this._instance = LoggerFactory.createLogger(prefixStyles);
        // Delegate all methods to the underlying instance
        return new Proxy(this, {
            get(target, prop, receiver) {
                if (prop in target._instance) {
                    const value = target._instance[prop];
                    if (typeof value === 'function') {
                        return value.bind(target._instance);
                    }
                    return value;
                }
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                if (prop in target._instance) {
                    ;
                    target._instance[prop] = value;
                    return true;
                }
                return Reflect.set(target, prop, value, receiver);
            },
        });
    }
    static getLoggerInstance(type, styles) {
        return LoggerFactory.getLoggerInstance(type, styles);
    }
    static valid(isValid = true) {
        return LoggerFactory.valid(isValid);
    }
    static type(type, styles) {
        return LoggerFactory.type(type, styles);
    }
    static get stream() {
        return LoggerFactory.stream;
    }
    static get plain() {
        const instance = LoggerFactory.getLoggerInstance('plain');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return Object.assign(callable, instance);
    }
    static get info() {
        const instance = LoggerFactory.getLoggerInstance('info');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return Object.assign(callable, instance);
    }
    static get warn() {
        const instance = LoggerFactory.getLoggerInstance('warn');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return Object.assign(callable, instance);
    }
    static get error() {
        const instance = LoggerFactory.getLoggerInstance('error');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return Object.assign(callable, instance);
    }
    static get debug() {
        const instance = LoggerFactory.getLoggerInstance('debug');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return Object.assign(callable, instance);
    }
    static get success() {
        const instance = LoggerFactory.getLoggerInstance('success');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return Object.assign(callable, instance);
    }
    static get failure() {
        const instance = LoggerFactory.getLoggerInstance('failure');
        const callable = (...args) => {
            return args.length > 0 ? instance.text(...args) : instance;
        };
        Object.setPrototypeOf(callable, Object.getPrototypeOf(instance));
        return Object.assign(callable, instance);
    }
    // Implement BaseLogger interface methods
    text(...args) {
        this._instance.text(...args);
        return this;
    }
    detail(detail, styles) {
        this._instance.detail(detail, styles);
        return this;
    }
    prefix(prefix, styles) {
        this._instance.prefix(prefix, styles);
        return this;
    }
    data(data) {
        this._instance.data(data);
        return this;
    }
    time(isDisplay) {
        this._instance.time(isDisplay);
        return this;
    }
    styles(styles) {
        this._instance.styles(styles);
        return this;
    }
    divider(char, length, styles) {
        this._instance.divider(char, length, styles);
        return this;
    }
    prependDivider(char, length, styles) {
        this._instance.prependDivider(char, length, styles);
        return this;
    }
    appendDivider(char, length, styles) {
        this._instance.appendDivider(char, length, styles);
        return this;
    }
    print(isValid) {
        return this._instance.print(isValid);
    }
    toString() {
        return this._instance.toString();
    }
    toObject() {
        this._instance.toObject();
        return this;
    }
    toStream(prefix, prefixStyles) {
        return this._instance.toStream(prefix, prefixStyles);
    }
    valid(isValid) {
        this._instance.valid(isValid);
        return this;
    }
    decorateText(content, styles) {
        return this._instance.decorateText(content, styles);
    }
    printOutput(output) {
        return this._instance.printOutput(output);
    }
    printDivider(text, styles) {
        return this._instance.printDivider(text, styles);
    }
}
/**
 * Unified StreamLogger class that provides the same API as the original StreamLogger
 * but uses the factory pattern internally to select the appropriate implementation
 */
export class StreamLogger {
    _instance;
    constructor(prefix, prefixStyles) {
        this._instance = LoggerFactory.createStreamLogger(prefix, prefixStyles);
        // Delegate all methods to the underlying instance
        return new Proxy(this, {
            get(target, prop, receiver) {
                if (prop in target._instance) {
                    const value = target._instance[prop];
                    if (typeof value === 'function') {
                        return function (...args) {
                            const result = value.apply(target._instance, args);
                            // If the method returns the instance (for chaining), return the proxy instead
                            if (result === target._instance) {
                                return receiver;
                            }
                            return result;
                        };
                    }
                    return value;
                }
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                if (prop in target._instance) {
                    ;
                    target._instance[prop] = value;
                    return true;
                }
                return Reflect.set(target, prop, value, receiver);
            },
        });
    }
    static create(prefix, prefixStyles) {
        return LoggerFactory.createStreamLogger(prefix, prefixStyles);
    }
    // Implement BaseStreamLogger interface methods
    text(...args) {
        this._instance.text(...args);
        return this;
    }
    detail(detail, styles) {
        this._instance.detail(detail, styles);
        return this;
    }
    prefix(prefix, styles) {
        this._instance.prefix(prefix, styles);
        return this;
    }
    data(data) {
        this._instance.data(data);
        return this;
    }
    time(isDisplay) {
        this._instance.time(isDisplay);
        return this;
    }
    styles(styles) {
        this._instance.styles(styles);
        return this;
    }
    divider(char, length, styles) {
        this._instance.divider(char, length, styles);
        return this;
    }
    prependDivider(char, length, styles) {
        this._instance.prependDivider(char, length, styles);
        return this;
    }
    appendDivider(char, length, styles) {
        this._instance.appendDivider(char, length, styles);
        return this;
    }
    print(isValid) {
        return this._instance.print(isValid);
    }
    toString() {
        return this._instance.toString();
    }
    toObject() {
        this._instance.toObject();
        return this;
    }
    toStream(prefix, prefixStyles) {
        return this._instance.toStream(prefix, prefixStyles);
    }
    decorateText(content, styles) {
        return this._instance.decorateText(content, styles);
    }
    printOutput(output) {
        return this._instance.printOutput(output);
    }
    printDivider(text, styles) {
        return this._instance.printDivider(text, styles);
    }
    // Stream-specific methods
    delay(delay) {
        this._instance.delay(delay);
        return this;
    }
    state(state) {
        this._instance.state(state);
        return this;
    }
    update() {
        this._instance.update();
        return this;
    }
    async asyncUpdate(delay) {
        return this._instance.asyncUpdate(delay);
    }
    valid(isValid) {
        this._instance.valid(isValid);
        return this;
    }
    initializeStream() {
        return this._instance.initializeStream();
    }
    updateStream(output) {
        return this._instance.updateStream(output);
    }
    finalizeStream(state, output) {
        return this._instance.finalizeStream(state, output);
    }
    // Convenience methods for common stream states
    succeed(output) {
        this._instance.succeed(output);
        return this;
    }
    fail(output) {
        this._instance.fail(output);
        return this;
    }
    start(output) {
        this._instance.start(output);
        return this;
    }
    stop(output) {
        this._instance.stop(output);
        return this;
    }
}
