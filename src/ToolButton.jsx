import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';

import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { FormControlLabel, Typography, IconButton, Button, ButtonGroup, Container, Paper, Avatar, Box, Chip, Grow, Zoom, Slide } from "@material-ui/core";
import SwitchBtn from "./SwitchBtn"




import ColorLensOutlinedIcon from '@material-ui/icons/ColorLensOutlined';




class ToolButton_ extends React.Component {


  constructor(props) {
    super(props)

    this.editorState = this.props.editorState
    this.setEditorState = this.props.setEditorState
    this.state = {
      top: 0,
      left: 0,
    }

  }

  componentDidMount() {

    this.props.toolButtonRef.current = this
  }

  componentWillUnmount() {
    this.props.toolButtonRef.current = null
  }

  setTop = (value) => {
  
    this.setState(pre => {
      return {
        ...pre,
        top: value
      }
    })
  }

  setLeft = (value) => {
    this.setState(pre => {
      return {
        ...pre,
        left: value
      }
    })
  }


  render() {

    const theme = this.props.theme
    const top = this.state.top
    const setEditorState = this.props.setEditorState
    const editorState = this.props.editorState
    const ctx = this.props.ctx
    //  console.log(theme)
    return (

      <IconButton
        style={{
          transform: "translateX(0%)",
          alignItems: "center",
          userSelect: "none",
          position: "absolute",
          //  left,
          top,
          right: 0,
          zIndex: 100,
          transition:"top 200ms"
          //  backgroundColor: "pink"
        }}
        className={theme.sizeCss}
        contentEditable={false}
        onMouseDown={function (e) {
          e.preventDefault()
          e.stopPropagation()
        }}

        onClick={function (e) {
          e.preventDefault()
          e.stopPropagation()

          // markingColorBlock()
          // markingColorBlock(e, editorState, setEditorState, {}, blockKey)

          setEditorState(RichUtils.toggleBlockType(editorState, "editingBlock"))

          //setShowSettingBar(pre => !pre)
        }}
      >
        <ColorLensOutlinedIcon contentEditable={false} className={theme.sizeCss + " " + "rotate1"} style={{ userSelect: "none" }} />
      </IconButton>
    )



  }


}


const ToolButton = withTheme(withContext(ToolButton_))
export default ToolButton


// export default function ToolButton({ editorState, setEditorState, ...props }) {

//   const [top, setTop] = useState(0)
//   const [left, setLeft] = useState(0)

//   const theme = useTheme()



//   return (
//     <IconButton
//       style={{
//         transform: "translateX(0%)",
//         alignItems: "center",
//         userSelect: "none",
//         position: "absolute",
//         //  left,
//         top,
//         right: 0,
//         zIndex: 100,
//         //  backgroundColor: "pink"
//       }}
//       className={theme.sizeCss}
//       contentEditable={false}
//       onMouseDown={function (e) {
//         e.preventDefault()
//         e.stopPropagation()
//       }}

//       onClick={function (e) {
//         e.preventDefault()
//         e.stopPropagation()

//         // markingColorBlock()
//         // markingColorBlock(e, editorState, setEditorState, {}, blockKey)

//         setEditorState(RichUtils.toggleBlockType(editorState, "editingBlock"))

//         //setShowSettingBar(pre => !pre)
//       }}
//     >
//       <ColorLensOutlinedIcon contentEditable={false} className={theme.sizeCss + " " + "rotate1"} style={{ userSelect: "none" }} />
//     </IconButton>
//   )

// }



