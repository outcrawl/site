import { createMuiTheme } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[700],
    },
    secondary: {
      main: blue[500],
    },
  },
});

export default theme;
