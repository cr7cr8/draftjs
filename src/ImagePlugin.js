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


  function ImageButton(props) {

    const { children, picArr, setPicArr, editor } = props



    const { block } = props
    const blockKey = block.getKey()


    const theme = useTheme()


    const [hover, setHover] = useState(true)


    return (


      <div onMouseEnter={function () { setHover(true) }} onMouseLeave={function () { setHover(false) }} style={{ overflow: "hidden", position: "relative" }}>

        <Slide in={hover} direction="left">
          <Button
            style={{
              color: theme.palette.type === "dark" ? theme.palette.text.secondary : theme.palette.primary.main,
              // transform: "translateX(-100%)",
              backgroundColor: "pink",
              position: "absolute",
              right: 0,
              //    opacity: 0.5,
              display: "inline-block"

            }}
            //  disabled={picArr.length >= 4}
            onClick={function (e) {
              insertImageBlock(blockKey)
              // setTimeout(() => {
              //   editor.current.focus()
              // }, 0);
            }}
          >
            <AddPhotoAlternateOutlined />
          </Button>
        </Slide>
        <EditorBlock    {...{ ...props }} />

      </div>
    )


    // return (
    //   <>




    //     <div data-offset-key={offsetKey} className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr" style={{ position: "relative", minHeight: "2.2rem" }}>

    //       <span data-offset-key={offsetKey}>
    //         <span data-text="true">{text || ""}
    //           <div style={{ backgroundColor: "pink", width: "2rem", height: "2.2rem", margin: 0, padding: 0 }}>

    //           </div>


    //           {/* <Button
    //             style={{
    //               color: theme.palette.type === "dark" ? theme.palette.text.secondary : theme.palette.primary.main,
    //               // transform: "translateX(-100%)",
    //               backgroundColor: "pink",
    //               position: "absolute",
    //               right: 0,
    //               opacity: 0.5,

    //             }}
    //             //  disabled={picArr.length >= 4}
    //             onClick={function (e) {
    //               insertImageBlock()
    //               // setTimeout(() => {
    //               //   editor.current.focus()
    //               // }, 0);
    //             }}
    //           >
    //             <AddPhotoAlternateOutlined />
    //           </Button> */}


    //         </span>
    //       </span>
    //     </div>



    //   </>
    // )
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