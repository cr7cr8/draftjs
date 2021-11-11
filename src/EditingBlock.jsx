
import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, IconButton, Tabs, Tab, Button, ButtonGroup, Container, Paper, Popover, Avatar, Box, Chip, Grow, Fade, Zoom, Slide, Collapse } from "@material-ui/core";





import CloseIcon from '@material-ui/icons/Close';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import ImageTwoToneIcon from '@material-ui/icons/ImageTwoTone';
import AvatarChipList from "./AvatarChipList";


import HeightIcon from '@material-ui/icons/Height';


import classNames from "classnames"
import { light } from '@material-ui/core/styles/createPalette';
import { lineHeight } from '@material-ui/system';


import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DetectableOverflow from "react-detectable-overflow"


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

        paddingBottom: "4px",
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
          ...breakpointsAttribute(["fontSize", textSizeArr]),

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
  const { editorBlockKeyArr, setEditorBlockKeyArr, darkToLightArr, setDarkToLightArr, bgImageObj, editorState, setEditorState, editorRef,} = useContext(Context)

  //const { editorState, setEditorState, editorRef, gradientStyleArr, showFontBar, setShowFontBar, markingImageBlock, markingColorBlock } = props;
  const {  gradientStyleArr, showFontBar, setShowFontBar, markingImageBlock, markingColorBlock, toolButtonRef } = props;

  const selection = editorState.getSelection()
  const startKey = selection.getStartKey()
  const endKey = selection.getEndKey()
  const isStartKeyIn = props.children.some(item => { return item.props.children.props.block.getKey() === startKey })
  const isEndKeyIn = props.children.some(item => { return item.props.children.props.block.getKey() === endKey })
  const hasFocus = selection.getHasFocus()
  const isCollapsed = selection.isCollapsed()
  const focusKey = selection.getFocusKey()

  const isFocusIn = hasFocus && isStartKeyIn && isEndKeyIn


  const isFocusIn = hasFocus && isStartKeyIn && isEndKeyIn

  const displayToolBar = hasFocus && isStartKeyIn && isEndKeyIn
  //const arr = [props.children[0]]
  //let preItemValue = props.children[0].props.children.props.block.getData().toObject().backgroundImage



  const headKey = props.children[0].props.children.props.block.getKey()


  const hasLoaded = editorBlockKeyArr.some(key => {
    return key === headKey
  })
  //const [loaded, setLoaded] = useState(hasLoaded)

  const [showSettingBar, setShowSettingBar] = useState(true)


  const lightToDarkCss = classNames({

    "editor-block-light": !(hasFocus && isStartKeyIn && isEndKeyIn && hasLoaded),
    "editor-block-dark": hasFocus && isStartKeyIn && isEndKeyIn && hasLoaded   //displayToolBar && hasLoaded 

  })


  const ediotrBlockCss = function () { return darkToLightArr.includes(headKey) ? "editor-block-dark-light" : lightToDarkCss }()



  const settingIconCss = classNames({
    "rotate2": true,
  })

  const inputRef = useRef()




  useEffect(function () {
    if (!hasLoaded) {

      setEditorBlockKeyArr(pre => {
        return [...pre, headKey]
      })

    }

    if (setDarkToLightArr.length > 0) {
      setTimeout(() => {
        setDarkToLightArr([])
      }, 300);

    }


  }, [])


  useEffect(function () {


    //  props.children[0].props.children.props.block.getData().toObject().backgroundImage

    // const element = Array.from(props.children).find(item => {


    //   return item.props.children.props.block.getKey() === focusKey


    // })

    // data-offset-key="9itp6-0-0"

    // const element = editorBlockRef.current._node

    // const bound = element && element.getBoundingClientRect()

    const element = document.querySelector(`div[data-offset-key*="${startKey}"]`)
    const bound = element && element.getBoundingClientRect()

    const bound2 = editorRef.current.editor.editor.getBoundingClientRect()


    //console.log(startKey,element)

    //console.log(toolButtonRef)
     selection.hasFocus && toolButtonRef.current && toolButtonRef.current.setTop(bound.top - bound2.top)


  })


  return (

    <div className={ediotrBlockCss}>

      {props.children.map((item, index, allChildren) => {

        const block = item.props.children.props.block


        return item



      })}


<<<<<<< HEAD
      <Collapse in={isFocusIn} unmountOnExit={true} contentEditable={false}>

        <ToolBar hasLoaded={hasLoaded} inputRef={inputRef} markingImageBlock={markingImageBlock} editorState={editorState}
          ediotrBlockCss={ediotrBlockCss} anmimationType={null}
        />

=======
      <Collapse in={isFocusIn} unmountOnExit={true}  contentEditable={false}>
    
          <ToolBar hasLoaded={hasLoaded} inputRef={inputRef} markingImageBlock={markingImageBlock} editorState={editorState}
            ediotrBlockCss={ediotrBlockCss} anmimationType={null}
          />
       
>>>>>>> fa0a0c36d64c90e58be0158845fa0d13b6921c5f
      </Collapse>

    </div >

  )



}


