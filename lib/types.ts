export type ParseLogArgs = {
  input: string,
  output: string
};

export type ParseLogResult = {
  timestamp: number,
  loglevel: string,
  transactionId: string,
  err: string,
};

export type LogRecordExpectedDataChunks = {
  date: string;
  level: string;
  jsonData: string;
};

export type LogRecordJsonData = {
  transactionId: string;
  details: string;
  err?: string;
  [key: string]: any;
};
