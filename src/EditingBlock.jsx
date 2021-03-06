
import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"


import { genKey, EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
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
import AddIcon from '@material-ui/icons/Add';
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';


import BlurOnIcon from '@material-ui/icons/BlurOn';

import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";


const useStyles = makeStyles((theme) => {

  return {

    imageWrap: ({ styleObj }) => {

      return {
        position: "relative",
        //   '&::before': {

        //     content: '""',  // must have content on to display the backgroundImage, quotes style are =>  '"hihihihi"'
        //     display: "block",
        //     position: "absolute",
        //     left: 0,
        //     top: 0,
        //     width: "100%",
        //     height: "100%",
        //  //   opacity: "0.3",
        //     zIndex:0,
        //     //   backgroundColor:"red",
        //     backgroundImage: styleObj.backgroundImage,//  'url(https://picsum.photos/632/347)', 
        //     backgroundPosition: `${styleObj.horizontal}% ${styleObj.vertical}%`,      //50% 0; */
        //     backgroundSize: "cover",

        //     pointerEvents: "none",

        //   }

      }
    },


  }



})



export default function EditingBlock(props) {




  const theme = useTheme()


  const { // setEditorBlockKeyArr,// darkToLightArr, setDarkToLightArr,


    gradientStyleArr, setGradientStyleArr,

    bgImageObj, editorState, setEditorState, editorRef,

    //   editorBlockKeyArr,
    editingBlockKeyArrRef } = useContext(Context)


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


  //const hasLoaded = editorBlockKeyArr.some(key => {
  const hasLoaded = editingBlockKeyArrRef.current.some(key => {
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



  //console.log(arr)




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



  const fromBlockKey = useRef()




  return (

    <div className={frameCss1}  >

      <input ref={inputRef} type="file" multiple={false} style={{ display: "none" }}
        onClick={function (e) { e.currentTarget.value = null; }}
        onChange={function (e) {

          const headKey = getHeadKey(editorState)

          update({ e, bgImageObj, editorRef, editorState, setEditorState, headKey, gradientStyleArr, setGradientStyleArr })

        }}
      />
      {arr.map((groupArr, index) => {
        //GroupBlock({ groupArr, editorState, hasLoaded, inputRef, markingColorBlock, setEditorState, index, isFocusIn, markingImageBlock })
        const topKey = groupArr[0].props.children.props.block.getKey()
        return <GroupBlock key={index} {...{ groupArr, topKey, editorState, hasLoaded, inputRef, markingColorBlock, setEditorState, index, isFocusIn, markingImageBlock }} />

      })}



    </div>


  )



}

function GroupBlock({ groupArr, editorState, hasLoaded, inputRef, markingColorBlock, setEditorState, topKey, index, isFocusIn, markingImageBlock }) {
  const styleObj = groupArr[0].props.children.props.block.getData().toObject()
  const headKey = groupArr[0].props.children.props.block.getKey()
  const isInRange = groupArr.some(item => {
    const block = item.props.children.props.block
    return block.getKey() === editorState.getSelection().getStartKey()
  })
  // const { imageWrap } = useStyles({ styleObj })
  // console.log(styleObj)

  //alert(imageWrap)
  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute", width: "100%", height: "100%", ...styleObj, zIndex: 1,

        backgroundPosition: `${styleObj.horizontal}% ${styleObj.vertical}%`,
        pointerEvents: "none"
      }}>


      </div>

      <div style={{ zIndex: 10, position: "relative", backgroundColor: "transparent" }}>
        {groupArr.map((item, index, allChildren) => {
          //  console.log(groupArr[0])
          return item
        })}

        <Collapse in={isFocusIn && isInRange} unmountOnExit={true} contentEditable={false}
          //timeout={{enter:3000,exit:3000}}
          onExited={function () {
            const selection = editorState.getSelection()
            // seteditorSate  
            setEditorState(EditorState.acceptSelection(editorState, selection))

          }}
        >
          {isMobile
            ? <ToolBarMobile hasLoaded={hasLoaded} inputRef={inputRef} markingImageBlock={markingImageBlock} editorState={editorState}
              anmimationType={null && Zoom} setEditorState={setEditorState}
              isFocusIn={isFocusIn} headKey={headKey}
              index={index}
              topKey={topKey}
            />
            : <ToolBar hasLoaded={hasLoaded} inputRef={inputRef} markingImageBlock={markingImageBlock} editorState={editorState}
              anmimationType={null && Zoom} setEditorState={setEditorState}
              isFocusIn={isFocusIn} headKey={headKey}
              index={index}
              topKey={topKey}
            />
          }
        </Collapse>
      </div>
    </div>
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


function ToolBarMobile({ hasLoaded, topKey, inputRef, markingImageBlock, ediotrBlockCss, isFocusIn, anmimationType, headKey, horizontal, setHorizontal, vertical, setVertical, index }) {

  const theme = useTheme()
  const { gradientStyleArr, editorState, setEditorState, bgImageObj } = useContext(Context)
  const [isOverFlow, setIsOverFlow] = useState(false)

  const [randomId] = useState("--toolbar--" + Math.floor(Math.random() * 1000))




  return (
    <div className={theme.heightCss} style={{
      display: "flex", width: "fit-content", justifyContent: "flex-start", alignItems: "center",
      // position: "absolute",
      backgroundColor: "rgba(245 ,222	,179 ,0.5)",
      transform: "scale(1.2) translateY(-10%) translateX(10%)"
      // zIndex:100,
    }}

      contentEditable={false}
    >

      <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();


          inputRef.current.click()



        }}
      >
        <AddPhotoAlternateOutlinedIcon className={theme.sizeCss} />
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
            es = EditorState.acceptSelection(es, editorState.getSelection())

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
           es = EditorState.acceptSelection(es, editorState.getSelection())

          setEditorState(es)
        }}
      >
        <SwapHorizIcon className={theme.sizeCss} />
      </IconButton>









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

                const headKey = getHeadKey(editorState)


                setHeadBlockData(editorState, setEditorState, headKey, item)
                // todo   markingColorBlock(e, editorState, setEditorState, item, headKey, true)
              }}
            />
          )
        )

      })}















      {!isMobile && <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();
          changeBlockData({ e, dirStr: "left", editorState, setEditorState })
        }}
      >
        <FormatAlignLeftIcon className={theme.sizeCss} />
      </IconButton>}


      {!isMobile && <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();
          changeBlockData({ e, dirStr: "center", editorState, setEditorState })
        }}
      >
        <FormatAlignCenterIcon className={theme.sizeCss} />
      </IconButton>}

      {!isMobile && <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();
          changeBlockData({ e, dirStr: "right", editorState, setEditorState })
        }}
      >
        <FormatAlignRightIcon className={theme.sizeCss} />
      </IconButton>}






      <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();
          // const headKey = getHeadKey(editorState)
          changeOpacity({ topKey, editorState, setEditorState })


        }}
      >
        <BlurOnIcon className={theme.sizeCss} />
      </IconButton>




      <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          //       alert("x")
          e.preventDefault(); e.stopPropagation();


          //addEmptyBlock(editorState,setEditorState)
          if (editorState.getSelection().isCollapsed()) {
            let es = EditorState.moveFocusToEnd(editorState)

            let newContentState = Modifier.splitBlock(es.getCurrentContent(), es.getSelection())

            es = EditorState.push(es, newContentState, "split-block")

            newContentState = Modifier.setBlockData(
              newContentState, es.getSelection(),
              Immutable.Map({ backgroundImage: `linear-gradient(${Math.floor(Math.random() * 360)}deg,${getRandomColor()} 0%,${getRandomColor()} 100%)`, opacity: 1 })
            )

            newContentState = Modifier.setBlockType(newContentState, es.getSelection(), "editingBlock")


            es = EditorState.push(es, newContentState, "change-block-type")


            setEditorState(es)


          }
        }}

      >
        <AddIcon className={theme.sizeCss} />
      </IconButton>


    </div >
  )
}



