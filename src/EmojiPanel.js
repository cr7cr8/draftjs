import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

import { EditorState, KeyBindingUtil, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, SelectionState, CharacterMetadata } from 'draft-js';


import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, IconButton, Box, Slide } from "@material-ui/core";

import { height } from '@material-ui/system';
import { withContext } from "./ContextProvider"

import classNames from "classnames"

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { InsertEmoticon, PanToolOutlined, PeopleOutlined, BeachAccessOutlined } from "@material-ui/icons";


import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";


import emojiArr, { emojiRegex } from "./EmojiConfig";


const useStyles = makeStyles(({ breakpointsAttribute, ...theme }) => ({
  root: {

    "& .MuiTab-root": {
      minWidth: "unset",
      padding: 0,
      lineHeight: 1,
      color: theme.palette.text.secondary,
      //  ...theme,

      ...breakpointsAttribute(["fontSize", [theme.textSizeArr]])


    },
    "& .MuiTab-root:hover": {
      backgroundColor: theme.palette.action.selected,
    },

    "& .MuiTabs-flexContainer": {
      flexWrap: "wrap",

    },

    "& .MuiTab-fullWidth": {
      flexBasis: "unset",
      //    flexShrink: "unset"
    },


    "& .MuiBox-root": {
      padding: 0,
      margin: 0,
      overflow: "hidden",

    },

  },
  emojiCss: (props) => {
    return {
      //  cursor: "pointer",
      borderWidth: 0,
      margin: 0,
      padding: 0,
      borderRadius: 0,
      //backgroundColor: theme.palette.background.default,
      display: "inline-block",
      // backgroundColor:"wheat",
      ...breakpointsAttribute(["fontSize", theme.textSizeArr]),

    }
  },
  emojiButtonCss: (props) => {
    return {
      margin: 1,
      cursor: "pointer",
      color: isChrome ? theme.palette.text.secondary : theme.palette.text.primary,
      backgroundColor: theme.palette.action.hover,
      //backgroundColor:theme.palette.action.selected, 
      "&:hover": {
        backgroundColor: theme.palette.action.selected,
      },
      "&:active": {
        backgroundColor: theme.palette.divider,
      }

    }
  },


}));


export default function EmojiPanel({ clickFn, ctx, theme, ...props }) {
  const classes = useStyles();

  const insertEmoji = clickFn || function () { }

  const emojiCtxStr = ctx && ctx.emojiCtxStr;
  const setEmojiCtxStr = ctx && ctx.setEmojiCtxStr;
  const editorRef = ctx && ctx.editorRef

  if (ctx) {
    emojiArr[0].symbolStr = emojiCtxStr

  }

  const [dataArr, setDataArr] = useState(emojiArr.map(item => {

    return { slideOn: false, direction: "right", ...item }

  }))

  const [tabValue, setTabValue] = React.useState(0);

  const [height, setHeight] = useState(0)
  const panelRef = useRef()

  useEffect(function () {

    //  panelRef.current && console.log("----", window.getComputedStyle( panelRef.current).height)

    panelRef.current && window.getComputedStyle(panelRef.current).height !== height && setHeight(window.getComputedStyle(panelRef.current).height)

  })









  return (
    <div className={classes.root}>


      <AppBar position="static" color="default" elevation={0} >
        <Tabs

          indicatorColor="primary"
          value={tabValue}
          selectionFollowsFocus={true}
          //onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        //variant="scrollable"
        //scrollButtons="on"

        >


          {
            dataArr.map((item, index) => {
              return <Tab value={index} style={{}} label={<span style={{}}>{item.category}</span>} key={index}


                onClick={() => {


                  setDataArr(pre => {
                    const newDataArr = pre.map(oldItem => ({ ...oldItem, slideOn: false, direction: index > tabValue ? "right" : "left" }))
                    newDataArr[index].slideOn = true
                    newDataArr[index].direction = index > tabValue ? "left" : "right"
                    return [...newDataArr]
                  })
                  setTabValue(index)

                }} />
            })
          }

        </Tabs>
      </AppBar>


      <div key="slide" style={{ overflow: "hidden", /*backgroundColor: "wheat",*/ position: "relative", width: "100%", height, maxHeight: "30vh", overflowX: "hidden", overflowY: "auto" }}>


        {dataArr.map((item, index) => {

          let match;
          const arr = [];
          while (match = emojiRegex.exec(item.symbolStr)) {
            const emoji = match[0];
            arr.push(emoji)

          }
          const allClassNames = classNames({
            [classes.emojiCss]: true,
            [classes.emojiButtonCss]: true

          })

          return <Slide
            onEntered={function () { console.log(editorRef.current.editor.editor.getBoundingClientRect()) }}
            onExited={function () { console.log(editorRef.current.editor.editor.getBoundingClientRect()) }}


            in={item.slideOn} unmountOnExit={true} timeout={{ exit: 150, enter: 300 }} direction={item.direction} key={index} ref={panelRef}>


            <div style={{ /*backgroundColor: "pink",*/ overflowWrap: "anywhere", width: "100%", position: "absolute" }} >

              {arr.map(item => {
                return (
                  <button key={item} //disableRipple
                    className={allClassNames}
                    onClick={function () {
                      if (index > 0) {
                        setDataArr(pre => {
                          pre[0].symbolStr = pre[0].symbolStr.replace(item + " ", "")
                          pre[0].symbolStr = item + " " + pre[0].symbolStr
                          if (ctx) { setEmojiCtxStr(pre[0].symbolStr) }
                          return pre
                        })
                      }
                      insertEmoji(item)
                    }}
                    children={item}
                  />
                )
              })}

              {index === 0 && dataArr[0].symbolStr.length > 0 && <button className={allClassNames} style={{ float: "right", backgroundColor: "transparent" }}
                onClick={function () {
                  setDataArr(pre => {
                    pre[0].symbolStr = ""
                    if (ctx) { setEmojiCtxStr("") }
                    return pre
                  })
                }}
              >✖</button>}
            </div>

          </Slide>
        })}

      </div>





    </div >
  );
}