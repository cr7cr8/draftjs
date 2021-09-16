import logo from './logo.svg';
import './App.css';
import DraftEditor from "./DraftEditor"
import { Avatar, Chip, Popover, Typography, Container, CssBaseline } from "@material-ui/core";



import { AvatarChip, AvatarLogo } from "./AvatarLogo"

function App() {
  return (

    <>
      <CssBaseline />


      <Container disableGutters={true} fixed={false} maxWidth={window.innerWidth >= 3000 ? false : "lg"} style={{ backgroundColor: "pink" }} >

        <DraftEditor />
      </Container>
    </>




  );
}

export default App;
