import React, { createContext, useEffect, useState, useReducer, useRef, useMemo, useCallback, useLayoutEffect, useContext, Component } from 'react';

import { createTheme, ThemeProvider, responsiveFontSizes, List, Avatar, IconButton } from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import colorIndigo from '@material-ui/core/colors/indigo';

import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import ColorLensOutlinedIcon from '@material-ui/icons/ColorLensOutlined';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

//import { makeStyles, styled, useTheme, } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import { stateToHTML } from 'draft-js-export-html';

import styled, { ThemeProvider as StyledThemeProvider } from "styled-components"
import Immutable from "immutable"

import DetectableOverflow from "react-detectable-overflow"


// import {
//   isMobile,
//   isFirefox,
//   isChrome,
//   browserName,
//   engineName,
//   BrowserTypes,
//   deviceDetect
// } from "react-device-detect";

//import axios from 'axios';
//import url, { axios } from './config';
//import jwtDecode from 'jwt-decode';


import { PhoneMissed } from '@material-ui/icons';
import DraftEditor from './DraftEditor';
import Content from "./Content";
import { Button, Switch, FormGroup, FormControlLabel, CssBaseline } from '@material-ui/core';



import { AvatarChip, TwoLineLabel, AvatarLogo } from "./AvatarLogo";

import SwitchBtn from "./SwitchBtn"
import AvatarChipList from "./AvatarChipList"
import { makeStyles } from '@material-ui/styles';

import BasicImageList from "./ImagePanel"


import { FontBar, taggingFontBar } from "./FontBar"
import {
  red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime,
  yellow, amber, orange, deepOrange, brown, grey, blueGrey
} from '@material-ui/core/colors';


let colorStringArr = [];

[red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime,
  yellow, amber, orange, deepOrange, brown, grey, blueGrey].forEach(item => {

    colorStringArr = [...colorStringArr, ...Object.values(item)]
  })

let charSizeArr = ["charSize0", "charSize1", "charSize2", "charSize3", "charSize4", "charSize5"]

//const shadowIndexArr = ["SHADOW0","SHADOW1","SHADOW2","SHADOW3","SHADOW4","SHADOW5","SHADOW6","SHADOW7","SHADOW8"]

const shadowIndexArr = [...new Array(9)].map((item, index) => ("SHADOW" + index))



const shadowTextArr = [

  "0 0 5px #FFF, 0 0 10px #FFF, 0 0 15px #FFF, 0 0 20px #49ff18, 0 0 30px #49FF18, 0 0 40px #49FF18, 0 0 55px #49FF18, 0 0 75px #49ff18",

  "0 -1px 4px #FFF, 0 -2px 10px #ff0, 0 -10px 20px #ff8000, 0 -18px 40px #F00",

  "2px 2px 0 #4074b5, 2px -2px 0 #4074b5, -2px 2px 0 #4074b5, -2px -2px 0 #4074b5, 2px 0px 0 #4074b5, 0px 2px 0 #4074b5, -2px 0px 0 #4074b5, 0px -2px 0 #4074b5",

  "1px 0px 1px #CCCCCC, 0px 1px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 3px 2px 1px #CCCCCC, 2px 3px 1px #EEEEEE, 4px 3px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 5px 4px 1px #CCCCCC, 4px 5px 1px #EEEEEE, 6px 5px 1px #CCCCCC, 5px 6px 1px #EEEEEE, 7px 6px 1px #CCCCCC",

  "0 1px 0 #CCCCCC, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)",

  "0 1px #808d93, -1px 0 #cdd2d5, -1px 2px #808d93, -2px 1px #cdd2d5, -2px 3px #808d93, -3px 2px #cdd2d5, -3px 4px #808d93, -4px 3px #cdd2d5, -4px 5px #808d93, -5px 4px #cdd2d5, -5px 6px #808d93, -6px 5px #cdd2d5, -6px 7px #808d93, -7px 6px #cdd2d5, -7px 8px #808d93, -8px 7px #cdd2d5",

  "2px 2px 0px #FFFFFF, 5px 4px 0px rgba(0,0,0,0.15)",

  "1px 3px 0 #969696, 1px 13px 5px #aba8a8",

  "0 1px 0px #378ab4, 1px 0 0px #5dabcd, 1px 2px 1px #378ab4, 2px 1px 1px #5dabcd, 2px 3px 2px #378ab4, 3px 2px 2px #5dabcd, 3px 4px 2px #378ab4, 4px 3px 3px #5dabcd, 4px 5px 3px #378ab4, 5px 4px 2px #5dabcd, 5px 6px 2px #378ab4, 6px 5px 2px #5dabcd, 6px 7px 1px #378ab4, 7px 6px 1px #5dabcd, 7px 8px 0px #378ab4, 8px 7px 0px #5dabcd",
]