function ToolBar({ hasLoaded, topKey, inputRef, markingImageBlock, ediotrBlockCss, isFocusIn, anmimationType, headKey, horizontal, setHorizontal, vertical, setVertical, index }) {

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

      <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();


          inputRef.current.click()



        }}
      >
        <AddPhotoAlternateOutlinedIcon className={theme.sizeCss} />
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

                  const headKey = getHeadKey(editorState)


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












      {!isMobile && <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();
          changeBlockData({ e, dirStr: "left", editorState, setEditorState })
        }}
      >
        <FormatAlignLeftIcon className={theme.sizeCss} />
      </IconButton>}


      {!isMobile && <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();
          changeBlockData({ e, dirStr: "center", editorState, setEditorState })
        }}
      >
        <FormatAlignCenterIcon className={theme.sizeCss} />
      </IconButton>}

      {!isMobile && <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();
          changeBlockData({ e, dirStr: "right", editorState, setEditorState })
        }}
      >
        <FormatAlignRightIcon className={theme.sizeCss} />
      </IconButton>}






      <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          e.preventDefault(); e.stopPropagation();
          // const headKey = getHeadKey(editorState)
          changeOpacity({ topKey, editorState, setEditorState })


        }}
      >
        <BlurOnIcon className={theme.sizeCss} />
      </IconButton>




      <IconButton className={theme.sizeCss}
        contentEditable={false}

        onClick={function (e) {
          //       alert("x")
          e.preventDefault(); e.stopPropagation();


          //addEmptyBlock(editorState,setEditorState)
          if (editorState.getSelection().isCollapsed()) {
            let es = EditorState.moveFocusToEnd(editorState)

            let newContentState = Modifier.splitBlock(es.getCurrentContent(), es.getSelection())

            es = EditorState.push(es, newContentState, "split-block")

            newContentState = Modifier.setBlockData(
              newContentState, es.getSelection(),
              Immutable.Map({ backgroundImage: `linear-gradient(${Math.floor(Math.random() * 360)}deg,${getRandomColor()} 0%,${getRandomColor()} 100%)`, opacity: 1 })
            )

            newContentState = Modifier.setBlockType(newContentState, es.getSelection(), "editingBlock")


            es = EditorState.push(es, newContentState, "change-block-type")


            setEditorState(es)


          }
        }}

      >
        <AddIcon className={theme.sizeCss} />
      </IconButton>


    </div >
  )
}

