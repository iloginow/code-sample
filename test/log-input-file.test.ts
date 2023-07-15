import {
  describe, it, after, before,
} from 'node:test';
import assert = require('node:assert');
import { createWriteStream, unlink } from 'fs';
import { LogInputFile } from '../lib/log-input-file';

const filePath = './test/test.log';

function createTestFile(): Promise<void> {
  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(filePath);
    writeStream.write('foo\n');
    writeStream.write('bar\n');
    writeStream.close();
    writeStream.once('close', () => resolve());
    writeStream.once('error', (err) => reject(err));
  });
}

describe('LogInputFile', () => {
  before(async () => {
    await createTestFile();
  });

  after(() => {
    unlink(filePath, () => {});
  });

  it('read file line by line and convert into array of strings', async () => {
    const logInputFile = new LogInputFile(filePath);
    const result = await logInputFile.read();
    assert.deepStrictEqual(result, ['foo', 'bar']);
  });

  it('throw if file not found', async () => {
    const logInputFile = new LogInputFile('./bar.log');
    try {
      await logInputFile.read();
    } catch (err) {
      assert.strictEqual(err.message, 'ENOENT: no such file or directory, open \'./bar.log\'');
    }
  });
});
