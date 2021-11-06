import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo } from 'react';



import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';


import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';


import { stateToHTML } from 'draft-js-export-html';


//import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { Avatar, Chip, Popover, Typography, Container, CssBaseline, Paper, Grow, Zoom, Collapse, Fade, Slide, Button, } from "@material-ui/core";
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

import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
const { hasCommandModifier } = KeyBindingUtil;




const Div = styled.div.withConfig({

  shouldForwardProp: (prop, htmlAttributeCheckFn) => { return true }

})`

${props => {

    //  console.log(props)
    return {
      width: 100,
      height: 200,
      backgroundColor: "pink",
    }

  }}

`

const initialState = {
  entityMap: {},
  blocks: []
};
const { mentionPlugin, taggingMention, checkShowing } = createMentionPlugin()
const { emojiPlugin, EmojiPanel } = createEmojiPlugin()
const { imagePlugin, ImagePanel, markingImageBlock,  /* deleteImageBlock, setImageBlockData*/ } = createImagePlugin()



//const { fontBarPlugin, taggingFontBar } = createFontBarPlugin()


// const useStyles = makeStyles(function (theme) {

//   return {
//     editorPaperCss: (props) => {
//       return {
//         ...theme.breakpointsAttribute(["fontSize", theme.textSizeArr])
//       }
//     }
//   }
// })


const useStyles = makeStyles((theme) => {


  return {
    colorBlockCss: (data) => {
      return {
        backgroundImage: data.backgroundImage
      }
    }
  }

})



