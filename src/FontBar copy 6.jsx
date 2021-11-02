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

import Immutable from "immutable"




import { markingColorBlock } from "./ColorBlock";

import {
  red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime,
  yellow, amber, orange, deepOrange, brown, grey, blueGrey
} from '@material-ui/core/colors';




const useStyles = makeStyles(({ textSizeArr, breakpointsAttribute, multiplyArr, ...theme }) => {

  return {

    // panelHeightCss: () => {
    //   return {
    //     ...breakpointsAttribute(["height", multiplyArr(textSizeArr, 1.2)]),
    //   }
    // },

    colorBtnCss: ({ item: item }) => {

      const rgba = colorValues(item && item.color || "white")

      return {
        ...item,
        borderRadius: "1000px",
        color: `rgba(${rgba[0]},${rgba[1]},${rgba[2]},0.1)`,
        ...breakpointsAttribute(["width", multiplyArr(textSizeArr, 1)], ["height", multiplyArr(textSizeArr, 1)]),

        "&:hover": {
          color: `rgba(${rgba[0]},${rgba[1]},${rgba[2]},1)`,
        }

      }

    },

    fontBarCss: ({ basicButtonArr, ...props }) => {

      return {


        "& .MuiTabs-root": {
          minWidth: "0px",
          minHeight: "0px",
        },

        "& .MuiTab-root": {
          minWidth: "0px",
          minHeight: "0px",
          padding: 0,
          margin: 0,
          lineHeight: 1,
          color: theme.palette.text.secondary,

          ...breakpointsAttribute(["width", multiplyArr(textSizeArr, 1.1)], ["height", multiplyArr(textSizeArr, 1.1)]),

        },


        // "& .MuiTab-root:hover": {
        //   backgroundColor: theme.palette.action.selected,
        // },
        "& .MuiTabs-indicator": {
          backgroundColor: "transparent",
          // flexWrap: "wrap",
          // minWidth: "0px",
          // minHeight: "0px",

        },

        // "& .MuiTabs-flexContainer": {
        // flexWrap: "wrap",
        // minWidth: "0px",
        // minHeight: "0px",

        //  },

        // "& .MuiTab-fullWidth": {
        //   flexBasis: "unset",
        //    flexShrink: "unset"
        //  },


        // "& .MuiBox-root": {
        //   padding: 0,
        //   margin: 0,
        //   overflow: "hidden"

        // }
      }
    },

    dotPanelCss: () => {

      return {

      }
    }


  }


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

  const theme = useTheme()
  const fontBarPanelRef = useRef()

  const inputRef = useRef()
  //const [panelColor, setPanelColor] = useState(null)

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


  const panelArr = [

    {

      fn: function () {
        return (
          basicButtonArr.map((item, index) => {
            return <IconButton
              key={index}
              //style={{ padding: 0 }}
              className={theme.sizeCss}
              onClick={(e) => { item.fn(e) }}>{item.btn}</IconButton>
          })
        )
      }
    },
    {
      fn: RenderColorPickerPanel.bind(null, {
        btnArr: [
          red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime,
          yellow, amber, orange, deepOrange, brown, grey, blueGrey
        ],
        basicButtonArr,
        panelColor,
        setPanelColor
      })
    },
    {

      fn: function () {

      }
    },
    {
      fn: function () {


        return (
          <>

            <input ref={inputRef} type="file" multiple={false} style={{ display: "none" }}
              onClick={function (e) { e.currentTarget.value = null; }}
              onChange={update}
            />

            <IconButton
              className={theme.sizeCss}
              //  style={{ padding: 0 }}
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
              <ImageTwoToneIcon className={theme.sizeCss} />
            </IconButton>



            {
              gradientStyleArr.map((item, index) => {
                const { colorBtnCss } = useStyles({ item })
                // const rgba = (colorValues(item.color || "white"))


                return <IconButton
                  key={index}
                  className={theme.sizeCss}
                  // style={{ padding: 0 }}
                  // disabled={(!isAllTextBlock && !isAllColorBlock)}

                  onClick={function (e) {
                    e.preventDefault(); e.stopPropagation();
                    markingColorBlock(e, editorState, setEditorState, item)


                    setTimeout(() => {
                      editorRef.current.focus()
                    }, 0);


                  }}>

                  <RadioButtonUncheckedIcon className={colorBtnCss}
                  //  style={{ ...item, borderRadius: "1000px", color: `rgba(${rgba[0]},${rgba[1]},${rgba[2]},0.3)` }}
                  />
                  {/* <div className={theme.sizeCss} style={{ ...item, borderRadius: "1000px" }} /> */}
                  {/* <div className={theme.sizeCss} style={{ ...item, opacity: isAllTextBlock || isAllColorBlock ? 1 : 0.3, borderRadius: "1000px" }} /> */}
                </IconButton>

              })
            }

          </>
        )
      }
    },

  ]

  const { fontBarCss } = useStyles({ basicButtonArr })

  useLayoutEffect(function () {

    // if ((left === "50%") && (tabValue !== 3)) {
    //   setTabValue(3)
    // }

    // document.querySelectorAll(`span[class*="${theme.lgTextCss}"]:not(span[style*="--font-size-large"])`).forEach(
    //   item => {
    //     item.classList.remove(theme.lgTextCss)
    //   }
    // )


    document.querySelectorAll(`span[class*="${theme.lgTextCss}"]`).forEach(
      item => {
        if (Object.values(item.style).includes("--font-size-large")) { return }
        else {
          item.classList.remove(theme.lgTextCss)
        }

      }
    )


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


    ///////////////////////////////////////


    // document.querySelectorAll(`span[class*="${theme.smTextCss}"]:not(span[style*="--font-size-small"])`).forEach(
    //   item => {
    //     item.classList.remove(theme.smTextCss)
    //   }
    // )

    document.querySelectorAll(`span[class*="${theme.smTextCss}"]`).forEach(
      item => {
        if (Object.values(item.style).includes("--font-size-small")) { return }
        else {
          item.classList.remove(theme.smTextCss)
        }

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
    else { setLeft("50%"); setTop(-4) }




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
        backgroundColor: panelColor || "#acf",
        // borderRadius: "1000px",
        position: "absolute",
        transform: `translateX( calc( -50% + ${taggingWidth / 2}px ) )   translateY(-100%)`,
        transitionProperty: "top ,left, opacity",
        transitionDuration: "100ms",

        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
      onClick={function (e) { }}
    >

      <Tabs

        indicatorColor="primary"
        value={tabValue}
        selectionFollowsFocus={true}
        //onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"

      //variant="scrollable"
      //scrollButtons="on"

      >

        {categoryBtnArr.map((item, index) => {

          return <Tab
            value={index}
            key={index}
            style={{ background: tabValue === index ? "transparent" : theme.isLight ? "lightgrey" : "gray" }}

            label={item}

            onClick={() => {

              setDirectionArr(pre => {

                pre[tabValue] = tabValue > index
                pre[index] = tabValue < index

                return pre //[...pre]

              })

              setTabValue(index)
            }}
          />
        })}

      </Tabs>


      <div key="slide"

        className={theme.panelHeightCss}
        style={{
          //overflow: "hidden", 
          //backgroundColor: "wheat",
          position: "relative", width: "100%", display: "flex", flexWrap: "nowrap",

        }}

      >
        {panelArr.map((panelItem, index) => {

          return (
            <Slide
              key={index}
              in={index === tabValue}
              direction={directionArr[index] ? "left" : "right"}
              onEntered={function () {

                //setTimeout(() => {
                //  editorRef.current.focus()
                //}, 0);

              }}

              onExited={function () {

                //setTimeout(() => {
                //    editorRef.current.focus()
                //}, 0);

              }}
              unmountOnExit={false} timeout={{ exit: 300, enter: 300 }} >

              <div style={{ position: index === 0 ? "relative" : "absolute", padding: "0px" }}>{panelItem.fn()}</div>

            </Slide>

          )


        })}
      </div>
    </Paper>


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




class ColorDot_ extends React.Component {



  constructor(props) {
    super(props)


    this.dotRef = React.createRef()

    this.state = { open: false, anchorEl: null }

    this.lastColor = "3333"
  }

  setOpen = (value) => {
    this.setState(pre => {
      return { ...pre, open: value }
    })
  }

  toggleOpen = () => {
    this.setState(pre => {
      return { ...pre, open: !pre.open }
    })
  }


  setRestAllOpen = (value) => {

    Object.keys(this.props.allDotsArr.current).forEach(key => {
      this.props.color[500] !== key && this.props.allDotsArr.current[key].setOpen(value)
    })
  }

  setAllOpenOff = () => {
    Object.keys(this.props.allDotsArr.current).forEach(item => this.props.allDotsArr.current[item].setOpen(false))
  }

  applyColorToText = (colorString) => {







    //todo
    let editorState = this.props.ctx.editorState
    let setEditorState = this.props.ctx.setEditorState

    const selection = editorState.getSelection()


    console.log(colorString, selection.isCollapsed());

  }



  componentDidMount() {

    if (this.props.color[500]) {
      this.props.allDotsArr.current = {
        ...this.props.allDotsArr.current,
        [this.props.color[500]]: this
      }
    }

    //  console.log( this.props.ctx.editorState);
  }
  componentWillUnmount() {

    if (this.props.color[500]) {
      delete this.props.allDotsArr.current[this.props.color[500]];

    }
  }



  render() {
    const { index, setPanelValue, panelArr, color, setDirection, dotPanelArrIndex, panelColor, setPanelColor, theme, ctx } = this.props

    return (
      <React.Fragment>

        <IconButton
          onMouseDown={(e) => {
            e.stopPropagation(); e.preventDefault();
          }}

          ref={this.dotRef}


          onClick={() => {

            if (color[500]) {


              // this.applyColorToText(color[500])

              this.setRestAllOpen(false);
              this.toggleOpen();
              this.lastColor = color[500]
              setPanelColor(color[500]);

              this.applyColorToText(color[500])
            }
            else {
              setDirection(pre => {
                const selfValue = pre[dotPanelArrIndex] = index === 0 ? "left" : "right"
                const arr = [...new Array(panelArr.length)].map(item => selfValue === "right" ? "left" : "right")
                arr[dotPanelArrIndex] = selfValue
                return arr
              })
              setPanelValue(pre => {
                return (pre + (index === 0 ? -1 : 1)) % panelArr.length
              })
              this.setAllOpenOff()

            }

          }}
          className={theme.sizeCss}>
          {color && color[500] ?
            <RadioButtonUncheckedIcon className={theme.sizeCss} style={{ backgroundColor: color[500], borderRadius: "1000px", color: "transparent" }} />
            : color
          }

        </IconButton>
        {color && color[500] && <Popover
          transitionDuration={{ enter: 0, exit: 300 }}
          elevation={0}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={this.state.open}
          anchorReference="anchorEl"
          //   anchorEl={document.getElementById("colordot" + index)}
          anchorEl={this.dotRef.current && this.dotRef.current.parentElement}
          style={{ pointerEvents: "none", overflow: "hidden", backgroundColor: panelColor, opacity: 0.5 }}



          PaperProps={{
            //  className: theme.heightCss,

            style: {
              pointerEvents: "auto", lineHeight: 1, ...panelColor && { backgroundColor: panelColor },
              borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px",
              overflow: "hidden",
            },


            elevation: 0
          }}

        >
          {Object.keys(color).map((item, index) => {
            if (item === "500" || item[0] === "A") { return null }
            return <IconButton className={theme.sizeCss} key={index}


              // onMouseDown={(e) => {
              //   e.stopPropagation(); e.preventDefault();


              // }}

              onClick={(e) => {
                e.stopPropagation(); e.preventDefault();

                this.setRestAllOpen(false);
                this.lastColor === color[item] && this.toggleOpen();
                this.lastColor = color[item]
                setPanelColor(color[item])



                this.applyColorToText(color[item])




              }}

            >

              <RadioButtonUncheckedIcon className={theme.sizeCss} style={{ backgroundColor: color[item], borderRadius: "1000px", color: "transparent" }} />
            </IconButton>

          })}

        </Popover>}
      </React.Fragment>


    )

  }
}

const ColorDot = withTheme(withContext(ColorDot_))


function RenderColorPickerPanel({ btnArr, basicButtonArr, panelColor, setPanelColor, ...props }) {

  const theme = useTheme()
  const [panelValue, setPanelValue] = useState(0)

  const sourceArr = btnArr

  const totalLength = sourceArr.length
  const perLength = basicButtonArr.length
  let panelArr;

  if (perLength >= totalLength) {
    console.log(totalLength)
  }
  else if ((2 * perLength - 2) >= totalLength) {
    console.log(totalLength, perLength)
  }
  else {
    panelArr = [...new Array(Math.ceil((totalLength - 2) / (perLength - 2)))].map(item => [])

    panelArr[0] = sourceArr.slice(0, perLength - 1)

    panelArr[panelArr.length - 1] = sourceArr.slice(sourceArr.length - (totalLength - (perLength - 1)) % (perLength - 2))


    panelArr = [
      panelArr[0],
      ...sliceIntoChunks((sourceArr.slice(perLength - 1, sourceArr.length - (totalLength - (perLength - 1)) % (perLength - 2))), perLength - 2),
      panelArr[panelArr.length - 1],
    ]

    panelArr.forEach((item, index) => {
      if (index === 0) {
        item.push(<NavigateNextIcon className={theme.sizeCss} />)
      }
      else if (index === panelArr.length - 1) {
        item.unshift(<NavigateBeforeIcon className={theme.sizeCss} />)
      }
      else {
        item.push(<NavigateNextIcon className={theme.sizeCss} />)
        item.unshift(<NavigateBeforeIcon className={theme.sizeCss} />)
      }

    })

  }

  const [direction, setDirection] = useState([...new Array(panelArr.length)].map(item => "left"))



  //  const [panelColor, setPanelColor] = useState(null)
  const allDotsArr = useRef({})

  return (<>

    {panelArr.map((dotArr, dotPanelArrIndex) => {



      return <Slide in={dotPanelArrIndex === panelValue} timeout={{ enter: 300, exit: 300 }}
        direction={direction[dotPanelArrIndex]}


        key={dotPanelArrIndex}
        unmountOnExit={false}>

        <div style={{
          ...panelColor && { backgroundColor: panelColor },

          display: "inline-block", position: "absolute",

        }}>


          {dotArr.map((color, index) => {
            return <ColorDot key={index} {...{ index, setPanelValue, panelArr, color, setDirection, dotPanelArrIndex, panelColor, setPanelColor, allDotsArr }} />

          })}
        </div>
      </Slide>

    })}

  </>)








}








function colorValues(color) {
  if (!color)
    return;
  if (color.toLowerCase() === 'transparent')
    return [0, 0, 0, 0];
  if (color[0] === '#') {
    if (color.length < 7) {
      // convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
      color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] + (color.length > 4 ? color[4] + color[4] : '');
    }
    return [parseInt(color.substr(1, 2), 16),
    parseInt(color.substr(3, 2), 16),
    parseInt(color.substr(5, 2), 16),
    color.length > 7 ? parseInt(color.substr(7, 2), 16) / 255 : 1];
  }
  if (color.indexOf('rgb') === -1) {
    // convert named colors
    var temp_elem = document.body.appendChild(document.createElement('fictum')); // intentionally use unknown tag to lower chances of css rule override with !important
    var flag = 'rgb(1, 2, 3)'; // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14
    temp_elem.style.color = flag;
    if (temp_elem.style.color !== flag)
      return; // color set failed - some monstrous css rule is probably taking over the color of our object
    temp_elem.style.color = color;
    if (temp_elem.style.color === flag || temp_elem.style.color === '')
      return; // color parse failed
    color = getComputedStyle(temp_elem).color;
    document.body.removeChild(temp_elem);
  }
  if (color.indexOf('rgb') === 0) {
    if (color.indexOf('rgba') === -1)
      color += ',1'; // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
    return color.match(/[\.\d]+/g).map(function (a) {
      return +a
    });
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