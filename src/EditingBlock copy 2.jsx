
import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, IconButton, Tabs, Tab, Button, ButtonGroup, Container, Paper, Popover, Avatar, Box, Chip, Grow, Zoom, Slide, Collapse } from "@material-ui/core";





import CloseIcon from '@material-ui/icons/Close';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import ImageTwoToneIcon from '@material-ui/icons/ImageTwoTone';
import AvatarChipList from "./AvatarChipList";


import HeightIcon from '@material-ui/icons/Height';


import classNames from "classnames"
import { light } from '@material-ui/core/styles/createPalette';
import { lineHeight } from '@material-ui/system';

const useStyles = makeStyles(({ textSizeArr, breakpointsAttribute, multiplyArr, ...theme }) => {


  return {

    collapseCss: () => {
      return {

        // right: 0,

        // // display: "flex",
        // alignItems: "center",
        // //   opacity: 0.5,
        // //  transition: "width 0.3s",
        // // width: showSettingBar ? "100%" : 0,
        // width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",

        paddingBottom:"4px",
        // margin: 0,
        // padding: 0,
        // minWidth: 0,
        // minHeight: 0,

        "& .MuiCollapse-wrapperInner": {
          display: "flex",
          margin: 0,
          padding: 0,
          minWidth: 0,
          minHeight: 0,
        }

      }
    },


    toolBarCss: () => {

      return {
        margin: 0,
        padding: 0,
        backgroundColor: "pink",
        minWidth: 0,
        minHeight: 0,

        "& .MuiSvgIcon-fontSizeSmall": {
          ...breakpointsAttribute(["fontSize",textSizeArr]),

        },


        "& .MuiTabs-scrollable": {
          height: "auto",
          display: "flex",
        },

        //  display:"inline-flex",
        "& .MuiTabs-indicator": {
          backgroundColor: "transparent",
          // flexWrap: "wrap",
          minWidth: "0px",
          minHeight: "0px",
          margin: 0,
          padding: 0,

        },
        "& .MuiTabs-flexContainer": {
        //  display: "flex",
        },
        "& button": {
          margin: 0,
          padding: 0,
        },
        "& .MuiTabs-root": {
          minWidth: "0px",
          minHeight: "0px",
        },

        "& .MuiTab-root": {
          minWidth: "0px",
          minHeight: "0px",
          //  padding: 0,
          //  margin: 0,
          // lineHeight: 1,
          // color: theme.palette.text.secondary,

          // ...breakpointsAttribute(["width", multiplyArr(textSizeArr, 1.1)], ["height", multiplyArr(textSizeArr, 1.1)]),

        },



      }

    },



  }


})




