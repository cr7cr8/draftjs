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
import createColorBlockPlugin from './ColorBlockPlugin';

import ToolBlock from "./ToolBlock";
import ColorBlock from "./ColorBlock";

import styled from "styled-components"

import { FontBar, taggingFontBar, markingColorBlock } from "./FontBar"

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
const { colorBlockPlugin, /*markingColorBlock*/ } = createColorBlockPlugin()


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

  const { editorState, setEditorState, editorRef, imageBlockObj, setImageBlockObj, gradientStyleArr, bgImageObj, setBgImageObj } = ctx
  const [readOnly, setReadOnly] = useState(false)





  return (

    <React.Fragment key={key.current}>



      <Collapse in={ctx.showEmojiPanel} unmountOnExit={true} style={{ opacity: ctx.showEmojiPanel ? 1 : 0, transitionProperty: "height, opacity", }}>
        <EmojiPanel />
      </Collapse>
      {/* </Fade> */}

      <Paper style={{ position: "relative" }} >


        <FontBar {...{ gradientStyleArr, editorState, setEditorState, editorRef }} />
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

          plugins={[mentionPlugin, emojiPlugin, imagePlugin, colorBlockPlugin]}


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

          blockStyleFn={function (block) {
            const text = block.getText()
            const data = block.getData().toObject()
            const type = block.getType()

            //   const { colorBlockCss } = useStyles()

            if (((type === "atomic") && (text === "imageBlockText")) || (type === "imageBlock")) {
              return "image-block-figure"
            }
            if ((!text) && (type === "unstyled")) {
              return "unstyled-text-draft-block"
            }
            // if (type === "FontBarBlock") {
            //   return "font-bar-block"
            // }
            // if (type==="colorBlock") {
            //   return "font-bar-block"
            // }

          }}



          blockRenderMap={
            Immutable.Map({
              "colorBlock": {
                element: "div",
                wrapper: <ColorBlock editorState={editorState} setEditorState={setEditorState} editorRef={editorRef} />,
              }


              // 'unstyled': { 
              //   element: 'div',
              //   wrapper: <ColorBlock />,
              //  }

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
                  markingColorBlock,
                  editorState,
                  setEditorState,
                  taggingFontBar,
                  gradientStyleArr,
                  bgImageObj,
                  setBgImageObj,

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

          }}

          keyBindingFn={function (e, { getEditorState, setEditorState, ...obj }) {
            const editorState = getEditorState()
            const selectionState = editorState.getSelection();
            const contentState = editorState.getCurrentContent();
            const block = contentState.getBlockForKey(selectionState.getStartKey());

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
        <hr />  */}
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