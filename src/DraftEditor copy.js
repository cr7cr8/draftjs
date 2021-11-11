import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo } from 'react';



import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';


import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';


import { stateToHTML } from 'draft-js-export-html';


//import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { Avatar, Chip, Popover, Typography, Container, CssBaseline, Paper, Grow, Zoom, Collapse, Fade, Slide, Button } from "@material-ui/core";

import ToolButton from "./ToolButton"

import { makeStyles, useTheme, ThemeProvider, withTheme } from '@material-ui/styles';



import { withContext } from "./ContextProvider"

import classNames from "classnames"

import { AvatarChip, TwoLineLabel, AvatarLogo } from "./AvatarLogo"


import createMentionPlugin from './MentionPlugin';
import createEmojiPlugin from './EmojiPlugin';
import createImagePlugin from './ImagePlugin';
import createLinkPlugin from './LinkPlugin';


import ToolBlock from "./ToolBlock";
import ColorBlock, { markingColorBlock } from "./ColorBlock";
import EditingBlock, { markingEditingBlock } from "./EditingBlock";


import styled from "styled-components"

import { FontBar, taggingFontBar } from "./FontBar"

import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";



import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
const { hasCommandModifier } = KeyBindingUtil;
const initialState = { entityMap: {}, blocks: [] };

const { mentionPlugin, taggingMention, checkShowing } = createMentionPlugin()
const { emojiPlugin, EmojiPanel } = createEmojiPlugin()
const { imagePlugin, ImagePanel, markingImageBlock,  /* deleteImageBlock, setImageBlockData*/ } = createImagePlugin()





