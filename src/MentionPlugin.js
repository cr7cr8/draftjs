import { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, Box, Chip, Grow } from "@material-ui/core";
import { Image, AlternateEmailSharp } from "@material-ui/icons";


import AvatarChipList from "./AvatarChipList";

import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";

//import axios from "axios";
//import { axios, avatarUrl } from "./config";

//import { AvatarChip, TwoLineLabel, AvatarLogo } from "./AvatarLogo"

const useStyles = makeStyles(({ breakpointsAttribute, ...theme }) => {


  return {

    longMention_HEAD_Css: () => {
      return {
        backgroundColor: "rgba(183,225,252,0.8)",//"skyblue",
        display: "inline-flex",
        lineHeight: "100%",
        alignItems: "center",

        //  transform: "scale(0.8)",
        //    boxShadow: theme.shadows[5],
        borderTopLeftRadius: "1000px",
        borderBottomLeftRadius: "1000px",

        verticalAlign: "text-bottom",
        ...breakpointsAttribute(
          ["width", theme.multiplyArr(theme.textSizeArr, 1.15)],
          ["height", theme.multiplyArr(theme.textSizeArr, 1.15).map(item => `calc( ${item} - 1px )`)],
          ["fontSize", theme.multiplyArr(theme.textSizeArr, 0.8)],
          //   ["transform", theme.multiplyArr(theme.textSizeArr, 0.1).map(item => { return `translateX(${item}) scale(0.9)` })],

        )
      }
    },
    longMention_BODY_Css: () => {
      return {
        position: "relative",
        backgroundColor: "rgba(183,225,252,0.8)",//"rgba( 200,156,212,0.5)",
        //  backgroundColor: "skyblue",
        paddingLeft: "0rem",
        lineHeight: "100%",
        //  boxShadow: theme.shadows[3],
        borderTopRightRadius: "1000px",
        borderBottomRightRadius: "1000px",
        //   borderTopLeftRadius: "1000px",
        //   borderBottomLeftRadius: "1000px",
        //   boxShadow: theme.shadows[3],
        //   ...breakpointsAttribute(["paddingRight", theme.multiplyArr(theme.textSizeArr, 0.5)], ["paddingLeft", theme.multiplyArr(theme.textSizeArr, 1.15)])
        ...breakpointsAttribute(["paddingRight", theme.multiplyArr(theme.textSizeArr, 0.5)], ["paddingLeft", theme.multiplyArr(theme.textSizeArr, 0)])
      }
    }




  }
})




