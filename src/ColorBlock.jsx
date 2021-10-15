
import { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, IconButton, Button, ButtonGroup, Container, Paper, Avatar, Box, Chip, Grow, Zoom, Slide } from "@material-ui/core";
import { Image, AlternateEmailSharp } from "@material-ui/icons";


import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';

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



const useStyles = makeStyles(theme => {

  return {


    colorBlockCss: (gradient) => {

      // console.log(gradient.toObject())

      return {

        ...gradient.toObject()
      }
    }

  }


})


export default function ColorBlock(props) {

  //const arr = []

  // props.children.forEach(element => {
  //   const block = element.props.children.props.block


  //   arr.push({ key: block.getKey(), ...block.getData().toObject() })
  // })


  const theme = useTheme()
  const { editorState, setEditorState } = props;
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

  // props.children.reduce((previousItem, currentItem, currentIndex) => {

  //   const previousValue = previousItem.props.children.props.block.getData().toObject().backgroundImage
  //   const currentValue = currentItem.props.children.props.block.getData().toObject().backgroundImage



  //   if (previousValue === currentValue) {
  //     arr[arr.length - 1].push(currentItem)
  //   }
  //   else if (!currentValue) {
  //     arr[arr.length - 1].push(currentItem)
  //   }
  //   else {
  //     arr.push([currentItem])
  //   }
  //   return currentItem

  // })



  const [horizontal, setHorizontal] = useState(arr.map(() => { return 50 }))
  const [vertical, setVertical] = useState(arr.map(() => { return 50 }))

  useEffect(function () {

    setHorizontal(pre => {
      const newArr = arr.map(() => { return 50 })

      pre.forEach((item, index) => {
        if (index < newArr.length) {
          newArr[index] = item
        }
      })

      return newArr

    })


    setVertical(pre => {
      const newArr = arr.map(() => { return 50 })

      pre.forEach((item, index) => {

        if (index < newArr.length) {
          newArr[index] = item
        }

      })

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




  })




  return (

    arr.map((groupArr, index) => {

      return <div key={index}

        style={{
          ...groupArr[0].props.children.props.block.getData().toObject(),
          backgroundPosition: `${horizontal[index]}% ${vertical[index]}%`,

        }}>
        {
          groupArr.map((blockItem) => {

            const blockItemText = blockItem.props.children.props.block.getText()
            const blockItemKey = blockItem.props.children.props.block.getKey()


            //   if (!blockItemText && selection.isCollapsed() && selection.hasFocus && selection.focusKey === blockItemKey) {
            if (selection.isCollapsed() && selection.hasFocus && selection.focusKey === blockItemKey) {
              return <div key={blockItem.props.children.props.block.getKey()} style={{ position: "relative" }}>

                <IconButton className={theme.sizeCss}
                  contentEditable={false}
                  style={{
                    top: "50%",
                    transform: "translateX(100%)  translateY(-50%)",
                    position: "absolute",
                    right: 0,
                  }}

                  onClick={function () {


                    let newContent = Modifier.setBlockType(
                      blockItem.props.children.props.contentState,
                      SelectionState.createEmpty(blockItemKey),
                      "unstyled"
                    )

                    let es = EditorState.push(editorState, newContent, 'change-block-type');

                    newContent = Modifier.setBlockData(
                      newContent,
                      SelectionState.createEmpty(blockItemKey),
                      Immutable.Map({}),
                    )

                    es = EditorState.push(es, newContent, 'change-block-data');
                    es = EditorState.acceptSelection(es, selection)
                    return setEditorState(es)

                  }}

                >
                  <HighlightOffOutlinedIcon className={theme.sizeCss}
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

                  onClick={function () {

                    setVertical(pre => {
                      //  pre + 25
                      const arr = [0, 25, 50, 75, 100]
                      const pos = pre[index] / 25


                      const newArr = [...pre]
                      newArr[index] = arr[(pos + 1) % 5]

                      console.log("verticle", newArr)
                      return newArr

                    })


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

                  onClick={function () {

                    setHorizontal(pre => {
                      //  pre + 25
                      const arr = [0, 25, 50, 75, 100]
                      const pos = pre[index] / 25

                      const newArr = [...pre]
                      newArr[index] = arr[(pos + 1) % 5]
                      console.log("horizontal", newArr)
                      return newArr

                    })


                  }}

                >
                  <HeightIcon className={theme.sizeCss} style={{ transform: "rotate(90deg)" }}
                  />
                </IconButton>



                {blockItem}
              </div>

            }
            else {
              //   console.log(blockItem.props.children.props)
              return blockItem
            }

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



export function ColorBlock1(props) {


  const { block, selection, contentState } = props

  //  const {  readOnly, setReadOnly, EmojiPanel, markingImageBlock, editorState, setEditorState, taggingFontBar } = props.blockProps


  const editorBlockRef = useRef()

  useEffect(function () {
    //  console.log(block.getKey())

    // console.log(editorBlockRef.current._node)
    // console.log(block.getData().toObject())


    editorBlockRef.current._node.style.backgroundImage = block.getData().toObject().backgroundImage
    editorBlockRef.current._node.style.color = block.getData().toObject().color




    //  editorBlockRef.current._node.setStyle({ ...block.getData() })

  })


  return (
    <EditorBlock     {...props} ref={editorBlockRef} />
    // <EditorBlock     {...props}  />

  )



}