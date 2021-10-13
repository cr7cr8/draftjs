
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


export default function ColorBlock(props) {


  const { block, selection, contentState } = props

  //  const {  readOnly, setReadOnly, EmojiPanel, markingImageBlock, editorState, setEditorState, taggingFontBar } = props.blockProps


  const editorBlockRef = useRef()

  useEffect(function () {
    //  console.log(block.getKey())

    // console.log(editorBlockRef.current._node)
    // console.log(block.getData().toObject())
    editorBlockRef.current._node.style.backgroundImage = block.getData().toObject().backgroundImage
    editorBlockRef.current._node.style.color = block.getData().toObject().color




    //  editorBlockRef.current._node.setStyle({ ...block.getData() })

  })


  return (
    <EditorBlock     {...props} ref={editorBlockRef} >  </EditorBlock>

  )



}