export default withContext(function DraftEditor({ ctx, ...props }) {




  const { editorState, setEditorState, editorRef, imageBlockObj, setImageBlockObj, gradientStyleArr, bgImageObj, showHint, showFontBar,
    setShowFontBar, tabValue, setTabValue, panelColor, setPanelColor, editorBlockKeyArr } = ctx
  const [readOnly, setReadOnly] = useState(false)

  const theme = useTheme()


  const toolButtonRef = useRef()


  useLayoutEffect(function () {

    // if ((left === "50%") && (tabValue !== 3)) {
    //   setTabValue(3)
    // }

    // document.querySelectorAll(`span[class*="${theme.lgTextCss}"]:not(span[style*="--font-size-large"])`).forEach(
    //   item => {
    //     item.classList.remove(theme.lgTextCss)
    //   }
    // )


    document.querySelectorAll(`span[class*="${theme.lgTextCss}"]`).forEach(
      item => {
        if (Object.values(item.style).includes("--font-size-large")) { return }
        else {
          item.classList.remove(theme.lgTextCss)
        }

      }
    )


    document.querySelectorAll('span[style*="--font-size-large"]').forEach(
      item => {

        if (item.parentElement && item.parentElement.getAttribute("data-mention-head")) {
          // console.log(item.parentElement.getAttribute("data-mention-head"))
        }
        else {
          item.className = theme.lgTextCss
        }

      }
    )


    ///////////////////////////////////////


    // document.querySelectorAll(`span[class*="${theme.smTextCss}"]:not(span[style*="--font-size-small"])`).forEach(
    //   item => {
    //     item.classList.remove(theme.smTextCss)
    //   }
    // )

    document.querySelectorAll(`span[class*="${theme.smTextCss}"]`).forEach(
      item => {
        if (Object.values(item.style).includes("--font-size-small")) { return }
        else {
          item.classList.remove(theme.smTextCss)
        }

      }
    )



    document.querySelectorAll('span[style*="--font-size-small"]').forEach(
      item => {
        if (item.parentElement && item.parentElement.getAttribute("data-mention-head")) {
          //console.log(item.parentElement.getAttribute("data-mention-head"))
        }
        else {
          item.className = theme.smTextCss
        }
      }
    )

    // const selection = editorState.getSelection()
    // const startKey = selection.getStartKey()

    // const element = document.querySelector(`div[data-offset-key*="${startKey}"]`)
    // const bound = element && element.getBoundingClientRect()

    // const bound2 = editorRef.current.editor.editor.getBoundingClientRect()


    // //console.log(startKey,element)

    // //console.log(toolButtonRef)
    //  toolButtonRef.current && toolButtonRef.current.setTop(bound.top - 300)


  })





  const toolButton = useState(React.createElement(ToolButton, { editorState, setEditorState }))


  return (

    <React.Fragment>

      <Collapse in={ctx.showEmojiPanel} unmountOnExit={true} style={{ opacity: ctx.showEmojiPanel ? 1 : 0, transitionProperty: "height, opacity", }}>
        <EmojiPanel />
      </Collapse>
      {/* </Fade> */}

      <Paper style={{ position: "relative", wordBreak: "break-all" }} >

        <ToolButton {...{ editorState, setEditorState, toolButtonRef }} />

        {ctx.showFontBar && <FontBar {...{ gradientStyleArr, editorState, setEditorState, editorRef, bgImageObj, tabValue, setTabValue, panelColor, setPanelColor, }} />}
        <Editor

          // onFocus={function (e, two) {
          //   console.log(two)
          // }}
          // onBlur={function (...args) {
          //   console.log(args.length)
          // }}





          readOnly={readOnly}
          ref={function (element) { editorRef.current = element; }}
          editorState={editorState}

          onChange={function (newState, { ...props }) {



            // newState = taggingFontBar(newState)
            newState = taggingMention(showHint, newState)

            //  setShowFontBar(!newState.getSelection().isCollapsed())

            //  setShowFontBar(true)




            setEditorState(newState)
          }}

          plugins={[mentionPlugin, emojiPlugin, imagePlugin]}


          // placeholder="hihihi"
          preserveSelectionOnBlur={true}

          customStyleMap={{

            // LARGE:{
            //   color:"red"
            // }



          }}

          customStyleFn={function (style, block) {

            const styleNameArr = style.toArray();

            const styleObj = {}
            let colorString = ""

            styleNameArr.forEach(item => {
              if (item[0] === "#") {
                styleObj.color = item
              }
            })

            if (styleNameArr.includes("FONTBAR")) {

              // block.findStyleRanges(
              //   (metaArr) => { return metaArr.hasStyle("FONTBAR") },    (start, end) => { /*console.log(start, end)*/ }
              // )
              // return {
              // only style attributes working

              //  color:"red",
              //  fontSize:"8rem",
              //  position: "relative",
              //  "--font-bar": block.getKey()
              // }

              styleObj.position = "relative"
              styleObj["--font-bar"] = block.getKey()

            }
            if (styleNameArr.includes("LARGE")) {

              styleObj["--font-size-large"] = "large"

              //  styleObj.color = "red"
            }
            if (styleNameArr.includes("SMALL")) {

              styleObj["--font-size-small"] = "small"

              //  styleObj.color = "red"
            }



            if (styleNameArr.length > 0) {
              return styleObj
            }


          }}

          blockStyleFn={function (block) {
            const blockText = block.getText()
            const blockData = block.getData().toObject()
            const blockType = block.getType()
            const blockKey = block.getKey()
            const startKey = editorState.getSelection().getStartKey()

            const randomNum = Math.floor(Math.random() * 2) % 2 === 1

            const allClassName = classNames({

              "image-block-figure": ((blockType === "atomic") && (blockText === "imageBlockText")) || (blockType === "imageBlock"),
              "text-center": blockData.centerBlock,
              "text-right": blockData.rightBlock,
              "unselectable": !blockText,
              "unstyled-block": true,// blockType === "unstyled" && randomNum,
              "unstyled-block2": false,//blockType === "unstyled" && !randomNum

            })

            return allClassName


          }}



          blockRenderMap={
            Immutable.Map({
              "colorBlock": {
                element: "div",
                wrapper: <ColorBlock editorState={editorState}
                  setEditorState={setEditorState} editorRef={editorRef}
                  showFontBar={showFontBar}
                  setShowFontBar={setShowFontBar}
                  gradientStyleArr={gradientStyleArr}
                  markingImageBlock={markingImageBlock}
                  markingColorBlock={markingColorBlock}
                  editorBlockKeyArr={editorBlockKeyArr}
                  toolButton={toolButton}
                />,
              },

              "editingBlock": {
                element: "div",
                //wrapper: <></>
                wrapper: <EditingBlock
                  editorState={editorState}
                  setEditorState={setEditorState} editorRef={editorRef}
                  showFontBar={showFontBar}
                  setShowFontBar={setShowFontBar}
                  gradientStyleArr={gradientStyleArr}
                  markingImageBlock={markingImageBlock}
                  markingColorBlock={markingColorBlock}
                  toolButtonRef={toolButtonRef}

                />


              }
            })
          }





          blockRendererFn={function (block) {

            const text = block.getText()
            const data = block.getData().toObject()
            const type = block.getType()
            const blockKey = block.getKey()
            const selection = editorState.getSelection()

            if ((type === "unstyled")) {

              return {
                component: ToolBlock,
                editable: true,

                props: {
                  editorRef,
                  readOnly,
                  setReadOnly,
                  markingImageBlock,
                  markingColorBlock,
                  editorState,
                  setEditorState,
                  taggingFontBar,
                  gradientStyleArr,
                  bgImageObj,
                  showFontBar,
                  setShowFontBar,
                  toolButtonRef,
                }
              }
            }


            if (type === "imageBlock") {

              return {

                component: ImagePanel,
                editable: false,
                props: {
                  imageBlockObj,
                  setImageBlockObj,
                  editorRef,
                  //blockKey: block.getKey(),

                  className: "image-block",


                },
              }
            }



          }}


          keyBindingFn={function (e, { getEditorState, setEditorState, ...obj }) {
            //return undefined to carry on
            const editorState = getEditorState()
            const selection = editorState.getSelection();

            const startKey = selection.getStartKey()
            const startOffset = selection.getStartOffset()

            const endKey = selection.getEndKey()
            const endOffset = selection.getEndOffset()

            const anchorKey = selection.getAnchorKey()
            const anchorOffset = selection.getAnchorOffset()
            const focusKey = selection.getFocusKey()
            const focusOffset = selection.getFocusOffset()

            const isCollapsed = selection.isCollapsed()
            const isInOrder = !selection.getIsBackward()
            const hasFocus = selection.getHasFocus()

            // console.log(startKey, startOffset, endKey, endOffset, anchorKey, anchorOffset, focusKey, focusOffset, isCollapsed, isInOrder, hasFocus)


            const contentState = editorState.getCurrentContent();
            const allBlocks = contentState.getBlockMap()

            const block = contentState.getBlockForKey(startKey);
            const blockText = block.getText()

            const keyBefore = contentState.getKeyBefore(startKey)
            const blockBefore = contentState.getBlockBefore(startKey)

            const firstBlockKey = allBlocks.slice(0, 1).toArray().shift().getKey()


            if ((e.keyCode === 8) && (isCollapsed) && (blockText.length === 0) && (startOffset === 0) && (startKey !== firstBlockKey)) {

              if (!contentState.getKeyAfter(startKey)) {
                return undefined
              }
              else {
                //     alert("done")



                let newContentState = Modifier.replaceText(contentState, selection, " ")
                let es = EditorState.push(editorState, newContentState, "insert-characters")

                // let newSelection = selection.merge({
                //   anchorOffset: 0,
                //   focusOffset: 0,
                // })

                es = deleteBlock2(es, startKey, setEditorState)

                let newSelection = es.getSelection()



                newSelection = newSelection.merge({

                  anchorOffset: newSelection.getAnchorOffset() + 0,  //hilight +0   ,not hilight +1
                  focusOffset: newSelection.getFocusOffset() + 1
                })

                es = EditorState.forceSelection(es, newSelection)

             //   RichUtils.handleKeyCommand(es,"deletemore")
                 setEditorState(es)
                
                setTimeout(() => {
                  RichUtils.handleKeyCommand(editorState,"deletemore")
          
                }, 10);
         


                return "deledddtemore"

                
              }

            }
            else if ((e.keyCode === 8) && (isCollapsed) && (startOffset === 0) && (startKey !== firstBlockKey)) {


             
              deleteBlock1(editorState, startKey, setEditorState)


              // const content = deleteBlock2(contentState, startKey)
              // const newState = EditorState.push(editorState, content, 'remove-block');
              // setEditorState(newState)

              return ("done")
            }





            if (checkShowing() && e.keyCode === 38) {
              return undefined
            }
            if (checkShowing() && e.keyCode === 40) {
              return undefined
            }

            // if ((block.getType() === "imageBlock")) {
            //   return "cancel-delete"
            // }
            else if (e.shiftKey || hasCommandModifier(e) || e.altKey) {
              return getDefaultKeyBinding(e);
            }
            return undefined

          }}

          handleKeyCommand={function (command, editorState, evenTimeStamp, { getEditorState }) {
            // return undefiend and return not-handled will be igonred in handleKeyCommand
            

            if (command === "deletemore") { 


alert("fff")


              setEditorState(editorState)


                //  alert("dfdf")
            }

            if (command === "backspace") {    //builtin command when hit backspace if not binded in keypress

              



            }


            if (command === "moveUp" || command === "moveDown") {
              const selection = editorState.getSelection();
              const startKey = selection.getStartKey();
              const endKey = selection.getEndKey();
              const isCollapsed = selection.isCollapsed()


              const upperBlockKey = editorState.getCurrentContent().getKeyBefore(startKey)
              const block = editorState.getCurrentContent().getBlockForKey(command === "moveUp" ? startKey : endKey)
              const lowerBlockKey = editorState.getCurrentContent().getKeyAfter(endKey)

              if ((command === "moveUp" && upperBlockKey) || ((command === "moveDown" && lowerBlockKey))) {

                const adjacentBlock = command === "moveUp"
                  ? editorState.getCurrentContent().getBlockBefore(startKey)
                  : editorState.getCurrentContent().getBlockAfter(endKey)
                const text = adjacentBlock.getText()

                let newSelection = selection.merge({

                  ...isCollapsed && { anchorKey: adjacentBlock.getKey() },
                  ...isCollapsed && { anchorOffset: text ? text.length : 0 },

                  focusKey: adjacentBlock.getKey(),
                  focusOffset: adjacentBlock.getKey() ? text.length : 0,

                  isBackward: false,
                  hasFocus: true,
                })
                //  externalES = EditorState.push(externalES, newContent, "insert-characters");
                let es = EditorState.forceSelection(editorState, newSelection)
                setEditorState(es)
              }
              else if ((command === "moveUp" && !upperBlockKey) || ((command === "moveDown" && !lowerBlockKey))) {


                const text = block.getText()

                let newSelection = selection.merge({
                  anchorKey: block.getKey(),
                  anchorOffset: command === "moveUp" ? 0 : text ? text.length : 0,
                  focusKey: block.getKey(),
                  focusOffset: command === "moveUp" ? 0 : text ? text.length : 0,
                  isBackward: false,
                  hasFocus: true,
                })
                let es = EditorState.forceSelection(editorState, newSelection)
                setEditorState(es)
              }

            }





            if (command === "bold") {

              setEditorState(RichUtils.handleKeyCommand(editorState, command))
            }
            if (command === "italic") {

              setEditorState(RichUtils.handleKeyCommand(editorState, command))
            }
            if (command === "underline") {

              setEditorState(RichUtils.handleKeyCommand(editorState, command))
            }
            return 'not-handled';

          }}

          handleBeforeInput={function (aaa, editorState) {

            //            console.log(aaa)
            //            alert(aaa)
          }}

          handleReturn={function (e, newState, { getEditorState, setEditorState }) {
            const editorState = newState;// getEditorState()
            const selectionState = editorState.getSelection();
            let contentState = newState.getCurrentContent();
            const block = contentState.getBlockForKey(selectionState.getStartKey());
            //    console.log(block.getType())
            if (block.getType() === "imageBlock") {
              return "handled"
            }
            // if ((block.getType() === "colorBlock") && (!checkShowing())) {



            //   // const es = RichUtils.insertSoftNewline(newState)

            //   // setEditorState(es)
            //   return "not-handled"

            // }


          }}


          stripPastedStyles={true}
        // handlePastedText={function (text, html, editorState, props) {

        // //  alert(text)
        // //   return "handled"
        //   return "un-handled"
        // }}



        // handleBeforeInput={function (chars, editorState, evenTimeStamp, { setEditorState }) {
        //   const selectionState = editorState.getSelection();
        //   const contentState = editorState.getCurrentContent();
        //   const block = contentState.getBlockForKey(selectionState.getStartKey());
        //     console.log(chars.length)
        // }}


        />

      </Paper>

      {/* <div style={{ whiteSpace: "pre-wrap", display: "flex", fontSize: 15 }}>
        {JSON.stringify(toPreHtml(editorState))}
      </div> */}

      {/* <AvatarChip personName="Fdsf"><TwoLineLabel lineTop="fdsff" lineDown="sdfe jdkljl ejkl" /></AvatarChip> */}
      <div style={{ whiteSpace: "pre-wrap", display: "flex", fontSize: 15 }}>

        {/* <div>{JSON.stringify(editorState.getCurrentContent().selectionBefore, null, 2)}</div>

        <div>{JSON.stringify(editorState.getCurrentContent().selectionAfter, null, 2)}</div> */}

        <div>{JSON.stringify(editorState.getCurrentContent(), null, 2)}</div>
        <hr />
        {/* <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()).entityMap, null, 2)}</div> */}
      </div>
      {/* <div style={{ whiteSpace: "pre-wrap", display: "flex", fontSize: 15 }}>

        <div>{JSON.stringify(imageBlockObj, null, 2)}</div>
        <hr />
        <div>{JSON.stringify(imageArr, null, 2)}</div>
      </div> */}
    </React.Fragment>
  )



})






