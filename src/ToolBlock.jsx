
import { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { FormControlLabel, Typography, IconButton, Button, ButtonGroup, Container, Paper, Avatar, Box, Chip, Grow, Zoom, Slide } from "@material-ui/core";
import SwitchBtn from "./SwitchBtn"





import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import ImageTwoToneIcon from '@material-ui/icons/ImageTwoTone';


import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import ColorLensOutlinedIcon from '@material-ui/icons/ColorLensOutlined';

import AvatarChipList from "./AvatarChipList";

import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";
import ImagePanel from "./ImagePanel"

import { CropOriginal, Brightness4, Brightness5, FormatBold, FormatItalic, AddPhotoAlternateOutlined } from "@material-ui/icons";
import ToolButton from "./ToolButton"
import { add } from 'date-fns/esm';


import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import { set } from 'immutable';
import { getEventListeners } from 'events';


export default function ToolBlock(props) {

  const { block, selection, contentState, } = props



  const { editorRef, readOnly, setReadOnly, EmojiPanel, markingImageBlock, markingColorBlock, editorState, setEditorState, taggingFontBar, gradientStyleArr,
    bgImageObj,
    setBgImageObj,
    showFontBar,
    setShowFontBar,

  } = props.blockProps



  const theme = useTheme()
  const blockKey = block.getKey()
  const blockText = block.getText()
  const startKey = selection.getStartKey()

  const editorBlockRef = useRef()

  const [backColor, setBackColor] = useState(getRandomColor())


  const [hidden, setHidden] = useState(selection.hasFocus && selection.isCollapsed() && (selection.getStartKey() === blockKey))

  const [showSettingBar, setShowSettingBar] = useState(false)


  function update(e) {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget.files[0].name.trim().match(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i)) {

      const files = e.currentTarget.files

      const newImage = bgImageObj.current[files[0].name]
      if (!newImage) {

        bgImageObj.current = {
          ...bgImageObj.current,
          [files[0].name]: {
            backgroundImage: `url(${URL.createObjectURL(files[0])})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          },


        }


      }
      const updatedImage = bgImageObj.current[files[0].name]


      markingColorBlock(e, editorState, setEditorState, updatedImage, blockKey)




      setTimeout(() => {

        editorRef.current.focus()
      }, 100);

    }

  }

  const toolBar =

    useMemo(
      () => (
        <div
          //  elevation={0}
          style={{
            boxShadow: theme.shadows[5],
            transform: "translateY(-100%)",
            position: "absolute",
            background: theme.palette.background.default,
            right: 0,

            // display: "flex",
            alignItems: "center",
            //   opacity: 0.5,
            //  transition: "width 0.3s",
            // width: showSettingBar ? "100%" : 0,
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden"
          }}
        >
          <Zoom in={showSettingBar} unmountOnExit={true}>
            <IconButton className={theme.sizeCss}
              contentEditable={false}

              onClick={function (e) {
                e.preventDefault(); e.stopPropagation()
                markingImageBlock(blockKey)
                //  setShowColorPanel(pre => !pre)
              }}
            >
              <InsertPhotoOutlinedIcon className={theme.sizeCss} />
            </IconButton>
          </Zoom>

          <Zoom in={showSettingBar} unmountOnExit={true}>
            <IconButton className={theme.sizeCss}
              contentEditable={false}

              onClick={function (e) {
                e.preventDefault(); e.stopPropagation();
                inputRef.current.click()
              }}
            >
              <ImageTwoToneIcon className={theme.sizeCss} />
            </IconButton>
          </Zoom>

          {gradientStyleArr.map(function (item, index) {

            return (
              <Slide key={index} in={showSettingBar} direction="left"
                timeout={{ enter: 100 * index + 100, exit: 100 * (gradientStyleArr.length - index) }}
                unmountOnExit={true}>
                <IconButton className={theme.sizeCss} key={index}
                  contentEditable={false}
                  style={{
                    padding: 0,
                  }}
                  onClick={function (e) {
                    e.preventDefault(); e.stopPropagation();
                    markingColorBlock(e, editorState, setEditorState, item, blockKey, true)

                  }}>
                  <div className={theme.sizeCss} style={{ borderRadius: "1000px", ...item }} />
                </IconButton>
              </Slide>
            )
          })}

        </div>
      ),
      [showSettingBar, editorState]
    )



  const inputRef = useRef()
  useLayoutEffect(function () {

    //editorBlockRef.current._node.parentElement.style.overflow = showSettingBar ? "hidden" : "visible"
    // setHidden(!(selection.hasFocus && selection.isCollapsed() && (selection.getStartKey() === blockKey)))
    setHidden(!(selection.isCollapsed() && (selection.getStartKey() === blockKey)))
    // if (editorBlockRef.current._node.style.backgroundColor !== backColor) editorBlockRef.current._node.style.backgroundColor = backColor

    //if (editorBlockRef.current._node.style.backgroundColor !== backColor) editorBlockRef.current._node.style.backgroundColor = backColor

    if (blockKey === startKey) {
   //   editorBlockRef.current._node.style.boxShadow = theme.shadows[5]
      //   editorBlockRef.current._node.style.backgroundColor = theme.palette.background.default
      //   editorBlockRef.current._node.style.transform = "scale(1.05)"
    
    //  editorBlockRef.current._node.style.transition = "transform 300ms,box-shadow 300ms,background-color 300ms"
    }
    else {
  //    editorBlockRef.current._node.style.boxShadow = theme.shadows[0]
 //     editorBlockRef.current._node.style.backgroundColor = backColor
      //    editorBlockRef.current._node.style.transform = "scale(1.0)"
   
   //   editorBlockRef.current._node.style.transition = "transform 300ms,box-shadow 300ms,background-color 300ms"
    }




  })


  return (

    <>
      <input ref={inputRef} type="file" multiple={false} style={{ display: "none" }}
        onClick={function (e) { e.currentTarget.value = null; }}
        onChange={update}
      />

      {toolBar}

      <EditorBlock  {...props} ref={editorBlockRef} />


      {

        !hidden && <div
          //  className={theme.sizeCss}
          contentEditable={false}
          style={{
            transform: "translateX(0%) translateY(-100%)",
            position: "absolute",
            //  background: "skyblue",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            //  backgroundColor: "skyblue",
            //  width:"100%",
            right: 0,
            zIndex: 0,
            userSelect: "none"
          }}
        >
          <div style={{ width: 0 }}>&nbsp;</div>
          {/* <div contentEditable={false} style={{ transform: "translateX(0%)", display: "flex", alignItems: "center" }}> */}
          {/* <div     contentEditable={false} style={{ width: 0 }}>&nbsp;</div> */}
          <IconButton
            style={{
              transform: "translateX(0%)",
              alignItems: "center",
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
            <ColorLensOutlinedIcon className={theme.sizeCss+" "+"rotate1"} />
          </IconButton>
          {/* </div> */}
        </div>
      }
    </>
  )
}







export function SettingBar({ setShowSettingBar, markingImageBlock, markingColorBlock, blockKey, editorBlockRef, ...props }) {


  const { showFontBar, setShowFontBar, editorState, setEditorState, gradientStyleArr, editorRef, bgImageObj } = useContext(Context)
  const inputRef = useRef()

  const theme = useTheme()
  const selection = editorState.getSelection()
  const [renderMe, setRenderMe] = useState(true)



  useEffect(function () {

    if (renderMe) {

      if (editorState.getCurrentContent().getBlockForKey(blockKey).getText()) {
        setShowSettingBar && setShowSettingBar(false)
        setRenderMe(false)
      }

    }

    return function () {
      console.log(renderMe)
    }



  })

  function update(e) {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget.files[0].name.trim().match(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i)) {

      const files = e.currentTarget.files

      const newImage = bgImageObj.current[files[0].name]
      if (!newImage) {

        bgImageObj.current = {
          ...bgImageObj.current,
          [files[0].name]: {
            backgroundImage: `url(${URL.createObjectURL(files[0])})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          },


        }


      }
      const updatedImage = bgImageObj.current[files[0].name]


      markingColorBlock(e, editorState, setEditorState, updatedImage, blockKey)




      setTimeout(() => {

        editorRef.current.focus()
      }, 100);

    }

  }

  // if (!renderMe) {
  //   return null
  // }




  return (
    <>
      <input ref={inputRef} type="file" multiple={false} style={{ display: "none" }}
        onClick={function (e) { e.currentTarget.value = null; }}
        onChange={update}
      />
      <Grow in={renderMe}
        unmountOnExit={true}

        direction="right" timeout={{ enter: setShowSettingBar ? 300 : 0, exit: 300 }}

        onExited={function () {

          //setShowSettingBar && function () { editorBlockRef.current._node.parentElement.style.overflow = "visible" }()

          setShowSettingBar && setShowSettingBar(false)

          !setShowSettingBar && function () {

            const selection = editorState.getSelection()
            const allBlocks = Modifier.mergeBlockData(editorState.getCurrentContent(), SelectionState.createEmpty(blockKey), Immutable.Map({ fromSetting: false }))

            let es = EditorState.push(
              editorState,
              allBlocks,               // editorState.getCurrentContent().getBlockMap().merge(allBlocks)
              "change-block-data",
            )

            es = EditorState.forceSelection(es, selection)



            setEditorState(es)


          }()
        }}
        onEntered={function () { editorRef.current.focus() }}>
        <div style={{ position: "absolute", top: 0, width: "auto", overflow: "hidden", whiteSpace: "nowrap", right: 0, /*backgroundColor:"#acf"*/ }}
          contentEditable={false}
          onMouseDown={function (e) {
            e.preventDefault()
            e.stopPropagation()

          }}
          onClick={function (e) {
            e.preventDefault()
            e.stopPropagation()

            let es = EditorState.forceSelection(editorState, SelectionState.createEmpty(blockKey))
            setEditorState(es)

            //  setShowSettingBar && setShowSettingBar(false)
            setRenderMe(false)

          }}
        >


          <SwitchBtn

            checked={showFontBar}
            //  factor={[2, 2, 0.5, 3, 1]} //"4rem", "4rem", "1rem", "6rem", "2rem"
            onChange={() => {
              // setShowFontBar(pre => !pre);
              // setShowFontBar(pre => !pre)
              // editorRef.current.focus()
            }}
            name="showFontBar" color="primary"
            onMouseDown={function (e) {
              e.preventDefault();
              e.stopPropagation();
              // setSwitchOn(pre => !pre);
              // setShowFontBar(pre => !pre);
            }}

            onClick={function (e) {
              e.preventDefault();
              e.stopPropagation();

              setShowFontBar(pre => !pre); //editorRef.current.focus()
            }}

          />



          <IconButton className={theme.sizeCss}
            contentEditable={false}

            onClick={function (e) {
              e.preventDefault(); e.stopPropagation()
              markingImageBlock(blockKey)
              //  setShowColorPanel(pre => !pre)
            }}
          >
            <InsertPhotoOutlinedIcon className={theme.sizeCss} />
          </IconButton>


          <IconButton className={theme.sizeCss}
            contentEditable={false}

            onClick={function (e) {
              e.preventDefault(); e.stopPropagation();
              inputRef.current.click()
            }}
          >
            <ImageTwoToneIcon className={theme.sizeCss} />
          </IconButton>

          {gradientStyleArr.map(function (item, index) {

            return (


              <IconButton className={theme.sizeCss} key={index}
                contentEditable={false}
                style={{
                  padding: 0,
                }}
                onClick={function (e) {
                  e.preventDefault(); e.stopPropagation();
                  markingColorBlock(e, editorState, setEditorState, item, blockKey, true)

                }}>
                <div className={theme.sizeCss} style={{ borderRadius: "1000px", ...item }} />
              </IconButton>
            )
          })}

          <IconButton className={theme.sizeCss}
            contentEditable={false}


            onClick={function () {
              //  setShowSettingBar && setShowSettingBar(false)

              let es = EditorState.forceSelection(editorState, SelectionState.createEmpty(blockKey))

              setEditorState(es)
              setRenderMe(false)


            }} >
            <ClearOutlinedIcon className={theme.sizeCss} contentEditable={false}
            />
          </IconButton>
        </div>
      </Grow>

    </>



  )



}


function getRandomColor() {

  return "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + (",") + Math.floor(Math.random() * 255) + ",0.3)"

}