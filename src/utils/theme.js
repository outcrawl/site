import { createMuiTheme } from 'material-ui/styles';
import grey from 'material-ui/colors/grey';
import lightBlue from 'material-ui/colors/lightBlue';

export default createMuiTheme({
  palette: {
    primary: grey,
    secondary: lightBlue,
  },
  overrides: {
    MuiButton: {
      raisedPrimary: {
        backgroundColor: grey[900],
        color: '#fff',
        '&:hover': {
          backgroundColor: grey[700],
        },
      },
    },
    MuiIconButton: {
      root: {
        fontSize: 18,
        fontWeight: 500,
        lineHeight: '24px',
        verticalAlign: 'middle',
        textDecoration: 'none',
        fill: 'rgba(0, 0, 0, 0.54)',
      },
      disabled: {
        fill: 'rgba(0, 0, 0, 0.26)',
      },
    },
  },
});
