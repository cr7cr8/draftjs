
import { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, IconButton, Button, ButtonGroup, Container, Paper, Avatar, Box, Chip, Grow, Zoom, Slide } from "@material-ui/core";
import { Image, AlternateEmailSharp } from "@material-ui/icons";


import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';

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


export default function ToolBlock(props) {





  const { block, selection, contentState } = props

  const { editorRef, readOnly, setReadOnly, EmojiPanel, markingImageBlock, editorState, setEditorState, taggingFontBar } = props.blockProps




  const theme = useTheme()
  const blockKey = block.getKey()
  const editorBlockRef = useRef()



  const [backColor, setBackColor] = useState(getRandomColor())

  //const [focusOn, setFocusOn] = useState(true)




  const [hidden, setHidden] = useState(selection.hasFocus && selection.isCollapsed() && (selection.getStartKey() === blockKey))




  useEffect(function () {
    // markingFontBarBlock()
    // if ((!selection.hasFocus) && (!hidden)) {
    //   setHidden(true)
    // }
    // else if ((selection.hasFocus) && (selection.focusKey === blockKey) && (hidden)) {
    //   setHidden(false)
    // }
    // else if ((selection.hasFocus) && (selection.focusKey !== blockKey) && (!hidden)) {
    //   setHidden(true)
    // }
    setHidden(!(selection.hasFocus && selection.isCollapsed() && (selection.getStartKey() === blockKey)))
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
      style={{ position: "relative", backgroundColor: backColor }} contentEditable={true}
    //  onMouseDown={function () {

    //    setHidden(false);  //  checkFocus();   //markingFontBarBlock(); setEditorState(editorState)
    //  }}

    >



      <EditorBlock     {...props} ref={editorBlockRef} >  </EditorBlock>



      {!hidden && <IconButton
        style={{
          top: "50%",
          transform: "translateY(-50%)",
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
      </IconButton>}


      {!hidden && <IconButton
        style={{
          top: "50%",
          transform: "translateX(-100%)  translateY(-50%)",

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
      </IconButton>}








      {/* <Collapse in={ctx.showEmojiPanel} unmountOnExit={true} style={{ opacity: ctx.showEmojiPanel ? 1 : 0, transitionProperty: "height, opacity", }}> */}
      {/* {EmojiPanel} */}
      {/* </Collapse> */}



      {/* <ToolButton blockKey={blockKey} clickFn={addImage} hidden={hidden} setHidden={setHidden} readOnly={readOnly} setReadOnly={setReadOnly} insertImageBlock={insertImageBlock} /> */}



    </div>
  )
}

function getRandomColor() {

  return "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + (",") + Math.floor(Math.random() * 255) + ",0.3)"

}