import React, { useState, useRef, useEffect } from 'react';

import { EditorState, KeyBindingUtil, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, SelectionState, CharacterMetadata } from 'draft-js';


import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, IconButton } from "@material-ui/core";
import { InsertEmoticon } from "@material-ui/icons";
import { height } from '@material-ui/system';

import { withContext } from "./ContextProvider"
import Emoji, { emoji } from "./Emoji"

import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";
import { AvatarLogo } from './AvatarLogo';

const emojiRegexRGI = require('emoji-regex/es2015/RGI_Emoji.js');
// const emojiRegex = require('emoji-regex/es2015/index.js');
// const emojiRegexText = require('emoji-regex/es2015/text.js');
const emojiRegex = emojiRegexRGI()


const styleObj = function ({ breakpointsAttribute, ...theme }) {

  return {
    emojiButtonCss: (props) => {
      return {
        padding: 0,
        borderRadius: 0,
        ...breakpointsAttribute(["fontSize", theme.textSizeArr]),
        "& .MuiIconButton-label": {
          display: "inline-block"
        }
      }
    },

    emojiCss: (props) => {

      const { ctx, contentState, entityKey, blockKey, offsetKey, start, end, decoratedText } = props;

      return {

        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "contain",
        // display: "inline-block",
        verticalAlign: "middle",
        // textAlign: "right",
        overflow: "hidden",

        ...breakpointsAttribute(["width", theme.textSizeArr], ["height", theme.textSizeArr]),



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





      // Object.keys(emoji).forEach(function (emojiKey) {

      //   const regx = new RegExp(`${emojiKey}`, "g")
      //   const array = []
      //   let matchArr;
      //   while ((matchArr = regx.exec(blockText)) !== null) {

      //     const start = matchArr.index;
      //     const end = matchArr.index + matchArr[0].length;
      //     const contentLength = end - start;
      //     const contentFocusAt = anchorFocusOffset - start;
      //     // array.push(start)

      //     newSelection = newSelection.merge({
      //       anchorKey: blockKey,
      //       anchorOffset: start,
      //       focusKey: blockKey,
      //       focusOffset: start + emojiKey.length,
      //       isBackward: false,
      //       hasFocus: false,

      //     })

      //     newContent = newContent.createEntity("EMOJI", "IMMUTABLE", { url: emoji[emojiKey], symbol: emojiKey });
      //     const entityKey = newContent.getLastCreatedEntityKey();

      //     newContent = Modifier.applyEntity(newContent, newSelection, entityKey)
      //   }


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

      // })



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


    return (
      <span
        className={classes.emojiCss}
        style={{
          //  backgroundImage: emoji[item],

        }}
      >
        <span //style={{ clipPath: "circle(0% at 50% 50%)", }}
        >
          {props.children}
        </span>

      </span>
    )


    return (

      ctx.showEmoji
        ? <Emoji decoratedText={decoratedText} >{props.children}</Emoji>
        : <span style={{ ...!isFirefox && { backgroundColor: "wheat" } }}>{props.children}</span>

    )

  }

  function EmojiPanel({ theme, ctx, classes, ...props }) {


    const emojiArr1 = `
    😃 😄 😁 😆 😅 😂 ☺️ 😊 😇 😉 😌 😍 😘 😚 😋 😝 😜 😎 😏 😒 😞 😔 ☹️ 😣 😖 😫 😩 😢 😭 😤 😠 😡 😳 😱 😨 😰 😥 😓 😶 😐 😲 😪 😵 😷 😈 👿 👹 👺 
    💩 👻 💀 ☠️ 👽 👾 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 
    `


    const emojiArr2 = `👋 ✋ 👌 ✌️ 👈 👉 👆 👇 ☝️ 👍 👎 ✊ 👊 👏 🙌 👐 🙏 ✍️ 💅 💪 👣 👂 👃 👀 👅 👄 💋 
    `

    const emojiArr3 = `👶 👧 🧒 👦 👩 🧑 👨 👩‍🦱 🧑‍🦱 👨‍🦱 👩‍🦰 🧑‍🦰 👨‍🦰 👱‍♀️ 👱 👱‍♂️ 👩‍🦳 🧑‍🦳 👨‍🦳 👩‍🦲 🧑‍🦲 👨‍🦲 🧔 👵 🧓 👴 👲 👳‍♀️ 👳 👳‍♂️ 🧕 👮‍♀️ 👮 👮‍♂️ 👷‍♀️ 
    👷 👷‍♂️ 💂‍♀️ 💂 💂‍♂️ 🕵️‍♀️ 🕵️ 🕵️‍♂️ 👩‍⚕️ 🧑‍⚕️ 👨‍⚕️ 👩‍🌾 🧑‍🌾 👨‍🌾 👩‍🍳 🧑‍🍳 👨‍🍳 👩‍🎓 🧑‍🎓 👨‍🎓 👩‍🎤 🧑‍🎤 👨‍🎤 👩‍🏫 🧑‍🏫 👨‍🏫 👩‍🏭 🧑‍🏭 👨‍🏭 👩‍💻 🧑‍💻 👨‍💻 👩‍💼 🧑‍💼 
    👨‍💼 👩‍🔧 🧑‍🔧 👨‍🔧 👩‍🔬 🧑‍🔬 👨‍🔬 👩‍🎨 🧑‍🎨 👨‍🎨 👩‍🚒 🧑‍🚒 👨‍🚒 👩‍✈️ 🧑‍✈️ 👨‍✈️ 👩‍🚀 🧑‍🚀 👨‍🚀 👩‍⚖️ 🧑‍⚖️ 👨‍⚖️ 👰‍♀️ 👰 👰‍♂️ 🤵‍♀️ 🤵 🤵‍♂️ 👸 🤴 🥷 🦸‍♀️ 🦸 🦸‍♂️ 🦹‍♀️ 🦹 
    🦹‍♂️ 🤶 🧑‍🎄 🎅 🧙‍♀️ 🧙 🧙‍♂️ 🧝‍♀️ 🧝 🧝‍♂️ 🧛‍♀️ 🧛 🧛‍♂️ 🧟‍♀️ 🧟 🧟‍♂️ 🧞‍♀️ 🧞 🧞‍♂️ 🧜‍♀️ 🧜 🧜‍♂️ 🧚‍♀️ 🧚 🧚‍♂️ 👼 🤰 🤱 👩‍🍼 🧑‍🍼 👨‍🍼 🙇‍♀️ 🙇 🙇‍♂️ 💁‍♀️ 💁 💁‍♂️ 🙅‍♀️ 🙅 🙅‍♂️ 🙆‍♀️ 🙆 🙆‍♂️ 
    🙋‍♀️ 🙋 🙋‍♂️ 🧏‍♀️ 🧏 🧏‍♂️ 🤦‍♀️ 🤦 🤦‍♂️ 🤷‍♀️ 🤷 🤷‍♂️ 🙎‍♀️ 🙎 🙎‍♂️ 🙍‍♀️ 🙍 🙍‍♂️ 💇‍♀️ 💇 💇‍♂️ 💆‍♀️ 💆 💆‍♂️ 🧖‍♀️ 🧖 🧖‍♂️ 💅 🤳 💃 🕺 👯‍♀️ 👯 👯‍♂️ 🕴 👩‍🦽 🧑‍🦽 👨‍🦽 👩‍🦼 🧑‍🦼 👨‍🦼 
    🚶‍♀️ 🚶 🚶‍♂️ 👩‍🦯 🧑‍🦯 👨‍🦯 🧎‍♀️ 🧎 🧎‍♂️ 🏃‍♀️ 🏃 🏃‍♂️ 🧍‍♀️ 🧍 🧍‍♂️ 👭 🧑‍🤝‍🧑 👬 👫 👩‍❤️‍👩 💑 👨‍❤️‍👨 👩‍❤️‍👨 👩‍❤️‍💋‍👩 💏 👨‍❤️‍💋‍👨 👩‍❤️‍💋‍👨 👪 👨‍👩‍👦 👨‍👩‍👧 👨‍👩‍👧‍👦 👨‍👩‍👦‍👦 
    👨‍👩‍👧‍👧 👨‍👨‍👦 👨‍👨‍👧 👨‍👨‍👧‍👦 👨‍👨‍👦‍👦 👨‍👨‍👧‍👧 👩‍👩‍👦 👩‍👩‍👧 👩‍👩‍👧‍👦 👩‍👩‍👦‍👦 👩‍👩‍👧‍👧 👨‍👦 👨‍👦‍👦 👨‍👧 👨‍👧‍👦 👨‍👧‍👧 👩‍👦 👩‍👦‍👦 👩‍👧 👩‍👧‍👦 👩‍👧‍👧 🗣 👤 👥 🫂 
    `




    let match;
    const arr = [];
    while (match = emojiRegex.exec(emojiArr3)) {
      const emoji = match[0];
      arr.push(emoji)
      console.log(`Matched sequence ${emoji} — code points: ${[...emoji].length}`);
    }



    return (
      <div style={{ display: "flex", flexWrap: "wrap", backgroundColor: "pink" }}>
        {arr.map(item => {

          return (
            <IconButton key={item} disableRipple
              className={classes.emojiButtonCss}
              onClick={function () {
                insertEmoji(item)
              }}

            >

              <span
                className={classes.emojiCss}
                style={{
                  // backgroundImage: emoji[item],

                }}
              >
                <span //style={{ clipPath: "circle(0% at 50% 50%)", }}
                >
                  {item}
                </span>

              </span>



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
        component: withStyles(styleObj, { withTheme: true })(withContext(EmojiComp))                       //withTheme(withContext(EmojiComp))
      }],
    },
    EmojiPanel: withStyles(styleObj, { withTheme: true })(withContext(EmojiPanel))


  }


}