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
const { hasCommandModifier } = KeyBindingUtil;

//const ToolButton = require("./ToolButton")
// import createEmojiPlugin from './EmojiPlugin';
// const { emojiPlugin, EmojiPanel } = createEmojiPlugin()

export default function createImagePlugin() {

  let externalES = null;
  let externalSetEditorState = null;
  let newContent = null;

  function deleteImageBlock0(blockKey) {


    // const block = contentState.getBlockForKey(blockKey);
    let contentState = externalES.getCurrentContent();
    let newContentBlockArr = contentState.getBlocksAsArray().filter(function (item) {
      return item.getKey() !== blockKey
    })

    const newContentState = ContentState.createFromBlockArray(newContentBlockArr)
    externalES = EditorState.createWithContent(newContentState)
    externalSetEditorState(externalES)
  }


  function deleteImageBlock(blockKey) {


    let newSelection = SelectionState.createEmpty(blockKey)
    newSelection = newSelection.merge({
      focusKey: blockKey,
      focusOffset: 0,
      anchorOffset: blockKey,
      anchorOffset: 0,
      hasFocus: true
    });

    // newSelection.getAnchorKey()
    // newSelection.getFocusKey();

    let newContent = Modifier.setBlockType(
      externalES.getCurrentContent(),
      newSelection,
      "unstyled"
    );

    newContent = Modifier.setBlockData(
      newContent,
      newSelection,//  SelectionState.createEmpty(newKey),
      Immutable.Map({})
    );


    externalES = EditorState.push(externalES, newContent, 'change-block-type');
    //   EditorState.forceSelection(externalES, newSelection)
    return externalSetEditorState(externalES)

  }

  function deleteImageBlock0(blockKey) {


    // const block = contentState.getBlockForKey(blockKey);
    let contentState = externalES.getCurrentContent();
    let newContentBlockArr = contentState.getBlocksAsArray().filter(function (item) {
      return item.getKey() !== blockKey
    })

    const newContentState = ContentState.createFromBlockArray(newContentBlockArr)
    externalES = EditorState.createWithContent(newContentState)
    externalSetEditorState(externalES)
  }



  function insertImageBlock(blockKey) {

    let newSelection = SelectionState.createEmpty(blockKey)
    newSelection = newSelection.merge({
      focusKey: blockKey,
      focusOffset: 0,
      anchorOffset: blockKey,
      anchorOffset: 0,
      hasFocus: false
    });

    const newContent = Modifier.setBlockType(
      externalES.getCurrentContent(),
      newSelection,
      "imageBlock"
    );

    externalES = EditorState.push(externalES, newContent, 'change-block-type');
    //   EditorState.forceSelection(externalES, newSelection)
    return externalSetEditorState(externalES)

    // const selection = externalES.getSelection()
    // let contentState = externalES.getCurrentContent();
    // const currentKey = selection.getStartKey()  //selection.getEndKey()


    // const currentBlock = contentState.getBlockForKey(currentKey);
    // const currentText = currentBlock && currentBlock.getText()

    //console.log(selection, currentKey, contentState.getBlockForKey(currentKey), currentText)

    // let newContentBlockArr = contentState.getBlocksAsArray()
    // const selectionBefore = contentState.getSelectionBefore()
    // const selectionAfter = contentState.getSelectionAfter()

    // let currentIndex = newContentBlockArr.findIndex(item => { return item.key === currentKey })
    // currentIndex = currentIndex >= 0 ? currentIndex : newContentBlockArr.length - 1
    // //  console.log(currentIndex)


    // const newKey = genKey()
    // newContentBlockArr.splice(currentText ? (currentIndex + 1) : currentIndex, currentText ? 0 : 1,
    //   new ContentBlock({
    //     key: currentText ? newKey : currentKey,
    //     type: "imageBlock",
    //     text: '',
    //     // data: Immutable.Map({ k: "aaa" })
    //     data: Immutable.Map({})
    //   })
    // )

    // let newSelection;
    // if (currentText) {
    //   newSelection = SelectionState.createEmpty(newKey)
    // }

    // contentState = ContentState.createFromBlockArray(newContentBlockArr)
    // contentState = contentState.merge(
    //   {
    //     selectionAfter, //newBlockMap,
    //     selectionBefore,

    //   }
    // )


    // // externalES = EditorState.createWithContent(contentState)
    // externalES = EditorState.push(externalES, contentState, 'insert-fragment');
    // if (newSelection) { externalES = EditorState.acceptSelection(externalES, newSelection) }
    // externalSetEditorState(externalES)


  };



  function setImageBlockData0(obj, newKey) {


    const selection = externalES.getSelection()
    let contentState = externalES.getCurrentContent();
    const currentKey = selection.getStartKey()  //selection.getEndKey()
    const currentBlock = contentState.getBlockForKey(currentKey);
    const currentText = currentBlock && currentBlock.getText()




    const newData = currentBlock.data.set("locked", "Aaa")

    // create a new selection with the block I want to change

    const newContent = Modifier.setBlockData(externalES.getCurrentContent(), SelectionState.createEmpty(newKey), newData)



    // return a new editor state, applying the selection we stored before
    externalES = EditorState.push(externalES, newContent, 'change-block-data')
    //EditorState.forceSelection(externalES, selection)
    return externalSetEditorState(externalES)

  }


  function setImageBlockData(obj, blockKey) {

    const contentState = externalES.getCurrentContent();
    const currentBlock = contentState.getBlockForKey(blockKey);
    let newSelection = SelectionState.createEmpty(blockKey)
    newSelection = newSelection.merge({
      focusKey: blockKey,
      focusOffset: 0,
      anchorOffset: blockKey,
      anchorOffset: 0,
      hasFocus: false
    });


    const newContent = Modifier.setBlockData(
      externalES.getCurrentContent(),
      newSelection,//  SelectionState.createEmpty(newKey),

      Immutable.Map(obj === "deleteAll" ? {} : { ...(currentBlock.getData().toObject() || {}), ...obj })
    );

    externalES = EditorState.push(externalES, newContent, 'change-block-data');
    //   EditorState.forceSelection(externalES, newSelection)
    return externalSetEditorState(externalES)



  }


  function ToolBlock(props) {

    const { children, picArr, setPicArr, } = props

    //console.log(props)

    const { block, selection, contentState } = props
    const blockKey = block.getKey()
    const { editorRef, readOnly, setReadOnly, EmojiPanel } = props.blockProps

    const theme = useTheme()
    const [hidden, setHidden] = useState(true)
    const editorBlockRef = useRef()

    function addImage() {

      insertImageBlock(blockKey)
      // setTimeout(() => {
      //   editorRef.current.focus()
      // }, 0);
    }

    const [backColor, setBackColor] = useState(getRandomColor())

    const [focusOn, setFocusOn] = useState(true)

    useEffect(function () {

      // setFocusOn(selection.hasFocus)

      checkFocus()
    })

    function checkFocus() {
      if ((!selection.hasFocus) && (!hidden)) {
        setHidden(true)
      }
      else if ((selection.hasFocus) && (selection.focusKey === blockKey) && (hidden)) {
        setHidden(false)
      }
      else if ((selection.hasFocus) && (selection.focusKey !== blockKey) && (!hidden)) {
        setHidden(true)
      }
      //console.log(blockKey)
    }

    function checkFocus2() {

      const { hasFocus, focusKey } = externalES.getSelection() //contentState.getSelectionAfter()

      //  console.log(hasFocus, blockKey, focusKey)

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
        Immutable.Map({})
      );

      externalES = EditorState.push(externalES, newContent, 'change-block-type');
      //   EditorState.forceSelection(externalES, newSelection)
      return externalSetEditorState(externalES)



    }



    return (
      <div
        style={{ position: "relative", backgroundColor: backColor, }}

        onMouseDown={function () { setHidden(false); checkFocus2() }}


      // onMouseEnter={function () { setHidden(false) }}
      // onMouseLeave={function () { setHidden(true) }}
      // onMouseOut={function () { setHidden(true) }}
      // onMouseOver={function () { setHidden(false) }}
      >
        {!hidden && <Button variant="contained" style={{ right: 0, top: 0, zIndex: 100, position: "absolute" }} contentEditable={false}
          onMouseDown={function (e) {
            e.preventDefault()
            e.stopPropagation()
            addImage()
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


  return {


    imagePlugin: {

      keyBindingFn(e, { getEditorState, setEditorState, ...obj }) {
        const editorState = getEditorState()
        const selectionState = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const block = contentState.getBlockForKey(selectionState.getStartKey());


        // if ((block.getType() === "imageBlock") && ((e.keyCode === 8) || (e.keyCode === 46))) {
        //   return "cancel-delete"
        // }
        if ((block.getType() === "imageBlock")) {
          return "cancel-delete"
        }
        else if (e.shiftKey || hasCommandModifier(e) || e.altKey) {
          return getDefaultKeyBinding(e);
        }


        else if ((block.getType() === "unstyled") && (e.keyCode === 37)) {
          return "tool-block-left"
        }
        else if ((block.getType() === "unstyled") && (e.keyCode === 38)) {
          return "tool-block-up"
        }
        else if ((block.getType() === "unstyled") && (e.keyCode === 39)) {
          return "tool-block-right"
        }
        else if ((block.getType() === "unstyled") && (e.keyCode === 40)) {
          return "tool-block-down"
        }
        else if ((!block.getText()) && (block.getType() === "unstyled") && (e.keyCode === 8)) {
          return "tool-block-delete"
        }

        return getDefaultKeyBinding(e);



      },
      handleKeyCommand(command, editorState, evenTimeStamp, { setEditorState }) {
        // better to place each command detail in draft.js, not here
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

    ToolBlock,
    ImagePanel,
    deleteImageBlock,
    setImageBlockData
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


function getRandomColor() {
  // var letters = '0123456789ABCDEF';
  // var color = '#';
  // for (var i = 0; i < 6; i++) {
  //   color += letters[Math.floor(Math.random() * 16)];
  // }
  // return color;

  return "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + (",") + Math.floor(Math.random() * 255) + ",0.5)"

}