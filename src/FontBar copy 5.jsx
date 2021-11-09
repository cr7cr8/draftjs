import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo } from 'react';

import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';


import { Avatar, Chip, Popover, Typography, Container, CssBaseline, Paper, Grow, Zoom, Collapse, Fade, Slide, Button, IconButton } from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Context, withContext } from "./ContextProvider"

import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';


import LinkIcon from '@material-ui/icons/Link';

import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';

import TitleIcon from '@material-ui/icons/Title';
import FormatSizeIcon from '@material-ui/icons/FormatSize';
import TextFieldsIcon from '@material-ui/icons/TextFields';

import FormatClearIcon from '@material-ui/icons/FormatClear';



import FormatColorTextIcon from '@material-ui/icons/FormatColorText';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';


import ImageTwoToneIcon from '@material-ui/icons/ImageTwoTone';


import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';


import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DetectableOverflow from "react-detectable-overflow"


import Immutable from "immutable"




import { markingColorBlock } from "./ColorBlock";

import {
  red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime,
  yellow, amber, orange, deepOrange, brown, grey, blueGrey
} from '@material-ui/core/colors';
import { browserName } from 'react-device-detect';


let colorStringArr = [];

[red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime,
  yellow, amber, orange, deepOrange, brown, grey, blueGrey].forEach(item => {

    colorStringArr = [...colorStringArr, ...Object.values(item)]
  })







