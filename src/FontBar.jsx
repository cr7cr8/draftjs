import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Avatar, Chip, Popover, Typography, Container, CssBaseline, Paper, Grow, Zoom, Collapse, Fade, Slide, Button, } from "@material-ui/core";
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';




export function FontBar({ editorState, setEditorState, ...props }) {
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)

  useEffect(function () {

    const fontBar = document.querySelector('span[style*="--font-bar"]')

    if (fontBar) {
      const { x, y } = fontBar.getBoundingClientRect()
      if ((x === left) && (y === top)) {
      }
      else {
        setLeft(x); setTop(y)
      }
    }
    else {
      if ((left === 0) && (top === 0)) {
      }
      else {
        setLeft(0); setTop(0)
      }
    }
  })



  return (
    <Paper style={{
      top, left,
      width: "300px", height: "3rem", position: "fixed", backgroundColor: "#aaf", zIndex: 100, transform: "translateY(-100%)",



    }} 
    
    onClick={function(e){ e.preventDefault();e.stopPropagation();  alert("fdsfa")}}
    
    >afddsfsdf</Paper>
  )
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
