import { Logger } from './interfaces';

type ErrorHandlerContext = {
  logger: Logger,
};

export class ErrorHandler {
  private readonly logger: Logger;

  constructor(ctx: ErrorHandlerContext) {
    this.logger = ctx.logger;
  }

  public onValidationError(err: Error): void {
    this.logger.printValidationError(err.message);
    process.exit(1);
  }

  public onGenericError(err: Error): void {
    this.logger.printError(err.message);
    process.exit(1);
  }
}
