// Modified: https://github.com/timlrx/rehype-prism-plus
import { parseCodeOptions } from './codeOptions';
import {
  CODE_CLASS_NAME,
  CODE_COMMAND_LINE_CLASS_NAME,
  CODE_LINE_CLASS_NAME,
  CODE_LINE_DELETED_CLASS_NAME,
  CODE_LINE_HIGHLIGHT_CLASS_NAME,
  CODE_LINE_INSERTED_CLASS_NAME,
} from './constants';
import { Element, ElementContent, Node, Properties } from 'hast';
import { toString } from 'hast-util-to-string';
import { refractor } from 'refractor/lib/all';
import { filter } from 'unist-util-filter';
import { visit } from 'unist-util-visit';

const rehypePrism = rehypePrismGenerator();

export default rehypePrism;

type Options = {
  showLineNumbers?: boolean;
  ignoreMissing?: boolean;
};

function rehypePrismGenerator() {
  return (options: Options = {}) => {
    return (tree: Node) => {
      visit(tree, 'element', visitor);
    };

    function visitor(node: Element, index: number, parent: Element) {
      if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
        return;
      }

      const meta =
        node.data && node.data.meta ? (node.data.meta as string) : '';
      // Coerce className to array
      if (node.properties?.className) {
        if (typeof node.properties.className === 'boolean') {
          node.properties.className = [];
        } else if (!Array.isArray(node.properties.className)) {
          // node.properties.className = [node.properties.className];
          node.properties.className = [];
        }
      } else {
        if (node.properties === undefined) {
          node.properties = {};
        }
        node.properties.className = [];
      }

      node.properties.className.push(CODE_CLASS_NAME);
      const lang = getLanguage(node);

      let refractorRoot: Element;

      // Syntax highlight
      if (lang) {
        try {
          // @ts-ignore
          refractorRoot = refractor.highlight(toString(node), lang);
          if (parent.properties === undefined) {
            parent.properties = {};
          }
          if (
            !parent.properties.className ||
            !Array.isArray(parent.properties.className)
          ) {
            parent.properties.className = [];
          }
          parent.properties.className.push('language-' + lang);
        } catch (err) {
          if (
            options.ignoreMissing &&
            (err as Error).message === 'Unknown language'
          ) {
            refractorRoot = node;
          } else {
            throw err;
          }
        }
      } else {
        refractorRoot = node;
      }

      const nodeWithPosition = addNodePositionClosure()(refractorRoot.children);
      refractorRoot.children = splitTextByLine(nodeWithPosition);

      if (refractorRoot.children.length > 0) {
        refractorRoot.position = {
          start: {
            line: refractorRoot.children[0].position?.start.line || 0,
            column: 0,
          },
          end: {
            line:
              refractorRoot.children[refractorRoot.children.length - 1].position
                ?.end.line || 0,
            column: 0,
          },
        };
      }

      const codeOptions = parseCodeOptions(meta);
      const codeLineArray = splitLine(toString(node));

      // Process lines
      for (let i = 0; i < codeLineArray.length; i++) {
        const line = codeLineArray[i];
        if (line.properties === undefined) {
          line.properties = {};
        }
        if (!line.properties.className) {
          line.properties.className = [];
        }

        // Line highlight
        if (
          codeOptions.highlight !== undefined &&
          codeOptions.highlight.lineNumbers.indexOf(i + 1) !== -1
        ) {
          (line.properties.className as string[]).push(
            CODE_LINE_HIGHLIGHT_CLASS_NAME,
          );
        }

        // Line diff
        if (lang === 'diff' && toString(line).substring(0, 1) === '-') {
          (line.properties.className as string[]).push(
            CODE_LINE_DELETED_CLASS_NAME,
          );
        } else if (lang === 'diff' && toString(line).substring(0, 1) === '+') {
          (line.properties.className as string[]).push(
            CODE_LINE_INSERTED_CLASS_NAME,
          );
        }

        // Syntax highlight
        const treeExtract = filter(
          refractorRoot,
          (node) =>
            (node.position?.start.line || 0) <= i + 1 &&
            (node.position?.end.line || 0) >= i + 1,
        );
        line.children = treeExtract?.children || [];
      }

      // Insert command line prompt
      if (codeOptions.commandLine !== undefined) {
        codeLineArray.splice(0, 0, {
          type: 'element',
          tagName: 'span',
          properties: { className: [CODE_COMMAND_LINE_CLASS_NAME] },
          children: codeLineArray.map((_, i) => {
            const properties: Properties = {};
            if (
              codeOptions.commandLine !== undefined &&
              codeOptions.commandLine.outputLines.indexOf(i + 1) === -1
            ) {
              properties['data-prompt'] = true;
            }
            return {
              type: 'element',
              tagName: 'span',
              properties,
              children: [],
            };
          }),
        } as Element);
      }

      node.children = codeLineArray;
    }
  };
}

