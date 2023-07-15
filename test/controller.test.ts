import { describe, it } from 'node:test';
import assert = require('node:assert');
import { Controller } from '../lib/controller';

type Mock<F extends Function> = F & { mock: any; };

const errorHandler = { onValidationError: () => {} };
const logHandler = { setLogInput: () => {}, setLogOutput: () => {}, parseErrorLogs: async () => 0 };
const logInputFile = { setInputFilePath: () => {}, read: async () => [] };
const logOutputFile = { setOutputFilePath: () => {}, write: async () => {} };

const input = './app.log';
const output = './err.json';

describe('Controller', () => {
  it('parse --input and --output args and invoke LogHandler', async (t) => {
    const controller = new Controller({
      errorHandler, logHandler, logInputFile, logOutputFile,
    }, ['--input', input, '--output', output]);
    t.mock.method(logInputFile, 'setInputFilePath');
    t.mock.method(logOutputFile, 'setOutputFilePath');
    t.mock.method(logHandler, 'parseErrorLogs');
    await controller.parseLogFileErrToJson();
    const logInputCall = (logInputFile.setInputFilePath as Mock<any>).mock.calls[0];
    const logOutputCall = (logOutputFile.setOutputFilePath as Mock<any>).mock.calls[0];
    const logHandlerCall = (logHandler.parseErrorLogs as Mock<any>).mock.calls[0];
    assert.deepStrictEqual(logInputCall.arguments, [input]);
    assert.deepStrictEqual(logOutputCall.arguments, [output]);
    assert.strictEqual(logHandlerCall.arguments.length, 0);
  });

  it('invoke ErrorHandler if receive unknown args', async (t) => {
    const controller = new Controller({
      errorHandler, logHandler, logInputFile, logOutputFile,
    }, ['--input', input, '--output', output, '--foo', 'bar']);
    t.mock.method(errorHandler, 'onValidationError');
    try {
      await controller.parseLogFileErrToJson();
    } catch (err) {
      const errorHandlerCall = (errorHandler.onValidationError as Mock<any>).mock.calls[0];
      assert.strictEqual(errorHandlerCall.arguments[0].message, 'Unknown option \'--foo\'');
    }
  });

  it('invoke ErrorHandler if no --input has been provided', async (t) => {
    const controller = new Controller({
      errorHandler, logHandler, logInputFile, logOutputFile,
    }, ['--output', output]);
    t.mock.method(errorHandler, 'onValidationError');
    try {
      await controller.parseLogFileErrToJson();
    } catch (err) {
      const errorHandlerCall = (errorHandler.onValidationError as Mock<any>).mock.calls[0];
      assert.strictEqual(errorHandlerCall.arguments[0].message, '--input must be provided');
    }
  });

  it('invoke ErrorHandler if no --output has been provided', async (t) => {
    const controller = new Controller({
      errorHandler, logHandler, logInputFile, logOutputFile,
    }, ['--input', input]);
    t.mock.method(errorHandler, 'onValidationError');
    try {
      await controller.parseLogFileErrToJson();
    } catch (err) {
      const errorHandlerCall = (errorHandler.onValidationError as Mock<any>).mock.calls[0];
      assert.strictEqual(errorHandlerCall.arguments[0].message, '--output must be provided');
    }
  });
});
