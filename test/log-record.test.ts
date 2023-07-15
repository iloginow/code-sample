import { describe, it } from 'node:test';
import assert = require('node:assert');
import { LogRecord } from '../lib/log-record';

describe('LogRecord', () => {
  it('identify valid log record', () => {
    const validStr = '2044-08-09T02:12:51.253Z - info - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Service is started"}';
    const invalidStr = 'foo bar 23098420';
    const validLogRecord = new LogRecord(validStr);
    const invalidLogRecord = new LogRecord(invalidStr);
    assert.strictEqual(validLogRecord.isValid, true);
    assert.strictEqual(invalidLogRecord.isValid, false);
  });

  it('identify error log record', () => {
    const errStr = '2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404,"err":"Not found"}';
    const nonErrStr = '2044-08-09T02:12:51.253Z - info - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Service is started"}';
    const errLogRecord = new LogRecord(errStr);
    const nonErrLogRecord = new LogRecord(nonErrStr);
    assert.strictEqual(errLogRecord.isErrorLevel, true);
    assert.strictEqual(nonErrLogRecord.isErrorLevel, false);
  });

  it('find and format required data for the result', () => {
    const errStr = '2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404,"err":"Not found"}';
    const expectedResult = {
      timestamp: 1628475171259,
      loglevel: 'error',
      transactionId: '9abc55b2-807b-4361-9dbe-aa88b1b2e978',
      err: 'Not found',
    };
    const errLogRecord = new LogRecord(errStr);
    assert.deepStrictEqual(errLogRecord.parseLogResult, expectedResult);
  });
});
