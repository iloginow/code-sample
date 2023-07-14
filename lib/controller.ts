import { parseArgs, ParseArgsConfig } from 'util';
import { ParseLogArgs } from './types';
import {
  LogInputFile, LogOutputFile, LogHandler, ErrorHandler,
} from './interfaces';

type ControllerCtx = {
  errorHandler: ErrorHandler,
  logHandler: LogHandler,
  logInputFile: LogInputFile,
  logOutputFile: LogOutputFile,
};

export class Controller {
  private readonly errorHandler: ErrorHandler;

  private readonly logHandler: LogHandler;

  private readonly logInputFile: LogInputFile;

  private readonly logOutputFile: LogOutputFile;

  private readonly args: string[];

  constructor(ctx: ControllerCtx, args = process.argv.slice(2)) {
    this.errorHandler = ctx.errorHandler;
    this.logHandler = ctx.logHandler;
    this.logInputFile = ctx.logInputFile;
    this.logOutputFile = ctx.logOutputFile;
    this.args = args;
  }

  private getParseLogArgs(): ParseLogArgs {
    try {
      const options = {
        input: { type: 'string' },
        output: { type: 'string' },
      };
      const { values } = parseArgs({ options, args: this.args } as ParseArgsConfig);
      Object.keys(options).forEach((key) => {
        if (!(key in values)) throw new Error(`--${key} must be provided`);
      });
      return values as ParseLogArgs;
    } catch (err) {
      this.errorHandler.onValidationError(err);
      return null;
    }
  }

  public async parseLogFileErrToJson(): Promise<number> {
    const { input, output } = this.getParseLogArgs();
    this.logInputFile.setInputFilePath(input);
    this.logOutputFile.setOutputFilePath(output);
    this.logHandler.setLogInput(this.logInputFile);
    this.logHandler.setLogOutput(this.logOutputFile);
    return this.logHandler.parseErrorLogs();
  }
}
