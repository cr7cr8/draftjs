import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';

import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { FormControlLabel, Typography, IconButton, Button, ButtonGroup, Container, Paper, Avatar, Box, Chip, Grow, Zoom, Slide } from "@material-ui/core";
import SwitchBtn from "./SwitchBtn"




import ColorLensOutlinedIcon from '@material-ui/icons/ColorLensOutlined';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';

import { isThisMinute } from 'date-fns/esm';
import classNames from 'classnames';


class ToolButton_ extends React.Component {


  constructor(props) {
    super(props)

    this.editorState = this.props.editorState
    this.setEditorState = this.props.setEditorState
    this.state = {
     // isExpanded: false,
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
        //  ...pre,
        top: value
      }
    })
  }

  setLeft = (value) => {
    this.setState(pre => {
      return {
        //    ...pre,
        left: value
      }
    })
  }

  // toggleExpand = () => {
  //   this.setState(pre => {

  //     return {

  //       isExpanded: !pre.isExpanded
  //     }
  //   })
  // }


  render() {

    const theme = this.props.theme
    const top = this.state.top
    const setEditorState = this.props.setEditorState
    const editorState = this.props.editorState
    const blockType = this.props.currentBlockKey ? editorState.getCurrentContent().getBlockForKey(this.props.currentBlockKey).getType() : null
    const blockText = this.props.currentBlockKey ? editorState.getCurrentContent().getBlockForKey(this.props.currentBlockKey).getText() : null
    // const block

    //console.log(blockType)

    const ctx = this.props.ctx

    const toolButtonCss = classNames({
      [theme.widthCss]: true,
      [theme.widthCss2]:  blockType === "editingBlock"&& !blockText,
     // [theme.widthCss3]: this.state.isExpanded && !blockText && blockType !== "unstyled",

    })


    //  console.log(theme)
    return (

      <div

        className={
          toolButtonCss
        }

        style={{
          //  transform: "translateX(0%)",
          alignItems: "center",
          userSelect: "none",
          position: "absolute",
          //  left,
          top,
          right: 0,
          zIndex: 100,
          transition: "top 100ms",
          backgroundColor: "skyblue",
          //    ...this.state.isExpanded && { wdith: "100%" },
          transition: "top 300ms, width 300ms",

          //   width:this.state.isExpanded?"":"2rem",
          overflow: "hidden",

          ...(!editorState.getSelection().isCollapsed() || blockType === "imageBlock") && { display: "none" },
          //  display: "",
          // alignItems:"center",
          whiteSpace: "nowrap",
          direction: "rtl",
        }}>
        <IconButton
          style={{
            transform: blockType === "unstyled" ?   "rotate(0deg)" : "rotate(-45deg)",
            transition: "transform 300ms",
            padding: 0
          }}
          className={theme.sizeCss}
          contentEditable={false}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}

          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()


         //   if (blockType === "unstyled") {
      //        this.toggleExpand()

      //        setEditorState(RichUtils.toggleBlockType(editorState, "editingBlock"))
        //    }
    //        else {
            //  this.toggleExpand()
              setEditorState(RichUtils.toggleBlockType(editorState, "editingBlock"))
     //       }

            // markingColorBlock()
            // markingColorBlock(e, editorState, setEditorState, {}, blockKey)

            //  setEditorState(RichUtils.toggleBlockType(editorState, "editingBlock"))
            //  setEditorState(RichUtils.toggleBlockType(editorState, "imageBlock"))

            //setShowSettingBar(pre => !pre)
          }}
        >


          <ControlPointIcon contentEditable={false} className={theme.sizeCss + " " + "rotate1"} style={{ userSelect: "none" }} />
        </IconButton>



        {/* {blockType !== "editingBlock" && <IconButton
          style={{
            padding: 0
          }}
          className={theme.sizeCss}
          contentEditable={false}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}

          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            this.toggleExpand()
            // markingColorBlock()
            // markingColorBlock(e, editorState, setEditorState, {}, blockKey)

            setEditorState(RichUtils.toggleBlockType(editorState, "editingBlock"))
            //  setEditorState(RichUtils.toggleBlockType(editorState, "imageBlock"))

            //setShowSettingBar(pre => !pre)
          }}
        >


          <ColorLensOutlinedIcon contentEditable={false} className={theme.sizeCss + " " + "rotate1"} style={{ userSelect: "none" }} />
        </IconButton>
        } */}

        {!blockText && <IconButton
          style={{
            padding: 0
          }}
          className={theme.sizeCss}
          contentEditable={false}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}

          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          //  this.toggleExpand()
            // markingColorBlock()
            // markingColorBlock(e, editorState, setEditorState, {}, blockKey)

            //  setEditorState(RichUtils.toggleBlockType(editorState, "editingBlock"))
            //  setEditorState(RichUtils.toggleBlockType(editorState, "imageBlock"))
            setEditorState(RichUtils.toggleBlockType(editorState, "imageBlock"))
            //setShowSettingBar(pre => !pre)
          }}
        >


          <InsertPhotoOutlinedIcon contentEditable={false} className={theme.sizeCss + " " + "rotate1"} style={{ userSelect: "none" }} />
        </IconButton>
        }



      </div>
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



