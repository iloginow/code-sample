import { after, describe, it } from 'node:test';
import { readFile } from 'fs/promises';
import assert = require('node:assert');
import { unlink } from 'fs';
import { LogOutputFile } from '../lib/log-output-file';

const filePath = './test/test.json';

describe('LogOutputFile', () => {
  after(() => {
    unlink(filePath, () => {});
  });

  it('write json data to file', async () => {
    const data = [{
      timestamp: 0, loglevel: 'foo', transactionId: 'bar', err: 'error',
    }];
    const logOutputFile = new LogOutputFile(filePath);
    await logOutputFile.write(data);
    const fileContents = await readFile(filePath);
    assert.deepStrictEqual(JSON.parse(fileContents.toString()), data);
  });
});