const getLanguage = (node: Element): string | null => {
  const className = node.properties?.className;
  if (!className) {
    return null;
  }
  if (Array.isArray(className)) {
    for (const classListItem of className as string[]) {
      if (classListItem.slice(0, 9) === 'language-') {
        return classListItem.slice(9).toLowerCase();
      }
    }
  }
  if (typeof className === 'string') {
    if (className.slice(0, 9) === 'language-') {
      return className.slice(9).toLowerCase();
    }
  }
  return null;
};

/**
 * Split line to div node with className `code-line`
 */
const splitLine = (text: string): Element[] => {
  // Xdm Markdown parses every code line with \n
  const textArray = text.split(/\n/);

  // Remove last line \n which results in empty array
  if (textArray[textArray.length - 1].trim() === '') {
    textArray.pop();
  }

  // Empty array are actually line segments so we convert them back to newlines
  return textArray.map((line) => {
    return {
      type: 'element',
      tagName: 'span',
      properties: { className: [CODE_LINE_CLASS_NAME] },
      children: [{ type: 'text', value: line }],
    };
  });
};

/**
 * Add a node start and end line position information for each text node
 */
const addNodePositionClosure = (): ((
  ast: ElementContent[],
) => ElementContent[]) => {
  let startLineNum = 1;
  const addNodePosition = (ast: ElementContent[]): ElementContent[] =>
    ast.reduce((result, node) => {
      if (node.type === 'text') {
        const value: string = node.value;
        const numLines = (value.match(/\n/g) || '').length;
        node.position = {
          // column: 0 is to make the ts compiler happy but we do not use this field
          start: { line: startLineNum, column: 0 },
          end: { line: startLineNum + numLines, column: 0 },
        };
        startLineNum = startLineNum + numLines;
        result.push(node);
        return result;
      }

      if (node.type === 'element') {
        const initialLineNum = startLineNum;
        // @ts-ignore
        node.children = addNodePosition(node.children, startLineNum);
        result.push(node);
        node.position = {
          start: { line: initialLineNum, column: 0 },
          end: { line: startLineNum, column: 0 },
        };
        return result;
      }

      result.push(node);
      return result;
    }, [] as ElementContent[]);
  return addNodePosition;
};

/**
 * Split multiline text nodes into individual nodes with positioning
 */
const splitTextByLine = (ast: ElementContent[]): ElementContent[] => {
  return ast.reduce((result, node) => {
    if (node.type === 'text') {
      if (node.value.indexOf('\n') === -1) {
        result.push(node);
        return result;
      }

      const lines = node.value.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        result.push({
          type: 'text',
          value: i === lines.length - 1 ? line : line + '\n',
          position: {
            start: {
              ...(node.position?.start || { column: 0 }),
              line: (node.position?.start.line || 0) + i,
            },
            end: {
              ...(node.position?.end || { column: 0 }),
              line: (node.position?.start.line || 0) + i,
            },
          },
        });
      }

      return result;
    }

    if (node.type === 'element') {
      node.children = splitTextByLine(node.children);
      result.push(node);
      return result;
    }

    result.push(node);
    return result;
  }, [] as ElementContent[]);
};
