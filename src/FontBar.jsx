import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Avatar, Chip, Popover, Typography, Container, CssBaseline, Paper, Grow, Zoom, Collapse, Fade, Slide, Button, } from "@material-ui/core";
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';

import ReactDOM from 'react-dom';
import { transform } from '@babel/core';


export function FontBar({ editorState, setEditorState, editorRef, ...props }) {
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [taggingWidth, setTaggingWidth] = useState(0)

  useEffect(function () {





    const fontBar = document.querySelector('span[style*="--font-bar"]')




    // const div = document.createElement("div")
    // div.innerText = "bbb"

    // div.style.backgroundColor = "pink";
    // div.style.position = "absolute";
    // div.style.width = "fit-content";
    // div.style.backgroundColor = "pink";
    // div.style.transform = "translateY(-200%)";

    // div.addEventListener("click", function (e) {
    //   e.preventDefault()
    //   e.stopPropagation()
    //   alert("adfs")
    // })

    // if (fontBar) {
    //   fontBar.parentNode.insertBefore(div, fontBar.nextSibling);
    // }
    // return function () {
    //   div.remove()
    // }


    if (fontBar) {
      const { x: fontBarX, y: fontBarY, width } = fontBar.getBoundingClientRect()

      console.log(width)

      const { x: editorRefX, y: editorRefY } = editorRef.current.editor.editor.getBoundingClientRect()

      const x = Number(fontBarX) - Number(editorRefX)
      const y = Number(fontBarY) - Number(editorRefY)

      //console.log(fontBar.getClientRects(), window.getComputedStyle(fontBar))


      // if ((x === left) && (y === top)) {
      // }
      // else {


        setLeft(x); setTop(y); setTaggingWidth(width)
    //  }
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
      width: "300px", height: "3rem", position: "absolute", backgroundColor: "#aaf", zIndex: 100, transform: `translateX( calc( -50% + ${taggingWidth/2}px ) )   translateY(-100%)`,
      transitionProperty: "top ,left",
      display: (top === 0 && left === 0) ? "none" : "block",


    }}

      onClick={function (e) { e.preventDefault(); e.stopPropagation(); alert("fdsfa") }}

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
