import { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context } from "./ContextProvider"


import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';





//import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { Avatar, Chip, Popover, Typography, Container, CssBaseline, Paper } from "@material-ui/core";
import { makeStyles, styled, useTheme, ThemeProvider, withTheme } from '@material-ui/styles';

import { withContext } from "./ContextProvider"



import { AvatarChip, TwoLineLabel, AvatarLogo } from "./AvatarLogo"


import createMentionPlugin from './MentionPlugin';



const initialState = {
  entityMap: {},
  blocks: []
};
const { mentionPlugin } = createMentionPlugin()


export default withContext(function DraftEditor({ ctx, ...props }) {
  const theme = useTheme()
  const editor = useRef()

  const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(initialState)))

  return (

    <>
      <Paper>
        <Editor
          ref={function (element) { editor.current = element; }}
          editorState={editorState}


          onChange={function (newState, { ...props }) {


            setEditorState(newState)

          }}

          plugins={
            [
              mentionPlugin
            ]

          }


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
            })
          }



          blockStyleFn={function (block) {

          }}

          blockRendererFn={function (block) {



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
        />
      </Paper>

      <div style={{ whiteSpace: "pre-wrap", display: "flex", fontSize: 15 }}>
        {/* <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()).entityMap, null, 2)}</div> */}
        {/* <div>{JSON.stringify(editorState.getCurrentContent(), null, 2)}</div> */}
        {/* <hr /> */}
        {/* <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()).entityMap, null, 2)}</div> */}
      </div>

    </>
  )



})


