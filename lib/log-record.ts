import { LogRecordExpectedDataChunks, LogRecordJsonData, ParseLogResult } from './types';

export class LogRecord {
  private readonly recordString: string;

  constructor(recordString: string) {
    this.recordString = recordString;
  }

  private get expectedDataChunks(): LogRecordExpectedDataChunks {
    try {
      const regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)) - ([a-z]+) - (\{.+})/;
      const matches = this.recordString.match(regex);
      return { date: matches[1], level: matches[2], jsonData: matches[3] };
    } catch (err) {
      return null;
    }
  }

  private get timestamp(): number {
    if (!this.expectedDataChunks?.date) return null;
    const date = new Date(this.expectedDataChunks.date);
    return date.getTime() || null;
  }

  private get loglevel(): string {
    return this.expectedDataChunks?.level || null;
  }

  private get jsonData(): LogRecordJsonData {
    try {
      return JSON.parse(this.expectedDataChunks.jsonData);
    } catch (err) {
      return null;
    }
  }

  private get transactionId(): string {
    return this.jsonData?.transactionId || null;
  }

  private get err(): string {
    return this.jsonData?.err || null;
  }

  public get isValid(): boolean {
    const requirements = [this.timestamp, this.loglevel, this.transactionId];
    return requirements.every((requirement) => !!requirement);
  }

  public get isErrorLevel(): boolean {
    return this.loglevel === 'error';
  }

  public get parseLogResult(): ParseLogResult {
    return {
      timestamp: this.timestamp,
      loglevel: this.loglevel,
      transactionId: this.transactionId,
      err: this.err,
    };
  }
}