export const FontBar = withContext(function ({ gradientStyleArr, editorState, setEditorState, editorRef, bgImageObj, tabValue, setTabValue, panelColor, setPanelColor, ...props }) {

  let isAllTextBlock = getChoosenBlocks(editorState).every((block, key, ...props) => {
    return block.getType() === "unstyled"
  })

  let isAllColorBlock = getChoosenBlocks(editorState).every((block, key, ...props) => {
    return block.getType() === "colorBlock"
  })

  const [top, setTop] = useState(-4)
  const [left, setLeft] = useState("50%")
  const [taggingWidth, setTaggingWidth] = useState(0)

  const [top2,setTop2] = useState(4)
  const [left2, setLeft2] = useState("50%")
  const [taggingWidth2, setTaggingWidth2] = useState(0)



  const theme = useTheme()
  const fontBarPanelRef = useRef()

  const endBlockRef = useRef()
  //const [panelColor, setPanelColor] = useState(null)
  const [colorGroupNum, setColorGroupNum] = useState(0)


  const selection = editorState.getSelection()
  const startKey = selection.getStartKey()
  const endKey = selection.getEndKey()
  // const isStartKeyIn = props.children.some(item => { return item.props.children.props.block.getKey() === startKey })
  // const isEndKeyIn = props.children.some(item => { return item.props.children.props.block.getKey() === endKey })
  const hasFocus = selection.getHasFocus()
  const isCollapsed = selection.isCollapsed()


  function toggleInlineStyle(e, fontStr) {
    e.preventDefault(); e.stopPropagation();

    const isCollapsed = editorState.getSelection().isCollapsed()

    if (!isCollapsed) {



      setEditorState(RichUtils.toggleInlineStyle(editorState, fontStr));
      setTimeout(() => {
        editorRef.current && editorRef.current.focus()
      }, 0);
    }
    else {

      // let newContent = Modifier.replaceText(
      //   editorState.getCurrentContent(),
      //   editorState.getSelection(),
      //   " ",
      // )

      // let newSelection = editorState.getSelection().merge({

      //   anchorKey: editorState.getSelection().getStartKey(),
      //   anchorOffset: editorState.getSelection().getStartOffset(),
      //   focusKey: editorState.getSelection().getStartKey(),
      //   focusOffset: editorState.getSelection().getStartOffset() + 1,
      //   isBackward: false,
      //   hasFocus: true,
      // })


      // let es = EditorState.push(editorState, newContent, "insert-characters");
      // es = EditorState.acceptSelection(es, newSelection)

      // setEditorState(RichUtils.toggleInlineStyle(es, fontStr));

      // setEditorState(es)

    }


  }

  function changeInlineStyle(e, fontStr) {
    e.preventDefault(); e.stopPropagation();

    const isCollapsed = editorState.getSelection().isCollapsed()
    if (!isCollapsed) {
      const allBlocks = Modifier.removeInlineStyle(editorState.getCurrentContent(), editorState.getSelection(), fontStr === "LARGE" ? "SMALL" : "LARGE")

      let es = EditorState.push(
        editorState,
        allBlocks,               // editorState.getCurrentContent().getBlockMap().merge(allBlocks)
        "change-inline-style",
      )


      setEditorState(RichUtils.toggleInlineStyle(es, fontStr));
      setTimeout(() => {
        editorRef.current && editorRef.current.focus()
      }, 0);

    }

  }

  function clearInlineStyle(e) {
    e.preventDefault(); e.stopPropagation();
    let allBlocks = editorState.getCurrentContent();
    let selection = editorState.getSelection();

    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "BOLD")
    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "ITALIC")
    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "UNDERLINE")

    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "SMALL")
    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "LARGE")

    colorStringArr.forEach(colorString => {
      allBlocks = Modifier.removeInlineStyle(allBlocks, selection, colorString)
    })


    let es = EditorState.push(
      editorState,
      allBlocks,               // editorState.getCurrentContent().getBlockMap().merge(allBlocks)
      "change-inline-style",
    )

    setEditorState(es);
    setTimeout(() => {
      editorRef.current && editorRef.current.focus()
    }, 0);
  }

  function changeBlockData(e, dirStr) {

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
    setEditorState(es)
    setTimeout(() => {
      editorRef.current.focus()
    }, 0);
  }

  const categoryBtnArr = [

    <TitleIcon className={theme.sizeCss} />,


    <FormatColorTextIcon className={theme.sizeCss} />,


    <LinkIcon className={theme.sizeCss} />,

    <FormatColorFillIcon className={theme.sizeCss} />,


  ]

  const [directionArr, setDirectionArr] = useState(new Array(categoryBtnArr.length).map(item => true))


  const basicButtonArr = [

    {
      btn: <FormatBoldIcon className={theme.sizeCss} />,
      fn: function (e) { toggleInlineStyle(e, "BOLD") }
    },
    {
      btn: <FormatItalicIcon className={theme.sizeCss} />,
      fn: function (e) { toggleInlineStyle(e, "ITALIC") }
    },
    {
      btn: <FormatUnderlinedIcon className={theme.sizeCss} />,
      fn: function (e) { toggleInlineStyle(e, "UNDERLINE") }
    },
    {
      btn: <FormatSizeIcon className={theme.sizeCss} />,
      fn: function (e) { changeInlineStyle(e, "LARGE"); }
    },
    {
      btn: <TextFieldsIcon className={theme.sizeCss} />,
      fn: function (e) { changeInlineStyle(e, "SMALL"); }
    },

    {
      btn: <FormatClearIcon className={theme.sizeCss} />,
      fn: function (e) { clearInlineStyle(e) }
    },

    // {
    //   btn: < LinkIcon className={theme.sizeCss} />,
    //   fn: function (e) { }
    // },
    {
      btn: <FormatAlignLeftIcon className={theme.sizeCss} />,
      fn: function (e) { changeBlockData(e, "left") }
    },
    {
      btn: <FormatAlignCenterIcon className={theme.sizeCss} />,
      fn: function (e) { changeBlockData(e, "center") }
    },
    {
      btn: <FormatAlignRightIcon className={theme.sizeCss} />,
      fn: function (e) { changeBlockData(e, "right") }
    },

    // {
    //   btn: <NavigateNextIcon className={theme.sizeCss} />,
    //   fn: function (e) { e.preventDefault(); e.stopPropagation(); setMovingPX(-100) }
    // }

  ]

  const colorButtonArr = [

    ...[
      red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime,
      yellow, amber, orange, deepOrange, brown, grey, blueGrey
    ].map((item, index) => {
      return {

        btn: <RadioButtonUncheckedIcon className={theme.sizeCss} style={{ backgroundColor: item[500] }}
          onClick={function () {


            //setOpen(colorGroupNum!==index)

            setColorGroupNum(index);
         //   setOpen(colorGroupNum!==index)
          
          }}
        />,

      }
    })
  ]


  const subColorGroupFn = function (groupNum) {

    let arr = [];
    [
      red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime,
      yellow, amber, orange, deepOrange, brown, grey, blueGrey].forEach(
        (color) => {

          const tempArr = Object.keys(color).map(item => {
            return { btn: <RadioButtonUncheckedIcon className={theme.sizeCss} style={{ backgroundColor: color[item] }} /> }
          })

          arr = [...arr, tempArr]

        })



    return groupNum >= 0 ? [arr[groupNum]] : arr


  }

  const subColorButtonFn = function () {

    let arr = [];
    [
      red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime,
      yellow, amber, orange, deepOrange, brown, grey, blueGrey].forEach(
        (color) => {

          const tempArr = Object.keys(color).map(item => {
            return { btn: <RadioButtonUncheckedIcon className={theme.sizeCss} style={{ backgroundColor: color[item] }} /> }
          })

          arr = [...arr, ...tempArr]

        })
    return arr
  }






  const [open, setOpen] = useState(true)


  useEffect(function () {


    const selection = editorState.getSelection()


    if (!selection.isCollapsed()) {
      const startKey = selection.getStartKey()
      const startOffset = selection.getStartOffset()

      if (!editorState.getCurrentContent().getBlockForKey(startKey).getText()) { return function () { } }



      const endKey = selection.getEndKey()
      const endOffset = selection.getEndOffset()
      const text = editorState.getCurrentContent().getBlockForKey(startKey).getText();
      const sameLine = startKey === endKey
      const selectedText = sameLine ? text.substring(startOffset, endOffset) : text.substr(startOffset)


      // const element = document.querySelector(`div[data-block="true"][data-offset-key*="${startKey}"] [data-offset-key*="${startKey}"]`)

      const elementNodeList =
        document.querySelectorAll(`div[data-block="true"][data-offset-key*="${startKey}"] > div[data-offset-key*="${startKey}"] [data-offset-key*="${startKey}"] [data-text*="true"] `)


      const elementArr = Array.from(elementNodeList).map(el => { return el.firstChild.textContent })

      //  console.log(elementArr, startOffset)
      let startPosDone = false
      let startElement = 0
      let accumString = ""
      let accumString_ = ""

      let relateStartPos = 0;
      elementArr.reduce((previous, current, elementIndex) => {
        // console.log(current)
        accumString_ = previous + current

        if ((startOffset <= accumString_.length - 1) && (startPosDone === false)) {
          startElement = elementIndex
          startPosDone = true
          accumString = accumString_
          //  console.log(current[startOffset])
          relateStartPos = startOffset - previous.length + 1
        }

        return accumString_

      }, "")

      const range = document.createRange();



      range.setStart(elementNodeList[startElement].firstChild, Math.max(0, Math.min(relateStartPos - 1, elementArr[startElement].length - 1)))

      if (!sameLine || endOffset === text.length) {
        range.setEnd(elementNodeList[elementNodeList.length - 1].firstChild, elementNodeList[elementNodeList.length - 1].firstChild.textContent.length)
      }

      else if (sameLine) {

        let endPosDone = false
        let endElement = 0
        accumString = ""
        accumString_ = ""

        let relateEndPos = 0;
        elementArr.reduce((previous, current, elementIndex) => {
          // console.log(current)
          accumString_ = previous + current

          if ((endOffset <= accumString_.length - 1) && (endPosDone === false)) {
            endElement = elementIndex
            endPosDone = true
            accumString = accumString_
            //  console.log(current[startOffset])
            relateEndPos = endOffset - previous.length + 1
          }

          return accumString_

        }, "")

        range.setEnd(elementNodeList[endElement].firstChild, relateEndPos - 1)

        console.log("start", elementNodeList[startElement].firstChild.textContent[relateStartPos - 1])
        console.log("end", accumString, elementNodeList[endElement].firstChild.textContent[relateEndPos - 1])

      }

      const { x: fontBarX, y: fontBarY, width } = range.getBoundingClientRect()
      const { x: editorRefX, y: editorRefY } = editorRef.current.editor.editor.getBoundingClientRect()
      const x = Number(fontBarX) - Number(editorRefX)
      const y = Number(fontBarY) - Number(editorRefY)
      //   console.log(x,y)
      setLeft(x); setTop(y); setTaggingWidth(width)




    }


  })



  useEffect(function () {


    const selection = editorState.getSelection()


    if (!selection.isCollapsed()) {
      const startKey = selection.getStartKey()
      const startOffset = selection.getStartOffset()

      if (!editorState.getCurrentContent().getBlockForKey(startKey).getText()) { return function () { } }



      const endKey = selection.getEndKey()
      const endOffset = selection.getEndOffset()
      const text = editorState.getCurrentContent().getBlockForKey(startKey).getText();
      const sameLine = startKey === endKey
      const selectedText = sameLine ? text.substring(startOffset, endOffset) : text.substr(startOffset)


      // const element = document.querySelector(`div[data-block="true"][data-offset-key*="${startKey}"] [data-offset-key*="${startKey}"]`)

      const elementNodeList =
        document.querySelectorAll(`div[data-block="true"][data-offset-key*="${startKey}"] > div[data-offset-key*="${startKey}"] [data-offset-key*="${startKey}"] [data-text*="true"] `)


      const elementArr = Array.from(elementNodeList).map(el => { return el.firstChild.textContent })

      //  console.log(elementArr, startOffset)
      let startPosDone = false
      let startElement = 0
      let accumString = ""
      let accumString_ = ""

      let relateStartPos = 0;
      elementArr.reduce((previous, current, elementIndex) => {
        // console.log(current)
        accumString_ = previous + current

        if ((startOffset <= accumString_.length - 1) && (startPosDone === false)) {
          startElement = elementIndex
          startPosDone = true
          accumString = accumString_
          //  console.log(current[startOffset])
          relateStartPos = startOffset - previous.length + 1
        }

        return accumString_

      }, "")

      const range = document.createRange();



      range.setStart(elementNodeList[startElement].firstChild, Math.max(0, Math.min(relateStartPos - 1, elementArr[startElement].length - 1)))

      if (!sameLine || endOffset === text.length) {
        range.setEnd(elementNodeList[elementNodeList.length - 1].firstChild, elementNodeList[elementNodeList.length - 1].firstChild.textContent.length)
      }

      else if (sameLine) {

        let endPosDone = false
        let endElement = 0
        accumString = ""
        accumString_ = ""

        let relateEndPos = 0;
        elementArr.reduce((previous, current, elementIndex) => {
          // console.log(current)
          accumString_ = previous + current

          if ((endOffset <= accumString_.length - 1) && (endPosDone === false)) {
            endElement = elementIndex
            endPosDone = true
            accumString = accumString_
            //  console.log(current[startOffset])
            relateEndPos = endOffset - previous.length + 1
          }

          return accumString_

        }, "")

        range.setEnd(elementNodeList[endElement].firstChild, relateEndPos - 1)

        console.log("start", elementNodeList[startElement].firstChild.textContent[relateStartPos - 1])
        console.log("end", accumString, elementNodeList[endElement].firstChild.textContent[relateEndPos - 1])

      }

      const { x: fontBarX, y: fontBarY, width } = range.getBoundingClientRect()
      const { x: editorRefX, y: editorRefY } = editorRef.current.editor.editor.getBoundingClientRect()
      const x = Number(fontBarX) - Number(editorRefX)
      const y = Number(fontBarY) - Number(editorRefY)
      //   console.log(x,y)
      setLeft(x); setTop(y); setTaggingWidth(width)




    }


  })





  useLayoutEffect(function () {

    const element =
      document.querySelector(`div[data-block="true"][data-offset-key*="${endKey}"] > div[data-offset-key*="${endKey}"] [data-offset-key*="${endKey}"] [data-text*="true"] `)
    console.log(element);


    endBlockRef.current = element



  })






  return (

    <div style={{
      top, left,
      display: "block",

      zIndex: 1100,


      position: "absolute",
      transform: `translateX( calc( -50% + ${taggingWidth / 2}px ) )   translateY(-100%)`,
      transitionProperty: "top ,left, opacity",
      transitionDuration: "100ms",

      overflow: "hidden",
      whiteSpace: "nowrap",
    }}>

      <div className={theme.heightCss} style={{
        maxWidth: "30vw", display: "flex", width: "100%", justifyContent: "space-around",
        alignItems: "center", backgroundColor: "#A0A0A0"
      }}>

        {categoryBtnArr.map((item, index) => {

          return <Button

            className={theme.sizeCss}
            style={{
              color: theme.palette.text.secondary,
              backgroundColor: "#A0A0A0",


            }} >{item}</Button>
        })}



      </div>



      {/* <RenderColorPickerPanel basicButtonArr={basicButtonArr} /> */}

      <RenderColorPickerPanel basicButtonArr={colorButtonArr} />



      {/* <Popover
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}

        open={open}
        anchorReference="anchorEl"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorEl={endBlockRef.current}
        style={{ pointerEvents: "none", overflow: "hidden", transform: "translateY(0px)", }}

        PaperProps={{
          //  className: theme.heightCss,

          style: {
            pointerEvents: "auto", lineHeight: 1,// ...panelColor && { backgroundColor: panelColor },
            borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px",
            overflow: "hidden",
          //  opacity: 0.5,
            backgroundColor: "yellow",
            height: "6rem",
          },
          onMouseLeave: function () {  //setOpen(false)
           },
          //   onMouseEnter: function () {  alert("222 enter pop"); setOpen(true) },

          elevation: 0
        }}

      // onMouseLeave={function () { alert("leave leave pop");setOpen(false) }}
      // onMouseEnter={function () { alert("enter pop");setOpen(true) }}

      >
        {subColorGroupFn(colorGroupNum).map((group, index) => {
          return <RenderColorPickerPanel basicButtonArr={group} key={index} />
        })}
      </Popover> */}


      {/* <RenderColorPickerPanel basicButtonArr={subColorButtonFn(red)} /> */}



    </div>
  )



})


