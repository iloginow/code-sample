import { Controller } from './lib/controller';
import { ErrorHandler } from './lib/error-handler';
import { LogHandler } from './lib/log-handler';
import { Logger } from './lib/logger';

const logger = new Logger();
const errorHandler = new ErrorHandler({ logger });
const logHandler = new LogHandler();
const controller = new Controller({ errorHandler, logHandler });

async function run() {
  try {
    const result = await controller.parseLog();
    logger.printParseLogResult(result);
  } catch (err) {
    errorHandler.onUnexpectedError(err);
  }
}

run();
