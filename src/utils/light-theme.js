import {
  createMuiTheme
} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import grey from 'material-ui/colors/grey';
import lightBlue from 'material-ui/colors/lightBlue';

const lightTheme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: lightBlue
  }
});

export default lightTheme;
