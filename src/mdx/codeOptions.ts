import rangeParser from 'parse-numeric-range';

export type CodeOptions = {
  highlight?: HighlightCodeOption;
  commandLine?: CommandLineCodeOption;
};

export type HighlightCodeOption = {
  lineNumbers: number[];
};

export type CommandLineCodeOption = {
  outputLines: number[];
};

export function parseCodeOptions(meta: string): CodeOptions {
  const options: CodeOptions = {};

  const optionsRe = /({[^}]+})/g;
  const optionRe = /{(highlight|commandLine|user|host):?([^}]*)}/;
  let result;
  while ((result = optionsRe.exec(meta))) {
    const option = optionRe.exec(result[0]);
    if (!option) {
      continue;
    }
    if (option[1] === 'highlight') {
      const lineNumbers = rangeParser(option[2].trim());
      if (options.highlight === undefined) {
        options.highlight = { lineNumbers };
      } else {
        options.highlight.lineNumbers.push(...lineNumbers);
      }
    } else if (option[1] === 'commandLine') {
      if (options.commandLine === undefined) {
        options.commandLine = { outputLines: [] };
      }
      if (option[2]) {
        const outputLines = rangeParser(option[2].trim());
        options.commandLine.outputLines.push(...outputLines);
      }
    }
  }

  return options;
}
