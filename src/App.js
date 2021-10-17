import logo from './logo.svg';
import './App.css';
import DraftEditor from "./DraftEditor"
import ContextProvider from "./ContextProvider"
import { Avatar, Chip, Popover, Typography, Container, CssBaseline, Switch, Grid } from "@material-ui/core";



import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"





function App() {
  return (

    <>


      {/* <Switch /> */}
      <CssBaseline />

      <Container disableGutters={true} fixed={false} maxWidth={window.innerWidth >= 3000 ? false : "lg"} >

        <Grid container
          direction="row"
          justifyContent="space-around"
          alignItems="flex-start"
          spacing={0}

        >
          <Grid item xs={12} sm={12} md={10} lg={6} xl={6} >



            <ContextProvider />
          </Grid>

        </Grid>


      </Container>
    </>




  );
}

export default App;
