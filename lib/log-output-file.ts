import { writeFile } from 'fs/promises';
import { ParseLogResult } from './types';

export class LogOutputFile {
  private outputFilePath: string;

  constructor(outputFilePath = '') {
    this.outputFilePath = outputFilePath;
  }

  public setOutputFilePath(outputFilePath: string): void {
    this.outputFilePath = outputFilePath;
  }

  public async write(result: ParseLogResult[]): Promise<void> {
    return writeFile(this.outputFilePath, JSON.stringify(result));
  }
}
