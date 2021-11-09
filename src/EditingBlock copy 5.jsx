
import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, IconButton, Tabs, Tab, Button, ButtonGroup, Container, Paper, Popover, Avatar, Box, Chip, Grow, Zoom, Slide, Collapse } from "@material-ui/core";





import CloseIcon from '@material-ui/icons/Close';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import ImageTwoToneIcon from '@material-ui/icons/ImageTwoTone';
import AvatarChipList from "./AvatarChipList";


import HeightIcon from '@material-ui/icons/Height';


import classNames from "classnames"
import { light } from '@material-ui/core/styles/createPalette';
import { lineHeight } from '@material-ui/system';


import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DetectableOverflow from "react-detectable-overflow"


const useStyles = makeStyles(({ textSizeArr, breakpointsAttribute, multiplyArr, ...theme }) => {


  return {

    collapseCss: () => {
      return {

        // right: 0,

        // // display: "flex",
        // alignItems: "center",
        // //   opacity: 0.5,
        // //  transition: "width 0.3s",
        // // width: showSettingBar ? "100%" : 0,
        // width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",

        paddingBottom: "4px",
        // margin: 0,
        // padding: 0,
        // minWidth: 0,
        // minHeight: 0,

        "& .MuiCollapse-wrapperInner": {
          display: "flex",
          margin: 0,
          padding: 0,
          minWidth: 0,
          minHeight: 0,
        }

      }
    },


    toolBarCss: () => {

      return {
        margin: 0,
        padding: 0,
        backgroundColor: "pink",
        minWidth: 0,
        minHeight: 0,

        "& .MuiSvgIcon-fontSizeSmall": {
          ...breakpointsAttribute(["fontSize", textSizeArr]),

        },


        "& .MuiTabs-scrollable": {
          height: "auto",
          display: "flex",
        },

        //  display:"inline-flex",
        "& .MuiTabs-indicator": {
          backgroundColor: "transparent",
          // flexWrap: "wrap",
          minWidth: "0px",
          minHeight: "0px",
          margin: 0,
          padding: 0,

        },
        "& .MuiTabs-flexContainer": {
          //  display: "flex",
        },
        "& button": {
          margin: 0,
          padding: 0,
        },
        "& .MuiTabs-root": {
          minWidth: "0px",
          minHeight: "0px",
        },

        "& .MuiTab-root": {
          minWidth: "0px",
          minHeight: "0px",
          //  padding: 0,
          //  margin: 0,
          // lineHeight: 1,
          // color: theme.palette.text.secondary,

          // ...breakpointsAttribute(["width", multiplyArr(textSizeArr, 1.1)], ["height", multiplyArr(textSizeArr, 1.1)]),

        },



      }

    },



  }


})



