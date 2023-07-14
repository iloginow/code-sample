import { createReadStream, ReadStream } from 'fs';
import { createInterface } from 'readline';

export class LogInputFile {
  private inputFilePath: string;

  constructor(inputFilePath = '') {
    this.inputFilePath = inputFilePath;
  }

  public setInputFilePath(inputFilePath: string): void {
    this.inputFilePath = inputFilePath;
  }

  public async read(): Promise<string[]> {
    const lines = [];
    const input = await this.getReadStream();
    const rl = createInterface({ input, crlfDelay: Infinity });
    rl.on('line', (line) => lines.push(line));
    return new Promise((resolve) => {
      rl.once('close', () => resolve(lines));
    });
  }

  private getReadStream(): Promise<ReadStream> {
    return new Promise((resolve, reject) => {
      const readStream = createReadStream(this.inputFilePath);
      readStream.once('open', () => resolve(readStream));
      readStream.once('error', (err) => reject(err));
    });
  }
}
