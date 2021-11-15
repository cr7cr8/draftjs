
import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';

import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { FormControlLabel, Typography, IconButton, Button, ButtonGroup, Container, Paper, Avatar, Box, Chip, Grow, Zoom, Slide } from "@material-ui/core";
import SwitchBtn from "./SwitchBtn"




import ColorLensOutlinedIcon from '@material-ui/icons/ColorLensOutlined';

import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";
import ImagePanel from "./ImagePanel"




import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import { set } from 'immutable';
import { getEventListeners } from 'events';


export default function ToolBlock(props) {

  const { block, selection, contentState, } = props



  const { editorRef, readOnly, setReadOnly, EmojiPanel, markingImageBlock, markingColorBlock, editorState, setEditorState, taggingFontBar, gradientStyleArr,
    bgImageObj,
    setBgImageObj,
    showFontBar,
    setShowFontBar,
    toolButtonRef,
    currentBlockKey,
  } = props.blockProps

  //  console.log("----", toolButtonRef.current)

  const theme = useTheme()
  const blockKey = block.getKey()
  const blockText = block.getText()
  const startKey = selection.getStartKey()

  const editorBlockRef = useRef()

  const [backColor, setBackColor] = useState(getRandomColor())


  //const [hidden, setHidden] = useState(selection.hasFocus && selection.isCollapsed() && (selection.getStartKey() === blockKey))


  const [showButton, setShowButton] = useState(selection.hasFocus && selection.isCollapsed() && (selection.getStartKey() === blockKey))

  function update(e) {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget.files[0].name.trim().match(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i)) {

      const files = e.currentTarget.files

      const newImage = bgImageObj.current[files[0].name]
      if (!newImage) {

        bgImageObj.current = {
          ...bgImageObj.current,
          [files[0].name]: {
            backgroundImage: `url(${URL.createObjectURL(files[0])})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          },


        }


      }
      const updatedImage = bgImageObj.current[files[0].name]


      markingColorBlock(e, editorState, setEditorState, updatedImage, blockKey)




      setTimeout(() => {

        editorRef.current.focus()
      }, 100);

    }

  }



  //console.log(currentBlockKey)

  useLayoutEffect(function () {

    setShowButton((selection.isCollapsed() && (selection.getStartKey() === blockKey)))

    //   //console.log(editorBlockRef.current._node)

    //   let p = document.createElement("button");
    //   p.innerText="A"
    //   p.contentEditable = false
    //   p.style.position="absolute"
    //   p.style.top = 0
    //  // document.body.appendChild(p);


    //   ///const bbb = React.createElement(Button, { children: "a" })

    //   if (blockKey === startKey) {
    //editorBlockRef.current._node.style.backgroundColor = getRandomColor()
    // editorBlockRef.current._node.style.position = "relative"
    //     editorBlockRef.current._node.children[0].children[0].appendChild(p)
    //   }
    //   else {
    //     editorBlockRef.current._node.style.backgroundColor = "transparent"
    //    // p.remove()
    //   }



  })


  useEffect(function () {

    // const element = editorBlockRef.current._node
    // const bound = element.getBoundingClientRect()
    // const bound2 = editorRef.current.editor.editor.getBoundingClientRect()
    // startKey === blockKey && selection.hasFocus && toolButtonRef.current && toolButtonRef.current.setTop(bound.top - bound2.top)

  })


console.log(EditorBlock)

  return (
    <EditorBlock  {...props} ref={editorBlockRef} />
  )
  return (

    <>
      {/* <input ref={inputRef} type="file" multiple={false} style={{ display: "none", userSelect: "none" }}
        onClick={function (e) { e.currentTarget.value = null; }}
        onChange={update}
        contentEditable={false}
      /> */}

      {/* {toolBar} */}

      <EditorBlock  {...props} ref={editorBlockRef} />


      {

        showButton && <div
          //  className={theme.sizeCss}
          contentEditable={false}
          style={{
            transform: "translateX(0%) translateY(-100%)",
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
          <div contentEditable={false} style={{ width: 0, userSelect: "none" }}>&nbsp;</div>
          {/* <div contentEditable={false} style={{ transform: "translateX(0%)", display: "flex", alignItems: "center" }}> */}
          {/* <div     contentEditable={false} style={{ width: 0 }}>&nbsp;</div> */}
          <IconButton
            style={{
              transform: "translateX(0%)",
              alignItems: "center",
              userSelect: "none",
              //  backgroundColor: "pink"
            }}
            className={theme.sizeCss}
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
            <ColorLensOutlinedIcon contentEditable={false} className={theme.sizeCss + " " + "rotate1"} style={{ userSelect: "none" }} />
          </IconButton>
          {/* </div> */}
        </div>
      }
    </>
  )
}











function getRandomColor() {

  return "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + (",") + Math.floor(Math.random() * 255) + ",0.3)"

}