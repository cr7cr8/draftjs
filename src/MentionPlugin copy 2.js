import { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext1 } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, Box, Chip, Grow } from "@material-ui/core";
import { Image, AlternateEmailSharp } from "@material-ui/icons";
import { withContext } from "./ContextProvider";

import AvatraChipList from "./AvatarChipList";

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
        backgroundColor: "skyblue",
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
        backgroundColor: "skyblue",
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

  const friendList = <AvatraChipList />


  let externalES = null;
  let externalSetEditorState = null;
  let newContent = null;

  const entityKeyObj = {}

  function mentionStrategy(contentBlock, callback, contentState) {

    contentBlock.findEntityRanges(
      function (character) {
        const entityKey = character.getEntity();
        return entityKey !== null && contentState.getEntity(entityKey).getType().indexOf("Mention") >= 0
      },
      callback
    );
  }

  function Mention({ ctx, theme, ...props }) {

    //  const theme = ctx.theme

    const textSizeArr = theme.textSizeArr
    const showMention = ctx.showMention

    const { longMention_HEAD_Css, longMention_BODY_Css } = useStyles()


    const { contentState, entityKey, blockKey, offsetKey, start, end, decoratedText, children } = props;
    const { mentionHeadKey, mentionBodyKey, person, imgurl, mentionType } = contentState.getEntity(entityKey).getData()

    // console.log(mentionType)
    // console.log(theme)


    if (mentionType === "longMentionOnAt_HEAD") {
      // return <></>                                                      //2+2*0.15
      return (
        <span className={longMention_HEAD_Css}>{children}</span>
      )
    }
    else if (mentionType === "longMentionOnAt_BODY") {                                   //2*0.5
      return (
        <>
          <span className={longMention_BODY_Css}>{children}</span>
          {friendList}
        </>
      )

      //    return <AvatarChip size={theme.textSizeArr} labelSize={theme.textSizeArr} personName={props.decoratedText.replace(" @", "")} label={props.children} />
    }

    else if (mentionType === "longMentionOnOther_HEAD") {
      // return <></>
      //    return <sapn style={{ backgroundColor: "skyblue", paddingRight: "0" }}>{children}</sapn>
      return <span className={longMention_HEAD_Css}>{children}</span>
    }
    else if (mentionType === "longMentionOnOther_BODY") {
      return <>
        <span className={longMention_BODY_Css}>{children}</span>
        {friendList}
      </>

      //   return <AvatarChip size={theme.textSizeArr} labelSize={theme.textSizeArr} personName={props.decoratedText.replace(" @", "")} label={props.children} />
    }



    // else if (mentionType === "shortMentionOn") {
    //   return <sapn style={{ backgroundColor: "skyblue", width: "2rem" }}>{children}</sapn>
    // }

    // else if (mentionType === "shortMentionOff") {
    //   return <sapn style={{ backgroundColor: "skyblue", width: "2rem" }}>{children}</sapn>
    // }


    else if (mentionType === "longMentionOff_HEAD") {
      return showMention
        ? <></>
        : <span className={longMention_HEAD_Css}>{children}</span>
    }
    else if (mentionType === "longMentionOff_BODY") {


      return showMention
        ? <AvatarChip size={theme.textSizeArr} labelSize={theme.textSizeArr} personName={props.decoratedText.replace(" @", "")} label={props.children} />
        : <span className={longMention_BODY_Css}>{children}</span>
    }
    else {
      return children
    }



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

          createTag({ tagName: "longMentionOnAt", newSelection, blockKey, start, end })

        }
        else if (longMentionOnOther) {

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


  return {
    mentionPlugin: {

      onChange: function (editorState, { setEditorState }) {
        externalES = editorState
        externalSetEditorState = setEditorState
        externalES = taggingMention()
        return externalES

      },

      decorators: [
        {
          strategy: mentionStrategy,
          component: withTheme(withContext(Mention))
        }
      ],

    }
  }

}