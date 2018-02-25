const visit = require('unist-util-visit');
const cheerio = require('cheerio');
const slug = require('slug');
const marked = require('marked');
const hljs = require('highlight.js');
const rangeParser = require('parse-numeric-range');

// Credit: https://github.com/isagalaev/highlight.js/issues/1471
hljs.registerLanguage("graphql",function(e){return{aliases:["gql"],k:{keyword:"query mutation subscription|10 type interface union scalar fragment|10 enum on ...",literal:"true false null"},c:[e.HCM,e.QSM,e.NM,{cN:"type",b:"[^\\w][A-Z][a-z]",e:"\\W",eE:!0},{cN:"literal",b:"[^\\w][A-Z][A-Z]",e:"\\W",eE:!0},{cN:"variable",b:"\\$",e:"\\W",eE:!0},{cN:"keyword",b:"[.]{2}",e:"\\."},{cN:"meta",b:"@",e:"\\W",eE:!0}],i:/([;<']|BEGIN)/}});

module.exports = ({
  files,
  markdownNode,
  markdownAST,
  getNode
}) => {
  // Lower heading level
  visit(markdownAST, 'heading', node => {
    const id = slug(node.children[0].value, {
      lower: true
    });
    node.type = 'html';
    node.value = `
      <h${node.depth + 1} id="${id}">
        ${node.children[0].value}
      </h${node.depth + 1}>
    `;
  });

  // Modify gif markup
  visit(markdownAST, 'image', node => {
    if (node.url.endsWith('.gif')) {
      node.type = 'html';
      node.value = `
        <img src=${node.url} alt="${node.alt}" class="small-image"/>
      `;
    }
  });

  // Transform shortcodes
  visit(markdownAST, 'html', node => {
    if (node.value.startsWith('<note')) {
      createNote(node);
    }
  });

  // Highlight code
  visit(markdownAST, 'code', node => {
    let language = node.lang;
    let { splitLanguage, highlightLines } = parseLineNumberRange(language);
    language = splitLanguage;

    let languageName = 'none';
    if (language) {
      language = language.toLowerCase();
      languageName = language;
    }

    const className = `language-${languageName}`;

    node.type = 'html';
    node.value = `
    <div class="gatsby-highlight">
      <pre class="${className}"><code>${highlightCode(
        language,
        node.value,
        highlightLines
      )}</code></pre>
    </div>`;
  });

  return markdownAST;
};

function createNote(node) {
  const e = cheerio.load(node.value);
  node.value = `
    <div class="note">
      ${marked(e.text())}
    </div>
  `;
}

function parseLineNumberRange(language) {
  if (!language) {
    return ``
  }
  if (language.split(`{`).length > 1) {
    let [splitLanguage, rangeStr] = language.split(`{`)
    rangeStr = rangeStr.slice(0, -1)
    return {
      splitLanguage,
      highlightLines: rangeParser.parse(rangeStr).filter(n => n > 0),
    }
  }
  return { splitLanguage: language }
}

function highlightCode(language, code, lineNumbersHighlight = []) {
  if (!language) {
    return code;
  }
  let highlightedCode = hljs.highlight(language, code).value;
  if (lineNumbersHighlight) {
    const codeSplits = highlightedCode.split(`\n`).map((split, i) => {
      if (lineNumbersHighlight.indexOf(i + 1) != -1) {
        return {
          highlighted: true,
          code: `<span class="gatsby-highlight-code-line">${split}\n</span>`,
        }
      } else {
        return { code: split };
      }
    });
    highlightedCode = '';
    codeSplits.forEach(split => {
      split.highlighted
        ? (highlightedCode += split.code)
        : (highlightedCode += `${split.code}\n`)
    });
  }
  return highlightedCode;
}
