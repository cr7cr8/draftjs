import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';



import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';


import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';


import { stateToHTML } from 'draft-js-export-html';


//import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { Avatar, Chip, Popover, Typography, Container, CssBaseline, Paper, Grow, Zoom, Collapse, Fade, Slide, Button, } from "@material-ui/core";
import { makeStyles, useTheme, ThemeProvider, withTheme } from '@material-ui/styles';

import { withContext } from "./ContextProvider"



import { AvatarChip, TwoLineLabel, AvatarLogo } from "./AvatarLogo"


import createMentionPlugin from './MentionPlugin';
import createEmojiPlugin from './EmojiPlugin';
import createImagePlugin from './ImagePlugin';
import createFontBarPlugin from './FontBarPlugin';

import ToolBlock from "./ToolBlock";

import styled from "styled-components"

import { FontBar, taggingFontBar } from "./FontBar"

import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
const { hasCommandModifier } = KeyBindingUtil;


//import { ToolButton2 } from "./ToolButton"

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



export default withContext(function DraftEditor({ ctx, ...props }) {
  //const theme = useTheme()

  const key = useRef(Math.random() + "")

  const { editorState, setEditorState, editorRef, imageBlockObj, setImageBlockObj } = ctx
  const [readOnly, setReadOnly] = useState(false)





  return (

    <React.Fragment key={key.current}>



      <Collapse in={ctx.showEmojiPanel} unmountOnExit={true} style={{ opacity: ctx.showEmojiPanel ? 1 : 0, transitionProperty: "height, opacity", }}>
        <EmojiPanel />
      </Collapse>
      {/* </Fade> */}

      <Paper style={{ position: "relative" }} >


        <FontBar {...{editorState,setEditorState,editorRef}} />
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

            newState = taggingFontBar(newState)
            setEditorState(newState)
          }}

          plugins={[mentionPlugin, emojiPlugin, imagePlugin,]}


          // placeholder="hihihi"
          preserveSelectionOnBlur={true}

          customStyleMap={
            Immutable.Map({
              // stylename1_: {
              //   color: "rgba(200,0,0,1)",

            })
          }

          customStyleFn={function (style, block) {

            const styleNames = style.toArray();


            if (styleNames.includes("FONTBAR")) {
              //  console.log(block.getKey())

              block.findStyleRanges(

                (metaArr) => { return metaArr.hasStyle("FONTBAR") },

                (start, end) => { /*console.log(start, end)*/ }
              )

              return {
                // element: 'p',
                // style: {
                //   color: "red",
                // },
                //  attributes: {
                //    "data-type": "xxxx",
                //  },
                position: "relative",
                "--font-bar": block.getKey()
              }


            }
            // if (styleNames.includes("UNDERLINE")) {

            //   return {
            //     // element: 'p',
            //     // style: {
            //     //   color: "red",
            //     // },
            //      attributes: {
            //        "data-type": "xxxx",
            //      },
            //      backgroundColor: "skyblue"
            //     // color:"red",
            //   }


            // }


          }}

          blockRenderMap={
            Immutable.Map({
              // 'unstyled': { 
              //   element: 'h3',
              //   wrapper: <Typography variant='body2'/>,
              //  }

              // "colorBlock": {
              //   style: "backgournd-color:red"
              // }
              // "imageBlock": {
              //   element: "figure",
              //   wrapper: <ImagePanel
              //     imageArr
              //     setImageArr
              //     imageBlockObj
              //     setImageBlockObj
              //     editor={editorRef}
              //     blockKey={"dsdd"}
              //     deleteImageBlock={deleteImageBlock.bind(null, "dsdd")}
              //     className="image-block" />
              // }
            })
          }



          blockStyleFn={function (block) {
            const text = block.getText()
            const data = block.getData().toObject()
            const type = block.getType()
            if (((type === "atomic") && (text === "imageBlockText")) || (type === "imageBlock")) {
              return "image-block-figure"
            }
            if ((!text) && (type === "unstyled")) {
              return "unstyled-text-draft-block"
            }
            if (type === "FontBarBlock") {
              return "font-bar-block"
            }

          }}

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
            if ((!text) && (type === "unstyled")) {

              return {
                component: ToolBlock,
                editable: true,
                props: {
                  editorRef,
                  readOnly,
                  setReadOnly,
                  markingImageBlock,
                  editorState,
                  setEditorState,
                  taggingFontBar,

                }
              }
            }

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

          }}

          keyBindingFn={function (e, { getEditorState, setEditorState, ...obj }) {
            const editorState = getEditorState()
            const selectionState = editorState.getSelection();
            const contentState = editorState.getCurrentContent();
            const block = contentState.getBlockForKey(selectionState.getStartKey());


            // if ((block.getType() === "imageBlock") && ((e.keyCode === 8) || (e.keyCode === 46))) {
            //   return "cancel-delete"
            // }

            if (checkShowing() && e.keyCode === 38) {
              return undefined
            }
            if (checkShowing() && e.keyCode === 40) {
              return undefined
            }

            if ((block.getType() === "imageBlock")) {
              return "cancel-delete"
            }
            else if (e.shiftKey || hasCommandModifier(e) || e.altKey) {
              return getDefaultKeyBinding(e);
            }
            else if ((block.getType() === "unstyled") && (e.keyCode === 37)) {
         
              return "tool-block-left"
            }
            else if ((block.getType() === "unstyled") && (e.keyCode === 38)) {
              return "tool-block-up"
            }
            else if ((block.getType() === "unstyled") && (e.keyCode === 39)) {
              return "tool-block-right"
            }
            else if ((block.getType() === "unstyled") && (e.keyCode === 40)) {
              return "tool-block-down"
            }
            else if ((!block.getText()) && (block.getType() === "unstyled") && (e.keyCode === 8)) {
              return "tool-block-delete"
            }

            // return getDefaultKeyBinding(e);

            return undefined

          }}

          handleKeyCommand={function (command, editorState, evenTimeStamp, { getEditorState }) {

            if (command === "bold") {

              setEditorState(RichUtils.handleKeyCommand(editorState, command))
            }
            if (command === "italic") {

              setEditorState(RichUtils.handleKeyCommand(editorState, command))
            }
            if (command === "underline") {

              setEditorState(RichUtils.handleKeyCommand(editorState, command))
            }



            if (command === "tool-block-left") {

              let selectionState = editorState.getSelection();
              const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = editorState.getSelection().toArray()

              const contentState = editorState.getCurrentContent();
              const blockArr = contentState.getBlocksAsArray();

              //console.log(selectionState)

              let currentIndex = blockArr.findIndex((item, index) => {
                return item.getKey() === selectionState.getStartKey()
              })


              if (currentIndex === 0) {
                selectionState = selectionState.merge({
                  focusKey: blockArr[currentIndex].getKey(),
                  focusOffset: Math.max(0, focusOffset - 1),
                  anchorKey: blockArr[currentIndex].getKey(),
                  anchorOffset: Math.max(0, focusOffset - 1),
                  hasFocus: true
                });

                //   editorState = EditorState.acceptSelection(editorState, selectionState)
                editorState = EditorState.forceSelection(editorState, selectionState)
                editorState = taggingFontBar(editorState)
                setEditorState(editorState)
                //   break
                return 'not-handled';

              }

              let aboveIndex = currentIndex
              while (aboveIndex > 0) {
                aboveIndex = aboveIndex - 1;
                if ((blockArr[aboveIndex].getType() === "unstyled") || (focusOffset > 0)) {
                  selectionState = selectionState.merge({
                    focusKey: focusOffset === 0 ? blockArr[aboveIndex].getKey() : blockArr[currentIndex].getKey(),
                    focusOffset: focusOffset === 0 ? blockArr[aboveIndex].getText().length : focusOffset - 1,
                    anchorKey: focusOffset === 0 ? blockArr[aboveIndex].getKey() : blockArr[currentIndex].getKey(),
                    anchorOffset: focusOffset === 0 ? blockArr[aboveIndex].getText().length : focusOffset - 1,
                    hasFocus: true
                  });

                  //   editorState = EditorState.acceptSelection(editorState, selectionState)
                  editorState = EditorState.forceSelection(editorState, selectionState)
                  editorState = taggingFontBar(editorState)
                  setEditorState(editorState)
                  //   break
                  return 'not-handled';
                  // return 'handled';        //return 'not-handled';
                }
              }
            }

            if (command === "tool-block-up") {

              let selectionState = editorState.getSelection();
              const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = editorState.getSelection().toArray()

              const contentState = editorState.getCurrentContent();
              const blockArr = contentState.getBlocksAsArray();


              //console.log(selectionState)

              let currentIndex = blockArr.findIndex((item, index) => {

                return item.getKey() === selectionState.getStartKey()
              })


              if (currentIndex === 0) {

                return 'not-handled';

              }


              let aboveIndex = currentIndex
              while (aboveIndex > 0) {
                aboveIndex = aboveIndex - 1;

                if ((blockArr[aboveIndex].getType() === "unstyled")) {

                  selectionState = selectionState.merge({
                    focusKey: blockArr[aboveIndex].getKey(),
                    focusOffset: Math.min(focusOffset, blockArr[aboveIndex].getText().length),
                    anchorKey: blockArr[aboveIndex].getKey(),
                    anchorOffset: Math.min(focusOffset, blockArr[aboveIndex].getText().length),
                    hasFocus: true
                  });

                  //   editorState = EditorState.acceptSelection(editorState, selectionState)
                  editorState = EditorState.forceSelection(editorState, selectionState)
                  editorState = taggingFontBar(editorState)
                  setEditorState(editorState)
                  //   break
                  return 'not-handled';
                  // return 'handled';        //return 'not-handled';
                }
              }
            }

            if (command === "tool-block-right") {

              let selectionState = editorState.getSelection();
              const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = editorState.getSelection().toArray()
              const contentState = editorState.getCurrentContent();
              const blockArr = contentState.getBlocksAsArray();
              let currentIndex = blockArr.findIndex((item, index) => {
                return item.getKey() === selectionState.getStartKey()
              })

              if (currentIndex === blockArr.length - 1) {
                selectionState = selectionState.merge({
                  focusKey: blockArr[currentIndex].getKey(),
                  focusOffset: Math.min(blockArr[currentIndex].getText().length, focusOffset + 1),
                  anchorKey: blockArr[currentIndex].getKey(),
                  anchorOffset: Math.min(blockArr[currentIndex].getText().length, focusOffset + 1),
                  hasFocus: true
                });

                //   editorState = EditorState.acceptSelection(editorState, selectionState)
                editorState = EditorState.forceSelection(editorState, selectionState)
                editorState = taggingFontBar(editorState)
                setEditorState(editorState)
                //   break
                return 'not-handled';

              }

              let belowIndex = currentIndex
              while (belowIndex < blockArr.length - 1) {

                belowIndex = belowIndex + 1;
                if ((blockArr[belowIndex].getType() === "unstyled") || (focusOffset < blockArr[currentIndex].getText().length)) {




                  selectionState = selectionState.merge({
                    focusKey: focusOffset < blockArr[currentIndex].getText().length ? blockArr[currentIndex].getKey() : blockArr[belowIndex].getKey(),
                    focusOffset: focusOffset < blockArr[currentIndex].getText().length ? focusOffset + 1 : 0,
                    anchorKey: focusOffset < blockArr[currentIndex].getText().length ? blockArr[currentIndex].getKey() : blockArr[belowIndex].getKey(),
                    anchorOffset: focusOffset < blockArr[currentIndex].getText().length ? focusOffset + 1 : 0,
                    hasFocus: true
                  });

                  //   editorState = EditorState.acceptSelection(editorState, selectionState)
                  editorState = EditorState.forceSelection(editorState, selectionState)
                  editorState = taggingFontBar(editorState)
                  setEditorState(editorState)
                  //   break
                  return 'not-handled';
                }
              }


            }

            if (command === "tool-block-down") {

              let selectionState = editorState.getSelection();
              const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = editorState.getSelection().toArray()

              const contentState = editorState.getCurrentContent();
              const blockArr = contentState.getBlocksAsArray();

              let currentIndex = blockArr.findIndex((item, index) => {
                return item.getKey() === selectionState.getStartKey()
              })

              if (currentIndex === blockArr.length - 1) {
                return 'not-handled';
              }

              let belowIndex = currentIndex
              while (belowIndex < blockArr.length - 1) {

                belowIndex = belowIndex + 1;
                if ((blockArr[belowIndex].getType() === "unstyled")) {

                  selectionState = selectionState.merge({
                    focusKey: blockArr[belowIndex].getKey(),
                    focusOffset: Math.min(focusOffset, blockArr[belowIndex].getText().length),
                    anchorKey: blockArr[belowIndex].getKey(),
                    anchorOffset: Math.min(focusOffset, blockArr[belowIndex].getText().length),
                    hasFocus: true
                  });

                  //   editorState = EditorState.acceptSelection(editorState, selectionState)
                  editorState = EditorState.forceSelection(editorState, selectionState)
                  editorState = taggingFontBar(editorState)
                  setEditorState(editorState)
                  //   break


                  return 'not-handled';
                }



              }

            }

            if (command === "tool-block-delete") {


              let selectionState = editorState.getSelection();
              const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = editorState.getSelection().toArray()

              const contentState = editorState.getCurrentContent();
              const blockArr = contentState.getBlocksAsArray();


              let currentIndex = blockArr.findIndex((item, index) => {
                return item.getKey() === selectionState.getStartKey()
              })


              let newContentBlockArr = contentState.getBlocksAsArray().filter(function (item) {
                return item.getKey() !== selectionState.getStartKey()
              })


              if (currentIndex === 0) { return 'not-handled'; }
              // selectionState = selectionState.merge({
              //   focusKey: blockArr[currentIndex - 1].getKey(),
              //   focusOffset: blockArr[currentIndex - 1].getText().length,
              //   anchorKey: blockArr[currentIndex - 1].getKey(),
              //   anchorOffset: blockArr[currentIndex - 1].getText().length,
              //   hasFocus: true
              // });



              const newContentState = ContentState.createFromBlockArray(newContentBlockArr)

              editorState = EditorState.push(editorState, newContentState, 'move-block');


              //   editorState = EditorState.createWithContent(newContentState)
              //   editorState = EditorState.forceSelection(editorState, selectionState)
              setEditorState(editorState)
              return 'not-handled';


            }

            return 'not-handled';

          }}
          handleReturn={function (e, newState, { getEditorState, setEditorState }) {
            const editorState = getEditorState()
            const selectionState = editorState.getSelection();
            const contentState = editorState.getCurrentContent();
            const block = contentState.getBlockForKey(selectionState.getStartKey());
            //    console.log(block.getType())
            if (block.getType() === "imageBlock") {
              return "handled"
            }
          }}


          stripPastedStyles={true}
          handlePastedText={function (text, html, editorState, props) {
            return true

          }}



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




function ImagePanelWrap(props) {
  //const {children,aonClick} = props.blockProps
  // alert("a")

  useEffect(function () {
    //console.log(Date.now())

  }, [])




  return <ImagePanel  {...{ ...props.blockProps }} />
}