export const Context = createContext();

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

const breakpoints = createBreakpoints({})

function breakpointsAttribute(...args) {
  let xs = {}, sm = {}, md = {}, lg = {}, xl = {};

  args.forEach(item_ => {
    const item = flatten(item_)
    xs = { ...xs, [item[0]]: item[1] }
    sm = { ...sm, [item[0]]: item[2] || item[1] }
    md = { ...md, [item[0]]: item[3] || item[2] || item[1] }
    lg = { ...lg, [item[0]]: item[4] || item[3] || item[2] || item[1] }
    xl = { ...xl, [item[0]]: item[5] || item[4] || item[3] || item[2] || item[1] }
  })
  return {
    [breakpoints.only('xs')]: { ...xs },
    [breakpoints.only('sm')]: { ...sm },
    [breakpoints.only('md')]: { ...md },
    [breakpoints.only('lg')]: { ...lg },
    [breakpoints.only('xl')]: { ...xl },
  }
}

function multiplyArr(arr, factor) {
  return arr.map((item) => {
    const num = Number(item.replace(/[^\d\.]/g, ''))
    const unit = String(item.replace(/[\d\.]/g, ''))
    return String(num * factor + unit)
  })
}

const useStyles = makeStyles((theme) => {

  return {
    sizeCss: ({ textSizeArr }) => {
      return {
        ...breakpointsAttribute(["width", multiplyArr(textSizeArr, 1)], ["height", multiplyArr(textSizeArr, 1)]),
      }
    },
    widthCss: ({ textSizeArr }) => {
      return {
        ...breakpointsAttribute(["width", multiplyArr(textSizeArr, 1)]),
      }
    },

    widthCss2: ({ textSizeArr }) => {
      return {
        ...breakpointsAttribute(["width", multiplyArr(textSizeArr, 2)]),
      }
    },

    widthCss3: ({ textSizeArr }) => {
      return {
        ...breakpointsAttribute(["width", multiplyArr(textSizeArr, 3)]),
      }
    },


    heightCss: ({ textSizeArr }) => {
      return {
        ...breakpointsAttribute(["height", multiplyArr(textSizeArr, 1)]),
        // "& button": {
        //   verticalAlign: "unset"
        // }
      }
    },

    smSizeCss: ({ textSizeArr }) => {
      return {
        ...breakpointsAttribute(["width", multiplyArr(textSizeArr, 0.8)], ["height", multiplyArr(textSizeArr, 0.8)]),
      }
    },

    textCss: ({ textSizeArr }) => {
      return {
        //color: "red",
        ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 1)]),
      }
    },

    smTextCss: ({ textSizeArr }) => {
      return {
        //color: "red",
        ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 0.8)]),
      }
    },

    lgTextCss: ({ textSizeArr }) => {
      return {
        //color: "yellow",
        ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 1.2)]),
      }
    },


  }
})


