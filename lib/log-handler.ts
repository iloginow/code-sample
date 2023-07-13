import { ParseLogResult } from './types';

export class LogHandler {
  async parseLog(inputFilePath: string, outputFilePath: string): Promise<ParseLogResult> {
    return { foundLogsTotal: 0, foundErrLogs: 0 };
  }
}
