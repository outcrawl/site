const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/index.js');
const rangeParser = require('parse-numeric-range');

function highlight(code, language) {
  if (!language) {
    return `<pre><code>${code}</code></pre>`;
  }

  // Check highlighted lines
  let lines = [];
  if (language.indexOf('{') != -1) {
    let [split, range] = language.split('{');
    range = range.slice(0, -1);
    language = split;
    lines = rangeParser.parse(range).filter(i => i > 0);
  }

  // Parse source code
  language = language == 'js' ? 'javascript' : language;
  language = language == 'ts' ? 'typescript' : language;
  language = language == 'html' ? 'markup' : language;
  loadLanguages([language]);
  code = Prism.highlight(code, Prism.languages[language], language);

  // Highlight lines
  if (lines.length > 0) {
    const sourceLines = code.split('\n');
    code = '';
    for (let i = 0; i < sourceLines.length; i++) {
      if (lines.indexOf(i - 1) != -1) {
        code += `<span class="code__line">${sourceLines[i]}</span>`;
      } else {
        code += sourceLines[i] + '\n';
      }
    }
  }

  return `
    <div class="code">
      <pre><code class="code-language-${language}">${code}</code></pre>
    </div>
  `;
}

export { highlight };
