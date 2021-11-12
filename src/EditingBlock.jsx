
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






export default function EditingBlock(props) {




  const theme = useTheme()


  const { editorBlockKeyArr, setEditorBlockKeyArr, darkToLightArr, setDarkToLightArr, bgImageObj, editorState, setEditorState, editorRef, editingBlockKeyArrRef } = useContext(Context)

  //const { editorState, setEditorState, editorRef, gradientStyleArr, showFontBar, setShowFontBar, markingImageBlock, markingColorBlock } = props;
  const { gradientStyleArr, showFontBar, setShowFontBar, markingImageBlock, markingColorBlock, toolButtonRef } = props;

  const selection = editorState.getSelection()
  const startKey = selection.getStartKey()
  const endKey = selection.getEndKey()
  const isStartKeyIn = props.children.some(item => { return item.props.children.props.block.getKey() === startKey })
  const isEndKeyIn = props.children.some(item => { return item.props.children.props.block.getKey() === endKey })
  const hasFocus = selection.getHasFocus()
  const isCollapsed = selection.isCollapsed()
  const focusKey = selection.getFocusKey()

  const isFocusIn = hasFocus && isStartKeyIn && isEndKeyIn

  const displayToolBar = hasFocus && isStartKeyIn && isEndKeyIn
  //const arr = [props.children[0]]
  //let preItemValue = props.children[0].props.children.props.block.getData().toObject().backgroundImage



  const headKey = props.children[0].props.children.props.block.getKey()


  const hasLoaded = editorBlockKeyArr.some(key => {
    return key === headKey
  })
  //const [loaded, setLoaded] = useState(hasLoaded)

  const [initial, setInitial] = useState(true)
  const [initial2, setInitial2] = useState(true)


  const [startAddingShadow, setStartAddingShadow] = useState(false)
  const [firstTime, setFirstTime] = useState(!editingBlockKeyArrRef.current.includes(headKey))

  console.log(headKey)
  // !firstTime&&alert(headKey)

  const frameCss1 = classNames({

    "shadowOn": isFocusIn,
    "shadowOff": !isFocusIn,
    "shadowEntering": (!(!firstTime && !isFocusIn)) && (firstTime && isFocusIn) && initial,
    "shadowLeaving": (!firstTime && !isFocusIn) && initial,

  })

  // if(!firstTime&&!isFocusIn ){
  //   alert(!firstTime&&!isFocusIn )
  // }


  // const [frameCss, setFrameCss] = useState(frameCssPhase1)

  //const ediotrBlockCss = function () { return darkToLightArr.includes(headKey) ? "editor-block-dark-light" : lightToDarkCss }()


  //const ediotrBlockCss = function () { return darkToLightArr.includes(headKey) ? lightToDarkCss: lightToDarkCss }()


  const settingIconCss = classNames({
    "rotate2": true,
  })

  const inputRef = useRef()





  useEffect(function () {





    setTimeout(() => {
      setInitial(false)
    }, 300);

  }, [])


  useEffect(function () {


    props.children.forEach((item, index, allChildren) => {

      const block = item.props.children.props.block;


      if (!(editingBlockKeyArrRef.current.includes(block.getKey))) {
        editingBlockKeyArrRef.current.push(block.getKey())
      }

    })

    const element = document.querySelector(`div[data-offset-key*="${startKey}"]`)
    const bound = element && element.getBoundingClientRect()

    const bound2 = editorRef.current.editor.editor.getBoundingClientRect()



    selection.hasFocus && toolButtonRef.current && toolButtonRef.current.setTop(bound.top - bound2.top)

    console.log(editingBlockKeyArrRef.current)
  })


  return (

    <div className={frameCss1}>

      {props.children.map((item, index, allChildren) => {

        const block = item.props.children.props.block

        //   !editingBlockKeyArrRef.current.includes(block.getKey()) && editingBlockKeyArrRef.current.push(block.getKey())


        return item



      })}


      <Collapse in={isFocusIn} unmountOnExit={true} contentEditable={false}

        onExited={function () {
          const selection = editorState.getSelection()

          // seteditorSate  
          setEditorState(EditorState.acceptSelection(editorState, selection))

        }}
      >
        {/* <div style={{ position:"absolute",overflow:"hidden", width:"100%"}}> */}
        <ToolBar hasLoaded={hasLoaded} inputRef={inputRef} markingImageBlock={markingImageBlock} editorState={editorState}
          anmimationType={null && Zoom} setEditorState={setEditorState}
          isFocusIn={isFocusIn}
        />
        {/* </div> */}
      </Collapse>

    </div >

  )



}


function ToolBar({ hasLoaded, inputRef, markingImageBlock, editorState, ediotrBlockCss, isFocusIn, anmimationType, setEditorState }) {

  const theme = useTheme()
  const { gradientStyleArr } = useContext(Context)
  const [isOverFlow, setIsOverFlow] = useState(false)

  const [randomId] = useState("--toolbar--" + Math.floor(Math.random() * 1000))

  return (
    <div className={theme.heightCss} style={{
      display: "flex", width: "100%", justifyContent: "flex-start", alignItems: "center",
      // position: "absolute",
      // backgroundColor: "wheat" 
      //zIndex:100,
    }}

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

      {/* <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation()


          setEditorState(RichUtils.toggleBlockType(editorState, "imageBlock"))



        }}
      >
        <InsertPhotoOutlinedIcon className={theme.sizeCss} />
      </IconButton> */}

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
                  in: isFocusIn, unmountOnExit: true,
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