export default withContext(function DraftEditor({ ctx, ...props }) {
  //const theme = useTheme()

  const key = useRef(Math.random() + "")

  const { editorState, setEditorState, editorRef, imageBlockObj, setImageBlockObj, gradientStyleArr, bgImageObj, showHint, showFontBar,
    setShowFontBar, tabValue, setTabValue, panelColor, setPanelColor } = ctx
  const [readOnly, setReadOnly] = useState(false)

  const theme = useTheme()

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




  })


  const selection = editorState.getSelection()





  return (

    <React.Fragment key={key.current}>

      <Collapse in={ctx.showEmojiPanel} unmountOnExit={true} style={{ opacity: ctx.showEmojiPanel ? 1 : 0, transitionProperty: "height, opacity", }}>
        <EmojiPanel />
      </Collapse>
      {/* </Fade> */}

      <Paper style={{ position: "relative" }} >


        {ctx.showFontBar && <FontBar {...{ gradientStyleArr, editorState, setEditorState, editorRef, bgImageObj, tabValue, setTabValue, panelColor, setPanelColor }} />}
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

            setShowFontBar(!newState.getSelection().isCollapsed())

            //setShowFontBar(true)

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


            const allClassName = classNames({

              "image-block-figure": ((blockType === "atomic") && (blockText === "imageBlockText")) || (blockType === "imageBlock"),

              // "unstyled-focus-on > div[data-offset-key]": blockKey === startKey,
              // "unstyled-focus-off > div[data-offset-key]": blockKey !== startKey,


              "text-center": blockData.centerBlock,
              "text-right": blockData.rightBlock,
              "unselectable": !blockText,
              "unstyled-block":blockType==="unstyled"

            })

            return allClassName
            // if (((type === "atomic") && (text === "imageBlockText")) || (type === "imageBlock")) {
            //   return "image-block-figure"
            // }
            // if ((!text) && (type === "unstyled")) {
            //   return "unstyled-text-draft-block"
            // }
            // if (data.centerBlock) {
            //   return "text-center"
            // }
            // if (data.rightBlock) {
            //   return "text-right"
            // }
            // if (!text) {
            //   return "unselectable"
            // }

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
            // const startKey = selection && (!selection.isCollapsed())&&selection.getStartKey()
            // if (startKey.current === blockKey) {

            //   console.log(blockKey)

            // }
            // if ((!text) && (type === "unstyled")) {
            if ((type === "unstyled")) {
              //if ((!text) && (type === "unstyled" || type === "colorBlock")) {
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

                }
              }
            }

            // if (type === "colorBlock") {

            //   return {
            //     component: ColorBlock,
            //     editable: true,

            //   }

            // }


            if (((type === "atomic") && (text === "imageBlockText")) || (type === "imageBlock")) {
              //   console.log(JSON.stringify(data))
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

            else {
              return null
            }

          }
          }

          keyBindingFn={function (e, { getEditorState, setEditorState, ...obj }) {
            const editorState = getEditorState()
            const selectionState = editorState.getSelection();

            const startKey = selectionState.getStartKey();
            const startOffset = selectionState.getStartOffset();
            const endOffset = selectionState.getEndOffset();
            const contentState = editorState.getCurrentContent();
            const block = contentState.getBlockForKey(selectionState.getStartKey());
            const allBlocks = contentState.getBlockMap()
            const firstBlockKey = allBlocks.slice(0, 1).toArray().shift().getKey()




            // if ((e.keyCode === 8) && (!block.getText()) && allBlocks.size !== 1 && selectionState.isCollapsed() && startKey !== firstBlockKey) {
            //   //     if ((e.keyCode === 8) && (startOffset===0) && allBlocks.size !== 1 && selectionState.isCollapsed() && startKey !== firstBlockKey) {
            //   //  setEditorState(RichUtils.onBackspace(editorState))

            //   //   alert("dd")

            //   return "moveup"

            // }


            if ((e.keyCode === 8) && (startOffset === 0) && allBlocks.size !== 1 && selectionState.isCollapsed() && startKey !== firstBlockKey) {
              //  setEditorState(RichUtils.onBackspace(editorState))

              //   alert("dd")

              return "moveup2"

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

            if (command === "moveup") {

              const selectionState = editorState.getSelection();

              const startKey = selectionState.getStartKey();
              setEditorState(deleteBlock(editorState, startKey))

              // const selection = editorState.getSelection();
              // const startKey = selection.getStartKey();
              // const startOffset = selection.getStartOffset();
              // const allBlocks = editorState.getCurrentContent();
              // const block = allBlocks.getBlockForKey(selection.getStartKey());

              // const blockBefore = allBlocks.getBlockBefore(startKey)


              // const newSelection = selection.merge({
              //   anchorKey: blockBefore.getKey(),
              //   anchorOffset: blockBefore.getText().length - 1,
              //   focusKey: blockBefore.getKey(),
              //   focusOffset: blockBefore.getText().length - 1,
              //   isBackward: false,
              //   hasFocus: true,

              // })

              // const newAllBlocks = allBlocks.filter(function (value, key) { return key !== startKey })

              // console.log(newAllBlocks.toArray())

              // let newState = EditorState.createWithContent(newAllBlocks)   //EditorState.push(editorState, newAllBlocks, 'remove-range');
              // newState = EditorState.forceSelection(newState, newSelection)
              // setEditorState(newState)

              return 'handled';

            }

            if (command === "moveup2") {
              const selectionState = editorState.getSelection();
              const startKey = selectionState.getStartKey();
              setEditorState(deleteBlock2(editorState, startKey))
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



function deleteBlock(store, blockKey) {
  // const editorState = store.getEditorState();
  console.log(Math.random())
  const editorState = store;
  let content = editorState.getCurrentContent();

  const beforeKey = content.getKeyBefore(blockKey);
  const beforeBlock = content.getBlockForKey(beforeKey);

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

  const targetRange = new SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),
    focusKey: blockKey,
    focusOffset: 1,
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
  return EditorState.forceSelection(newState, newSelection);
}



function deleteBlock2(store, blockKey) {
  // const editorState = store.getEditorState();
  console.log(Math.random())
  const editorState = store;
  let content = editorState.getCurrentContent();

  const beforeKey = content.getKeyBefore(blockKey);
  const beforeBlock = content.getBlockForKey(beforeKey);

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

  const targetRange = new SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),
    focusKey: blockKey,
    focusOffset: 0,
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
  return EditorState.forceSelection(newState, newSelection);
}



function ImagePanelWrap(props) {
  //const {children,aonClick} = props.blockProps
  // alert("a")

  useEffect(function () {
    //console.log(Date.now())

  }, [])




  return <ImagePanel  {...{ ...props.blockProps }} />
}