function getHeadKey(editorState) {
  const focusKey = editorState.getSelection().getFocusKey()
  let dataObj = editorState.getCurrentContent().getBlockForKey(focusKey).getData().toObject()

  let headKey = focusKey
  while ((!dataObj.backgroundImage) && (editorState.getCurrentContent().getBlockBefore(headKey))) {
    console.log(dataObj)
    headKey = editorState.getCurrentContent().getBlockBefore(headKey).getKey()
    dataObj = editorState.getCurrentContent().getBlockForKey(headKey).getData().toObject()
  }
  return headKey
}





function setHeadBlockData(editorState, setEditorState, headKey, dataObj, individual = false) {
  const newContent = Modifier.mergeBlockData(
    editorState.getCurrentContent(),

    //   individual ? editorState.getSelection() : SelectionState.createEmpty(headKey),

    SelectionState.createEmpty(headKey),
    Immutable.Map({ ...dataObj, horizontal: 50, vertical: 50, opacity: 1 })
  )

  let es = EditorState.push(editorState, newContent, 'change-block-data');
  es = isMobile ? EditorState.acceptSelection(es, editorState.getSelection()) : EditorState.forceSelection(es, editorState.getSelection())

  return setEditorState(es)
}


function changeOpacity({ topKey, editorState, setEditorState }) {



  const selection = editorState.getSelection()

  const data = editorState.getCurrentContent().getBlockForKey(topKey).getData().toObject()

  let opacity = 1
  if (data.opacity === null || data.opacity === undefined) {
    opacity = 1
  }
  else {
    opacity = data.opacity + 0.25
    if (opacity > 1) {
      opacity = 0
    }

  }


  let allBlocks = Modifier.mergeBlockData(editorState.getCurrentContent(), SelectionState.createEmpty(topKey), Immutable.Map({ opacity }))

  let es = EditorState.push(
    editorState,
    allBlocks,               // editorState.getCurrentContent().getBlockMap().merge(allBlocks)
    "change-block-data",
  )

  es = isMobile ? EditorState.acceptSelection(es, editorState.getSelection()) : EditorState.forceSelection(es, editorState.getSelection())
 // es = EditorState.forceSelection(es, selection)
  setEditorState(es);

}


function changeBlockData({ e, dirStr, editorState, setEditorState }) {

  e.preventDefault(); e.stopPropagation();

  const selection = editorState.getSelection()
  const startKey = selection.getStartKey()
  const data = editorState.getCurrentContent().getBlockForKey(startKey).getData().toObject()

  const dirObj = {
    left: { centerBlock: false, rightBlock: false },
    center: { centerBlock: !(data.centerBlock), rightBlock: false },
    right: { centerBlock: false, rightBlock: !(data.rightBlock) }
  }


  let allBlocks = Modifier.mergeBlockData(editorState.getCurrentContent(), editorState.getSelection(), Immutable.Map(dirObj[dirStr]))

  let es = EditorState.push(
    editorState,
    allBlocks,               // editorState.getCurrentContent().getBlockMap().merge(allBlocks)
    "change-block-data",
  )

  es = EditorState.forceSelection(es, selection)
  setEditorState(es);

  // setTimeout(() => {
  //    editorRef.current.focus()
  // }, 0);
}



function getRandomColor() {

  return "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + (",") + Math.floor(Math.random() * 255) + ",0.3)"

}

