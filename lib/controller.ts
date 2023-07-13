import { parseArgs, ParseArgsConfig } from 'util';
import { ParseLogArgs, ParseLogResult } from './types';

interface ErrorHandler {
  onValidationError(err: Error): void,
}

interface LogHandler {
  parseLog(inputFilePath: string, outputFilePath: string): Promise<ParseLogResult>
}

type ControllerCtx = {
  errorHandler: ErrorHandler,
  logHandler: LogHandler,
};

export class Controller {
  private readonly errorHandler: ErrorHandler;

  private readonly logHandler: LogHandler;

  private readonly args: string[];

  constructor(ctx: ControllerCtx, args = process.argv.slice(2)) {
    this.errorHandler = ctx.errorHandler;
    this.logHandler = ctx.logHandler;
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

  public async parseLog(): Promise<ParseLogResult> {
    const { input, output } = this.getParseLogArgs();
    return this.logHandler.parseLog(input, output);
  }
}