export default function EditingBlock(props) {




  const theme = useTheme()

  const { toolBarCss, collapseCss } = useStyles()


  const { editorState, setEditorState, editorRef, gradientStyleArr, showFontBar, setShowFontBar, markingImageBlock } = props;
  const selection = editorState.getSelection()
  const startKey = selection.getStartKey()
  const endKey = selection.getEndKey()
  const isStartKeyIn = props.children.some(item => { return item.props.children.props.block.getKey() === startKey })
  const isEndKeyIn = props.children.some(item => { return item.props.children.props.block.getKey() === endKey })
  const hasFocus = selection.getHasFocus()
  const isCollapsed = selection.isCollapsed()

  const displayToolBar = hasFocus && isStartKeyIn && isEndKeyIn
  //const arr = [props.children[0]]
  //let preItemValue = props.children[0].props.children.props.block.getData().toObject().backgroundImage

  const [loaded, setLoaded] = useState(false)

  const [showSettingBar, setShowSettingBar] = useState(true)


  const allClassNames = classNames({

    "editor-block-wrapper": true,
    "editor-block-wrapper-focus-on": displayToolBar || !loaded

  })


  const settingIconCss = classNames({
    "rotate2": true,
  })


  const toolBar =

    useMemo(
      () => (
        <Collapse
          contentEditable={false}
          in={loaded && isStartKeyIn && isEndKeyIn}
          timeout={{ enter: 300, exit: 0 }}
          //  elevation={0}
          className={collapseCss}
          style={{
            //boxShadow: theme.shadows[5],
            //  transform: "translateY(-100%)",
            //  position: "absolute",
            // randomColor(), //colorValues('#' + (Math.random() * 0xFFFFFF << 0).toString(16)),
            // right: 0,

            // // display: "flex",
            // alignItems: "center",
            // //   opacity: 0.5,
            // //  transition: "width 0.3s",
            // // width: showSettingBar ? "100%" : 0,
            // width: "100%",
            // whiteSpace: "nowrap",
            // overflow: "hidden",
            // lineHeight: 1,

          }}
        >
          <div style={{ display: "flex", backgroundColor: "orange" }}>
            <Zoom in={showSettingBar} unmountOnExit={true}>
              <IconButton className={theme.sizeCss}
                contentEditable={false}

                onClick={function (e) {
                  e.preventDefault(); e.stopPropagation()
                  //   markingImageBlock(blockKey)
                  //  setShowColorPanel(pre => !pre)
                }}
              >
                <InsertPhotoOutlinedIcon className={theme.sizeCss} />
              </IconButton>
            </Zoom>

            <Zoom in={showSettingBar} unmountOnExit={true}>
              <IconButton className={theme.sizeCss}
                contentEditable={false}

                onClick={function (e) {
                  e.preventDefault(); e.stopPropagation();
                  //   inputRef.current.click()
                }}
              >
                <ImageTwoToneIcon className={theme.sizeCss} />
              </IconButton>
            </Zoom>
          </div>


          {/* <div style={{ backgroundColor: "lightcoral", display: "inline-block" }}> */}

          <Tabs

            className={toolBarCss}

            indicatorColor="primary"
            value={1}
            selectionFollowsFocus={true}
            //onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            // variant="fullWidth"

            variant="scrollable"
            scrollButtons="auto"
            style={{
              // display: "inline-block",
              // backgroundColor: "lightyellow" 

            }}
          >

            {gradientStyleArr.map(function (item, index) {

              return (

                <Tab key={index}
                  value={index}
                  icon={


                    <div className={theme.sizeCss} contentEditable={false} style={{ borderRadius: "1000px", ...item }} />



                    // <IconButton className={theme.sizeCss} key={index}
                    //   contentEditable={false}
                    //   style={{
                    //     padding: 0,
                    //   }}
                    //   onClick={function (e) {
                    //     e.preventDefault(); e.stopPropagation();
                    //     //    markingColorBlock(e, editorState, setEditorState, item, blockKey, true)

                    //   }}>
                    //   <div className={theme.sizeCss} style={{ borderRadius: "1000px", ...item }} />
                    // </IconButton>
                  }
                />



              )


              return (






                <Slide key={index} in={loaded && displayToolBar} in={true} direction="left"
                  timeout={{ enter: 50 * index + 100, exit: 50 * (gradientStyleArr.length - index) }}
                  unmountOnExit={true}>

                  <IconButton className={theme.sizeCss} key={index}
                    contentEditable={false}
                    style={{
                      padding: 0,
                    }}
                    onClick={function (e) {
                      e.preventDefault(); e.stopPropagation();
                      //    markingColorBlock(e, editorState, setEditorState, item, blockKey, true)

                    }}>
                    <div className={theme.sizeCss} style={{ borderRadius: "1000px", ...item }} />
                  </IconButton>
                </Slide>


              )
            })}
          </Tabs>
          {/* </div> */}
        </Collapse>
      ),
      [showSettingBar, loaded && displayToolBar]
    )




  useEffect(function () {

    setLoaded(true)

  }, [])



  return (

    <div className={allClassNames}>
      {/* <div className="editor-block-wrapper"> */}
      {props.children.map((item, index) => {

        const block = item.props.children.props.block

        if (isCollapsed && (startKey === block.getKey())) {
          return (
            <React.Fragment key={index} >
              {item}

              <div
                //  className={theme.sizeCss}
                contentEditable={false}
                style={{
                  transform: "translateX(100%) translateY(-100%)",
                  position: "absolute",
                  //  background: "skyblue",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  //  backgroundColor: "skyblue",
                  //  width:"100%",
                  right: 0,
                  zIndex: 0,
                  userSelect: "none"
                }}
              >
                <div style={{ width: 0 }}>&nbsp;</div>

                <IconButton
                  style={{
                    transform: "translateX(0%)",
                    alignItems: "center",
                    //backgroundColor: "wheat",
                  }}
                  className={theme.sizeCss + " "}
                  contentEditable={false}
                  onMouseDown={function (e) {
                    e.preventDefault()
                    e.stopPropagation()
                  }}

                  onClick={function (e) {
                    e.preventDefault()
                    e.stopPropagation()

                    // markingColorBlock()
                    // markingColorBlock(e, editorState, setEditorState, {}, blockKey)

                    setEditorState(RichUtils.toggleBlockType(editorState, "editingBlock"))

                    //setShowSettingBar(pre => !pre)
                  }}
                >

                  <CloseIcon className={theme.sizeCss + " " + settingIconCss} />
                </IconButton>
                {/* </div> */}
              </div>

            </React.Fragment>
          )
        }
        else {
          return item
        }


      })}



      {toolBar}
      {/* </div> */}
    </div >
  )



}





function randomColor() {

  Math.floor(Math.random() * 255)

  return `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.1)`

}


