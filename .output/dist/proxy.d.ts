import { Logger } from './core.ts';
interface LoggerWithDynamicMethods {
    [key: string]: (...args: any[]) => any;
}
export declare const loggerProxy: typeof Logger & LoggerWithDynamicMethods;
export {};