function ToolBar({ hasLoaded, inputRef, markingImageBlock, editorState, ediotrBlockCss, anmimationType }) {

  const theme = useTheme()
  const { gradientStyleArr } = useContext(Context)
  const [isOverFlow, setIsOverFlow] = useState(false)

  const [randomId] = useState("--toolbar--" + Math.floor(Math.random() * 1000))

  return (
    <div className={theme.heightCss} style={{ display: "flex", width: "100%", justifyContent: "flex-start", alignItems: "center" }}

      contentEditable={false}
    >
      {isOverFlow && <IconButton
        style={{
          alignItems: "center",
        }}
        className={theme.sizeCss}
        contentEditable={false}
        onClick={function () {

          const toolBar = document.querySelector(`div[style*="${randomId}"]`)

          toolBar.scrollBy({
            top: 0,
            left: -Number(window.getComputedStyle(toolBar).width.replace("px", "")) / 2,
            behavior: 'smooth'
          })

        }}
        onDoubleClick={function (e) {
          const toolBar = document.querySelector(`div[style*="${randomId}"]`)
          toolBar.scrollBy({
            top: 0,
            left: -1000,
            behavior: 'smooth'
          })
        }}

      >
        <ChevronLeftIcon className={theme.sizeCss} />
      </IconButton>
      }

      <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation()



          markingImageBlock(editorState.getSelection().getStartKey())
          //  setShowColorPanel(pre => !pre)
        }}
      >
        <InsertPhotoOutlinedIcon className={theme.sizeCss} />
      </IconButton>

      <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();

          inputRef.current.click()



        }}
      >
        <ImageTwoToneIcon className={theme.sizeCss} />
      </IconButton>

      <DetectableOverflow

        onChange={function (overflow) { setIsOverFlow(overflow) }}

        className={theme.heightCss}
        style={{
          display: "block",
          // backgroundColor: "wheat", 
          whiteSpace: "nowrap",

          lineHeight: 1,
          overflow: "hidden",
          [randomId]: "--toolbar",

        }}>
        {gradientStyleArr.map(function (item, index) {


          return (
            React.createElement(
              anmimationType || React.Fragment,
              {
                key: index,

                ...anmimationType && {
                  in: true, unmountOnExit: true,
                  timeout: { enter: hasLoaded ? 0 : Math.floor((index + 1) / gradientStyleArr.length * (gradientStyleArr.length / 9 * 700)) },
                  contentEditable: false,
                  style: {
                    userSelect: "none",
                  }
                },
              }
              ,
              <div className={theme.sizeCss}
                contentEditable={false}

                key={index}
                style={{
                  borderRadius: "1000px",
                  display: "inline-block",
                  verticalAlign: "top",
                  userSelect: "none",
                  ...item
                }}

                onMouseDown={function (e) {
                  e.preventDefault(); e.stopPropagation();

                }}
                onClick={function (e) {
                  e.preventDefault(); e.stopPropagation();
                  // todo   markingColorBlock(e, editorState, setEditorState, item, headKey, true)
                }}
              />
            )
          )

        })}
      </DetectableOverflow >


      {isOverFlow && <IconButton
        style={{
          alignItems: "center",
        }}
        className={theme.sizeCss}

        contentEditable={false}

        onClick={function (e) {


          const toolBar = document.querySelector(`div[style*="${randomId}"]`)
          toolBar.scrollBy({
            top: 0,
            left: Number(window.getComputedStyle(toolBar).width.replace("px", "")) / 2,
            behavior: 'smooth'
          })
          // document.querySelector('div[style*="--toolbar--xx"]').scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
        }}
        onDoubleClick={function (e) {
          const toolBar = document.querySelector(`div[style*="${randomId}"]`)
          toolBar.scrollBy({
            top: 0,
            left: 1000,
            behavior: 'smooth'
          })
        }}

      >
        <ChevronRightIcon className={theme.sizeCss} />
      </IconButton>
      }

    </div >
  )
}