function RenderColorPickerPanel({ basicButtonArr, ...props }) {

  const theme = useTheme()
  const { gradientStyleArr } = useContext(Context)
  const [isOverFlow, setIsOverFlow] = useState(false)

  const [randomId] = useState("--toolbar--" + Math.floor(Math.random() * 1000))

  return (
    <div className={theme.heightCss} style={{
      maxWidth: "20rem",   //"10vw", 
      display: "flex", width: "100%", justifyContent: "flex-start",
      alignItems: "center", backgroundColor: "pink"
    }}>
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

      <DetectableOverflow //ref={inputRef} 

        onChange={function (overflow) {
          setIsOverFlow(overflow)

          //   console.log(document.querySelector(`div[style*="${randomId}"]`))

        }}


        className={theme.heightCss}
        style={{
          display: "block",
          backgroundColor: "skyblue",
          whiteSpace: "nowrap",
          // position: "relative",
          //  flexGrow:1,
          lineHeight: 1,
          overflow: "hidden",
          [randomId]: "--toolbar",
          // minWidth:"18rem",

          // width: "calc(100% - 4rem)"
        }}>

        {
          basicButtonArr.map(function (item, index) {
            return (
              <IconButton className={theme.sizeCss} key={index} style={{ verticalAlign: "top", }}>

                {item.btn}
              </IconButton>)
          })
        }



      </DetectableOverflow>



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

    </div>
  )


}








