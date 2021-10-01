import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
//import { Context } from "./ContextProvider"


import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';


import { stateToHTML } from 'draft-js-export-html';


//import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { Avatar, Chip, Popover, Typography, Container, CssBaseline, Paper, Grow, Zoom, Collapse, Fade, Slide, Button } from "@material-ui/core";
import { makeStyles, useTheme, ThemeProvider, withTheme } from '@material-ui/styles';

import { withContext } from "./ContextProvider"



import { AvatarChip, TwoLineLabel, AvatarLogo } from "./AvatarLogo"


import createMentionPlugin from './MentionPlugin';
import createEmojiPlugin from './EmojiPlugin';
import createImagePlugin from './ImagePlugin';


import styled from "styled-components"

import { ToolButton2 } from "./ToolButton"

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
const { mentionPlugin } = createMentionPlugin()
const { emojiPlugin, EmojiPanel } = createEmojiPlugin()
const { imagePlugin, ImagePanel, ToolBlock, deleteImageBlock, setImageBlockData } = createImagePlugin()

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

  const { editorState, setEditorState, editorRef, imageArr, setImageArr, imageBlockObj, setImageBlockObj } = ctx



  const [readOnly, setReadOnly] = useState(false)



  return (

    <React.Fragment key={key.current}>
      {/* <ImagePanel
        imageArr={imageArr} setImageArr={setImageArr} editor={editorRef}

        editorState={editorState} setEditorState={setEditorState}
      
      /> */}
      {/* <Div data-aaa="aaa" data-bbb="34343" id="99999" data-num="4343" /> */}
      {/* <Fade in={ctx.showEmojiPanel} unmountOnExit={false}> */}

      {/* <ImageButton editor={editorRef} /> */}
      <Collapse in={ctx.showEmojiPanel} unmountOnExit={true} style={{ opacity: ctx.showEmojiPanel ? 1 : 0, transitionProperty: "height, opacity", }}>
        <EmojiPanel />
      </Collapse>
      {/* </Fade> */}

      <Paper style={{ position: "relative" }} >


        <Editor
          readOnly={readOnly}
          ref={function (element) { editorRef.current = element; }}
          editorState={editorState}

          onChange={function (newState, { ...props }) {
            setEditorState(newState)
          }}

          plugins={[mentionPlugin, emojiPlugin, imagePlugin]}


          // placeholder="hihihi"
          preserveSelectionOnBlur={true}

          customStyleMap={
            Immutable.Map({
              // stylename1_: {
              //   color: "rgba(200,0,0,1)",

            })
          }

          customStyleFn={function (style, block) {

            const styleNames = style.toObject();

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
          }}

          blockRendererFn={function (block) {

            const text = block.getText()
            const data = block.getData().toObject()
            const type = block.getType()

            if ((!text) && (type === "unstyled")) {

              return {
                component: ToolBlock,
                editable: true,
                props: {
                  editorRef,
                  readOnly,
                  setReadOnly,

                }
              }
            }





            //   const entityId = editorState.getCurrentContent().getEntityAt(0);
            if (((type === "atomic") && (text === "imageBlockText")) || (type === "imageBlock")) {
              //   console.log(JSON.stringify(data))
              return {
                // component: function (props) {
                //   const {children,aonClick} = props.blockProps
                //   return <Button variant="contained" onMouseDown={aonClick}>{children}</Button>
                // },

                component: ImagePanel,
                editable: false,
                props: {
                  imageArr,
                  setImageArr,
                  imageBlockObj,
                  setImageBlockObj,
                  editor: editorRef,
                  //blockKey: block.getKey(),
                  deleteImageBlock,
                  className: "image-block",
                  setImageBlockData,


                },
              }
            }

            else {
              return null
            }

          }}




          handleKeyCommand={function (command, editorState, evenTimeStamp, { getEditorState }) {

            if (command === "bold") {


              setEditorState(RichUtils.handleKeyCommand(editorState, command))
            }
            else if (command === "italic") {


              setEditorState(RichUtils.handleKeyCommand(editorState, command))
            }
            else if (command === "underline") {


              setEditorState(RichUtils.handleKeyCommand(editorState, command))
            }
            else if (command === "underline") {

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
                setEditorState(editorState)
                //   break
                return 'not-handled';

              }

              let aboveIndex = currentIndex
              while (aboveIndex > 0) {
                aboveIndex = aboveIndex - 1;
                if ((blockArr[aboveIndex].getType() === "unstyled")) {

                  selectionState = selectionState.merge({
                    focusKey: focusOffset === 0 ? blockArr[aboveIndex].getKey() : blockArr[currentIndex].getKey(),
                    focusOffset: focusOffset === 0 ? blockArr[aboveIndex].getText().length : focusOffset - 1,
                    anchorKey: focusOffset === 0 ? blockArr[aboveIndex].getKey() : blockArr[currentIndex].getKey(),
                    anchorOffset: focusOffset === 0 ? blockArr[aboveIndex].getText().length : focusOffset - 1,
                    hasFocus: true
                  });

                  //   editorState = EditorState.acceptSelection(editorState, selectionState)
                  editorState = EditorState.forceSelection(editorState, selectionState)
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
                setEditorState(editorState)
                //   break
                return 'not-handled';

              }

              let belowIndex = currentIndex
              while (belowIndex < blockArr.length - 1) {

                belowIndex = belowIndex + 1;
                if ((blockArr[belowIndex].getType() === "unstyled")) {

                  selectionState = selectionState.merge({
                    focusKey: focusOffset < blockArr[currentIndex].getText().length ? blockArr[currentIndex].getKey() : blockArr[belowIndex].getKey(),
                    focusOffset: focusOffset < blockArr[currentIndex].getText().length ? focusOffset + 1 : 0,
                    anchorKey: focusOffset < blockArr[currentIndex].getText().length ? blockArr[currentIndex].getKey() : blockArr[belowIndex].getKey(),
                    anchorOffset: focusOffset < blockArr[currentIndex].getText().length ? focusOffset + 1 : 0,
                    hasFocus: true
                  });

                  //   editorState = EditorState.acceptSelection(editorState, selectionState)
                  editorState = EditorState.forceSelection(editorState, selectionState)
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
                    focusOffset:  Math.min(focusOffset, blockArr[belowIndex].getText().length),
                    anchorKey:  blockArr[belowIndex].getKey(),
                    anchorOffset:  Math.min(focusOffset, blockArr[belowIndex].getText().length),
                    hasFocus: true
                  });

                  //   editorState = EditorState.acceptSelection(editorState, selectionState)
                  editorState = EditorState.forceSelection(editorState, selectionState)
                  setEditorState(editorState)
                  //   break
                  return 'not-handled';
                }
              
              
              
              }

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
        {/*  <hr />
        <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()).entityMap, null, 2)}</div> */}
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