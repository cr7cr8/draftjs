import React, { useState, useRef, useEffect } from 'react';

import { EditorState, KeyBindingUtil, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, SelectionState, CharacterMetadata } from 'draft-js';


import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, IconButton } from "@material-ui/core";
import { InsertEmoticon } from "@material-ui/icons";
import { height } from '@material-ui/system';

import { withContext } from "./ContextProvider"
import Emoji,{emoji} from "./Emoji"

import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";
import { AvatarLogo } from './AvatarLogo';

//<img src="/emoji/❤.png" />



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





      Object.keys(emoji).forEach(function (emojiKey) {

        const regx = new RegExp(`${emojiKey}`, "g")
        const array = []
        let matchArr;
        while ((matchArr = regx.exec(blockText)) !== null) {

          const start = matchArr.index;
          const end = matchArr.index + matchArr[0].length;
          const contentLength = end - start;
          const contentFocusAt = anchorFocusOffset - start;
          // array.push(start)

          newSelection = newSelection.merge({
            anchorKey: blockKey,
            anchorOffset: start,
            focusKey: blockKey,
            focusOffset: start + emojiKey.length,
            isBackward: false,
            hasFocus: false,

          })

          newContent = newContent.createEntity("EMOJI", "IMMUTABLE", { url: emoji[emojiKey], symbol: emojiKey });
          const entityKey = newContent.getLastCreatedEntityKey();

          newContent = Modifier.applyEntity(newContent, newSelection, entityKey)



        }


        // array.forEach(function (offset) {
        //   newSelection = newSelection.merge({
        //     anchorKey: blockKey,
        //     anchorOffset: offset,
        //     focusKey: blockKey,
        //     focusOffset: offset + emojiKey.length,
        //     isBackward: false,
        //     hasFocus: false,

        //   })

        //   newContent = Modifier.applyEntity(newContent, newSelection, emojiEntity)


        // })

      })



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
    const { ctx, theme, contentState, entityKey, blockKey, offsetKey, start, end, decoratedText } = props;

    return (

      ctx.showEmoji
        ? <Emoji decoratedText={decoratedText} >{props.children}</Emoji>
        : <span style={{ ...!isFirefox && { backgroundColor: "wheat" } }}>{props.children}</span>

    )

  }




  function EmojiButton({ theme, ctx, classes, ...props }) {



    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {Object.keys(emoji).map(item => {

          return (
            <IconButton key={item}
              
              style={{ padding: 0, borderRadius: 0, }}

              onClick={function () {
                insertEmoji(item)
              }}
            >
              <Emoji>{item}</Emoji>

              {/* <span
                className={theme.emojiCss}
                style={{
                  backgroundImage: emoji[item],

                }}
              /> */}

            </IconButton>
          )
        })}
      </div >
    )
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
        component: withTheme(withContext(EmojiComp))
      }],
    },
    EmojiPanel: withTheme(withContext(EmojiButton))


  }


}