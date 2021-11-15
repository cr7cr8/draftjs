
import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"


import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, IconButton, Tabs, Tab, Button, ButtonGroup, Container, Paper, Popover, Avatar, Box, Chip, Grow, Fade, Zoom, Slide, Collapse } from "@material-ui/core";





import CloseIcon from '@material-ui/icons/Close';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import ImageTwoToneIcon from '@material-ui/icons/ImageTwoTone';


import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import SwapVertIcon from '@material-ui/icons/SwapVert';






import classNames from "classnames"
import { light } from '@material-ui/core/styles/createPalette';
import { lineHeight } from '@material-ui/system';


import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DetectableOverflow from "react-detectable-overflow"


import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';



export default function EditingBlock(props) {




  const theme = useTheme()


  const { editorBlockKeyArr, setEditorBlockKeyArr, darkToLightArr, setDarkToLightArr,


    gradientStyleArr, setGradientStyleArr,

    bgImageObj, editorState, setEditorState, editorRef, editingBlockKeyArrRef } = useContext(Context)

  const { showFontBar, setShowFontBar, markingImageBlock, markingColorBlock, toolButtonRef } = props;

  const selection = editorState.getSelection()
  const startKey = selection.getStartKey()
  const endKey = selection.getEndKey()
  const isStartKeyIn = props.children.some(item => { return item.props.children.props.block.getKey() === startKey })
  const isEndKeyIn = props.children.some(item => { return item.props.children.props.block.getKey() === endKey })
  const hasFocus = selection.getHasFocus()
  const isCollapsed = selection.isCollapsed()
  const focusKey = selection.getFocusKey()

  const isFocusIn = hasFocus && isStartKeyIn && isEndKeyIn



  const headKey = props.children[0].props.children.props.block.getKey()


  const hasLoaded = editorBlockKeyArr.some(key => {
    return key === headKey
  })


  const [initial, setInitial] = useState(true)
  const [firstTime, setFirstTime] = useState(!editingBlockKeyArrRef.current.includes(headKey))
  const frameCss1 = classNames({

    "shadowOn": isFocusIn,
    "shadowOff": !isFocusIn,
    "shadowEntering": (!(!firstTime && !isFocusIn)) && (firstTime && isFocusIn) && initial,
    "shadowLeaving": (!firstTime && !isFocusIn) && initial,

  })

  const inputRef = useRef()




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



  console.log(arr)




  useEffect(function () {

    setTimeout(() => {
      setInitial(false)
    }, 300);

  }, [])


  useEffect(function () {


    // props.children.forEach((item, index, allChildren) => {
    arr[0].forEach((item, index, allChildren) => {
      const block = item.props.children.props.block;


      if (!(editingBlockKeyArrRef.current.includes(block.getKey()))) {
        editingBlockKeyArrRef.current.push(block.getKey())
      }

    })

    const element = document.querySelector(`div[data-offset-key*="${startKey}"]`)
    const bound = element && element.getBoundingClientRect()

    const bound2 = editorRef.current.editor.editor.getBoundingClientRect()



    selection.hasFocus && toolButtonRef.current && toolButtonRef.current.setTop(bound.top - bound2.top)

    // console.log(editingBlockKeyArrRef.current)
  })






  return (

    <div className={frameCss1} >

      <input ref={inputRef} type="file" multiple={false} style={{ display: "none" }}
        onClick={function (e) { e.currentTarget.value = null; }}
        onChange={function (e) {

          const headKey = editorState.getSelection().getStartKey()

          update({ e, bgImageObj, editorRef, editorState, setEditorState, headKey, gradientStyleArr, setGradientStyleArr })

        }}
      />


      {arr.map((groupArr, index) => {
        const styleObj = groupArr[0].props.children.props.block.getData().toObject()
        const headKey = groupArr[0].props.children.props.block.getKey()

        const isInRange = groupArr.some(item => {
          const block = item.props.children.props.block
          return block.getKey() === editorState.getSelection().getStartKey()
        })


        return (
          <div className={""}
            style={{
              ...styleObj,
              //    backgroundPosition: `${horizontal}% ${vertical}%`,
              backgroundPosition: `${styleObj.horizontal}% ${styleObj.vertical}%`,
            }}
            key={index}>


            {groupArr.map((item, index, allChildren) => {

              const block = item.props.children.props.block


              //   !editingBlockKeyArrRef.current.includes(block.getKey()) && editingBlockKeyArrRef.current.push(block.getKey())

              return (
                item
              )


            })}


            <Collapse in={isFocusIn && isInRange} unmountOnExit={true} contentEditable={false}
              //timeout={{enter:3000,exit:3000}}
              onExited={function () {
                const selection = editorState.getSelection()

                // seteditorSate  
                setEditorState(EditorState.acceptSelection(editorState, selection))

              }}
            >
              {/* <div style={{ position:"absolute",overflow:"hidden", width:"100%"}}> */}
              <ToolBar hasLoaded={hasLoaded} inputRef={inputRef} markingImageBlock={markingImageBlock} editorState={editorState}
                anmimationType={null && Zoom} setEditorState={setEditorState}
                isFocusIn={isFocusIn} headKey={headKey}


                index={index}
              />
              {/* </div> */}
            </Collapse>

          </div >
        )


      })
      }</div>


  )



}


