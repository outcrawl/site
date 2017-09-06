import {
  createMuiTheme
} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import purple from 'material-ui/colors/purple';
import green from 'material-ui/colors/green';

const lightTheme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      ...green,
      A400: '#00e677'
    }
  }
});

export default lightTheme;
