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


export default function createColorBlockPlugin() {

  let externalES = null;
  let externalSetEditorState = null;

  let clicked = false;

  function markingColorBlock(e, editorState, setEditorState, gradientStyle) {
    e.preventDefault(); e.stopPropagation();


    let allBlocks = Modifier.setBlockType(editorState.getCurrentContent(), editorState.getSelection(), "colorBlock")

    allBlocks = Modifier.setBlockData(allBlocks, editorState.getSelection(), Immutable.Map({ colorBlock: true, ...gradientStyle, horizontal: 50, verticle: 50 }))


    let es = EditorState.push(
      editorState,
      allBlocks,               // editorState.getCurrentContent().getBlockMap().merge(allBlocks)
      "change-block-type",
    )

    setEditorState(es)

  }


  // function markingColorBlock(a,b,c,gradientStyle) {
  //   //e.preventDefault(); e.stopPropagation();


  //   let allBlocks = Modifier.setBlockType(externalES.getCurrentContent(), externalES.getSelection(), "colorBlock")

  //   allBlocks = Modifier.setBlockData(allBlocks, externalES.getSelection(), Immutable.Map({ colorBlock: true, ...gradientStyle, horizontal: 50, verticle: 50 }))


  //   let externalES = EditorState.push(
  //     externalES,
  //     allBlocks,               
  //     "change-block-type",
  //   )


  //   //return externalES
  //   externalSetEditorState(externalES)

  // }




  return {

    colorBlockPlugin: {

      onChange: function (editorState, { setEditorState }) {

        externalES = editorState
        externalSetEditorState = setEditorState
   
        return externalES
    
          

      },





    },
    markingColorBlock,

  }

}