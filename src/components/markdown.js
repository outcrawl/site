import React from 'react';
import marked from 'marked';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import highlight from '../utils/highlight';

// Set up marked
marked.setOptions({
  renderer: new marked.Renderer(),
});

const Markdown = ({ source }) => <div dangerouslySetInnerHTML={{__html: marked(source)}}></div>;

export default Markdown;