function createMyTheme({ textSizeArr, isLight, setIsLight, sizeCss, smSizeCss, heightCss, widthCss, widthCss2, widthCss3, myTheme, textCss, smTextCss, lgTextCss }) {

  //console.log( sizeCss, smSizeCss, heightCss, widthCss,  smTextCss)

  return responsiveFontSizes(createTheme(
    {



      textSizeArr,
      factor: 1.3,
      get lgTextSizeArr() { return this.multiplyArr(this.textSizeArr, this.factor) },
      multiplyArr,
      isLight,
      setIsLight,
      breakpointsAttribute,

      sizeCss: sizeCss.split(" ").pop(),
      smSizeCss: smSizeCss.split(" ").pop(),
      heightCss: heightCss.split(" ").pop(),
      widthCss: widthCss.split(" ").pop(),
      widthCss2: widthCss2.split(" ").pop(),
      widthCss3: widthCss3.split(" ").pop(),

      textCss: textCss.split(" ").pop(),
      smTextCss: smTextCss.split(" ").pop(),
      lgTextCss: lgTextCss.split(" ").pop(),

      palette: {
        primary: colorIndigo,
        type: isLight ? 'light' : "dark",
      },
      typography: {
        fontSize: 14,
        button: { textTransform: 'none' },
        body2: breakpointsAttribute(["fontSize", textSizeArr]),
      },


      overrides: {

        MuiCssBaseline: {

          '@global': {
            a:{
              color:"#08c",
              textDecoration:"none",
            },

            html: {

              '& a[style*="--charSize0"],span[style*="--charSize0"]': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 0.5)]),
              },
              '& a[style*="--charSize1"],span[style*="--charSize1"]': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 0.8)]),
              },
              '& a[style*="--charSize2"],span[style*="--charSize2"]': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 1)]),
              },
              '& a[style*="--charSize3"],span[style*="--charSize3"]': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 1.2)]),
              },
              '& a[style*="--charSize4"],span[style*="--charSize4"]': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 1.5)]),
              },
              '& a[style*="--charSize5"],span[style*="--charSize5"]': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 2.0)]),
              },

              '& span[data-mention-head*="@"] span': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 0.8)]),
              },


              '& input[style*="--linkinput"]': {
                //   backgroundColor:"lightBlue",
                //   width:"200%",
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 0.8)], ["height", multiplyArr(textSizeArr, 0.8)]),
                //    width
              },


              // '& div[style*="--linkinput"] input': {
              //   //   backgroundColor:"pink",
              //   //       width:"200%",

              //   ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 0.8)]),

              //   borderWidth: 0,
              //   //    width
              // },



            },


          },
        },

        MuiChip: {
          root: {
            //     ...breakpointsAttribute(["borderRadius", ...textSizeArr])
          }
        },
        MuiPaper: {
          root: {
            fontSize: "3rem",
            ...breakpointsAttribute(["fontSize", textSizeArr])


          }
        },
        // MuiCollapse: {

        //   root:{
        //     transitionProperty:"height, opacity",
        //     opacity:1,
        //   },

        //   hidden: {
        //     visibility: "hidden",
        //     opacity: 0,
        //   }


        // }
      },

    }, myTheme))
}




const inlineStyleFn = (styleNameSet, ...props) => {
  //function inlineStyleFn(styleNameSet, ...props){
  // let color = styleName.filter((value) => value.startsWith("BOLD")).first();

  // console.log(styleName.toArray())
  //console.log(this)



  const styleObj = {

    element: "span",
    style: {},
    attributes: {}

  }

  colorStringArr.forEach(colorString => {
    if (styleNameSet.has(colorString)) {
      styleObj.attributes.textcolor = colorString
    }
  })

  colorStringArr.forEach(colorString => {
    if (styleNameSet.has("#" + colorString)) {
      styleObj.attributes.textbackcolor = colorString
    }
  })

  charSizeArr.forEach(item => {
    if (styleNameSet.has(item)) {
      styleObj.attributes.class = item
    }
  })

  shadowIndexArr.forEach(item => {
    if (styleNameSet.has(item)) {
      styleObj.attributes.textshadow = shadowTextArr[Number(item.replace("SHADOW", ""))]
    }
  })


  styleNameSet.forEach(item => {

    if (item.indexOf("LINK") >= 0) {
      styleObj.attributes.linkadd = item
    }

  })
  // Object.keys(linkDictionary.current).forEach(item=>{

  //   if (styleNameSet.has(item)) {
  //     styleObj.attributes.linkAdd = linkDictionary.current[item]
  //   }

  // })




  return styleObj
}

