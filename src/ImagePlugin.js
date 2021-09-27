import { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, Box, Chip, Grow } from "@material-ui/core";
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

export default function createImagePlugin() {

  let externalES = null;
  let externalSetEditorState = null;
  let newContent = null;

  function deleteImageBlock(blockKey) {


    // const block = contentState.getBlockForKey(blockKey);
    let contentState = externalES.getCurrentContent();
    let newContentBlockArr = contentState.getBlocksAsArray().filter(function (item) {
      return item.getKey() !== blockKey
    })

    const newContentState = ContentState.createFromBlockArray(newContentBlockArr)
    externalES = EditorState.createWithContent(newContentState)
    externalSetEditorState(externalES)
  }

  function insertImageBlock() {

    const selection = externalES.getSelection()
    let contentState = externalES.getCurrentContent();
    const currentKey = selection.getStartKey()  //selection.getEndKey()


    const currentBlock = contentState.getBlockForKey(currentKey);
    const currentText = currentBlock && currentBlock.getText()

    //console.log(selection, currentKey, contentState.getBlockForKey(currentKey), currentText)

    let newContentBlockArr = contentState.getBlocksAsArray()
    const selectionBefore = contentState.getSelectionBefore()
    const selectionAfter = contentState.getSelectionAfter()

    let currentIndex = newContentBlockArr.findIndex(item => { return item.key === currentKey })
    currentIndex = currentIndex >= 0 ? currentIndex : newContentBlockArr.length - 1
    //  console.log(currentIndex)


    const newKey = genKey()
    newContentBlockArr.splice(currentText ? (currentIndex + 1) : currentIndex, currentText ? 0 : 1,
      new ContentBlock({
        key: currentText ? newKey : currentKey,
        type: "imageBlock",
        text: 'ofdf',
      })
    )

    let newSelection;
    if (currentText) {
      newSelection = SelectionState.createEmpty(newKey)
    }

    contentState = ContentState.createFromBlockArray(newContentBlockArr)
    contentState = contentState.merge(
      {
        selectionAfter, //newBlockMap,
        selectionBefore,

      }
    )


    // externalES = EditorState.createWithContent(contentState)
    externalES = EditorState.push(externalES, contentState, 'insert-fragment');
    if (newSelection) { externalES = EditorState.acceptSelection(externalES, newSelection) }
    externalSetEditorState(externalES)


  };

  function ImageButton({ children, picArr, setPicArr, editor, ...props }) {


    const inputRef = useRef()
    const theme = useTheme()


    return (
      <>
        <Button {...props}
          style={{
            color: theme.palette.type === "dark" ? theme.palette.text.secondary : theme.palette.primary.main
          }}
          //  disabled={picArr.length >= 4}
          onClick={function (e) {
            insertImageBlock()
            // setTimeout(() => {
            //   editor.current.focus()
            // }, 0);
          }}
        >
          <AddPhotoAlternateOutlined />
        </Button>
      </>
    )
  }


  return {


    imagePlugin: {

      keyBindingFn(e, { getEditorState, setEditorState, ...obj }) {
        const editorState = getEditorState()
        const selectionState = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const block = contentState.getBlockForKey(selectionState.getStartKey());
        //    console.log(block.getType())
        if ((block.getType() === "imageBlock") && ((e.keyCode === 8) || (e.keyCode === 46))) {
          return "cancel-delete"
        }

      },
      handleKeyCommand(command, editorState, evenTimeStamp, { setEditorState }) {

        if (command === "cancel-delete") {
          return "handled"
        }


        return 'not-handled';
      },



      onChange: function (editorState, { setEditorState }) {
        externalES = editorState
        externalSetEditorState = setEditorState
        return externalES

      },
      handleReturn: function (e, newState, { getEditorState, setEditorState }) {
        const editorState = getEditorState()
        const selectionState = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const block = contentState.getBlockForKey(selectionState.getStartKey());
        //    console.log(block.getType())
        if (block.getType() === "imageBlock") {
          return "handled"
        }
      }
    },

    insertImageBlock,

    ImageButton,
    ImagePanel,
    deleteImageBlock,

  }


}



function genKey(length = 4) {

  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}