export default function EditingBlock(props) {




  const theme = useTheme()

  const { toolBarCss, collapseCss } = useStyles()
  const { editorBlockKeyArr, setEditorBlockKeyArr, darkToLightArr, setDarkToLightArr, bgImageObj, editorState, setEditorState } = useContext(Context)

  //const { editorState, setEditorState, editorRef, gradientStyleArr, showFontBar, setShowFontBar, markingImageBlock, markingColorBlock } = props;
  const { editorRef, gradientStyleArr, showFontBar, setShowFontBar, markingImageBlock, markingColorBlock } = props;

  const selection = editorState.getSelection()
  const startKey = selection.getStartKey()
  const endKey = selection.getEndKey()
  const isStartKeyIn = props.children.some(item => { return item.props.children.props.block.getKey() === startKey })
  const isEndKeyIn = props.children.some(item => { return item.props.children.props.block.getKey() === endKey })
  const hasFocus = selection.getHasFocus()
  const isCollapsed = selection.isCollapsed()

  const displayToolBar = hasFocus && isStartKeyIn && isEndKeyIn
  //const arr = [props.children[0]]
  //let preItemValue = props.children[0].props.children.props.block.getData().toObject().backgroundImage

  const headKey = props.children[0].props.children.props.block.getKey()


  const hasLoaded = editorBlockKeyArr.some(key => {
    return key === headKey
  })
  //const [loaded, setLoaded] = useState(hasLoaded)

  const [showSettingBar, setShowSettingBar] = useState(true)


  const lightToDarkCss = classNames({

    "editor-block-light": !(hasFocus && isStartKeyIn && isEndKeyIn && hasLoaded),
    "editor-block-dark": hasFocus && isStartKeyIn && isEndKeyIn && hasLoaded   //displayToolBar && hasLoaded 




  })


  const ediotrBlockCss = function () { return darkToLightArr.includes(headKey) ? "editor-block-dark-light" : lightToDarkCss }()



  const settingIconCss = classNames({
    "rotate2": true,
  })

  const inputRef = useRef()




  useEffect(function () {
    if (!hasLoaded) {

      setEditorBlockKeyArr(pre => {
        return [...pre, headKey]
      })

    }

    if (setDarkToLightArr.length > 0) {
      setTimeout(() => {
        setDarkToLightArr([])
      }, 300);

    }


  }, [])


  return (

    <div className={ediotrBlockCss}>
  
      {props.children.map((item, index, allChildren) => {

        const block = item.props.children.props.block

        if (isCollapsed && (startKey === block.getKey())) {
          return (
            <React.Fragment key={index} >
              {item}

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
                  //  backgroundColor: "skyblue",
                  //  width:"100%",
                  right: 0,
                  zIndex: 0,
                  userSelect: "none"
                }}
              >
                <div style={{ width: 0 }}>&nbsp;</div>

                <IconButton
                  style={{
                    transform: "translateX(0%)",
                    alignItems: "center",
                    //backgroundColor: "wheat",
                  }}
                  className={theme.sizeCss + " "}
                  contentEditable={false}
                  onMouseDown={function (e) {
                    e.preventDefault()
                    e.stopPropagation()
                  }}

                  onClick={function (e) {
                    e.preventDefault()
                    e.stopPropagation()

                    if (allChildren[index + 1]) {

                      const nextItem = allChildren[index + 1]
                      const nextBlock = nextItem.props.children.props.block
                      if (nextBlock.getType() === "editingBlock") {

                        setDarkToLightArr(pre => {
                          return [...pre, nextBlock.getKey()]
                        })
                      }

                    }
                    //editorState.getCurentConent().getN
                    // markingColorBlock()
                    // markingColorBlock(e, editorState, setEditorState, {}, blockKey)

                    setEditorState(RichUtils.toggleBlockType(editorState, "editingBlock"))
                    block.getKey() === headKey && setEditorBlockKeyArr(pre => {
                      return pre.filter(key => { return key !== headKey })
                    })
                    //setShowSettingBar(pre => !pre)
                  }}
                >

                  <CloseIcon className={theme.sizeCss + " " + settingIconCss} />
                </IconButton>
                {/* </div> */}
              </div>

            </React.Fragment>
          )
        }
        else {
          return item
        }


      })}


      <ToolBar hasLoaded={hasLoaded} inputRef={inputRef} markingImageBlock={markingImageBlock} editorState={editorState}
        ediotrBlockCss={ediotrBlockCss}
      />
  
    </div >
  )



}


