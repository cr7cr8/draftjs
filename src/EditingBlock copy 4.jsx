
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


  const toolBar = useMemo(
    () => (
      <>
        <input ref={inputRef} type="file" multiple={false} style={{ display: "none" }}
          onClick={function (e) { e.currentTarget.value = null; }}
          onChange={function (e) {

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
              const pickedBgImage = bgImageObj.current[files[0].name]

              // console.log(pickedBgImage)
              // setEditingBlockData(editorState, setEditorState)

              let allBlocks = Modifier.setBlockType(editorState.getCurrentContent(), editorState.getSelection(), "editingBlock")
              allBlocks = Modifier.mergeBlockData(allBlocks, selection, Immutable.Map({ colorBlock: true, ...pickedBgImage, horizontal: 50, vertical: 50, }))
              let es = EditorState.push(
                editorState,
                allBlocks,               // editorState.getCurrentContent().getBlockMap().merge(allBlocks)
                "change-block-type",
              )
              es = EditorState.forceSelection(es, selection)



              setEditorState(es)

              //   markingColorBlock(e, editorState, setEditorState, updatedImage)

              // setTimeout(() => {
              //   editorRef.current.focus()
              // }, 100);

            }

          }}
        />


        <Collapse
          contentEditable={false}
          in={hasLoaded && isStartKeyIn && isEndKeyIn}
          timeout={{ enter: 300, exit: 0 }}

          className={collapseCss}

        >




          <div style={{ display: "flex", backgroundColor: "orange" }}>
            <Zoom in={showSettingBar} unmountOnExit={true} timeout={{ enter: hasLoaded ? 0 : 300, exit: 300 }} >
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
            </Zoom>

            <Zoom in={showSettingBar} unmountOnExit={true} timeout={{ enter: hasLoaded ? 0 : 300, exit: 300 }}  >
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
          </div>



          <Tabs

            className={toolBarCss}

            indicatorColor="primary"
            value={1}
            selectionFollowsFocus={true}
            //onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            // variant="fullWidth"

            variant="scrollable"
            scrollButtons="auto"
            style={{
              // display: "inline-block",
              // backgroundColor: "lightyellow" 

            }}
          >

            {gradientStyleArr.map(function (item, index) {
              return (

                <Tab key={index}
                  value={index}
                  icon={
                    <Grow key={index} in={hasLoaded && displayToolBar} in={true} direction="left"
                      timeout={{ enter: hasLoaded ? 0 : 200 * index + 100, exit: 100 * (gradientStyleArr.length - index) }}
                      unmountOnExit={true}>

                      <div className={theme.sizeCss} contentEditable={false} style={{ borderRadius: "1000px", ...item }}
                        onClick={function (e) {
                          e.preventDefault(); e.stopPropagation();
                          // todo   markingColorBlock(e, editorState, setEditorState, item, headKey, true)




                        }}
                      />
                    </Grow>
                  }
                />
              )
            })}
          </Tabs>

        </Collapse>
      </>
    ),
    [showSettingBar, hasLoaded, displayToolBar, inputRef, bgImageObj, editorState]
  )


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
      {/* <div className="editor-block-wrapper"> */}
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



      {toolBar}
      {/* </div> */}
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


