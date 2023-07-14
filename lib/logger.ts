import { WriteStream } from 'tty';

export class Logger {
  out: WriteStream;

  constructor(out = process.stdout) {
    this.out = out;
  }

  public printUsage(): void {
    const usage = 'Usage: node parser.js [options]';
    const optionsArray = [
      { name: '--input', description: 'input file path' },
      { name: '--output', description: 'output file path' },
    ];
    const optionsString = optionsArray.map((opt) => {
      const offset = Array.from({ length: 15 - opt.name.length }, () => ' ').join('');
      return `${opt.name}${offset}${opt.description}`;
    }).join('\n  ');
    const options = `Options: \n  ${optionsString}`;
    this.out.write(`${usage}\n\n${options}\n`);
  }

  public printParseLogResult(result: number): void {
    this.out.write(`Result: Found ${result} error level log records\n`);
  }

  public printError(msg: string) {
    this.out.write(`Error: ${msg}\n`);
  }

  public printValidationError(msg: string) {
    this.printError(msg);
    this.out.write('\n');
    this.printUsage();
  }
}
