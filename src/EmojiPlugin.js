import React, { useState, useRef, useEffect } from 'react';

import { EditorState, KeyBindingUtil, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, SelectionState, CharacterMetadata } from 'draft-js';


import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, IconButton, Box } from "@material-ui/core";
import { InsertEmoticon } from "@material-ui/icons";
import { height } from '@material-ui/system';

import { withContext } from "./ContextProvider"


import EmojiPanel from "./EmojiPanel"
import { emojiRegex } from "./EmojiConfig"








const styleObj = function ({ breakpointsAttribute, ...theme }) {




  return {


    emojiCss: (props) => {
      return {
        //  cursor: "pointer",
        borderWidth: 0,
        margin: 0,
        padding: 0,
        borderRadius: 0,
        //backgroundColor: theme.palette.background.default,
        display: "inline-block",
        // backgroundColor:"wheat",
        ...breakpointsAttribute(["fontSize", theme.textSizeArr]),

      }
    },
    emojiButtonCss: (props) => {
      return {
        margin: 1,
        cursor: "pointer",
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.action.hover,

        "&:hover": {
          backgroundColor: theme.palette.action.selected,
        },
        "&:active": {

          backgroundColor: theme.palette.divider,
        }

      }
    },

  }
}



export default function createImagePlugin() {
  let externalES = null;
  let externalSetEditorState = null;



  function emojiStrategy(contentBlock, callback, contentState) {


    contentBlock.findEntityRanges(
      function (character) {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === "EMOJI"

        );
      },
      callback
    );
  };

  function taggingEmoji() {
    const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = externalES.getSelection().toArray()
    const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
      = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]


    const oldSelection = externalES.getSelection();
    let newContent = externalES.getCurrentContent();
    let newSelection = externalES.getSelection();

    externalES.getCurrentContent().getBlocksAsArray().forEach(function (block) {

      const [blockKey, blockType, blockText, metaArr] = block.toArray()

      // metaArr.forEach(function (item, index) {
      //   const itemEntityKey = item.getEntity()


      //   if (itemEntityKey) {
      //     const entityType = newContent.getEntity(itemEntityKey).getType()
      //     if (entityType === "EMOJI") {

      //       newSelection = newSelection.merge({
      //         anchorKey: blockKey,
      //         anchorOffset: index,
      //         focusKey: blockKey,
      //         focusOffset: index + 1,
      //         isBackward: false,
      //         hasFocus: false,
      //       })
      //       newContent = Modifier.applyEntity(newContent, newSelection, null)
      //     }
      //   }
      // })



      let matchArr;
      while ((matchArr = emojiRegex.exec(blockText)) !== null) {

        const emojiKey = matchArr[0]
        const start = matchArr.index;
        const end = matchArr.index + matchArr[0].length;
        const contentLength = end - start;
        const contentFocusAt = anchorFocusOffset - start;


        newSelection = newSelection.merge({
          anchorKey: blockKey,
          anchorOffset: start,
          focusKey: blockKey,
          focusOffset: start + emojiKey.length,
          isBackward: false,
          hasFocus: false,

        })

        newContent = newContent.createEntity("EMOJI", "IMMUTABLE", { emojiKey });
        const entityKey = newContent.getLastCreatedEntityKey();

        newContent = Modifier.applyEntity(newContent, newSelection, entityKey)
      }






    })






    externalES = EditorState.push(externalES, newContent, "insert-characters");
    externalES = EditorState.acceptSelection(externalES, oldSelection);
    return externalES
  }

  function insertEmoji(text) {

    const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = externalES.getSelection().toArray()
    const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
      = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]


    let newContent = Modifier.replaceText(
      externalES.getCurrentContent(),
      externalES.getSelection(),
      text,
    )

    let newSelection = externalES.getSelection().merge({

      anchorKey: anchorStartKey,
      anchorOffset: anchorStartOffset + text.length,
      focusKey: anchorStartKey,
      focusOffset: anchorStartOffset + text.length,
      isBackward: false,
      hasFocus: true,
    })

    externalES = EditorState.push(externalES, newContent, "insert-characters");
    externalES = EditorState.acceptSelection(externalES, newSelection)

    externalSetEditorState(externalES)

  }

  function EmojiComp(props) {
    const { ctx, theme, contentState, entityKey, blockKey, offsetKey, start, end, decoratedText, classes } = props;
    return props.children
  }

  function EmojiPanelComp({ theme, ctx, classes, ...props }) {


    return <EmojiPanel {...{ theme, ctx, classes, ...props, }} clickFn={insertEmoji} />


  }

  return {

    emojiPlugin: {
      onChange: function (editorState, { setEditorState }) {
        externalES = editorState
        externalSetEditorState = setEditorState
        externalES = taggingEmoji()

        return externalES
      },

      decorators: [{

        strategy: emojiStrategy,
        component: withStyles(styleObj, { withTheme: true })(withContext(EmojiComp))                       //withTheme(withContext(EmojiComp))
      }],
    },

    EmojiPanel: withStyles(styleObj, { withTheme: true })(withContext(EmojiPanelComp))


  }


}