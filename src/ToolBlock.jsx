
import { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, Box, Chip, Grow, Zoom, Slide } from "@material-ui/core";
import { Image, AlternateEmailSharp } from "@material-ui/icons";


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


export default function ToolBlock(props) {





  const { block, selection, contentState } = props
  const blockKey = block.getKey()
  const { editorRef, readOnly, setReadOnly, EmojiPanel, markingImageBlock, editorState, setEditorState, taggingFontBar } = props.blockProps

  const theme = useTheme()
  const [hidden, setHidden] = useState(true)
  const editorBlockRef = useRef()



  const [backColor, setBackColor] = useState(getRandomColor())

  const [focusOn, setFocusOn] = useState(true)

  useEffect(function () {
    //  markingFontBarBlock()
    if ((!selection.hasFocus) && (!hidden)) {
      setHidden(true)
    }
    else if ((selection.hasFocus) && (selection.focusKey === blockKey) && (hidden)) {
      setHidden(false)
    }
    else if ((selection.hasFocus) && (selection.focusKey !== blockKey) && (!hidden)) {
      setHidden(true)
    }

  })



  function checkFocus() {

    const { hasFocus, focusKey } = editorState.getSelection() //contentState.getSelectionAfter()



    let newSelection = SelectionState.createEmpty(blockKey)
    newSelection = newSelection.merge({
      focusKey: blockKey,
      focusOffset: 0,
      anchorOffset: blockKey,
      anchorOffset: 0,
      hasFocus: true
    });

    let newContent = Modifier.setBlockData(
      contentState,
      newSelection,//  SelectionState.createEmpty(newKey),
      Immutable.Map(block.getData())
    );

    const newEditorState = EditorState.push(editorState, newContent, 'change-block-type');

    //   EditorState.forceSelection(externalES, newSelection)
    return setEditorState(taggingFontBar(newEditorState))



  }



  return (
    <div
      style={{ position: "relative", backgroundColor: backColor, }}
      onMouseDown={function () {

        setHidden(false); checkFocus();   //markingFontBarBlock(); setEditorState(editorState)
      }}

    >

      {!hidden && <Button variant="contained" style={{ right: 100, top: 0, zIndex: 100, position: "absolute" }} contentEditable={false}
        onMouseDown={function (e) {
          e.preventDefault()
          e.stopPropagation()
          //  markingImageBlock(blockKey)

          setTimeout(() => {
            editorRef.current.focus()
          }, 0);
        }}

        onClick={function (e) {
          e.preventDefault()
          e.stopPropagation()

        }}

      >bbb</Button>}


      {!hidden && <Button variant="contained" style={{ right: 0, top: 0, zIndex: 100, position: "absolute" }} contentEditable={false}
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

      >aaa</Button>}

      {/* <Collapse in={ctx.showEmojiPanel} unmountOnExit={true} style={{ opacity: ctx.showEmojiPanel ? 1 : 0, transitionProperty: "height, opacity", }}> */}
      {/* {EmojiPanel} */}
      {/* </Collapse> */}

      <EditorBlock     {...{ ...props }} ref={editorBlockRef} >  </EditorBlock>

      {/* <ToolButton blockKey={blockKey} clickFn={addImage} hidden={hidden} setHidden={setHidden} readOnly={readOnly} setReadOnly={setReadOnly} insertImageBlock={insertImageBlock} /> */}
    </div>
  )
}

function getRandomColor() {

  return "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + (",") + Math.floor(Math.random() * 255) + ",0.3)"

}