import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo } from 'react';

import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';


import { Avatar, Chip, Popover, Typography, Container, CssBaseline, Paper, Grow, Zoom, Collapse, Fade, Slide, Button, IconButton } from "@material-ui/core";


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



import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';




import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';


import InvertColorsIcon from '@material-ui/icons/InvertColors';
import InvertColorsOffOutlinedIcon from '@material-ui/icons/InvertColorsOffOutlined';


import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DetectableOverflow from "react-detectable-overflow"


import Immutable from "immutable"

import detectElementOverflow from 'detect-element-overflow'


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



const useStyles = makeStyles(({ textSizeArr, breakpointsAttribute, multiplyArr, ...theme }) => {

  return {
    fontBarCss: ({ buttonCount }) => {



      return {
        // backgroundColor: "lightGreen",
        padding: 0,
        margin: 0,

        //...breakpointsAttribute(["width", multiplyArr(textSizeArr, buttonCount)], ["height", multiplyArr(textSizeArr, 2)]),

        ...breakpointsAttribute(["width", multiplyArr(textSizeArr, buttonCount)])


      }

    },
    colorTabPanelCss: ({ buttonCount }) => {

      return {

        padding: 0,
        margin: 0,
        display: "flex", justifyContent: "flex-start",
        alignItems: "center", //backgroundColor: "pink",


        ...breakpointsAttribute(["width", multiplyArr(textSizeArr, buttonCount)], ["height", multiplyArr(textSizeArr, 1)])


      }

    },

    bottomTabPanelCss: ({ buttonCount }) => {

      return {

        padding: 0,
        margin: 0,
        display: "flex", justifyContent: "flex-start",
        alignItems: "center", //backgroundColor: "pink",


        ...breakpointsAttribute(["width", multiplyArr(textSizeArr, buttonCount)], ["height", multiplyArr(textSizeArr, 1)])


      }

    },




  }


})