function getChoosenBlocks(editorState) {

  const startKey = editorState.getSelection().getStartKey()
  const endKey = editorState.getSelection().getEndKey()

  let shouldReturn = false;
  const allBlocks = editorState.getCurrentContent().getBlockMap().filter(item => {

    if (item.getKey() === startKey) {
      shouldReturn = true
      return true
    }
    else if (item.getKey() === endKey) {
      shouldReturn = false
      //  return true
      return Boolean(item.getText())
    }
    else {
      return startKey === endKey ? false : shouldReturn
    }
  })

  return allBlocks
}


export function taggingFontBar(editorState) {

  const oldSelection = editorState.getSelection();
  let newSelection = editorState.getSelection();


  //if (oldSelection.isCollapsed()) {


  // setLeft("50%"); setTop(-4)

  //  return editorState
  //}


  let allBlocks = editorState.getCurrentContent();



  allBlocks.getBlockMap().forEach(function (block) {

    const [blockKey, blockType, blockText, metaArr] = block.toArray()
    newSelection = SelectionState.createEmpty(blockKey).merge({

      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: blockText.length,
      isBackward: false,
      hasFocus: false,

    })
    allBlocks = Modifier.removeInlineStyle(allBlocks, newSelection, "FONTBAR")

  })




  if (oldSelection.isCollapsed()) {

    editorState = EditorState.push(editorState, allBlocks, "change-inline-style");
    //  editorState = EditorState.acceptSelection(editorState, oldSelection);
    editorState = EditorState.forceSelection(editorState, oldSelection);
    return editorState

  }
  else {


    allBlocks = Modifier.applyInlineStyle(allBlocks, oldSelection, "FONTBAR")
    editorState = EditorState.push(editorState, allBlocks, "change-inline-style");
    //editorState = EditorState.acceptSelection(editorState, oldSelection);
    editorState = EditorState.forceSelection(editorState, oldSelection);

    return editorState
  }


}












function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}