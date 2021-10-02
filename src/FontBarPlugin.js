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



const styleObj = function ({ breakpointsAttribute, ...theme }) {


  return {


  }
}



export default function createFontBarPlugin() {
  let externalES = null;
  let externalSetEditorState = null;


  function fontBarStrategy(contentBlock, callback, contentState) {


    contentBlock.findEntityRanges(
      function (character) {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === "FONTBAR"

        );
      },
      callback
    );
  };

  function FontBarComp()    {

    return <></>
  }

  function taggingFontBar(){



  }


  return {


    fontBarPlugin: {

      keyBindingFn(e, { getEditorState, setEditorState, ...obj }) {




        return getDefaultKeyBinding(e);



      },
      handleKeyCommand(command, editorState, evenTimeStamp, { setEditorState }) {
        // better to place each command detail in draft.js, not here
        if (command === "cancel-delete") {

        }


        return 'not-handled';
      },



      onChange: function (editorState, { setEditorState }) {
        externalES = editorState
        externalSetEditorState = setEditorState
        externalES = taggingFontBar()

        return externalES

      },


      decorators: [{

        strategy: fontBarStrategy,
        component: withStyles(styleObj, { withTheme: true })(withContext(FontBarComp))                       //withTheme(withContext(EmojiComp))
      }],

      handleReturn: function (e, newState, { getEditorState, setEditorState }) {

      },
    },




  }


}

