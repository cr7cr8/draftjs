import { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context } from "./ContextProvider"


import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, Box, Chip, Grow } from "@material-ui/core";
import { Image, AlternateEmailSharp } from "@material-ui/icons";

import useMediaQuery from '@material-ui/core/useMediaQuery';

import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";

//import axios from "axios";
//import { axios, avatarUrl } from "./config";

import { AvatarChip, TwoLineLabel, AvatarLogo } from "./AvatarLogo"

const useStyles = makeStyles(({ breakpointsAttribute, ...theme }) => {


  return {

    longMention_HEAD_Css: () => {
      return {
        backgroundColor: "skyblue",
        display: "inline-block",
        lineHeight: "115%",
        //  transform: "scale(0.8)",
        //   boxShadow: theme.shadows[3],
        borderTopLeftRadius: "1000px",
        borderBottomLeftRadius: "1000px",
        ...breakpointsAttribute(
          ["width", theme.multiplyArr(theme.textSizeArr, 1.15)],

          //   ["transform", theme.multiplyArr(theme.textSizeArr, 0.1).map(item => { return `translateX(${item}) scale(0.9)` })],

        )
      }
    },
    longMention_BODY_Css: () => {
      return {
        backgroundColor: "skyblue",
        paddingLeft: "0rem",
        lineHeight: "100%",
        borderTopRightRadius: "1000px",
        borderBottomRightRadius: "1000px",
        //   boxShadow: theme.shadows[3],
        ...breakpointsAttribute(["paddingRight", theme.multiplyArr(theme.textSizeArr, 0.5)])

      }
    }




  }
})