function ToolBar({ hasLoaded, inputRef, markingImageBlock, editorState, ediotrBlockCss, anmimationType }) {

  const theme = useTheme()
  const { gradientStyleArr } = useContext(Context)
  const [isOverFlow, setIsOverFlow] = useState(false)

  const [randomId] = useState("--toolbar--" + Math.floor(Math.random() * 1000))





  return (
    <div className={theme.heightCss} style={{ display: "flex", width: "100%", justifyContent: "flex-start", alignItems: "center" }}>
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
          e.preventDefault(); e.stopPropagation()



          markingImageBlock(editorState.getSelection().getStartKey())
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

      <DetectableOverflow //ref={inputRef} 

        onChange={function (overflow) {
          setIsOverFlow(overflow)

       //   console.log(document.querySelector(`div[style*="${randomId}"]`))

        }}


        className={theme.heightCss}
        style={{
          display: "block",
          //    backgroundColor: "wheat", 
          whiteSpace: "nowrap",
          // position: "relative",
          //  flexGrow:1,
          lineHeight: 1,
          overflow: "hidden",
          [randomId]: "--toolbar",
          // minWidth:"18rem",

          // width: "calc(100% - 4rem)"
        }}>
        {gradientStyleArr.map(function (item, index) {


          return (


            React.createElement(
              anmimationType || React.Fragment,

              {
                key: index,
                ...anmimationType && {
                  in: true,
                  unmountOnExit: true,
                  timeout: { enter: hasLoaded ? 0 : Math.floor((index + 1) / gradientStyleArr.length * (gradientStyleArr.length / 9 * 700)) }
                },
              }
              ,
              <div className={theme.sizeCss} contentEditable={false} key={index} style={{
                borderRadius: "1000px",
                display: "inline-block",
                verticalAlign: "top",
                ...item
              }}
                onClick={function (e) {
                  e.preventDefault(); e.stopPropagation();
                  // todo   markingColorBlock(e, editorState, setEditorState, item, headKey, true)
                }}
              />
            )



            // <div className={theme.sizeCss} contentEditable={false} key={index} style={{
            //   borderRadius: "1000px",
            //   display: "inline-block",
            //   verticalAlign: "top",
            //   ...item
            // }}
            //   onClick={function (e) {
            //     e.preventDefault(); e.stopPropagation();
            //     // todo   markingColorBlock(e, editorState, setEditorState, item, headKey, true)
            //   }}
            // />


            // <ConditionWrapper

            //   shouldWrap={!hasLoaded}
            //   WrapCompo={
            //     function ({ children }) {
            //       return (
            //         <Zoom in={true} key={index}
            //           timeout={{
            //             enter: Math.floor((index + 1) / gradientStyleArr.length * (gradientStyleArr.length / 9 * 700))
            //           }}
            //         >{children}</Zoom>
            //       )
            //     }}
            // >
            //   <div className={theme.sizeCss} contentEditable={false} key={index} style={{
            //     borderRadius: "1000px",
            //     display: "inline-block",
            //     verticalAlign: "top",
            //     ...item
            //   }}
            //     onClick={function (e) {
            //       e.preventDefault(); e.stopPropagation();
            //       // todo   markingColorBlock(e, editorState, setEditorState, item, headKey, true)
            //     }}
            //   />
            // </ConditionWrapper>


            // <Zoom in={true} key={index} direction="right" unmountOnExit={true}
            //   timeout={{
            //     enter: hasLoaded ? 0 : Math.floor((index + 1) / gradientStyleArr.length * (gradientStyleArr.length / 9 * 700))
            //   }}
            // >
            //   <div className={theme.sizeCss} contentEditable={false} key={index} style={{
            //     borderRadius: "1000px",
            //     display: "inline-block",
            //     verticalAlign: "top",
            //     ...item
            //   }}
            //     onClick={function (e) {
            //       e.preventDefault(); e.stopPropagation();
            //       // todo   markingColorBlock(e, editorState, setEditorState, item, headKey, true)
            //     }}
            //   />
            // </Zoom>

          )
          //}

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

    </div >
  )
}



function setEditingBlockData() {



}

// const SetEditingBlockData = function () {

//   console.log(".....")

//     return null
//   }


// const setEditingBlockData = withContext(function AA(props) {

// console.log(props)

//   return <></>
// })





// function randomColor() {

//   Math.floor(Math.random() * 255)

//   return `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.1)`

// }