function deleteBlock1(store, blockKey, setEditorState) {
  // const editorState = store.getEditorState();

  const editorState = store;
  let content = editorState.getCurrentContent();

  const beforeKey = content.getKeyBefore(blockKey);
  const beforeBlock = content.getBlockForKey(beforeKey);
  const beforeBlockText = beforeBlock && beforeBlock.getText();
  // Note: if the focused block is the first block then it is reduced to an
  // unstyled block with no character
  if (beforeBlock === undefined) {
    const targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 1,
    });
    // change the blocktype and remove the characterList entry with the sticker
    content = Modifier.removeRange(content, targetRange, 'backward');
    content = Modifier.setBlockType(
      content,
      targetRange,
      'unstyled'
    );
    const newState = EditorState.push(editorState, content, 'remove-block');

    // force to new selection
    const newSelection = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 0,
    });
    return EditorState.forceSelection(newState, newSelection);
  }


  //alert(`beforeTextLength ${beforeBlock.getText().length}  anchorKey ${beforeKey}  anchorOffset: ${beforeBlock.getLength()}   focusKey ${blockKey}  `)

  const targetRange = new SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),//beforeBlockText && beforeBlockText.length || 0,// beforeBlock.getLength(),
    focusKey: blockKey,
    focusOffset: 0,   // one in colorblock or editingBlock
  });

  content = Modifier.removeRange(content, targetRange, 'backward');
  const newState = EditorState.push(editorState, content, 'remove-block');



  // force to new selection

  const newSelection = new SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),
    focusKey: beforeKey,
    focusOffset: beforeBlock.getLength(),
  });


  setEditorState(EditorState.forceSelection(newState, newSelection))



  // return EditorState.acceptSelection(newState, newSelection);
}


