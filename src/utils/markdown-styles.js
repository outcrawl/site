export default (theme) => ({
  fontFamily: theme.typography.fontFamily,
  color: theme.palette.text.primary,

  // Headings

  '& h1': {
    ...theme.typography.display4,
    fontSize: '3.5rem',
    margin: '0.7em 0 0.5em',
  },
  '& h2': {
    ...theme.typography.display3,
    fontSize: '2.75rem',
    margin: '0.7em 0 0.4em',
  },
  '& h3': {
    ...theme.typography.display2,
    fontSize: '2rem',
    margin: '0.7em 0 0.4em',
  },
  '& h4': {
    ...theme.typography.display1,
    fontSize: '1.5rem',
    margin: '0.6em 0',
  },
  '& img': {
    maxWidth: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
  },

  // Code
  '& code': {
    fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
    lineHeight: 1.6,
    fontSize: '0.875rem',
    display: 'inline-block',
    padding: '0 4px',
    color: theme.palette.text.primary,
    backgroundColor: '#f7f7f7',
  },

  '& pre': {
    padding: 16,
  },

  '& .code': {
    overflow: 'auto',
    margin: '1rem 0',
    backgroundColor: '#f7f7f7',

    '& pre': {
      backgroundColor: 'transparent',
      margin: 0,
      overflow: 'initial',
      float: 'left',
      minWidth: '100%',
    },

    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
      width: '100%',
    },

    // Highlights
    '& .code__prompt': {
      color: 'rgba(0, 0, 0, 0.56)',
    },

    '& .code__line-highlight': {
      background: 'rgba(0, 0, 0, 0.08)',
      display: 'block',
      marginRight: -16,
      marginLeft: -16,
      paddingRight: 16,
      paddingLeft: 16,
    },

    '& .code__line-add': {
      background: 'rgba(0, 255, 0, 0.15)',
      display: 'block',
      marginRight: -16,
      marginLeft: -16,
      paddingRight: 16,
      paddingLeft: 16,
    },

    '& .code__line-remove': {
      background: 'rgba(255, 0, 0, 0.15)',
      display: 'block',
      marginRight: -16,
      marginLeft: -16,
      paddingRight: 16,
      paddingLeft: 16,
    },

    // Tokens

    '& .token.comment, & .token.prolog, & .token.doctype, & .token.cdata': {
      color: '#008000',
    },

    '& .token.string': {
      color: '#a31515',
    },

    '& .token.punctuation, & .token.operator': {
      color: '#393a34',
    },

    '& .token.url, & .token.symbol, & .token.number, & .token.boolean, & .token.variable, & .token.constant, & .token.inserted': {
      color: '#36acaa',
    },

    '& .token.atrule, & .token.keyword, & .token.attr-value, & .code--autohotkey .token.selector, & .code--json .token.boolean, & .code--json .token.number, & code[class*="code--css"]': {
      color: '#0000ff',
    },

    '& .token.function': {
      color: '#393a34',
    },

    '& .token.deleted, & .code--autohotkey .token.tag': {
      color: '#9a050f',
    },

    '& .token.selector, & .code--autohotkey .token.keyword': {
      color: '#00009f',
    },

    '& .token.important, & .token.bold': {},

    '& .token.italic': {},

    '& .token.class-name, & .code--json .token.property': {
      color: '#2b91af',
    },

    '& .token.tag, & .token.selector': {
      color: '#800000',
    },

    '& .token.attr-name, & .token.property, & .token.regex, & .token.entity': {
      color: '#ff0000',
    },

    '& .token.directive.tag .tag': {
      background: '#ffff00',
      color: '#393a34',
    },
  },

  // Text

  '& p, & ul, & ol': {
    lineHeight: 1.6,
    margin: '1rem 0',
  },
  '& a': {
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  // Shortcodes

  '& .page__note': {
    lineHeight: 1.6,
    padding: 16,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.contrastText,
  },
});