const entityStyleFn = (entity, ...props) => {

  // console.log("===", props)

  if (entity.getType().indexOf("HEAD") > 0) {
    return {
      element: 'object',
      attributes: {
        "data-type": "avatar_head"
      }
    }
  }
  else if (entity.getType().indexOf("BODY") > 0) {
    return {
      element: 'object',
      attributes: {
        "data-type": "avatar_body"
      },


    }
  }
  else if (entity.getType().indexOf("EMOJI") >= 0) {
    return {
      element: 'object',
      attributes: {
        "data-type": "emoji",
        "data-emoji_symbol": entity.getData().symbol,
        "data-emoji_url": entity.getData().url
      }

    }
  }


}




function toPreHtml(editorState) {

  const linkDictionary = this

  console.log(linkDictionary)

  const preHtml = stateToHTML(
    editorState.getCurrentContent(),
    {
      defaultBlockTag: "div",

      entityStyleFn: entityStyleFn.bind(linkDictionary),
      inlineStyleFn,

      blockStyleFn: function (block) {

        const styleObj = block.getData().toObject()


        return {
          // style: {
          //   ...styleObj.centerBlock && { textAlign: "center" },
          //   ...styleObj.rightBlock && { textAlign: "right" }

          // },
          attributes: {

            ...styleObj.centerBlock && { className: "text-center" },
            ...styleObj.rightBlock && { className: "text-right" }
          }
        }

      },

      blockRenderers: {



        imageBlock: function (block) {
          const text = block.getText()
          const data = escape(JSON.stringify(block.getData().toObject()))
          const type = block.getType()
          const key = block.getKey()



          //  return `<img src=${data.imgUrl} style=max-width:300px;display:block;margin-left:auto;margin-right:auto;/>`
          //  return `<imgtag id=${data.imgId} style=max-width:100%;display:block;margin-left:auto;margin-right:auto;/>`
          return `<object  data-type="image-block"  data-block_key="${key}" data-block_data="${data}" >` + escape(block.getText()) + '</object>'

        },

        // editingBlock:function(block){
        //   alert(JSON.stringify(   block.getData().toObject()))
        // },

        editingBlock: function (block) {
          const text = block.getText()
          const data = block.getData().toObject()//escape(JSON.stringify(block.getData().toObject()))
          const type = block.getType()
          const key = block.getKey()

          let textAlign = data.centerBlock ? "center" : "left"
          textAlign = data.rightBlock ? "right" : textAlign

          // console.log(data.backgroundImage)

          return (

            `<object data-text-align="${textAlign}"  data-type="color-block"  data-block_key="${key}" data-block_data='${JSON.stringify(data)}' data-bgiamge='${data.backgroundImage}' > 
            ${stateToHTML(ContentState.createFromBlockArray([block]), {
              defaultBlockTag: "div",
              entityStyleFn,
              inlineStyleFn,

              blockRenderers: {},
            })}  
            </object>`

          )






        },
      },

    }
  )
  return preHtml
}



const gradientStyleArr0 = [
  {
    backgroundImage: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",// color: "#ffaaaa"
  },
  {
    backgroundImage: "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)", //color: "orange" 
  },
  {
    backgroundImage: "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",// color: "white"
  },
  {
    backgroundImage: "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",  //color: "orange" 
  },
  {
    backgroundImage: "linear-gradient(to top, rgba(207,217,223,0.8) 0%, rgba(226,235,240,0.8) 100%),  url(https://picsum.photos/600/300)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    //  color: "#666",

  },
  {
    backgroundImage: "linear-gradient(to top, rgba(207,217,223,0.8) 0%, rgba(226,235,240,0.8) 100%),  url(https://picsum.photos/500/700)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    //   color: "#666"
  },
  {
    backgroundImage: "linear-gradient(to top, rgba(207,217,223,0.8) 0%, rgba(226,235,240,0.8) 100%),  url(https://picsum.photos/502/700)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    // color: "#666"
  },


]



