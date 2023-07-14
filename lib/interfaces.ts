import { ParseLogResult } from './types';

export interface Logger {
  printValidationError(msg: string): void;
  printError(msg: string): void;
}

export interface ErrorHandler {
  onValidationError(err: Error): void;
}

export interface LogInput {
  read(): Promise<string[]>;
}

export interface LogInputFile extends LogInput {
  setInputFilePath(inputFilePath: string): void;
}

export interface LogOutput {
  write(parseLogResults: ParseLogResult[]): Promise<void>;
}

export interface LogOutputFile extends LogOutput {
  setOutputFilePath(outputFilePath: string): void;
}

export interface LogHandler {
  setLogInput(logInput: LogInput): void;
  setLogOutput(logOutput: LogOutput): void;
  parseErrorLogs(): Promise<number>;
}
