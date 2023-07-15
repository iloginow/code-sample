import { describe, it } from 'node:test';
import assert = require('node:assert');
import { LogHandler } from '../lib/log-handler';

type Mock<F extends Function> = F & { mock: any; };

describe('LogHandler', () => {
  it('receive log records from input, parse them, and pass result to output', async (t) => {
    const logInput = {
      read: async () => [
        '2044-08-09T02:12:51.253Z - info - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Service is started"}',
        '2021-08-09T02:12:51.258Z - debug - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e821","details":"About to request user orders list","userId":16}',
        '2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404,"err":"Not found"}',
      ],
    };
    const logOutput = { write: async () => {} };
    t.mock.method(logOutput, 'write');
    const expectedResult = [{
      timestamp: 1628475171259, loglevel: 'error', transactionId: '9abc55b2-807b-4361-9dbe-aa88b1b2e978', err: 'Not found',
    }];
    const logHandler = new LogHandler();
    logHandler.setLogInput(logInput);
    logHandler.setLogOutput(logOutput);
    await logHandler.parseErrorLogs();
    const logOutputCall = (logOutput.write as Mock<any>).mock.calls[0];
    assert.deepStrictEqual(logOutputCall.arguments[0], expectedResult);
  });
});
