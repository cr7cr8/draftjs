import logo from './logo.svg';
import './App.css';
import DraftEditor from "./DraftEditor"
import { Avatar, Chip, Popover, Typography, Container, CssBaseline } from "@material-ui/core";



import { AvatarChip, AvatarLogo } from "./AvatarLogo"

function App() {
  return (
    <>

      <Container>
        <CssBaseline />
        <DraftEditor />

      </Container>
    </>



  );
}

export default App;
