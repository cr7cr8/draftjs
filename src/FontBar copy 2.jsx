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

import FormatSizeIcon from '@material-ui/icons/FormatSize';
import TextFieldsIcon from '@material-ui/icons/TextFields';

import FormatClearIcon from '@material-ui/icons/FormatClear';



import FormatColorTextIcon from '@material-ui/icons/FormatColorText';


import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
//import NavigateNextIcon from '@material-ui/icons/ArrowForwardIos';


import NavigateNextIcon from '@material-ui/icons/NavigateNext';
//import NavigateBeforeIcon from '@material-ui/icons/ArrowBackIos';



import WallpaperIcon from '@material-ui/icons/Wallpaper';

import Immutable from "immutable"

import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';

import ColorLensTwoToneIcon from '@material-ui/icons/ColorLensTwoTone';

//import tinygradient from "tinygradient";

import { markingColorBlock } from "./ColorBlock";

const useStyles = makeStyles(({ textSizeArr, breakpointsAttribute, multiplyArr }) => {

  return {

    fontBarCss: ({ buttonArr, ...props }) => {

      return {
        ...breakpointsAttribute(["height", multiplyArr(textSizeArr, 1)]),
        ...breakpointsAttribute(["width", multiplyArr(textSizeArr, buttonArr.length)]),
        "& button": { padding: 0, },
        "& > div": {
          ...breakpointsAttribute(["width", multiplyArr(textSizeArr, buttonArr.length)]),
        }
      }
    }

  }


})






