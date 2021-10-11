import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';

import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';


import { Avatar, Chip, Popover, Typography, Container, CssBaseline, Paper, Grow, Zoom, Collapse, Fade, Slide, Button, IconButton } from "@material-ui/core";
import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';


import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';

import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatColorTextIcon from '@material-ui/icons/FormatColorText';

import Immutable from "immutable"

import ColorLensTwoToneIcon from '@material-ui/icons/ColorLensTwoTone';

export function FontBar({ editorState, setEditorState, editorRef, ...props }) {




  let isAllTextBlock = getChoosenBlocks(editorState).every((block, key, ...props) => {
    return block.getType() === "unstyled"
  })




  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [taggingWidth, setTaggingWidth] = useState(0)

  const theme = useTheme()





  
  useEffect(function () {


   // setTimeout(() => {
      const fontBar = document.querySelector('span[style*="--font-bar"]')
      if (fontBar) {
        const { x: fontBarX, y: fontBarY, width } = fontBar.getBoundingClientRect()
        const { x: editorRefX, y: editorRefY } = editorRef.current.editor.editor.getBoundingClientRect()
        const x = Number(fontBarX) - Number(editorRefX)
        const y = Number(fontBarY) - Number(editorRefY)

        setLeft(x); setTop(y); setTaggingWidth(width)

      }
      else { setLeft(0); setTop(0) }

       


  })




  return (
    <Paper
      style={{
        top, left,
        display: (top === 0 && left === 0) ? "none" : "block",

        width: "fit-content",
        backgroundColor: "#acf",
        borderRadius: "1000px",

        position: "absolute",
        zIndex: 100,
        transform: `translateX( calc( -50% + ${taggingWidth / 2}px ) )   translateY(-100%)`,
        transitionProperty: "top ,left",
        transitionDuration: "100ms",
      }}
      onClick={function (e) { }}
    >

      <div>
        <IconButton className={theme.sizeCss}
          onClick={function (e) {
            e.preventDefault(); e.stopPropagation();
            setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"))
          }}>
          <FormatBoldIcon className={theme.sizeCss} />
        </IconButton>

        <IconButton className={theme.sizeCss}
          onClick={function (e) {
            e.preventDefault(); e.stopPropagation();
            setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"))
          }}>
          <FormatItalicIcon className={theme.sizeCss} />
        </IconButton>

        <IconButton className={theme.sizeCss}
          onClick={function (e) {
            e.preventDefault(); e.stopPropagation();
            setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"))
          }}>
          <FormatUnderlinedIcon className={theme.sizeCss} />
        </IconButton>

        <IconButton className={theme.sizeCss}
          onClick={function (e) {
            e.preventDefault(); e.stopPropagation();
            // setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"))
          }}>
          <FormatAlignCenterIcon className={theme.sizeCss} />
        </IconButton>

        <IconButton className={theme.sizeCss}
          onClick={function (e) {
            e.preventDefault(); e.stopPropagation();
            // setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"))
          }}>
          <FormatAlignRightIcon className={theme.sizeCss} />
        </IconButton>

        <IconButton className={theme.sizeCss}
          onClick={function (e) {
            e.preventDefault(); e.stopPropagation();
            // setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"))
          }}>
          <FormatColorTextIcon className={theme.sizeCss} />
        </IconButton>






        {isAllTextBlock && <IconButton className={theme.sizeCss}
          onClick={function (e) {
            onColorClick(e, editorState, setEditorState, "pink")
          }}
        >
          <ColorLensTwoToneIcon className={theme.sizeCss} />
        </IconButton>}

      </div>

    </Paper >
  )
}



function getChoosenBlocks(editorState) {

  const startKey = editorState.getSelection().getStartKey()
  const endKey = editorState.getSelection().getEndKey()

  let shouldReturn = false;
  const allBlocks = editorState.getCurrentContent().getBlockMap().filter(item => {

    if (item.getKey() === startKey) {
      shouldReturn = true
      return true
    }
    else if (item.getKey() === endKey) {
      shouldReturn = false
      //  return true
      return Boolean(item.getText())
    }
    else {
      return startKey === endKey ? false : shouldReturn
    }
  })

  return allBlocks
}




function onColorClick(e, editorState, setEditorState, color = "brown") {
  e.preventDefault(); e.stopPropagation();

  let selection = editorState.getSelection()

  const startKey = selection.getStartKey()
  const endKey = selection.getEndKey()

  let allBlocks = editorState.getCurrentContent()

  let blockList = Immutable.List()
  let blockText = ""


  allBlocks = getChoosenBlocks(editorState)

  allBlocks.forEach((block, ...props) => {
    const { characterList, data, key, text, type } = block.toObject()
    blockText = blockText + text + "\n"
    blockList = blockList.concat(characterList.push(CharacterMetadata.create()))
  })

  blockText = blockText.substr(0, blockText.length - 1)
  blockList = blockList.pop()

  const singleBlock = editorState.getCurrentContent().getBlockForKey(startKey)
    .merge({
      characterList: blockList,
      text: blockText,
      type: "colorBlock",
      key: startKey,
      data: Immutable.Map({ colorBlock: true, color: color })
    })

  let shouldReturn = true
  const arr = editorState.getCurrentContent().getBlocksAsArray().map(item => {
    return item.getKey() !== startKey ? item : singleBlock
  }).filter(item => {
    if (startKey === endKey) {
      return true
    }
    else if (item.getKey() === startKey) {
      shouldReturn = false
      return true
    }
    else if (item.getKey() === endKey) {
      shouldReturn = true
      // return false
      return !Boolean(item.getText())
    }
    else {
      return shouldReturn
    }
  })

  let es = EditorState.push(
    editorState,
    ContentState.createFromBlockArray(arr)
  )

  const newSelection = es.getSelection().merge({

    anchorKey: startKey,
    anchorOffset: 0,
    focusKey: startKey,
    focusOffset: blockText.length,
    isBackward: false,
    hasFocus: true,
  })

  es = EditorState.acceptSelection(es, newSelection)
  setEditorState(es)
}






export function taggingFontBar(editorState) {

  const oldSelection = editorState.getSelection();
  let allBlocks = editorState.getCurrentContent();
  let newSelection = editorState.getSelection();


  allBlocks.getBlockMap().forEach(function (block) {

    const [blockKey, blockType, blockText, metaArr] = block.toArray()

    metaArr.forEach(function (item, index) {

      // console.log(item.getStyle().toArray(), item.hasStyle("BOLD"))
      if (item.hasStyle("FONTBAR")) {
        newSelection = newSelection.merge({
          anchorKey: blockKey,
          anchorOffset: index,
          focusKey: blockKey,
          focusOffset: index + 1,
          isBackward: false,
          hasFocus: false,
        })
        allBlocks = Modifier.removeInlineStyle(allBlocks, newSelection, "FONTBAR")

      }
    })
  })


  if (oldSelection.isCollapsed()) {

    editorState = EditorState.push(editorState, allBlocks, "change-inline-style");
    editorState = EditorState.forceSelection(editorState, oldSelection);
    return editorState

  }
  else {


    allBlocks = Modifier.applyInlineStyle(allBlocks, oldSelection, "FONTBAR")
    editorState = EditorState.push(editorState, allBlocks, "change-inline-style");
    editorState = EditorState.forceSelection(editorState, oldSelection);

    return editorState
  }


}
