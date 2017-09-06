import {
  createMuiTheme
} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import grey from 'material-ui/colors/grey';

const lightTheme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: grey
  }
});

export default lightTheme;
