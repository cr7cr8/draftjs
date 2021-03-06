
import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, IconButton, Button, ButtonGroup, Container, Paper, Popover, Avatar, Box, Chip, Grow, Zoom, Slide } from "@material-ui/core";
import { Image, AlternateEmailSharp } from "@material-ui/icons";


import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';


import SettingsIcon from '@material-ui/icons/Settings';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import ImageTwoToneIcon from '@material-ui/icons/ImageTwoTone';
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
import HeightIcon from '@material-ui/icons/Height';

import { SettingBar } from "./ToolBlock"

// const useStyles = makeStyles(theme => {
//   return {
//     colorBlockCss: (gradient) => {
//       return {
//         ...gradient.toObject()
//       }
//     }
//   }
// })


export default function ColorBlock(props) {

  const theme = useTheme()
  const { editorState, setEditorState, editorRef, gradientStyleArr, showFontBar, setShowFontBar, markingImageBlock } = props;
  const selection = editorState.getSelection()

  const arr = [[props.children[0]]]


  let preItemValue = props.children[0].props.children.props.block.getData().toObject().backgroundImage
  props.children.reduce((previousItem, currentItem, currentIndex) => {

    const previousValue = previousItem.props.children.props.block.getData().toObject().backgroundImage
    const currentValue = currentItem.props.children.props.block.getData().toObject().backgroundImage

    if (previousValue) { preItemValue = previousValue }


    if (currentValue === previousValue) {
      arr[arr.length - 1].push(currentItem)
    }
    else if (currentValue === preItemValue) {
      arr[arr.length - 1].push(currentItem)
    }
    else if (!currentValue) {
      arr[arr.length - 1].push(currentItem)
    }
    else {
      arr.push([currentItem])
    }
    return currentItem

  })




  const [horizontal, setHorizontal] = useState(arr.map(() => { return 75 }))
  const [vertical, setVertical] = useState(arr.map(() => { return 75 }))

  useEffect(function () {

    setHorizontal(pre => {
      const newArr = arr.map(() => { return 50 })

      pre.forEach((item, index) => {
        if (index < newArr.length) {
          newArr[index] = item
        }
      })

      // return JSON.stringify(pre) === JSON.stringify(newArr)?pre:newArr

      return newArr

    })


    setVertical(pre => {
      const newArr = arr.map(() => { return 50 })

      pre.forEach((item, index) => {

        if (index < newArr.length) {
          newArr[index] = item
        }

      })

      // return JSON.stringify(pre) === JSON.stringify(newArr)?pre:newArr
      return newArr

    })


  }, [props])



  useEffect(function () {
    arr.forEach((groupArr, index) => {


      if (!groupArr[0].props.children.props.block.getData().toObject().colorBlock) {
        groupArr.forEach(blockItem => {
          let newContent = Modifier.setBlockType(
            blockItem.props.children.props.contentState,
            SelectionState.createEmpty(blockItem.props.children.props.block.getKey()),
            "unstyled"
          );
          let es = EditorState.push(editorState, newContent, 'change-block-type');
          return setEditorState(es)
        })
      }

    })

    // setTimeout(() => {                    will reander not only once per click if placed here
    //   setEditorState(editorState)
    // }, 0);
  })

  return (

    arr.map((groupArr, index) => {
      const styleObj = groupArr[0].props.children.props.block.getData().toObject()
      return <div key={index} //id={"bgkey" + groupArr[0].props.children.props.block.getKey()}

        style={{
          ...styleObj,
          backgroundPosition: `${styleObj.horizontal}% ${styleObj.vertical}%`,
        }}>





        {
          groupArr.map((blockItem) => {

            const blockItemText = blockItem.props.children.props.block.getText()
            const blockItemKey = blockItem.props.children.props.block.getKey()
            const blockItemData = blockItem.props.children.props.block.getData().toObject()


            return <div key={blockItem.props.children.props.block.getKey()} style={{ position: "relative" }}
            >



              {/* {blockItemData.fromSetting && <SettingBar  {...{ markingColorBlock, markingImageBlock, blockKey: blockItemKey }} />} */}




              {(selection.isCollapsed() && selection.hasFocus && selection.focusKey === blockItemKey) &&
                <React.Fragment>
                  <IconButton className={theme.sizeCss}
                    contentEditable={false}
                    style={{
                      top: "50%",
                      transform: "translateX(100%)  translateY(-50%)",
                      position: "absolute",
                      right: 0,
                    }}

                    onMouseDown={function () {

                      let newContent = Modifier.setBlockType(
                        blockItem.props.children.props.contentState,
                        SelectionState.createEmpty(blockItemKey),
                        "unstyled"
                      )

                      let es = EditorState.push(editorState, newContent, 'change-block-type');

                      newContent = Modifier.mergeBlockData(
                        newContent,
                        SelectionState.createEmpty(blockItemKey),
                        Immutable.Map({ colorBlock: false, fromSetting: false }),
                      )

                      es = EditorState.push(es, newContent, 'change-block-data');
                      es = EditorState.acceptSelection(es, selection)

                      return setEditorState(es)

                    }}

                  >
                    <HighlightOffOutlinedIcon className={theme.sizeCss} contentEditable={false}
                    />
                  </IconButton>

                  <IconButton className={theme.sizeCss}
                    contentEditable={false}
                    style={{
                      top: "50%",
                      transform: "translateX(200%)  translateY(-50%)",
                      position: "absolute",
                      right: 0,
                    }}

                    onMouseDown={function () {

                      setVertical(pre => {
                        //  pre + 25
                        const arr = [0, 25, 50, 75, 100]
                        const pos = pre[index] / 25


                        const newArr = [...pre]
                        newArr[index] = arr[(pos + 1) % 5]

                        //    console.log("vertical", newArr)
                        return newArr

                      })

                      let newContent = Modifier.mergeBlockData(
                        blockItem.props.children.props.contentState,
                        SelectionState.createEmpty(groupArr[0].props.children.props.block.getKey()),
                        Immutable.Map({ ...groupArr[0].props.children.props.block.getData().toObject(), vertical: vertical[index] }),
                      )

                      let es = EditorState.push(editorState, newContent, 'change-block-data');
                      es = EditorState.acceptSelection(es, editorState.getSelection())

                      setEditorState(es)
                      setTimeout(() => {
                        // setEditorState(es)
                        editorRef.current.focus()
                      }, 0);

                    }}

                  >
                    <HeightIcon className={theme.sizeCss}
                    />
                  </IconButton>

                  <IconButton className={theme.sizeCss}
                    contentEditable={false}
                    style={{
                      top: "50%",
                      transform: "translateX(300%)  translateY(-50%)",
                      position: "absolute",
                      right: 0,
                    }}

                    onMouseDown={function () {

                      setHorizontal(pre => {
                        //  pre + 25
                        const arr = [0, 25, 50, 75, 100]
                        const pos = pre[index] / 25

                        const newArr = [...pre]
                        newArr[index] = arr[(pos + 1) % 5]
                        //       console.log("horizontal", newArr)
                        return newArr

                      })

                      let newContent = Modifier.mergeBlockData(
                        blockItem.props.children.props.contentState,
                        SelectionState.createEmpty(groupArr[0].props.children.props.block.getKey()),
                        Immutable.Map({ ...groupArr[0].props.children.props.block.getData().toObject(), horizontal: horizontal[index] }),
                      )

                      let es = EditorState.push(editorState, newContent, 'change-block-data');
                      es = EditorState.acceptSelection(es, editorState.getSelection())

                      setEditorState(es)
                      setTimeout(() => {
                        editorRef.current.focus()
                      }, 0);
                    }}

                  >
                    <HeightIcon className={theme.sizeCss} style={{ transform: "rotate(90deg)" }}
                    />
                  </IconButton>

                </React.Fragment>}


              {/* {React.cloneElement(
                blockItem,
                { ...blockItem.props, ...!blockItemText && { className: "hide" } },

                <>
                  {blockItemData.fromSetting && <SettingBar  {...{ markingColorBlock, markingImageBlock, blockKey: blockItemKey }} />}
                  {blockItem.props.children}
                </>
              )} */}

              {/* <div {...{ ...blockItem.props, ...!blockItemText && { className: "hide" } }}>
                {blockItemData.fromSetting && <SettingBar  {...{ markingColorBlock, markingImageBlock, blockKey: blockItemKey }} />}
                {blockItem.props.children}
              </div> */}

              <div {...{ ...blockItem.props }}>
                {blockItem.props.children}
                {/* {blockItemData.fromSetting && <SettingBar  {...{ markingColorBlock, markingImageBlock, blockKey: blockItemKey }} />} */}

                {<div

                  style={{
                    transform: "translateY(-100%)",
                    position: "absolute",
                    //  background: "orange",
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
                  <Zoom in={true} unmountOnExit={true}>
                    <IconButton className={theme.sizeCss}
                      contentEditable={false}

                      onClick={function (e) {
                        e.preventDefault(); e.stopPropagation()
                        //  markingImageBlock(blockKey)
                        //  setShowColorPanel(pre => !pre)
                      }}
                    >
                      <InsertPhotoOutlinedIcon className={theme.sizeCss} />
                    </IconButton>
                  </Zoom>

                  <Zoom in={true} unmountOnExit={true}>
                    <IconButton className={theme.sizeCss}
                      contentEditable={false}

                      onClick={function (e) {
                        e.preventDefault(); e.stopPropagation();
                        //    inputRef.current.click()
                      }}
                    >
                      <ImageTwoToneIcon className={theme.sizeCss} />
                    </IconButton>
                  </Zoom>

                  {gradientStyleArr.map(function (item, index) {

                    return (
                      <Slide key={index} in={true} direction="left"
                        timeout={{ enter: 100 * index + 100, exit: 100 * (gradientStyleArr.length - index) }}
                        unmountOnExit={true}>
                        <IconButton className={theme.sizeCss} key={index}
                          contentEditable={false}
                          style={{
                            padding: 0,
                          }}
                          onClick={function (e) {
                            e.preventDefault(); e.stopPropagation();
                            markingColorBlock(e, editorState, setEditorState, item, blockItemKey, false)

                          }}>
                          <div className={theme.sizeCss} style={{ borderRadius: "1000px", ...item }} />
                        </IconButton>
                      </Slide>
                    )
                  })}

                </div>
                }
                {

                  <div
                    //  className={theme.sizeCss}
                    contentEditable={false}
                    style={{
                      transform: "translateX(100%) translateY(-100%)",
                      position: "absolute",
                      //  background: "skyblue",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "skyblue",
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
                      style={{ transform: "translateX(0%)", alignItems: "center", backgroundColor: "pink" }}
                      className={theme.sizeCss}
                      contentEditable={false}
                      onMouseDown={function (e) {
                        e.preventDefault()
                        e.stopPropagation()
                      }}

                      onClick={function (e) {
                        e.preventDefault()
                        e.stopPropagation()
                      //  setShowSettingBar(pre => !pre)
                      }}
                    >
                      <SettingsIcon className={theme.sizeCss} />
                    </IconButton>
                    {/* </div> */}
                  </div>
                }

              </div>

            </div>


 

          })


        }
      </div>
    })

    // <div className={colorBlockCss}>
    //   {/* here, this.props.children contains a <section> container, as that was the matching element */}
    //   {props.children}
    // </div>

  )



}


export function markingColorBlock(e, editorState, setEditorState, gradientStyle, targetKey = null, fromSetting = false) {
  e.preventDefault(); e.stopPropagation();


  const selection = targetKey ? SelectionState.createEmpty(targetKey) : editorState.getSelection()


  let allBlocks = Modifier.setBlockType(editorState.getCurrentContent(), selection, "colorBlock")

  // allBlocks = Modifier.setBlockData(allBlocks, editorState.getSelection(), Immutable.Map({ colorBlock: true, ...gradientStyle, horizontal: 50, vertical: 50 }))
  allBlocks = Modifier.mergeBlockData(allBlocks, selection, Immutable.Map({ colorBlock: true, ...gradientStyle, horizontal: 50, vertical: 50, fromSetting }))


  let es = EditorState.push(
    editorState,
    allBlocks,               // editorState.getCurrentContent().getBlockMap().merge(allBlocks)
    "change-block-type",
  )

  // es = targetKey
  //   ? EditorState.forceSelection(es, selection)
  //   : EditorState.acceptSelection(es, selection)

  es = EditorState.forceSelection(es, selection)



  setEditorState(es)

}







