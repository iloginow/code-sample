import { Controller } from './lib/controller';
import { ErrorHandler } from './lib/error-handler';
import { Logger } from './lib/logger';
import { LogHandler } from './lib/log-handler';
import { LogInputFile } from './lib/log-input-file';
import { LogOutputFile } from './lib/log-output-file';

const logger = new Logger();
const errorHandler = new ErrorHandler({ logger });
const logHandler = new LogHandler();
const logInputFile = new LogInputFile();
const logOutputFile = new LogOutputFile();
const controller = new Controller({
  errorHandler, logHandler, logInputFile, logOutputFile,
});

async function run() {
  try {
    const result = await controller.parseLogFileErrToJson();
    logger.printParseLogResult(result);
  } catch (err) {
    errorHandler.onGenericError(err);
  }
}

run();