function deleteBlock2(store, blockKey) {
  // const editorState = store.getEditorState();

  const editorState = store;
  let content = editorState.getCurrentContent();

  const beforeKey = content.getKeyBefore(blockKey);
  const beforeBlock = content.getBlockForKey(beforeKey);
  const beforeBlockText = beforeBlock && beforeBlock.getText();
  // Note: if the focused block is the first block then it is reduced to an
  // unstyled block with no character
  if (beforeBlock === undefined) {
    const targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 1,
    });
    // change the blocktype and remove the characterList entry with the sticker
    content = Modifier.removeRange(content, targetRange, 'backward');
    content = Modifier.setBlockType(
      content,
      targetRange,
      'unstyled'
    );
    const newState = EditorState.push(editorState, content, 'remove-block');

    // force to new selection
    const newSelection = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 0,
    });
    return EditorState.forceSelection(newState, newSelection);
  }


  //alert(`beforeTextLength ${beforeBlock.getText().length}  anchorKey ${beforeKey}  anchorOffset: ${beforeBlock.getLength()}   focusKey ${blockKey}  `)

  const targetRange = new SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),//beforeBlockText && beforeBlockText.length || 0,// beforeBlock.getLength(),
    focusKey: blockKey,
    focusOffset: 0,   // one in colorblock or editingBlock
  });

  content = Modifier.removeRange(content, targetRange, 'backward');
  const newState = EditorState.push(editorState, content, 'remove-block');



  // force to new selection

  const newSelection = new SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),
    focusKey: beforeKey,
    focusOffset: beforeBlock.getLength(),
  });


  //setEditorState(EditorState.forceSelection(newState, newSelection))



  return EditorState.forceSelection(newState, newSelection);
}












