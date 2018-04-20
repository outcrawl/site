import React from 'react';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import highlight from './highlight';

const styles = (theme) => ({
  img: {
    maxWidth: '100%',
  },
  code: {
    display: 'inline-block',
    lineHeight: 1.6,
    fontFamily: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
    padding: '3px 6px',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    fontSize: 14,
  },
  codeBlock: {
    margin: `${theme.spacing.unit * 3}px 0`,
    padding: '12px 18px',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 3,
    overflow: 'auto',
  },
});

export default (ast) =>
  withStyles(styles)(({ classes }) => render(ast, classes));

let key = 1;
function getKey() {
  return key++;
}

function render(ast, classes) {
  switch (ast.type) {
    case 'root':
      return renderRoot(ast, classes);
    case 'element':
      switch (ast.tagName) {
        case 'span':
          return renderChildren(ast, classes);
        case 'div':
          return renderChildren(ast, classes);
        case 'p':
          return renderParagraph(ast, classes);
        case 'h1':
          return renderHeading(ast, 1, classes);
        case 'h2':
          return renderHeading(ast, 2, classes);
        case 'h3':
          return renderHeading(ast, 3, classes);
        case 'img':
          return renderImage(ast, classes);
        case 'a':
          return renderLink(ast, classes);
        case 'code':
          return renderCode(ast, classes);
        case 'pre':
          return renderCodeBlock(ast, classes);
      }
    case 'text':
      return renderText(ast, classes);
  }
  return null;
}

function renderChildren(ast, classes) {
  return ast.children.map((c) => render(c, classes));
}

function renderRoot(ast, classes) {
  return <div key={getKey()}>{renderChildren(ast, classes)}</div>;
}

function renderText(ast, classes) {
  return <span key={getKey()}>{ast.value}</span>;
}

function renderParagraph(ast, classes) {
  return (
    <Typography key={getKey()} variant="body1" gutterBottom>
      {renderChildren(ast, classes)}
    </Typography>
  );
}

function renderHeading(ast, level, classes) {
  return (
    <Typography
      key={getKey()}
      gutterBottom
      variant={`display${4 - level}`}
      component={`h${level + 1}`}
    >
      {renderChildren(ast)}
    </Typography>
  );
}

function renderImage(ast, classes) {
  const { src, alt } = ast.properties;
  return <img key={getKey()} src={src} alt={alt} className={classes.img} />;
}

function renderLink(ast, classes) {
  const { href } = ast.properties;
  return (
    <a key={getKey()} href={href}>
      {renderChildren(ast, classes)}
    </a>
  );
}

function renderCode(ast, classes) {
  return (
    <code key={getKey()} className={classes.code}>
      {renderChildren(ast)}
    </code>
  );
}

function renderCodeBlock(ast, classes) {
  if (!ast.children[0] || !ast.children[0].children) {
    return;
  }

  const code = ast.children[0];
  const source = code.children[0].value;

  let lang = null;

  if (code.properties.className) {
    lang = code.properties.className[0].replace('language-', '');
  }

  return (
    <pre key={getKey()} className={classes.codeBlock}>
      {highlight(source, lang)}
    </pre>
  );
}