export default function ContextProvider({ myTheme = {}, ...props }) {


  const [textSizeArr, setTextSizeArr] = useState(["4rem", "6rem", "4rem", "1rem", "2rem"])
  const [isLight, setIsLight] = useState(true)

  const editorRef = useRef()



  const entityMap = {
    "index0111": {
      // "key":"aaaaa",
      "type": "foodMarket",
      "mutability": "MUTABLE",
      "data": {
        "eat": "apple"
      }
    },
  }




  const [editorState, setEditorState] = useState(EditorState.createWithContent(

    convertFromRaw({
      entityMap: {
        //not functional in current draftJS version
        0: { "type": "longMentionOff_HEAD", "mutability": "MUTABLE", "data": { "mentionType": "longMentionOff_HEAD" } },
        1: { "type": "longMentionOff_BODY", "mutability": "MUTABLE", "data": { "mentionType": "longMentionOff_BODY" } },
      },

      blocks: [
        {
          key: "1111", text: "abcs @abc_d  dfgsfsad  dsdfwefwfwf", type: "editingBlock",
          data: { "backgroundImage": "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)", "horizontal": 50, "vertical": 50 },
          inlineStyleRanges: [{ "offset": 0, "length": 1, "style": "BOLD" }, { "offset": 2, "length": 8, "style": "#e91e63" },],
          entityRanges: [{ "offset": 4, "length": 2, "key": 0 }, { "offset": 6, "length": 5, "key": 1 },],
        },

        {
          key: "2222", text: "@ab @fca bcddfgsfsaddsdfwefwfwf", type: "editingBlock",
          inlineStyleRanges: [{ "offset": 0, "length": 3, "style": "BOLD" }, { "offset": 2, "length": 1, "style": "#e91e63" },],
          entityRanges: [{ "offset": 3, "length": 2, "key": 0 }, { "offset": 5, "length": 3, "key": 1 },],
        }
      ]
    }),

  ))

  const [showContent, setShowContent] = useState(false)
  const [showMention, setShowMention] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [avatarHint, setAvatarHint] = useState(false)
  const [showFontBar, setShowFontBar] = useState(false)

  const [showEmojiPanel, setShowEmojiPanel] = useState(false)
  const [emojiCtxStr, setEmojiCtxStr] = useState("😃😄😁😆😅😂")

  const [imageBlockObj, setImageBlockObj] = useState({})

  const { sizeCss, smSizeCss, heightCss, widthCss, widthCss2, widthCss3, textCss, smTextCss, lgTextCss } = useStyles({ textSizeArr })
  const theme = useCallback(createMyTheme({ textSizeArr, isLight, setIsLight, sizeCss, smSizeCss, myTheme, heightCss, widthCss, widthCss2, widthCss3, textCss, smTextCss, lgTextCss }), [textSizeArr, isLight, setIsLight,])


  const bgImageObj = useRef({})
  //const [editorBlockKeyArr, setEditorBlockKeyArr] = useState([])
  //const [darkToLightArr, setDarkToLightArr] = useState([])

  const [tabValue, setTabValue] = useState(false)
  const [panelValue, setPanelValue] = useState(0)   //text color panel
  const [panelColorGroupNum, setPanelColorGroupNum] = useState(0)


  const editingBlockKeyArrRef = useRef([])
  const [gradientStyleArr, setGradientStyleArr] = useState(gradientStyleArr0)



  const [charSizePos, setCharSizePos] = useState(2)

  const [linkValue, setLinkValue] = useState("")
  const linkDictionary = useRef({})

  return (
    <ThemeProvider theme={theme}>

      <StyledThemeProvider theme={theme}>
        <Context.Provider value={{
          //isLight, setIsLight, theme, breakpointsAttribute,
          toPreHtml,// toPreHtml.bind(linkDictionary, editorState, linkDictionary),
          editorRef,
          editorState, setEditorState,
          showMention, setShowMention,
          showContent, setShowContent,
          showHint, setShowHint,
          showFontBar, setShowFontBar,
          avatarHint, setAvatarHint,
          showEmojiPanel, setShowEmojiPanel,
          emojiCtxStr, setEmojiCtxStr,
          imageBlockObj, setImageBlockObj,
          bgImageObj, //setBgImageObj,

          tabValue, setTabValue,

          panelValue, setPanelValue, //text color panel

          panelColorGroupNum, setPanelColorGroupNum,

          // editorBlockKeyArr, setEditorBlockKeyArr,
          //  darkToLightArr, setDarkToLightArr,

          editingBlockKeyArrRef,
          gradientStyleArr, setGradientStyleArr,
          charSizePos, setCharSizePos,
          linkValue, setLinkValue,
          linkDictionary,
          shadowTextArr,
          //     imageArr, setImageArr,
          //  editorTop, setEditorTop,
        }}>

          <CssBaseline />
          {/* <BasicImageList /> */}

          <FormGroup row >
            <FormControlLabel
              control={<SwitchBtn checked={showContent} factor={[2, 2, 2, 1.8, 2.2]}
                onChange={() => { setShowContent(pre => !pre) }} name="showContent" color="primary" />}
              label="Content"
              labelPlacement="start"
            />

            <FormControlLabel style={{ color: "orange", fontSize: "3rem" }}
              control={<SwitchBtn checked={showMention} factor={[2, 2, 2, 1.8, 3]}
                onChange={() => { setShowMention(pre => !pre); editorRef.current.focus() }} name="showMention" color="primary" />}
              label="AvatarMention"
              labelPlacement="start"
            />

            <FormControlLabel style={{ color: "orange", fontSize: "3rem" }}
              control={<SwitchBtn checked={showFontBar} factor={[2, 2, 2, 1.8, 2.2]}
                onChange={() => { setShowFontBar(pre => !pre); editorRef.current.focus() }} name="showFontBar" color="primary" />}
              label="FontBar"
              labelPlacement="start"
            />

            <FormControlLabel style={{ color: "orange", fontSize: "3rem" }}
              control={<SwitchBtn checked={showHint} factor={[2, 2, 2, 1.8, 2.2]}
                onChange={() => { setShowHint(pre => !pre); editorRef.current.focus() }} name="showHint" color="primary" />}
              label="Hint"
              labelPlacement="start"
            />

            <FormControlLabel style={{ color: "orange", fontSize: "3rem" }}
              control={<SwitchBtn checked={avatarHint} factor={[2, 2, 2, 1.8, 2.2]} disabled={!showHint}
                onChange={() => { setAvatarHint(pre => !pre); editorRef.current.focus() }} name="showHint" color="primary" />}
              label="AvatarHint"
              labelPlacement="start"
            />

            <FormControlLabel style={{ color: "orange", fontSize: "3rem" }}

              control={
                <SwitchBtn

                  checked={showEmojiPanel} factor={[2, 2, 2, 1.8, 2.2]}

                  onChange={() => {
                    setShowEmojiPanel(pre => !pre);


                  }} name="showEmojiPanel" color="primary" />
              }
              label="EmojiPanel"
              labelPlacement="start"

            />

            <FormControlLabel style={{ color: "orange", fontSize: "3rem" }}
              control={<SwitchBtn checked={!isLight} factor={[2, 2, 2, 1.8, 2.2]}
                onChange={() => { setIsLight(pre => !pre) }} name="lightDark" color="primary" />}
              label="LightDark"
              labelPlacement="start"
            />
          </FormGroup>


          <DraftEditor />

          <br /> <br />

          {showContent && <Content />}

        </Context.Provider>
      </StyledThemeProvider>
    </ThemeProvider>
  )



}






export function withContext(Compo) {
  return function (props) {
    return <Context.Consumer>{context => <Compo {...props} ctx={context} />}</Context.Consumer>
  }

}

export function withContext1(Compo) {

  return class extends Component {

    //static contextType = Context // Cannot be accessed in HOC
    constructor(props, ctx) {
      super(props, ctx)
    }
    render() {
      return (
        <Compo {...this.props} ctx1={Context} />
      )
    }
  }
}

export function withContext2(Compo) {
  return class extends Component {
    render() {
      return (
        <Context.Consumer>
          {(ctx) => <Compo {...this.props} ctx2={ctx} />}
        </Context.Consumer>
      )
    }
  }
}

export function withContext3(Compo) {

  return function ({ ...props }) {

    const ctx = useContext(Context)

    return <Compo {...props} ctx3={ctx} />
  }
}

export function withContext4(Compo) {
  return function (props) {
    return <Context.Consumer>{context => <Compo {...props} ctx4={context} />}</Context.Consumer>
  }

}
