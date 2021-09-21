import logo from './logo.svg';
import './App.css';
import DraftEditor from "./DraftEditor"
import ContextProvider from "./ContextProvider"
import { Avatar, Chip, Popover, Typography, Container, CssBaseline, Switch } from "@material-ui/core";



import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"





function App() {
  return (

    <>
     

      {/* <Switch /> */}
      <CssBaseline />


      <Container disableGutters={true} fixed={false} maxWidth={window.innerWidth >= 3000 ? false : "lg"} >

        <ContextProvider />
      </Container>
    </>




  );
}

export default App;