function update({ e, bgImageObj, editorRef, editorState, setEditorState, headKey, gradientStyleArr, setGradientStyleArr }) {
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


    setHeadBlockData(editorState, setEditorState, headKey, updatedImage)
    //  markingColorBlock(e, editorState, setEditorState, updatedImage, blockKey)

    setGradientStyleArr(pre => {

      return [updatedImage, ...pre.filter(item => { return item.backgroundImage !== updatedImage.backgroundImage })]





    })


    setTimeout(() => {

      editorRef.current.focus()
    }, 100);

  }

}






function ToolBar({ hasLoaded, inputRef, markingImageBlock, ediotrBlockCss, isFocusIn, anmimationType, headKey, horizontal, setHorizontal, vertical, setVertical, index }) {

  const theme = useTheme()
  const { gradientStyleArr, editorState, setEditorState, bgImageObj } = useContext(Context)
  const [isOverFlow, setIsOverFlow] = useState(false)

  const [randomId] = useState("--toolbar--" + Math.floor(Math.random() * 1000))




  return (
    <div className={theme.heightCss} style={{
      display: "flex", width: "100%", justifyContent: "flex-start", alignItems: "center",
      // position: "absolute",
       backgroundColor: "rgba(245 ,222	,179 ,0.5)" 
        
      // zIndex:100,
    }}

      contentEditable={false}
    >
      {isOverFlow && <IconButton
        style={{
          alignItems: "center",
        }}
        className={theme.sizeCss}
        contentEditable={false}
        onClick={function () {

          const toolBar = document.querySelector(`div[style*="${randomId}"]`)

          toolBar.scrollBy({
            top: 0,
            left: -Number(window.getComputedStyle(toolBar).width.replace("px", "")) / 2,
            behavior: 'smooth'
          })

        }}
        onDoubleClick={function (e) {
          const toolBar = document.querySelector(`div[style*="${randomId}"]`)
          toolBar.scrollBy({
            top: 0,
            left: -1000,
            behavior: 'smooth'
          })
        }}

      >
        <ChevronLeftIcon className={theme.sizeCss} />
      </IconButton>
      }



      <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();

          inputRef.current.click()



        }}
      >
        <ImageTwoToneIcon className={theme.sizeCss} />
      </IconButton>



      <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();



          const { vertical, horizontal } = editorState.getCurrentContent().getBlockForKey(headKey).getData().toObject()



          let newContent = Modifier.mergeBlockData(
            editorState.getCurrentContent(),
            //blockItem.props.children.props.contentState,
            SelectionState.createEmpty(headKey),
            Immutable.Map({ vertical: vertical >= 0 ? (vertical + 25) > 100 ? 0 : (vertical + 25) : 50 }),
          )




          let es = EditorState.push(editorState, newContent, 'change-block-data');
          es = EditorState.forceSelection(es, editorState.getSelection())

          setEditorState(es)
        }}
      >


        <SwapVertIcon className={theme.sizeCss} />

      </IconButton>



      <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();


          const { vertical, horizontal } = editorState.getCurrentContent().getBlockForKey(headKey).getData().toObject()

          //  horizontal + 25

          let newContent = Modifier.mergeBlockData(
            editorState.getCurrentContent(),
            //blockItem.props.children.props.contentState,
            SelectionState.createEmpty(headKey),
            Immutable.Map({ horizontal: horizontal >= 0 ? (horizontal + 25) > 100 ? 0 : (horizontal + 25) : 50 }),
          )

          let es = EditorState.push(editorState, newContent, 'change-block-data');
          es = EditorState.forceSelection(es, editorState.getSelection())

          setEditorState(es)
        }}
      >
        <SwapHorizIcon className={theme.sizeCss} />
      </IconButton>



      <DetectableOverflow
        contentEditable={false}
        onChange={function (overflow) { setIsOverFlow(overflow) }}

        className={theme.heightCss}
        style={{
          display: "block",
          // backgroundColor: "wheat", 
          whiteSpace: "nowrap",

          lineHeight: 1,
          overflow: "hidden",
          [randomId]: "--toolbar",

        }}>
        {gradientStyleArr.map(function (item, index) {


          return (
            React.createElement(
              anmimationType || React.Fragment,
              {
                key: index,

                ...anmimationType && {
                  in: isFocusIn, unmountOnExit: true,
                  timeout: { enter: hasLoaded ? 0 : Math.floor((index + 1) / gradientStyleArr.length * (gradientStyleArr.length / 9 * 700)) },
                  contentEditable: false,
                  style: {
                    userSelect: "none",
                  }
                },
              }
              ,
              <div className={theme.sizeCss}
                contentEditable={false}

                key={index}
                style={{
                  borderRadius: "1000px",
                  display: "inline-block",
                  verticalAlign: "top",
                  userSelect: "none",
                  cursor: "pointer",
                  ...item
                }}

                onMouseDown={function (e) {
                  e.preventDefault(); e.stopPropagation();

                }}
                onClick={function (e) {
                  e.preventDefault(); e.stopPropagation();

                  // console.log(headKey)

                  setHeadBlockData(editorState, setEditorState, headKey, item)
                  // todo   markingColorBlock(e, editorState, setEditorState, item, headKey, true)
                }}
              />
            )
          )

        })}
      </DetectableOverflow >


      {isOverFlow && <IconButton
        style={{
          alignItems: "center",
        }}
        className={theme.sizeCss}

        contentEditable={false}

        onClick={function (e) {


          const toolBar = document.querySelector(`div[style*="${randomId}"]`)
          toolBar.scrollBy({
            top: 0,
            left: Number(window.getComputedStyle(toolBar).width.replace("px", "")) / 2,
            behavior: 'smooth'
          })
          // document.querySelector('div[style*="--toolbar--xx"]').scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
        }}
        onDoubleClick={function (e) {
          const toolBar = document.querySelector(`div[style*="${randomId}"]`)
          toolBar.scrollBy({
            top: 0,
            left: 1000,
            behavior: 'smooth'
          })
        }}

      >
        <ChevronRightIcon className={theme.sizeCss} />
      </IconButton>
      }


<IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();


          const { vertical, horizontal } = editorState.getCurrentContent().getBlockForKey(headKey).getData().toObject()

          //  horizontal + 25

          let newContent = Modifier.mergeBlockData(
            editorState.getCurrentContent(),
            //blockItem.props.children.props.contentState,
            SelectionState.createEmpty(headKey),
            Immutable.Map({ horizontal: horizontal >= 0 ? (horizontal + 25) > 100 ? 0 : (horizontal + 25) : 50 }),
          )

          let es = EditorState.push(editorState, newContent, 'change-block-data');
          es = EditorState.forceSelection(es, editorState.getSelection())

          setEditorState(es)
        }}
      >
        <SwapHorizIcon className={theme.sizeCss} />
      </IconButton>


    </div >
  )
}


function setHeadBlockData(editorState, setEditorState, headKey, dataObj) {
  const newContent = Modifier.mergeBlockData(
    editorState.getCurrentContent(),

    editorState.getSelection(),

    // SelectionState.createEmpty(headKey),
    Immutable.Map({ ...dataObj, horizontal: 50, vertical: 50 })
  )

  let es = EditorState.push(editorState, newContent, 'change-block-data');
  es = EditorState.forceSelection(es, editorState.getSelection())

  return setEditorState(es)
}


function getRandomColor() {

  return "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + (",") + Math.floor(Math.random() * 255) + ",0.3)"

}