export default function createMentionPlugin() {


  let externalES = null;
  let externalSetEditorState = null;

  function mentionStrategy(contentBlock, callback, contentState) {

    contentBlock.findEntityRanges(
      function (character) {
        const entityKey = character.getEntity();
        return entityKey !== null && contentState.getEntity(entityKey).getType().indexOf("Mention") >= 0
      },
      callback
    );
  }

  function Mention({ ...props }) {

    const theme = useTheme()

    const textSizeArr = theme.textSizeArr

    const { longMention_HEAD_Css, longMention_BODY_Css } = useStyles()


    const { contentState, entityKey, blockKey, offsetKey, start, end, decoratedText, children } = props;
    const { mentionHeadKey, mentionBodyKey, person, imgurl, mentionType } = contentState.getEntity(entityKey).getData()

    console.log(mentionType)
    console.log(theme)


    if (mentionType === "longMentionOnAt_HEAD") {
      //    return <></>                                                      //2+2*0.15
      return <sapn className={longMention_HEAD_Css}>@</sapn>
    }
    else if (mentionType === "longMentionOnAt_BODY") {                                   //2*0.5
      return <sapn className={longMention_BODY_Css}>{children}</sapn>
    }

    else if (mentionType === "longMentionOnOther_HEAD") {
      //    return <></>
      //    return <sapn style={{ backgroundColor: "skyblue", paddingRight: "0" }}>{children}</sapn>
      return <sapn className={longMention_HEAD_Css}>@</sapn>
    }
    else if (mentionType === "longMentionOnOther_BODY") {
      return <sapn className={longMention_BODY_Css}>{children}</sapn>
    }



    // else if (mentionType === "shortMentionOn") {
    //   return <sapn style={{ backgroundColor: "skyblue", width: "2rem" }}>{children}</sapn>
    // }

    // else if (mentionType === "shortMentionOff") {
    //   return <sapn style={{ backgroundColor: "skyblue", width: "2rem" }}>{children}</sapn>
    // }


    else if (mentionType === "longMentionOff_HEAD") {
      return <></>
      //return <sapn className={longMention_HEAD_Css}>@</sapn>
    }
    else if (mentionType === "longMentionOff_BODY") {

      return <AvatarChip size={theme.textSizeArr} labelSize={theme.textSizeArr} personName={props.decoratedText.replace(" @", "")} label={props.children} />
      //return <sapn className={longMention_BODY_Css}>{children}</sapn>
    }
    else {
      return children
    }



  }

  function taggingMention() {

    const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = externalES.getSelection().toArray()
    const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
      = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]
    const regx = /\s([@][\w_\[\u4E00-\u9FCA\]]*)/g


    const oldSelection = externalES.getSelection();
    let newSelection = externalES.getSelection();
    let newContent = externalES.getCurrentContent();

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


      let matchArr;
      while ((matchArr = regx.exec(blockText)) !== null) {

        const start = matchArr.index;
        const end = matchArr.index + matchArr[0].length;
        const contentLenth = end - start;
        const contentFocusAt = anchorFocusOffset - start;

        const shortMentionOn = (contentLenth === 2) && hasfocus && (blockKey === anchorFocusKey) && (contentFocusAt === 2)
        const shortMentionOff = (contentLenth === 2) && ((!hasfocus) || (blockKey !== anchorFocusKey) || (contentFocusAt !== 2))

        const longMentionOnAt = (contentLenth > 2) && hasfocus && (blockKey === anchorFocusKey) && (contentFocusAt === 2)
        const longMentionOnOther = (contentLenth > 2) && hasfocus && (blockKey === anchorFocusKey) && (contentFocusAt !== 2) && (contentFocusAt > 0) && (contentFocusAt <= contentLenth)

        const longMentionOff = (contentLenth > 2) && ((!hasfocus) || (blockKey !== anchorFocusKey) || (contentFocusAt <= 0) || (contentFocusAt > contentLenth))


        if (shortMentionOn) {
          newContent = newContent.createEntity("shortMentionOn", "MUTABLE", { mentionType: "shortMentionOn" });
          let entityKey = newContent.getLastCreatedEntityKey();
          newSelection = newSelection.merge({
            anchorKey: blockKey,
            focusKey: blockKey,
            anchorOffset: start,
            focusOffset: end,
            isBackward: false,
            hasFocus: false,
          })

          newContent = Modifier.applyEntity(newContent, newSelection, entityKey)

        }
        else if (shortMentionOff) {
          newContent = newContent.createEntity("shortMentionOff", "MUTABLE", { mentionType: "shortMentionOff" });
          let entityKey = newContent.getLastCreatedEntityKey();
          newSelection = newSelection.merge({
            anchorKey: blockKey,
            focusKey: blockKey,
            anchorOffset: start,
            focusOffset: end,
            isBackward: false,
            hasFocus: false,
          })

          newContent = Modifier.applyEntity(newContent, newSelection, entityKey)

        }
        else if (longMentionOnAt) {

          createTag("longMentionOnAt")

        }
        else if (longMentionOnOther) {

          createTag("longMentionOnOther")

        }
        else if (longMentionOff) {
          createTag("longMentionOff")
        }



        function createTag(tagName) {

          newContent = newContent.createEntity(`${tagName}_HEAD`, "MUTABLE", { mentionType: `${tagName}_HEAD` });
          let mentionHeadKey = newContent.getLastCreatedEntityKey();
          newSelection = newSelection.merge({
            anchorKey: blockKey,
            focusKey: blockKey,
            anchorOffset: start,
            focusOffset: start + 2,
            isBackward: false,
            hasFocus: false,
          })

          newContent = Modifier.applyEntity(newContent, newSelection, mentionHeadKey)

          newContent = newContent.createEntity(`${tagName}_BODY`, "MUTABLE", { mentionType: `${tagName}_BODY` });
          let mentionBodyKey = newContent.getLastCreatedEntityKey();
          newSelection = newSelection.merge({
            anchorKey: blockKey,
            focusKey: blockKey,
            anchorOffset: start + 2,
            focusOffset: end,
            isBackward: false,
            hasFocus: false,
          })

          newContent = Modifier.applyEntity(newContent, newSelection, mentionBodyKey)


          newContent = newContent.mergeEntityData(
            mentionHeadKey,
            {
              mentionHeadKey, mentionBodyKey,
              person: blockText.substring(start, end).replace(" @", ""),
              //  imgurl: `url(${url}/avatar/downloadavatar/${blockText.substring(start, end).replace(" @", "")})`
              // imgurl: `${url}/${blockText.substring(start, end).replace(" @", "")}).svg`

            }
          )

          newContent = newContent.mergeEntityData(
            mentionBodyKey,
            {
              mentionHeadKey, mentionBodyKey,
              person: blockText.substring(start, end).replace(" @", ""),
              //     imgurl: `url(${url}/avatar/downloadavatar/${blockText.substring(start, end).replace(" @", "")})`
              //   imgurl: `${url}/${blockText.substring(start, end).replace(" @", "")}).svg`

            }
          )
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
          component: Mention
        }
      ],

    }
  }

}