export const FontBar = withContext(function ({
  ...props }) {

  const [top, setTop] = useState(-4)
  const [left, setLeft] = useState("50%")

  const fontPanel = useRef()

  const theme = useTheme()

  const { editorState, setEditorState, editorRef, bgImageObj, tabValue, setTabValue, panelColorGroupNum, setPanelColorGroupNum,

    panelValue, setPanelValue, charSizePos, setCharSizePos,gradientStyleArr } = props.ctx



  function toggleInlineStyle(e, fontStr) {
    e.preventDefault(); e.stopPropagation();


    const selection = editorState.getSelection()
    const isCollapsed = selection.isCollapsed()

    if (!isCollapsed) {


      let es = RichUtils.toggleInlineStyle(editorState, fontStr)
      es = EditorState.forceSelection(es, selection)
      setEditorState(es);
      // setTimeout(() => {
      //   editorRef.current && editorRef.current.focus()
      // }, 0);
    }



  }

  function changeInlineStyle(e, fontStr) {
    e.preventDefault(); e.stopPropagation();



    const selection = editorState.getSelection()
    const isCollapsed = selection.isCollapsed()


    if (isCollapsed) { return }

    if (fontStr[0] == "#") {

      let allBlocks = editorState.getCurrentContent()
      const selection = editorState.getSelection()

      colorStringArr.forEach(color => {

        allBlocks = Modifier.removeInlineStyle(allBlocks, selection, color)

      })

      let es = EditorState.push(
        editorState,
        allBlocks,               // editorState.getCurrentContent().getBlockMap().merge(allBlocks)
        "change-inline-style",
      )


      es = RichUtils.toggleInlineStyle(es, fontStr);
      es = EditorState.forceSelection(es, selection)
      setEditorState(es);
      setTimeout(() => {
        editorRef.current && editorRef.current.focus()
      }, 0);

    }

    else if (fontStr === "BIGGER" || fontStr === "SMALLER") {
      let allBlocks = editorState.getCurrentContent();
  
      allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "charSize0")
      allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "charSize1")
      allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "charSize2")
      allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "charSize3")
      allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "charSize4")
      allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "charSize5")

      let es = EditorState.push(editorState, allBlocks, "change-inline-style")


      let newCharSizePos = fontStr === "BIGGER" ? (charSizePos + 1) : fontStr === "SMALLER" ? (charSizePos - 1) : charSizePos

      newCharSizePos = newCharSizePos < 0 ? 5 : newCharSizePos
      newCharSizePos = newCharSizePos > 5 ? 0 : newCharSizePos

      const newFontStr = ["charSize0", "charSize1", "charSize2", "charSize3", "charSize4", "charSize5"][newCharSizePos]

      setCharSizePos(newCharSizePos)

      es = RichUtils.toggleInlineStyle(es, newFontStr);
      es = EditorState.forceSelection(es, selection)
      setEditorState(es);
      // setTimeout(() => {
      //   editorRef.current && editorRef.current.focus()
      // }, 0);
    }

  }

  function clearInlineStyle(e) {

    e.preventDefault(); e.stopPropagation();
    let allBlocks = editorState.getCurrentContent();
    let selection = editorState.getSelection();

    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "BOLD")
    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "ITALIC")
    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "UNDERLINE")

  

    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "charSize0")
    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "charSize1")
    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "charSize2")
    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "charSize3")
    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "charSize4")
    allBlocks = Modifier.removeInlineStyle(allBlocks, selection, "charSize5")


    setCharSizePos(2)

    colorStringArr.forEach(colorString => {
      allBlocks = Modifier.removeInlineStyle(allBlocks, selection, colorString)
    })


    let es = EditorState.push(
      editorState,
      allBlocks,               // editorState.getCurrentContent().getBlockMap().merge(allBlocks)
      "change-inline-style",
    )
    es = EditorState.forceSelection(es, selection)
    setEditorState(es);
    // setTimeout(() => {
    //      editorRef.current && editorRef.current.focus()
    // }, 0);
  }

  function clearInlineColor(e) {

    e.preventDefault(); e.stopPropagation();
    let allBlocks = editorState.getCurrentContent();
    let selection = editorState.getSelection();



    colorStringArr.forEach(colorString => {
      allBlocks = Modifier.removeInlineStyle(allBlocks, selection, colorString)
    })


    let es = EditorState.push(
      editorState,
      allBlocks,               // editorState.getCurrentContent().getBlockMap().merge(allBlocks)
      "change-inline-style",
    )
    es = EditorState.forceSelection(es, selection)
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

    es = EditorState.forceSelection(es, selection)
    setEditorState(es);

    // setTimeout(() => {
    //    editorRef.current.focus()
    // }, 0);
  }

  const categoryBtnArr = [

    <TitleIcon className={theme.sizeCss} />,
    // <FormatColorTextIcon className={theme.sizeCss} />,

    tabValue !== 1 ? <InvertColorsIcon className={theme.sizeCss} /> : <InvertColorsOffOutlinedIcon className={theme.sizeCss} />,


    <LinkIcon className={theme.sizeCss} />,

    <FormatColorFillIcon className={theme.sizeCss} />,


  ]




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
      fn: function (e) { changeInlineStyle(e, "BIGGER"); }

    },
    {
      btn: <TextFieldsIcon className={theme.sizeCss} />,
      fn: function (e) { changeInlineStyle(e, "SMALLER"); }

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

        //  btn: <FiberManualRecordIcon className={theme.sizeCss} style={{ color: item[500] }} />, // not in use
        color: item[500],
        fn: function (e) {

          setPanelColorGroupNum(index);
          changeInlineStyle(e, item[500])
        },
        hoverFn: function (e) {

          setPanelColorGroupNum(index);
          // changeInlineStyle(e, item[500])
        }

      }
    })
  ]


  const subColorGroupFn = function (groupNum) {

    let arr = [];
    [
      red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime,
      yellow, amber, orange, deepOrange, brown, grey, blueGrey].forEach(
        (color) => {

          const tempArr = Object.keys(color).map((item, index) => {
            return {


              btn: <FiberManualRecordIcon className={theme.sizeCss} style={{ color: color[item] }} key={index} />,
              fn: function (e) { changeInlineStyle(e, color[item]) },
              color: color[item],

            }
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

  const { fontBarCss, colorTabPanelCss, bottomTabPanelCss } = useStyles({ buttonCount: basicButtonArr.length })






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

        //    console.log("start", elementNodeList[startElement].firstChild.textContent[relateStartPos - 1])
        //    console.log("end", accumString, elementNodeList[endElement].firstChild.textContent[relateEndPos - 1])

      }

      const { x: fontBarX, y: fontBarY, width } = range.getBoundingClientRect()
      const { x: editorRefX, y: editorRefY, width: editorWidth } = editorRef.current.editor.editor.getBoundingClientRect()
      const x = Number(fontBarX) - Number(editorRefX)
      const y = Number(fontBarY) - Number(editorRefY)



      const fontPanelWdith = Number(window.getComputedStyle(fontPanel.current).width.replace("px", ""))


      //console.log(width)

      const finalX = (x - (fontPanelWdith / 2 - width / 2) + fontPanelWdith) <= editorWidth
        ? (x - (fontPanelWdith / 2 - width / 2))
        : editorWidth - fontPanelWdith




      setLeft(Math.max(0, finalX))
      setTop(y);
      // setTaggingWidth(width)

    }


  })



  return (
    <>
      <div
        id="fontpanel1"
        className={fontBarCss}
        ref={fontPanel}
        style={{
          // top, left: Math.max(0, left),

          top, left,
          display: "block",

          zIndex: 1100,
          overflow: "hidden",
          borderRadius: "4px",

          position: "absolute",
          //   transform: `translateX( calc( -50% + ${taggingWidth / 2}px ) )   translateY(-100%)`,
          //transform: `translateY(-${tabValue === 1 ? 150 : 100}%)`,

          transform: `translateY(-110%)`,

          transitionProperty: "top ,left",
          transitionDuration: "150ms",


          // transitionProperty: "opacity",



          //  overflow: "hidden",
          whiteSpace: "nowrap",
          boxShadow: theme.shadows[5],
          //     backgroundColor: "lightgreen",
          //     backgroundColor:theme.palette.background.default ,
        }}>

        <div className={theme.heightCss} style={{
          display: "flex",
          width: "100%", justifyContent: "flex-start",
          alignItems: "center",

          margin: 0,

          //  backgroundColor:theme.palette.background.default,


        }}>
          {categoryBtnArr.map((item, index) => {

            return <Button

              key={index}
              className={theme.sizeCss}
              style={{
                color: theme.palette.text.secondary,
                //  backgroundColor: tabValue === index ? "skyblue" : "#A0A0A0",

                backgroundColor: tabValue === index ? theme.palette.background.default : "#A0A0A0",

                width: 100 / categoryBtnArr.length + "%",
                minWidth: 0,
                borderRadius: 0,

              }}
              onClick={function (e) {
                e.preventDefault(); e.stopPropagation();
                if (index === 1 && tabValue === 1) {
                  clearInlineColor(e)
                }
                setTabValue(index)
                // index === 1 && tabValue !== 1 && 
                setTimeout(() => {
                  editorRef.current.focus()
                }, 0);
              }}

            >{item}</Button>
          })}

        </div>



        {tabValue === 0 && <RenderColorPickerPanel buttonArr={basicButtonArr} panelCss={colorTabPanelCss} />}


        {tabValue === 1 && <ColorPickerPanel panelCss={colorTabPanelCss} panelValue={panelValue} setPanelValue={setPanelValue} buttonArr={colorButtonArr} />}


        {tabValue === 1 && subColorGroupFn(panelColorGroupNum).map((group, index) => {
          return (
            <RenderColorPickerPanel
              buttonArr={[...group.slice(0, 5), ...group.slice(6, 10),]}
              key={index}
              panelCss={colorTabPanelCss}

            />
          )

        })}




      </div>





    </>
  )



})