export default function createMentionPlugin() {


  const friendListArr = ["aaa", "bbb", "ccc"]


  let externalES = null;
  let externalSetEditorState = null;
  let newContent = null;

  const entityKeyObj = {}

  let isShowing = false
  function setShowing(bool) {
    isShowing = bool
  }
  let matchFriendArr = []
  function setMatchFriendArr(arr) {
    matchFriendArr = arr
  }

  let inputingName = ""
  let tagStartPos = 0
  let tagEndPos = 0

  let tabIndex = 1000;


  function mentionStrategy(contentBlock, callback, contentState) {

    contentBlock.findEntityRanges(
      function (character) {
        const entityKey = character.getEntity();
        return entityKey !== null && contentState.getEntity(entityKey).getType().indexOf("Mention") >= 0
      },
      callback
    );
  }



  function createTag({ tagName, newSelection, blockKey, start, end }) {

    // newContent = newContent.createEntity(`${tagName}_HEAD`, "MUTABLE", { mentionType: `${tagName}_HEAD` });
    // let mentionHeadKey = newContent.getLastCreatedEntityKey();

    newSelection = newSelection.merge({
      anchorKey: blockKey,
      focusKey: blockKey,
      anchorOffset: start,
      focusOffset: start + 2,
      isBackward: false,
      hasFocus: false,
    })

    //  newContent = Modifier.applyEntity(newContent, newSelection, mentionHeadKey)
    newContent = Modifier.applyEntity(newContent, newSelection, entityKeyObj[`${tagName}_HEAD`])


    // newContent = newContent.createEntity(`${tagName}_BODY`, "MUTABLE", { mentionType: `${tagName}_BODY` });
    // let mentionBodyKey = newContent.getLastCreatedEntityKey();
    newSelection = newSelection.merge({
      anchorKey: blockKey,
      focusKey: blockKey,
      anchorOffset: start + 2,
      focusOffset: end,
      isBackward: false,
      hasFocus: false,
    })

    //  newContent = Modifier.applyEntity(newContent, newSelection, mentionBodyKey)
    //    newContent = Modifier.applyEntity(newContent, newSelection, entityKeyObj.mentionHeadKey)
    newContent = Modifier.applyEntity(newContent, newSelection, entityKeyObj[`${tagName}_BODY`])


    // newContent = newContent.mergeEntityData(
    //   mentionHeadKey,
    //   {
    //     mentionHeadKey, mentionBodyKey,
    //     person: blockText.substring(start, end).replace(" @", ""),
    //     //  imgurl: `url(${url}/avatar/downloadavatar/${blockText.substring(start, end).replace(" @", "")})`
    //     // imgurl: `${url}/${blockText.substring(start, end).replace(" @", "")}).svg`

    //   }
    // )

    // newContent = newContent.mergeEntityData(
    //   mentionBodyKey,
    //   {
    //     mentionHeadKey, mentionBodyKey,
    //     person: blockText.substring(start, end).replace(" @", ""),
    //     //     imgurl: `url(${url}/avatar/downloadavatar/${blockText.substring(start, end).replace(" @", "")})`
    //     //   imgurl: `${url}/${blockText.substring(start, end).replace(" @", "")}).svg`

    //   }
    // )
  }

  function taggingMention() {

    const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = externalES.getSelection().toArray()
    const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
      = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]
    const regx = /\s([@][\w_\[\u4E00-\u9FCA\]]*)/g


    const oldSelection = externalES.getSelection();
    let newSelection = externalES.getSelection();
    newContent = externalES.getCurrentContent();

    externalES.getCurrentContent().getBlocksAsArray().forEach(function (block) {

      const [blockKey, , blockText, metaArr] = block.toArray()


      metaArr.forEach(function (item, index) {
        const itemEntityKey = item.getEntity()
        if (itemEntityKey) {
          const entityType = newContent.getEntity(itemEntityKey).getType()

          if (entityType.indexOf("Mention") >= 0) {

            newSelection = newSelection.merge({
              anchorKey: blockKey,
              anchorOffset: index,
              focusKey: blockKey,
              focusOffset: index + 1,
              isBackward: false,
              hasFocus: false,
            })
            newContent = Modifier.applyEntity(newContent, newSelection, null)
          }
        }
      })


      if (!entityKeyObj.longMentionOnAt_HEAD) {
        newContent = newContent.createEntity(`longMentionOnAt_HEAD`, "MUTABLE", { mentionType: `longMentionOnAt_HEAD` });
        entityKeyObj.longMentionOnAt_HEAD = newContent.getLastCreatedEntityKey();
      }

      if (!entityKeyObj.longMentionOnAt_BODY) {
        newContent = newContent.createEntity(`longMentionOnAt_BODY`, "MUTABLE", { mentionType: `longMentionOnAt_BODY` });
        entityKeyObj.longMentionOnAt_BODY = newContent.getLastCreatedEntityKey();
      }

      if (!entityKeyObj.longMentionOnOther_HEAD) {
        newContent = newContent.createEntity(`longMentionOnOther_HEAD`, "MUTABLE", { mentionType: `longMentionOnOther_HEAD` });
        entityKeyObj.longMentionOnOther_HEAD = newContent.getLastCreatedEntityKey();
      }

      if (!entityKeyObj.longMentionOnOther_BODY) {
        newContent = newContent.createEntity(`longMentionOnOther_BODY`, "MUTABLE", { mentionType: `longMentionOnOther_BODY` });
        entityKeyObj.longMentionOnOther_BODY = newContent.getLastCreatedEntityKey();
      }

      if (!entityKeyObj.longMentionOff_HEAD) {
        newContent = newContent.createEntity(`longMentionOff_HEAD`, "MUTABLE", { mentionType: `longMentionOff_HEAD` });
        entityKeyObj.longMentionOff_HEAD = newContent.getLastCreatedEntityKey();
      }

      if (!entityKeyObj.longMentionOff_BODY) {
        newContent = newContent.createEntity(`longMentionOff_BODY`, "MUTABLE", { mentionType: `longMentionOff_BODY` });
        entityKeyObj.longMentionOff_BODY = newContent.getLastCreatedEntityKey();
      }




      let matchArr;
      while ((matchArr = regx.exec(blockText)) !== null) {

        const start = matchArr.index;
        const end = matchArr.index + matchArr[0].length;
        const contentLenth = end - start;
        const contentFocusAt = anchorFocusOffset - start;

        //console.log(" contentFocusAt ", contentFocusAt, " contentLength: ", contentLenth, " start: ", start, " end: ", end)

        // const shortMentionOn = (contentLenth === 2) && hasfocus && (blockKey === anchorFocusKey) && (contentFocusAt === 2)
        // const shortMentionOff = (contentLenth === 2) && ((!hasfocus) || (blockKey !== anchorFocusKey) || (contentFocusAt !== 2))

        const shortMentionOn = false
        const shortMentionOff = false


        const longMentionOnAt = (contentLenth > 2) && hasfocus && (blockKey === anchorFocusKey) && (contentFocusAt === 2)
        const longMentionOnOther = (contentLenth > 2) && hasfocus && (blockKey === anchorFocusKey) && (contentFocusAt !== 2) && (contentFocusAt > 0) && (contentFocusAt <= contentLenth)

        const longMentionOff = (contentLenth > 2) && ((!hasfocus) || (blockKey !== anchorFocusKey) || (contentFocusAt <= 0) || (contentFocusAt > contentLenth))


        // if (shortMentionOn) {
        //   newContent = newContent.createEntity("shortMentionOn", "MUTABLE", { mentionType: "shortMentionOn" });
        //   let entityKey = newContent.getLastCreatedEntityKey();
        //   newSelection = newSelection.merge({
        //     anchorKey: blockKey,
        //     focusKey: blockKey,
        //     anchorOffset: start,
        //     focusOffset: end,
        //     isBackward: false,
        //     hasFocus: false,
        //   })

        //   newContent = Modifier.applyEntity(newContent, newSelection, entityKey)

        // }
        // else if (shortMentionOff) {
        //   newContent = newContent.createEntity("shortMentionOff", "MUTABLE", { mentionType: "shortMentionOff" });
        //   let entityKey = newContent.getLastCreatedEntityKey();
        //   newSelection = newSelection.merge({
        //     anchorKey: blockKey,
        //     focusKey: blockKey,
        //     anchorOffset: start,
        //     focusOffset: end,
        //     isBackward: false,
        //     hasFocus: false,
        //   })

        //   newContent = Modifier.applyEntity(newContent, newSelection, entityKey)

        // }
        if (longMentionOnAt) {

          tagStartPos = start
          tagEndPos = end
          createTag({ tagName: "longMentionOnAt", newSelection, blockKey, start, end })


        }
        else if (longMentionOnOther) {
          tagStartPos = start
          tagEndPos = end
          createTag({ tagName: "longMentionOnOther", newSelection, blockKey, start, end })

        }
        else if (longMentionOff) {

          createTag({ tagName: "longMentionOff", newSelection, blockKey, start, end })
        }








      }
    })


    externalES = EditorState.push(externalES, newContent, "apply-entity");
    externalES = EditorState.acceptSelection(externalES, oldSelection);
    return externalES


  }

  function insertMention(friendName, mentionHeadKey, mentionBodyKey, entityKey) {


    const text = " @" + friendName + " "
    const contentState = externalES.getCurrentContent();
    const selection = externalES.getSelection();


    // const mentionBodyText = mentionBodyKey
    //   ? contentState.getEntity(mentionBodyKey).getData().person.replace(" @", "")
    //   : ""

    const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = selection.toArray()
    const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
      = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]


    let newSelection = selection.merge({
      anchorKey: anchorStartKey,
      anchorOffset: tagStartPos,
      focusKey: anchorStartKey,
      focusOffset: tagEndPos,
      isBackward: false,
      hasFocus: true,

    })


    let newContent = Modifier.replaceText(
      contentState,
      newSelection,
      text,
    )

    newSelection = externalES.getSelection().merge({

      anchorKey: anchorStartKey,
      anchorOffset: tagStartPos + text.length,
      focusKey: anchorStartKey,
      focusOffset: tagStartPos + text.length,
      isBackward: false,
      hasFocus: true,
    })

    externalES = EditorState.push(externalES, newContent, "insert-characters");
    externalES = EditorState.acceptSelection(externalES, newSelection)


    externalSetEditorState(externalES)


  }
  function Mention({ ctx, theme, ...props }) {

    //  const theme = ctx.theme

    //const textSizeArr = theme.textSizeArr
    const showMention = ctx.showMention
    //const showMention = true
    const showHint = ctx.showHint
    //const showHint = true

    const { longMention_HEAD_Css, longMention_BODY_Css } = useStyles()


    const { contentState, entityKey, blockKey, offsetKey, start, end, decoratedText, children } = props;
    const { mentionHeadKey, mentionBodyKey, person, imgurl, mentionType } = contentState.getEntity(entityKey).getData()

    //const [personTabIndex,setPersonTabIndex] = useState()
    // console.log(mentionType)
    // console.log(theme)

    inputingName = decoratedText


    if (mentionType === "longMentionOnAt_HEAD") {
      // return <></>                                                      //2+2*0.15
      return (
        <span className={longMention_HEAD_Css}>{children}</span>
      )
    }
    else if (mentionType === "longMentionOnAt_BODY") {                                   //2*0.5
      return (

        <span className={longMention_BODY_Css} >
          {showHint && <AvatarChipList insertMention={insertMention} tabIndex={tabIndex} nameOnTyping={decoratedText} setShowing={setShowing} setMatchFriendArr={setMatchFriendArr} />}
          {children}
        </span>


      )

      //    return <AvatarChip size={theme.textSizeArr} labelSize={theme.textSizeArr} personName={props.decoratedText.replace(" @", "")} label={props.children} />
    }

    else if (mentionType === "longMentionOnOther_HEAD") {
      // return <></>
      //    return <sapn style={{ backgroundColor: "skyblue", paddingRight: "0" }}>{children}</sapn>
      return <span className={longMention_HEAD_Css}>{children}</span>
    }
    else if (mentionType === "longMentionOnOther_BODY") {

      return (


        <span className={longMention_BODY_Css} onKeyDown={function () { alert("fdf") }}>
          {showHint && <AvatarChipList insertMention={insertMention} tabIndex={tabIndex} nameOnTyping={decoratedText} setShowing={setShowing} setMatchFriendArr={setMatchFriendArr} />}
          {children}
        </span>





      )
      //   return <AvatarChip hoverContent="fdsfsf" size={theme.textSizeArr} labelSize={theme.textSizeArr} personName={props.decoratedText.replace(" @", "")} label={props.children} />
    }



    // else if (mentionType === "shortMentionOn") {
    //   return <sapn style={{ backgroundColor: "skyblue", width: "2rem" }}>{children}</sapn>
    // }

    // else if (mentionType === "shortMentionOff") {
    //   return <sapn style={{ backgroundColor: "skyblue", width: "2rem" }}>{children}</sapn>
    // }


    else if (mentionType === "longMentionOff_HEAD") {
      return showMention
        ? <span style={{ fontSize: 0 }}>{children}</span>  //<></> works as well
        : <span className={longMention_HEAD_Css}>{children}</span>
    }
    else if (mentionType === "longMentionOff_BODY") {
      // return <span className={longMention_BODY_Css} contentEditable="true">
      //   <AvatraChipList />{children}
      // </span>

      return showMention
        ? <AvatarChip size={theme.textSizeArr} labelSize={theme.textSizeArr} personName={props.decoratedText.replace(" @", "")} label={props.children} />
        : <span className={longMention_BODY_Css}>{children}</span>
    }
    else {
      return children
    }



  }

  return {
    mentionPlugin: {



      handleReturn(e, newState, { setEditorState }) {
        if (isShowing) { insertMention(matchFriendArr[tabIndex % matchFriendArr.length]); return "handled" }

      },

      keyBindingFn(e, { getEditorState, setEditorState, ...obj }) {

        if ((e.keyCode === 40) && isShowing) {
          tabIndex = tabIndex + 1;
          return "fire-arrow";
        }

        else if ((e.keyCode === 38) && isShowing) {
          tabIndex = tabIndex - 1;
          return "fire-arrow";
        }

      },
      handleKeyCommand(command, editorState, evenTimeStamp, { setEditorState }) {

        if (command === "fire-arrow") {
          externalSetEditorState(externalES)
          return "handled"
        }

        // if (command === "fire-enter") {
        //   alert("xxdd")
        //   insertMention(...hasOnAtTag())
        //   return "handled"
        // }


        return 'not-handled';
      },

      onChange: function (editorState, { setEditorState }) {
        externalES = editorState
        externalSetEditorState = setEditorState
        externalES = taggingMention()
        return externalES

      },

      decorators: [
        {
          strategy: mentionStrategy,
          component: withContext(withTheme(Mention))
        }
      ],

    }
  }

}