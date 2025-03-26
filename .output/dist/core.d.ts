import type { ChalkInstance } from "chalk";
import type { LoggerParams } from "./typings";

export declare class Logger {
  private _message;
  private _messageStyles;
  private _tag;
  private _tagStyles;
  private _data;
  private _displayTime;
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

  constructor(tagStyles: (keyof ChalkInstance)[]);

  static stylesMap: Record<
    LoggerParams["type"] | string,
    (keyof ChalkInstance)[]
  >;

  static getLoggerInstance(
    type: LoggerParams["type"],
    styles?: (keyof ChalkInstance)[],
  ): Logger;

  static type(
    type: LoggerParams["type"],
    styles?: (keyof ChalkInstance)[],
  ): Logger;

  static get plain(): Logger;

  static get info(): Logger;

  static get warn(): Logger;

  static get error(): Logger;

  static get debug(): Logger;

  static get success(): Logger;

  static get failure(): Logger;

  private setDividerProperties;

  divider(
    char?: string,
    length?: number,
    styles?: (keyof ChalkInstance)[],
  ): void;

  prependDivider(
    char?: string,
    length?: number,
    styles?: (keyof ChalkInstance)[],
  ): this;

  appendDivider(
    char?: string,
    length?: number,
    styles?: (keyof ChalkInstance)[],
  ): this;

  displayTime(isShow: boolean): this;

  message(message: string, styles?: (keyof ChalkInstance)[]): this;

  tag(tag: string, styles?: (keyof ChalkInstance)[]): this;

  data(data: any): this;

  private formatMessage;
  private formatTag;

  print(): void;
}
