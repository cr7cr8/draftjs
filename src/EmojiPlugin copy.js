import React, { useState, useRef, useEffect } from 'react';

import { EditorState, KeyBindingUtil, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, SelectionState, CharacterMetadata } from 'draft-js';


import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, IconButton } from "@material-ui/core";
import { InsertEmoticon } from "@material-ui/icons";
import { height } from '@material-ui/system';

import { withContext } from "./ContextProvider"


import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";
import { AvatarLogo } from './AvatarLogo';

//<img src="/emoji/❤.png" />

const styleObj = function ({ breakpointsAttribute, ...theme }) {

  return {

    emojiCss: (props) => {

      const { ctx, contentState, entityKey, blockKey, offsetKey, start, end, decoratedText } = props;

      return {

        backgroundRepeat: "no-repeat",

        backgroundPosition: "center center",
        backgroundSize: "contain",
        display: "inline-block",
        verticalAlign: "middle",
        textAlign: "right",
        // marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
        //   verticalAlign: "middle",
        //  transform: isMobile ? "scale(1.2)" : "scale(1.2)",
        //  backgroundImage: emoji[decoratedText],
        overflow: "hidden",
        // backgroundColor: "pink",
        ...breakpointsAttribute(["width", theme.textSizeArr], ["height", theme.textSizeArr]),

        // ...ctx.showEmoji && {
        //   "& span": {
        //     clipPath: "circle(0% at 50% 50%)",
        //   }
        // }

      }

    },

    emojiButtonCss: (props) => {
      return {
        padding: 0,
        borderRadius: 0,

      }
    }
  }
}




export default function createImagePlugin() {
  let externalES = null;
  let externalSetEditorState = null;
  let emojiArr = [
    '\u2620',
    '\u2764',
    '\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC69',
    '\uD83D\uDC7F',
    '\uD83D\uDC80',
    '\uD83D\uDCA9',
    '\uD83D\uDE01',
    '\uD83D\uDE02',
    '\uD83D\uDE03',
    '\uD83D\uDE04',
    '\uD83D\uDE05',
    '\uD83D\uDE06',
    '\uD83D\uDE07',
    '\uD83D\uDE08',
    '\uD83D\uDE09',
    '\uD83D\uDE0A',
    '\uD83D\uDE0B',
    '\uD83D\uDE0C',
    '\uD83D\uDE0D',
    '\uD83D\uDE0E',
    '\uD83D\uDE0F',
    '\uD83D\uDE10',
    '\uD83D\uDE12',
    '\uD83D\uDE13',
    '\uD83D\uDE14',
    '\uD83D\uDE16',
    '\uD83D\uDE18',
    '\uD83D\uDE1A',
    '\uD83D\uDE1C',
    '\uD83D\uDE1D',
    '\uD83D\uDE1E',
    '\uD83D\uDE20',
    '\uD83D\uDE21',
    '\uD83D\uDE22',
    '\uD83D\uDE23',
    '\uD83D\uDE24',
    '\uD83D\uDE25',
    '\uD83D\uDE28',
    '\uD83D\uDE29',
    '\uD83D\uDE2A',
    '\uD83D\uDE2B',
    '\uD83D\uDE2D',
    '\uD83D\uDE30',
    '\uD83D\uDE31',
    '\uD83D\uDE32',
    '\uD83D\uDE33',
    '\uD83D\uDE35',
    '\uD83D\uDE36',
    '\uD83D\uDE37',
    '\uD83D\uDE47\u200D\u2640\uFE0F',
    '\uD83E\uDD24',
    '\uD83E\uDD71'
  ]

  const emojiUrl = `url(/emoji/`
  let emoji = {}


  emojiArr.forEach(icon => {

    emoji[icon] = emojiUrl + icon + ".png)"
  })



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



  function Emoji(props) {
    const { ctx, theme, contentState, entityKey, blockKey, offsetKey, start, end, decoratedText, classes } = props;



    return (


      ctx.showEmoji
        ? <span
          className={classes.emojiCss}
          style={{ backgroundImage: emoji[decoratedText], }}
        >
          <span style={{ clipPath: "circle(0% at 50% 50%)" }}>
            {props.children}
          </span>
        </span>
        : <span style={{ ...!isFirefox && { backgroundColor: "wheat" } }}>{props.children}</span>


    )

  }






  function EmojiPanel({ children, emoji, insertEmoji, isEmojiPanelOn, marginBottom, ...props }) {

    const theme = useTheme()

    return (

      <Paper

        // className={emojiPanelClass}
        style={{
          maxWidth: "100%",
          overflow: "auto",
          // marginBottom: "10px",
          marginTop: isEmojiPanelOn ? "10px" : 0,
          //  height: isEmojiPanelOn ? "auto" : 0,
          maxHeight: isEmojiPanelOn ? "30vh" : 0,

          transitionProperty: "height,max-height, opacity",
          transitionDuration: "0.2s",
          opacity: isEmojiPanelOn ? 1 : 0,
          // marginBottom: isEmojiPanelOn ? theme.spacing(2) : 0
          marginBottom: marginBottom || theme.spacing(2),
        }}>



        {Object.keys(emoji).map(function (icon, index) {


          return <Button variant="text" key={icon} onClick={
            function (e) {
              // alert("dsd")
              insertEmoji(icon)
            }
          }>

            <Avatar src={emoji[icon].replace("url(", "").replace(")", "")} style={{ transform: "scale(1.2)", borderRadius: 0 }} />
          </Button>


          return <Button variant="text" key={icon}

            size="small"
            style={{
              color: "rgba(0,0,0,0)",
              backgroundImage: emoji[icon],
              backgroundRepeat: "no-repeat",

              backgroundPosition: "center center",
              backgroundSize: "contain",
              transform: "scale(0.85)",

            }}
            onClick={
              function (e) {
                // alert("dsd")
                insertEmoji(icon)
              }
            }

          >
            {icon}
          </Button>
        })}





      </Paper>
    )
  }


  function EmojiButton({ theme, ctx, classes, ...props }) {


    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {Object.keys(emoji).map(item => {

          return (
            <IconButton key={item}
              className={classes.emojiButtonCss}
              onClick={function () {
                insertEmoji(item)
              }}

            >


              <span


                className={classes.emojiCss}
                style={{
                  backgroundImage: emoji[item],

                }}
              />



              {/* <AvatarLogo key={item} src={`/emoji\/${item}.png`} size={theme.textSizeArr}
              radius={"0%"}
              onClick={function () {
                insertEmoji(item)
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
        component: withContext(withStyles(styleObj, { withTheme: true })(Emoji))
      }],
    },
    EmojiPanel: withContext(withStyles(styleObj, { withTheme: true })(EmojiButton))


  }


}