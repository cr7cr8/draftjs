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
import useResizeObserver from '@react-hook/resize-observer';

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

const useSize = (target) => {
  const [size, setSize] = React.useState()

  React.useLayoutEffect(() => {
    setSize(target.current && target.current.editor && target.current.editor.editor.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target.current && target.current.editor && target.current.editor.editor, (entry) => {


  //  console.log(entry);
    // setSize(entry.contentRect)
    setSize(target.current && target.current.editor && target.current.editor.editor.getBoundingClientRect())

    setSize(window.getComputedStyle(target.current && target.current.editor && target.current.editor.editor).top)
  })
  return size
}


export default withContext(function DraftEditor({ ctx, ...props }) {
  //const theme = useTheme()

  const key = useRef(Math.random() + "")

  const { editorState, setEditorState, editorRef, imageArr, setImageArr, imageBlockObj, setImageBlockObj } = ctx

  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)

  const editorSizeRef = useRef(null)
  const editorSize = useSize(editorRef)

  //const [containerTop, setContainerTop]

  useEffect(function () {

  }, [])


  useEffect(function () {

    

    return function(){
    //  console.log(editorRef.current.editor.editor.getBoundingClientRect())

    }

    //  console.log("****",editorRef.current.editor)
    // const contentState = editorState.getCurrentContent();
    //   console.log("****",editorSize)
    //  const selectionState = editorState.getSelection();
    //   const contentState = editorState.getCurrentContent();

  })


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

      <Paper style={{ position: "relative" }} ref={editorSizeRef}>

        <ToolButton2 top={top} left={left} />

        <Editor
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
                  editor: editorRef,
                  setTop,
                  setLeft,
                }
              }
            }

            if (type === "tool-block") {

              return {
                component: ToolBlock,
                editable: true,
                props: {
                  editor: editorRef,
                  setTop,
                  setLeft,
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

        <div>{JSON.stringify(editorState.getCurrentContent(), null, 2)}</div>
        <hr />
        <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()).entityMap, null, 2)}</div>
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