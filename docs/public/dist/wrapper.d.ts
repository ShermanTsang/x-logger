import { Logger } from './logger-factory';
import type { BaseLogger, Type } from './typings';
export declare const typeProxyHandler: typeof Logger & Record<string, BaseLogger>;
export declare function createLoggerWithCustomType<T extends Record<string, (styles: Type.Style[]) => BaseLogger>>(): typeof Logger & T;
declare function logger(text: string): import("./typings").CallableLogger;
export declare const accessor: typeof logger & typeof Logger & Record<string, BaseLogger>;
export {};
