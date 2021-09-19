import React, { useState } from 'react';
import { makeStyles, withTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';


import { AvatarChip, TwoLineLabel, AvatarLogo } from "./AvatarLogo";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  listCss: {
    //paddingTop: theme.spacing(0.5),
    padding: 0,

    backgroundColor: "wheat",
    width: "fit-content",
    boxShadow: theme.shadows[3],
    borderRadius: 8,
    overflow: "hidden",
    // "&:hover":{
    //   backgroundColor:"skyblue"
    // }
  },
  listItemCss: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    lineHeight: "100%",


    "&:first-of-type": {
      paddingTop: theme.spacing(1),
    },
    "&:last-of-type": {
      paddingBottom: theme.spacing(1),
    },

    "&:hover": {
      backgroundColor: "#b7e1fc",
      cursor: "pointer",

    }

  },
  avatarChipCss: {
    borderRadius: 0,
    backgroundColor: "transparent",
    "&:hover": {
      cursor: "pointer",
    }

  }


}));



export default withTheme(function AvatarChipList({ showList = true, theme, friendList = ["dfsfew", "Fewf", "fd放空间的s", "分割空间而"], ...props }) {
  const classes = useStyles();

  //const [show, setShow] = useState(true);

  return (
    <>
      <Grow in={showList} timeout={{ appear: 200, enter: 200, exit: 1 }}>
        <List dense={true} disablePadding={true} className={classes.listCss}>

          {friendList.map((friend, index) => {

            return < ListItem key={index} className={classes.listItemCss} onClick={function () { alert("Hi, " + friend) }}>
              <AvatarChip personName={friend} className={classes.avatarChipCss} lift={0} />
            </ListItem>
          })}



        </List >
      </Grow>
      {/* <Button variant="outlined" onClick={function () { setShow(pre => !pre) }}>show</Button> */}
    </>
  );
})