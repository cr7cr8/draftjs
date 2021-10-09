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




  function markingImageBlock(blockKey) {

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


  };


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


  function withImageBlogFn(Compo) {

    return function (props) {

      return <Compo {...{ ...props }} blockProps={{ ...props.blockProps, markingImageBlock, deleteImageBlock, setImageBlockData, }} />
    }

  }

  return {

    imagePlugin: {

      onChange: function (editorState, { setEditorState }) {
      
        externalES = editorState
        externalSetEditorState = setEditorState
        return externalES

      },
    
    },


    ImagePanel: withImageBlogFn(ImagePanel),
    markingImageBlock,
    // deleteImageBlock,
    // setImageBlockData,

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