function RenderColorPickerPanel({ buttonArr, panelCss, panelWidth, extraButton, panelValue, setPanelValue, panelColor,
  setPanelColor, ...props }) {

  const theme = useTheme()

  const [isOverFlow, setIsOverFlow] = useState(false)

  const [randomId] = useState("--toolbar--" + Math.floor(Math.random() * 1000))

  const { style, ...other } = props


  return (
    <div className={panelCss} style={{
      ...panelWidth && { width: panelWidth },
      //   boxShadow:theme.shadows[5]







    }} >
      {isOverFlow && <IconButton
        style={{
          alignItems: "center",
          padding: 0,
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

          //  backgroundColor: "skyblue",
          backgroundColor: theme.palette.background.default,
          whiteSpace: "nowrap",
          // position: "relative",
          //  flexGrow:1,
          lineHeight: 1,
          overflow: "hidden",
          [randomId]: "--toolbar--"
          // minWidth:"18rem",

          // width: "calc(100% - 4rem)"
        }}>

        {
          buttonArr.map(function (item, index) {
            return (
              <IconButton className={theme.sizeCss} key={index} style={{
                verticalAlign: "top", padding: 0,
                ...item.color && { backgroundColor: item.color },
                ...item.color && { transform: "scale(0.9)" },
                ...item.color && { transition: "background-color 500ms" },
              }}

                onClick={item.fn}
              >
                {!item.color && item.btn}
              </IconButton>
            )
          })
        }



      </DetectableOverflow>



      {
        isOverFlow && <IconButton
          style={{
            alignItems: "center",
            padding: 0,
          }}
          className={theme.sizeCss}

          contentEditable={false}

          onClick={function (e) {


            const toolBar = document.querySelector(`div[style*="${randomId}"]`)
            //  alert( Number(window.getComputedStyle(toolBar).width.replace("px", "")))
            toolBar.scrollBy({
              top: 0,
              // left: Number(window.getComputedStyle(toolBar).width.replace("px", "")) *  Math.min(2, panelValue + 1) ,
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

    </div >
  )


}






function ColorPickerPanel({ panelCss, panelValue, setPanelValue, buttonArr }) {

  const theme = useTheme()




  return (
    <div className={panelCss} style={{

      overflow: "hidden", justifyContent: "flex-start",

      // boxShadow: theme.shadows[5],
      backgroundColor: theme.palette.background.default
    }}>
      <IconButton
        style={{
          alignItems: "center",
          padding: 0,
          display: panelValue <= 0 ? "none" : "block"
        }}
        className={theme.sizeCss}
        contentEditable={false}
        onClick={function () {


          if (panelValue === 2) setPanelValue(pre => 0)
          else setPanelValue(pre => (pre - 1) > 0 ? (pre - 1) : 0)

        }}

      >
        <ChevronLeftIcon className={theme.sizeCss} />
      </IconButton>


      <div style={{ lineHeight: 1, overflow: "hidden", }}>
        {
          buttonArr.map(function (item, index) {
            return (
              <IconButton className={theme.sizeCss} key={index} style={{
                verticalAlign: "top",
                padding: 0,
                transition: "transform 200ms",
                transform: `translateX(-${100 * panelValue}%) scale(0.9)`,
                backgroundColor: item.color,

              }}

                onClick={item.fn}
                onMouseEnter={item.hoverFn}
              />


            )
          })
        }
      </div>


      <IconButton
        style={{
          alignItems: "center",
          padding: 0,
          display: panelValue <= 10 ? "block" : "none"
        }}
        className={theme.sizeCss}
        contentEditable={false}
        onClick={function () {

          if (panelValue === 0) setPanelValue(pre => pre + 2)
          else setPanelValue(pre => pre + 1)


        }}

      >
        <ChevronRightIcon className={theme.sizeCss} />
      </IconButton>

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