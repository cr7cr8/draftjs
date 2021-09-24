import React, { useState, useEffect } from 'react';
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
import { withContext } from "./ContextProvider"

const useStyles = makeStyles((theme) => ({

  listCss: {
    //paddingTop: theme.spacing(0.5),

    padding: 0,

    backgroundColor: theme.palette.background.default,
    width: "max-content",
    boxShadow: theme.shadows[3],
    borderRadius: 8,
    overflow: "hidden",
    position: "absolute",
    left: 0,
    zIndex: 200,


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



export default withTheme(withContext(function AvatarChipList({


  nameOnTyping = "",
  ctx,
  theme,
  friendListArr = ["aaabsbbccdfsfew", "aassabbcFewf", "aaabfd放空间的s", "aaa分割空ss间而"],
  setShowing,
  setMatchFriendArr,
  tabIndex = 0,
  insertMention,
  ...props }) {





  const classes = useStyles();

  const matchFriendArr = friendListArr.filter(friendName => {

    return friendName.toLowerCase().indexOf(nameOnTyping.toLowerCase()) >= 0

  })
  setMatchFriendArr(matchFriendArr)



  useEffect(function () {
    return function () { setShowing(false) }
  }, [])

  useEffect(function () {

    if (matchFriendArr.length === 0) {
      setShowing(false)
    }

  })


  return (
    <>
      <Grow in={matchFriendArr.length > 0} timeout={{ appear: 150, enter: 150, exit: 1000 }} unmountOnExit={true}


        onEntered={function () {
          setShowing(true)

        }}
        onExited={function () {
          setShowing(false)
        }}

      >

        <List dense={true} disablePadding={true} className={classes.listCss} contentEditable="false" suppressContentEditableWarning="true"


        >

          {matchFriendArr.map((friend, index, arr) => {

            return (
              < ListItem
                style={{ ...index === tabIndex % arr.length && { backgroundColor: "#b7e1fc" } }}
                key={index}
                className={classes.listItemCss}
                onMouseDown={function () {
                  insertMention(friend); setTimeout(ctx.editorRef.current.focus, 0);
                }}

              >
                {ctx.avatarHint
                  ? <AvatarChip personName={friend} className={classes.avatarChipCss} lift={0} />
                  : <>{friend}</>


                }

              </ListItem>
            )
          })}



        </List >

      </Grow>
      {/* <Button variant="outlined" onClick={function () { setShow(pre => !pre) }}>show</Button> */}
    </>
  );
}))