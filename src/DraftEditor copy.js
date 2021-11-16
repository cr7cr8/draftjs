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
    setShowFontBar, tabValue, setTabValue, editorBlockKeyArr, editingBlockKeyArrRef,

    panelColorGroupNum, setPanelColorGroupNum,

    panelValue,
    setPanelValue, } = ctx
  const [readOnly, setReadOnly] = useState(false)

  const theme = useTheme()


  const toolButtonRef = useRef()


  const [currentBlockKey, setCurrentBlockKey] = useState(null)
  const specialBakcSpace = useRef(false)


  function adjustToolButtonPos() {


    const element = document.querySelector(`div[data-offset-key*="${currentBlockKey}-0-0"]`)

    // const element = editorBlockRef.current._node
    const bound = element && element.getBoundingClientRect()
    const bound2 = editorRef.current && editorRef.current.editor && editorRef.current.editor.editor.getBoundingClientRect()
    bound && bound2 && toolButtonRef.current && toolButtonRef.current.setTop(bound.top - bound2.top)

  }



  useEffect(function () {

    adjustToolButtonPos()

    window.addEventListener("resize", adjustToolButtonPos)

    return function () {
      window.removeEventListener("resize", adjustToolButtonPos)

    }

  })






  return (

    <React.Fragment>

      <Collapse in={ctx.showEmojiPanel} unmountOnExit={true} style={{ opacity: ctx.showEmojiPanel ? 1 : 0, transitionProperty: "height, opacity", }}>
        <EmojiPanel />
      </Collapse>

      <Paper style={{ position: "relative", wordBreak: "break-all" }} >

        <ToolButton {...{ editorState, setEditorState, toolButtonRef, currentBlockKey }} />

        {ctx.showFontBar && <FontBar />}
        <Editor



          onFocus={function (e, two) {
            //  console.log(two)

            // console.log(e.target)
            // const element = editorBlockRef.current._node
            // const bound = element.getBoundingClientRect()
            // const bound2 = editorRef.current.editor.editor.getBoundingClientRect()
            // startKey === blockKey && selection.hasFocus && toolButtonRef.current && toolButtonRef.current.setTop(bound.top - bound2.top)

          }}
          // onBlur={function (...args) {
          //   console.log(args.length)
          // }}


          readOnly={readOnly}
          ref={function (element) { editorRef.current = element; }}
          editorState={editorState}

          onChange={function (newState, { ...props }) {

            // console.log(Date.now())

            // newState = taggingFontBar(newState)
            newState = taggingMention(showHint, newState)
            newState.getCurrentContent()

            const selection = newState.getSelection()
            const isCollapsed = selection.isCollapsed()
            const startKey = selection.getStartKey()

            if (specialBakcSpace.current) {
              const newContentState = Modifier.replaceText(newState.getCurrentContent(), newState.getSelection(), "")
              newState = EditorState.push(newState, newContentState, "insert-characters")
              specialBakcSpace.current = false
            }
            isCollapsed && setCurrentBlockKey(startKey)
            setShowFontBar(!newState.getSelection().isCollapsed())
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
            styleNameArr.forEach(item => {
              if (item[0] === "#") {
                styleObj.color = item
              }
              if (item.indexOf("charSize") >= 0) {
                console.log(item)
                styleObj["--charSize" + [...item].pop()] = item
              }
            })

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


            if ((blockType !== "editingBlock") && (editingBlockKeyArrRef.current.includes(blockKey))) {
              editingBlockKeyArrRef.current = editingBlockKeyArrRef.current.filter(item => item !== blockKey)
            }

            const allClassName = classNames({

              "image-block-figure": blockType === "imageBlock",
              "text-center": blockData.centerBlock,
              "text-right": blockData.rightBlock,
              "unselectable": blockType === "imageBlock",

              "unstyled-block2": false,//blockType === "unstyled" && !randomNum

            })

            return allClassName


          }}

          blockRenderMap={
            Immutable.Map({
              // "colorBlock": {
              //   element: "div",
              //   wrapper: <ColorBlock editorState={editorState}
              //     setEditorState={setEditorState} editorRef={editorRef}
              //     showFontBar={showFontBar}
              //     setShowFontBar={setShowFontBar}
              //     gradientStyleArr={gradientStyleArr}
              //     markingImageBlock={markingImageBlock}
              //     markingColorBlock={markingColorBlock}
              //     editorBlockKeyArr={editorBlockKeyArr}
              //     toolButton={toolButton}
              //   />,
              // },

              // "unstyled": {
              //   element: "div",
              //   wrapper: <ToolBlock />

              // },


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
              },



            })
          }

          blockRendererFn={function (block) {

            const text = block.getText()
            const data = block.getData().toObject()
            const type = block.getType()
            const blockKey = block.getKey()
            const selection = editorState.getSelection()

            // if ((type === "unstyled")) {

            //   return {
            //     component: ToolBlock,
            //     editable: true,

            //     props: {
            //       editorRef,
            //       readOnly,
            //       setReadOnly,
            //       markingImageBlock,
            //       markingColorBlock,
            //       editorState,
            //       setEditorState,
            //       taggingFontBar,
            //       gradientStyleArr,
            //       bgImageObj,
            //       showFontBar,
            //       setShowFontBar,
            //       toolButtonRef,
            //       currentBlockKey,
            //     }
            //   }
            // }


            if (type === "imageBlock") {

              return {

                component: ImagePanel,
                editable: false,
                props: {
                  imageBlockObj,
                  setImageBlockObj,
                  editorRef,
                  //blockKey: block.getKey(),
                  currentBlockKey,
                  setCurrentBlockKey,
                  editorState,
                  setEditorState,
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

              if ((!contentState.getKeyAfter(startKey) && (!isFirefox)) && false) {
                return undefined
              }
              else {
                //     alert("done")



                let newContentState = Modifier.replaceText(contentState, selection, "#")
                let es = EditorState.push(editorState, newContentState, "insert-characters")


                es = deleteBlock2(es, startKey, setEditorState)
                let newSelection = es.getSelection()

                newSelection = newSelection.merge({

                  anchorOffset: newSelection.getAnchorOffset() + 0,  //hilight +0   ,not hilight +1
                  focusOffset: newSelection.getFocusOffset() + 1
                })

                es = EditorState.forceSelection(es, newSelection)

                specialBakcSpace.current = true

                setCurrentBlockKey(es.getSelection().getStartKey())
                setEditorState(es)

                return "dummy"


              }

            }
            else if ((e.keyCode === 8) && (isCollapsed) && (startOffset === 0) && (startKey !== firstBlockKey)) {

              deleteBlock1(editorState, startKey, setEditorState)
              return ("done")
            }






            // if (isFirefox && (e.keyCode === 38) && !checkShowing()) {
            //   return "moveUp"
            // }

            // else if (isFirefox && (e.keyCode === 40) && !checkShowing()) {
            //   return "moveDown"
            // }


            else if (checkShowing() && e.keyCode === 38) {
              return undefined
            }
            else if (checkShowing() && e.keyCode === 40) {
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

            //  const newState = RichUtils.handleKeyCommand(editorState, command);



            if (command === "deletemore") {

              alert("fff")


              //RichUtils.handleKeyCommand(editorState, "deletemore")
              return editorState


              //  alert("dfdf")
            }

            // if (command === "backspace") {    //builtin command when hit backspace if not binded in keypress
            //   //   RichUtils.handleKeyCommand(editorState, "deletemore")
            // }


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
        />

      </Paper>

      {/* <div style={{ whiteSpace: "pre-wrap", display: "flex", fontSize: 15 }}>
        {JSON.stringify(toPreHtml(editorState))}
      </div> */}

      {/* <AvatarChip personName="Fdsf"><TwoLineLabel lineTop="fdsff" lineDown="sdfe jdkljl ejkl" /></AvatarChip> */}
      <div style={{ whiteSpace: "pre-wrap", display: "flex", fontSize: 15 }}>

        {/* <div>{JSON.stringify(editorState.getCurrentContent().selectionBefore, null, 2)}</div>

        <div>{JSON.stringify(editorState.getCurrentContent().selectionAfter, null, 2)}</div> */}

        {/* <div>{JSON.stringify(editorState.getCurrentContent(), null, 2)}</div>
        <hr /> */}
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












