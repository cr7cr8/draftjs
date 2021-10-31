
import { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { FormControlLabel, Typography, IconButton, Button, ButtonGroup, Container, Paper, Avatar, Box, Chip, Grow, Zoom, Slide } from "@material-ui/core";
import SwitchBtn from "./SwitchBtn"

import { Image, AlternateEmailSharp } from "@material-ui/icons";


import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import ColorLensTwoToneIcon from '@material-ui/icons/ColorLensTwoTone';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';


import AvatarChipList from "./AvatarChipList";

import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";
import ImagePanel from "./ImagePanel"

import { CropOriginal, Brightness4, Brightness5, FormatBold, FormatItalic, AddPhotoAlternateOutlined } from "@material-ui/icons";
import ToolButton from "./ToolButton"
import { add } from 'date-fns/esm';


import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import { set } from 'immutable';
import { getEventListeners } from 'events';


export default function ToolBlock(props) {

  const { block, selection, contentState } = props

  const { editorRef, readOnly, setReadOnly, EmojiPanel, markingImageBlock, markingColorBlock, editorState, setEditorState, taggingFontBar, gradientStyleArr,
    bgImageObj,
    setBgImageObj,
    showFontBar,
    setShowFontBar,

  } = props.blockProps



  const theme = useTheme()
  const blockKey = block.getKey()
  const editorBlockRef = useRef()

  const [backColor, setBackColor] = useState(getRandomColor())

  //const [focusOn, setFocusOn] = useState(true)

  const [hidden, setHidden] = useState(selection.hasFocus && selection.isCollapsed() && (selection.getStartKey() === blockKey))

  const [showColorPanel, setShowColorPanel] = useState(false)

  const inputRef = useRef()

  function aaa() {

    setShowColorPanel(false)
  }

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


      markingColorBlock(e, editorState, setEditorState, updatedImage)



      // markingColorBlock(e, editorState, setEditorState, {
      //   backgroundImage: `url(${URL.createObjectURL(files[0])})`,
      //   backgroundSize: "cover",
      //   backgroundRepeat: "no-repeat",
      // })



      setTimeout(() => {

        editorRef.current.focus()
      }, 100);

    }

  }

  useEffect(function () {

    setHidden(!(selection.hasFocus && selection.isCollapsed() && (selection.getStartKey() === blockKey)))
    editorBlockRef.current._node.style.backgroundColor = backColor
    editorBlockRef.current._node.contentEditable = !showColorPanel



    if (showColorPanel) {

      editorBlockRef.current._node.addEventListener("click", aaa)

    }
    //console.log(editorBlockRef.current._node)



    return function () {

      if (editorBlockRef.current && editorBlockRef.current._node) {
        editorBlockRef.current._node.removeEventListener("click", aaa)
      }
    }


  })

  return (

    <>
      <input ref={inputRef} type="file" multiple={false} style={{ display: "none" }}
        onClick={function (e) { e.currentTarget.value = null; }}
        onChange={update}
      />
      <EditorBlock     {...props} ref={editorBlockRef} />






      {showColorPanel && gradientStyleArr.map(function (item, index) {

        return (


          <IconButton className={theme.sizeCss} key={index}
            contentEditable={false}
            style={{

              top: "50%",
              transform: `translateX(-${100 * (gradientStyleArr.length - index)}%) translateY(-50%)`,
              position: "absolute",
              right: 0,
              padding: 0,
            }}
            onClick={function (e) {
              e.preventDefault(); e.stopPropagation();
              markingColorBlock(e, editorState, setEditorState, item)

            }}>
            <div className={theme.sizeCss} style={{ borderRadius: "1000px", ...item }} />
          </IconButton>
        )
      })}





      {showColorPanel && <IconButton className={theme.sizeCss}
        contentEditable={false}
        style={{
          top: "50%",
          transform: "translateX(0%) translateY(-50%)",
          position: "absolute",
          right: 0,
          padding: 0,
        }}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();
          //console.log(bgImageObj)
          inputRef.current.click()
        }}
      >
        <WallpaperIcon className={theme.sizeCss} />
      </IconButton>
      }

      {showColorPanel && <IconButton
        style={{
          top: "50%",
          transform: `translateX(-${100 * (gradientStyleArr.length + 1)}%) translateY(-50%)`,
          position: "absolute",
          right: 0,
        }}
        className={theme.sizeCss}

        contentEditable={false}
        onMouseDown={function (e) {
          e.preventDefault()
          e.stopPropagation()
          markingImageBlock(blockKey)

          setTimeout(() => {
            editorRef.current.focus()
          }, 0);
        }}

        onClick={function (e) {
          e.preventDefault()
          e.stopPropagation()

        }}
      >
        <AddPhotoAlternateOutlinedIcon className={theme.sizeCss} />
      </IconButton>
      }

      {showColorPanel &&
        <SwitchBtn
          // style={{ position: "absolute", /*transform:"translateY(-100%)"*/ }}
          checked={showFontBar}
          factor={[1, 1, 1, 1, 1]}
          onChange={() => { setShowFontBar(pre => !pre); editorRef.current.focus() }} name="showFontBar" color="primary"
          inToolBlock={true}
          shiftX={gradientStyleArr.length}
        />
      }







      {
        !hidden && <IconButton
          style={{
            top: "50%",
            transform: "translateX(100%) translateY(-50%)",
            position: "absolute",
            right: 0,
          }}
          className={theme.sizeCss}

          contentEditable={false}
          onMouseDown={function (e) {
            e.preventDefault()
            e.stopPropagation()
            // markingImageBlock(blockKey)

            // setTimeout(() => {
            //   editorRef.current.focus()
            // }, 0);
          }}

          onClick={function (e) {
            e.preventDefault()
            e.stopPropagation()
            setShowColorPanel(pre => !pre)

          }}
        >
          <InsertPhotoOutlinedIcon className={theme.sizeCss} />
        </IconButton>
      }

      {/* {
        !hidden && <IconButton
          style={{
            top: "50%",
            transform: "translateX(200%) translateY(-50%)",
            position: "absolute",
            right: 0,
          }}
          className={theme.sizeCss}

          contentEditable={false}
          onMouseDown={function (e) {
            e.preventDefault()
            e.stopPropagation()
            markingImageBlock(blockKey)

            setTimeout(() => {
              editorRef.current.focus()
            }, 0);
          }}

          onClick={function (e) {
            e.preventDefault()
            e.stopPropagation()

          }}
        >
          <AddPhotoAlternateOutlinedIcon className={theme.sizeCss} />
        </IconButton>
      } */}


    </>
  )
}

function getRandomColor() {

  return "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + (",") + Math.floor(Math.random() * 255) + ",0.3)"

}