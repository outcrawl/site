const siteUrl = process.env.NODE_ENV === 'production'
  ? 'https://outcrawl.com'
  : 'http://localhost:8000';

var multilineComment = /\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|<self>)*\*\//.source;
for (var i = 0; i < 2; i++) {
  // support 4 levels of nested comments
  multilineComment = multilineComment.replace(/<self>/g, function () { return multilineComment; });
}
multilineComment = multilineComment.replace(/<self>/g, function () { return /[^\s\S]/.source; });

const remark = {
  resolve: 'gatsby-transformer-remark',
  options: {
    plugins: [
      {
        resolve: 'gatsby-remark-copy-linked-files',
        options: {
          destinationDir: './static',
        },
      },
      {
        resolve: 'gatsby-remark-images',
        options: {
          linkImagesToOriginal: false,
          quality: 90,
        },
      },
      {
        resolve: 'gatsby-remark-autolink-headers',
        options: {
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 4 24 16"><path d="M0 0h24v24H0z" fill="none"/><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>',
          className: 'heading-link',
          maintainCase: true,
          removeAccents: true,
          isIconAfterHeader: true,
        },
      },
      'lower-headings',
      {
        resolve: 'gatsby-remark-prismjs',
        options: {
          classPrefix: 'code-',
          inlineCodeMarker: null,
          aliases: {},
          showLineNumbers: false,
          noInlineHighlight: false,
          prompt: {
            global: true,
          },
          // TODO: Remove when https://github.com/PrismJS/prism/pull/2332 is released. "control-keyword" definition was added to make it look like in vscode.
          languageExtensions: [{
            language: 'rust',
            definition: {
              'comment': [
                {
                  pattern: RegExp(/(^|[^\\])/.source + multilineComment),
                  lookbehind: true,
                  greedy: true
                },
                {
                  pattern: /(^|[^\\:])\/\/.*/,
                  lookbehind: true,
                  greedy: true
                }
              ],
              'string': {
                pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/,
                greedy: true
              },
              'char': {
                pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u{(?:[\da-fA-F]_*){1,6}|.)|[^\\\r\n\t'])'/,
                greedy: true,
                alias: 'string'
              },
              'attribute': {
                pattern: /#!?\[[^[\]]*\]/,
                greedy: true,
                alias: 'attr-name',
                inside: {
                  'string': null // see below
                }
              },

              // Closure params should not be confused with bitwise OR |
              'closure-params': {
                pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
                lookbehind: true,
                greedy: true,
                inside: {
                  'closure-punctuation': {
                    pattern: /^\||\|$/,
                    alias: 'punctuation'
                  },
                  rest: null // see below
                }
              },

              'lifetime-annotation': {
                pattern: /'\w+/,
                alias: 'symbol'
              },

              'fragment-specifier': {
                pattern: /(\$\w+:)[a-z]+/,
                lookbehind: true,
                alias: 'punctuation'
              },
              'variable': /\$\w+/,

              'function-definition': {
                pattern: /(\bfn\s*)\w+/,
                lookbehind: true,
                alias: 'function'
              },

              'control-keyword': [
                /\b(?:async|await|return|if|match)\b/,
              ],
              'keyword': [
                // https://github.com/rust-lang/reference/blob/master/src/keywords.md
                /\b(?:abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|Self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/,
                // primitives
                // https://doc.rust-lang.org/stable/rust-by-example/primitives.html
                /\b(?:[ui](?:8|16|32|64|128|size)|f(?:32|64)|bool|char)\b/
              ],

              // functions can technically start with an upper-case letter, but this will introduce a lot of false positives
              // and Rust's naming conventions recommend snake_case anyway.
              // https://doc.rust-lang.org/1.0.0/style/style/naming/README.html
              'function': /\b[a-z_]\w*(?=\s*(?:::\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*)?\()/,
              'macro': {
                pattern: /\w+!/,
                alias: 'property'
              },

              // Hex, oct, bin, dec numbers with visual separators and type suffix
              'number': /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:\d(?:_?\d)*)?\.?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:[iu](?:8|16|32|64|size)?|f32|f64))?\b/,
              'boolean': /\b(?:false|true)\b/,
              'punctuation': /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
              'operator': /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/
            },
          }],
        },
      },
      'gatsby-remark-katex',
    ],
  },
};

const plugins = [
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'data',
      path: `${__dirname}/data/`,
    },
  },
  {
    resolve: 'gatsby-plugin-web-font-loader',
    options: {
      google: {
        families: ['Roboto+Mono|Roboto:300,400,500,700'],
      },
    },
  },
  'gatsby-plugin-react-svg',
  'gatsby-plugin-sharp',
  'gatsby-transformer-sharp',
  'gatsby-transformer-yaml',
  'gatsby-plugin-sass',
  'gatsby-plugin-material-ui',
  {
    resolve: 'gatsby-plugin-google-analytics',
    options: {
      trackingId: 'UA-103565863-1',
    },
  },
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      name: 'Outcrawl',
      short_name: 'Outcrawl',
      start_url: siteUrl + '/',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      display: 'minimal-ui',
      icon: 'static/static/logo.png',
    },
  },
  {
    resolve: 'gatsby-plugin-favicon',
    options: {
      logo: './static/static/logo.svg',
      injectHTML: true,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        twitter: false,
        yandex: false,
        windows: false,
      },
    },
  },
  'gatsby-plugin-react-helmet',
  remark,
];

module.exports = {
  siteMetadata: {
    siteUrl,
    title: 'Outcrawl',
    description: 'Software engineering without nonsense',
    copyright: '2020 © Outcrawl. All rights reserved.',
    twitterId: '@tinrab',
    facebookId: '863987620425609',
    articlesPerPage: 8,
    featuredImage: siteUrl + '/static/featured.jpg',
  },
  plugins,
};