export const FontBar = withContext(function ({ gradientStyleArr, editorState, setEditorState, editorRef, bgImageObj, ...props }) {




  let isAllTextBlock = getChoosenBlocks(editorState).every((block, key, ...props) => {
    return block.getType() === "unstyled"
  })

  let isAllColorBlock = getChoosenBlocks(editorState).every((block, key, ...props) => {
    return block.getType() === "colorBlock"
  })



  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [taggingWidth, setTaggingWidth] = useState(0)

  const theme = useTheme()
  const fontBarPanelRef = useRef()
  const [movingPX, setMovingPX] = useState(0)


  const inputRef = useRef()

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

  const buttonArr = [
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

    {
      btn: < LinkIcon className={theme.sizeCss} />,
      fn: function (e) {  }
    },

   
    {
      btn: <div className={theme.sizeCss} style={{background:"orange", borderRadius:"1000px"}}/>,
      fn: function (e) {  }
    },




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

    {
      btn: <NavigateNextIcon className={theme.sizeCss} />,
      fn: function (e) { e.preventDefault(); e.stopPropagation(); setMovingPX(-100) }
    }

  ]
  const { fontBarCss } = useStyles({ buttonArr })


  useLayoutEffect(function () {



    document.querySelectorAll('span[style*="--font-size-large"]').forEach(
      item => {


        if (item.parentElement && item.parentElement.getAttribute("data-mention-head")) {
          // console.log(item.parentElement.getAttribute("data-mention-head"))
        }
        else {
          item.className = theme.lgTextCss
        }

      }
    )
    document.querySelectorAll(`span[class*="${theme.lgTextCss}"]:not(span[style*="--font-size-large"])`).forEach(
      item => {
        item.classList.remove(theme.lgTextCss)
      }
    )

    document.querySelectorAll('span[style*="--font-size-small"]').forEach(
      item => {
        if (item.parentElement && item.parentElement.getAttribute("data-mention-head")) {
          //console.log(item.parentElement.getAttribute("data-mention-head"))
        }
        else {
          item.className = theme.smTextCss
        }
      }
    )
    document.querySelectorAll(`span[class*="${theme.smTextCss}"]:not(span[style*="--font-size-small"])`).forEach(
      item => {
        item.classList.remove(theme.smTextCss)
      }
    )




  })

  useEffect(function () {

    // setTimeout(() => {
    const fontBar = document.querySelector('span[style*="--font-bar"]')
    //   console.log(isAllTextBlock,isAllColorBlock,!!fontBar)
    if (fontBar) {
      const { x: fontBarX, y: fontBarY, width } = fontBar.getBoundingClientRect()
      const { x: editorRefX, y: editorRefY } = editorRef.current.editor.editor.getBoundingClientRect()
      const x = Number(fontBarX) - Number(editorRefX)
      const y = Number(fontBarY) - Number(editorRefY)
      //   console.log(x,y)
      setLeft(x); setTop(y); setTaggingWidth(width)

    }
    else { setLeft(-100); setTop(-100) }




    //  }, 0);

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


      markingColorBlock(e, editorState, setEditorState, updatedImage)

      setTimeout(() => {
        editorRef.current.focus()
      }, 100);

    }

  }




  return (
    <Paper


      className={fontBarCss}


      style={{
        top, left,
        display: "block",
        //  display: (top === 0 && left === 0) ? "none" : "block",
        //  display: editorState.getSelection().isCollapsed() ? "block" : "block",
        //  display: (top === 0 && left === 0) ? "block" : "block",

        //  opacity: editorState.getSelection().isCollapsed() ? 0 : 1,
        //  zIndex: editorState.getSelection().isCollapsed() ? -1 : 1100,

        zIndex: 1100,
        backgroundColor: "#acf",
        borderRadius: "1000px",
        position: "absolute",
        transform: `translateX( calc( -50% + ${taggingWidth / 2}px ) )   translateY(-100%)`,
        transitionProperty: "top ,left, opacity",
        transitionDuration: "100ms",

        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
      onClick={function (e) { }}
    >
      <div ref={fontBarPanelRef}
        style={{
          display: "inline-block",
          transitionProperty: "transform",
          transform: `translateX(${movingPX}%)`,
          transitionDuration: "200ms",
        }}

      >
        {
          buttonArr.map((item, index) => {
            return <IconButton className={theme.sizeCss} key={index} onClick={item.fn}>{item.btn}</IconButton>
          })
        }

      </div>





      <div
        style={{
          //   opacity: 0.5,
          backgroundColor: "pink",


          display: "inline-block",
          transitionProperty: "transform",
          transform: `translateX(${movingPX}%)`,
          transitionDuration: "200ms",
        }}
      >
        <IconButton className={theme.sizeCss}
          onClick={function (e) {
            e.preventDefault(); e.stopPropagation();
            setMovingPX(0)
          }}>
          <NavigateBeforeIcon className={theme.sizeCss} />
        </IconButton>



        <input ref={inputRef} type="file" multiple={false} style={{ display: "none" }}
          onClick={function (e) { e.currentTarget.value = null; }}
          onChange={update}
        />


        <IconButton
          className={theme.sizeCss}
          contentEditable={false}
          onMouseDown={function (e) {
            e.preventDefault()
            e.stopPropagation()

            inputRef.current.click()
            // setTimeout(() => {
            //   editorRef.current.focus()
            // }, 0);
          }}

          onClick={function (e) {
            e.preventDefault()
            e.stopPropagation()

          }}
        >
          <WallpaperIcon className={theme.sizeCss} />
        </IconButton>


        {
          gradientStyleArr.map(function (item, index) {

            return <IconButton className={theme.sizeCss} key={index}
              // disabled={(!isAllTextBlock && !isAllColorBlock)}

              onClick={function (e) {
                e.preventDefault(); e.stopPropagation();
                markingColorBlock(e, editorState, setEditorState, item)
                setMovingPX(-100)

                setTimeout(() => {
                  editorRef.current.focus()
                }, 0);


              }}>
              <div className={theme.sizeCss} style={{ ...item, borderRadius: "1000px" }} />
              {/* <div className={theme.sizeCss} style={{ ...item, opacity: isAllTextBlock || isAllColorBlock ? 1 : 0.3, borderRadius: "1000px" }} /> */}
            </IconButton>

          })
        }

        <IconButton
          className={theme.sizeCss}
          contentEditable={false}
          onClick={function (e) {
            const allBlocks = editorState.getCurrentContent()
            const selection = editorState.getSelection()

            let newContent = Modifier.setBlockType(
              allBlocks,
              selection,
              "unstyled"
            )

            let es = EditorState.push(editorState, newContent, 'change-block-type');

            newContent = Modifier.mergeBlockData(
              newContent,
              selection,
              Immutable.Map({ colorBlock: false }),
            )

            es = EditorState.push(es, newContent, 'change-block-data');
            es = EditorState.forceSelection(es, selection)

            return setEditorState(es)

          }}>
          <HighlightOffOutlinedIcon className={theme.sizeCss} />
        </IconButton>


      </div>







    </Paper >
  )
})




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

  //if (oldSelection.isCollapsed()) { return editorState }


  let allBlocks = editorState.getCurrentContent();
  let newSelection = editorState.getSelection();


  allBlocks.getBlockMap().forEach(function (block) {

    const [blockKey, blockType, blockText, metaArr] = block.toArray()

    metaArr.forEach(function (item, index) {

      // console.log(item.getStyle().toArray(), item.hasStyle("BOLD"))
      if (item.hasStyle("FONTBAR")) {
        newSelection = newSelection.merge({
          anchorKey: blockKey,
          anchorOffset: index,
          focusKey: blockKey,
          focusOffset: index + 1,
          isBackward: false,
          hasFocus: false,
        })
        allBlocks = Modifier.removeInlineStyle(allBlocks, newSelection, "FONTBAR")

      }
    })
  })


  if (oldSelection.isCollapsed()) {

    editorState = EditorState.push(editorState, allBlocks, "change-inline-style");
    editorState = EditorState.acceptSelection(editorState, oldSelection);
    // editorState = EditorState.forceSelection(editorState, oldSelection);
    return editorState

  }
  else {


    allBlocks = Modifier.applyInlineStyle(allBlocks, oldSelection, "FONTBAR")
    editorState = EditorState.push(editorState, allBlocks, "change-inline-style");
    // editorState = EditorState.acceptSelection(editorState, oldSelection);
    //editorState = EditorState.forceSelection(editorState, oldSelection);

    return editorState
  }


}
