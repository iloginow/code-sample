import { LogRecord } from './log-record';
import { LogInput, LogOutput } from './interfaces';

export class LogHandler {
  private logInput: LogInput;

  private logOutput: LogOutput;

  private defaultLogInput = { read: async () => [] as string[] };

  private defaultLogOutput = { write: async () => {} };

  constructor() {
    this.logInput = this.defaultLogInput;
    this.logOutput = this.defaultLogOutput;
  }

  public setLogInput(logInput: LogInput): void {
    this.logInput = logInput;
  }

  public setLogOutput(logOutput: LogOutput): void {
    this.logOutput = logOutput;
  }

  public async parseErrorLogs(): Promise<number> {
    const recordStrings = await this.logInput.read();
    const logRecords = recordStrings
      .map((str) => new LogRecord(str))
      .filter((record) => record.isValid && record.isErrorLevel)
      .map((record) => record.parseLogResult);
    await this.logOutput.write(logRecords);
    return logRecords.length;
  }
}
