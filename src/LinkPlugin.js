import React, { useState, useRef, useEffect } from 'react';

import { EditorState, KeyBindingUtil, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, SelectionState, CharacterMetadata } from 'draft-js';


import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, IconButton, Box } from "@material-ui/core";
import { InsertEmoticon } from "@material-ui/icons";
import { height } from '@material-ui/system';

import { withContext } from "./ContextProvider"



export default function createLinkPlugin() {
  let externalES = null;
  let externalSetEditorState = null;


  function LinkComp() {


    return <></>
  }


  function linkStrategy(contentBlock, callback, contentState) {


    contentBlock.findEntityRanges(
      function (character) {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === "LINK"

        );
      },
      callback
    );
  };

  function markingLink(editorState,setEditorState){

    let allBlocks = editorState.getCurrentContent()
    allBlocks = allBlocks.createEntity("LINK", "MUTABLE", { url:"url" });

  }




  return {

    emojiPlugin: {
      onChange: function (editorState, { setEditorState }) {
        externalES = editorState
        externalSetEditorState = setEditorState
        // externalES = taggingEmoji(externalES)

        return externalES
      },

      decorators: [{

        strategy: linkStrategy,
        component: withContext(LinkComp)                      //withTheme(withContext(EmojiComp))
      }],
    },

    // EmojiPanel: withStyles(styleObj, { withTheme: true })(withContext(EmojiPanelComp)),


  }


}