

import { AvatarChip, AvatarLogo } from "./AvatarLogo"
import { Avatar, Chip, Popover, Typography, Container, CssBaseline } from "@material-ui/core";


export default function DraftEditor() {


  return (
    <>


      <div><br /></div>


      <AvatarChip personName="ss5s"  label={<Typography variant="body2">body2回的</Typography>} hoverContent={"aaa"} />
      <AvatarChip personName="srers5s"  label={<>bodfdy2回的</>} hoverContent={"aaa"} />
      <div>&nbsp;</div>

      <AvatarChip personName="sdss" label={<Typography variant="h5" >回家d的</Typography>} />

      <Typography variant="body2">dfdsfsffsdfggg</Typography>
      {/* <AvatarLogo size={["4rem", "3rem", "2rem", "4.5rem"]} personName="ffdd" src={"https://picsum.photos/200/300/"} /> */}

    </>


  )


}