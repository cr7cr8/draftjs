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
            html: {

              '& span[style*="--charSize0"]': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 0.5)]),
              },
              '& span[style*="--charSize1"]': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 0.8)]),
              },
              '& span[style*="--charSize2"]': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 1)]),
              },
              '& span[style*="--charSize3"]': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 1.2)]),
              },
              '& span[style*="--charSize4"]': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 1.5)]),
              },
              '& span[style*="--charSize5"]': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 2.0)]),
              },

              '& span[data-mention-head*="@"] span': {
                ...breakpointsAttribute(["fontSize", multiplyArr(textSizeArr, 0.8)]),
              },

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


  // let color = styleName.filter((value) => value.startsWith("BOLD")).first();

  // console.log(styleName.toArray())

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

  if (styleNameSet.has("charSize0")) {

    styleObj.attributes.class = "charSize0"
  }
  if (styleNameSet.has("charSize1")) {

    styleObj.attributes.class = "charSize1"
  }
  if (styleNameSet.has("charSize2")) {

    styleObj.attributes.class = "charSize2"
  }
  if (styleNameSet.has("charSize3")) {

    styleObj.attributes.class = "charSize3"
  }
  if (styleNameSet.has("charSize4")) {

    styleObj.attributes.class = "charSize4"
  }
  if (styleNameSet.has("charSize5")) {

    styleObj.attributes.class = "charSize5"
  }


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
      }

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

  const preHtml = stateToHTML(
    editorState.getCurrentContent(),
    {
      defaultBlockTag: "div",

      entityStyleFn,
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
  { backgroundImage: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)", color: "#ffaaaa" },
  { backgroundImage: "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)", color: "orange" },
  { backgroundImage: "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)", color: "white" },
  { backgroundImage: "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)", color: "orange" },
  {
    backgroundImage: "linear-gradient(to top, rgba(207,217,223,0.8) 0%, rgba(226,235,240,0.8) 100%),  url(https://picsum.photos/600/300)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    color: "#666",

  },
  {
    backgroundImage: "linear-gradient(to top, rgba(207,217,223,0.8) 0%, rgba(226,235,240,0.8) 100%),  url(https://picsum.photos/500/700)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    color: "#666"
  },
  {
    backgroundImage: "linear-gradient(to top, rgba(207,217,223,0.8) 0%, rgba(226,235,240,0.8) 100%),  url(https://picsum.photos/502/700)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    color: "#666"
  },


]



export default function ContextProvider({ myTheme = {}, ...props }) {


  const [textSizeArr, setTextSizeArr] = useState(["4rem", "6rem", "4rem", "1rem", "2rem"])
  const [isLight, setIsLight] = useState(true)

  const editorRef = useRef()
  const [editorState, setEditorState] = useState(EditorState.createWithContent(

    convertFromRaw(

      {
        entityMap: {
          // "0": {
          //     type: "image",
          //     mutability: "IMMUTABLE",
          //     data: {
          //         src:
          //             "https://www.draft-js-plugins.com/images/canada-landscape-small.jpg"
          //     }
          // }
        },
        blocks: [
          {
            key: "1111",
            text:" @dsd",
            type: "editingBlock",
          }
        ]
      }

    )
  ))
  //const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText('')))




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

  //const [bgImageObj_, setBgImageObj] = useState({})
  const bgImageObj = useRef({})
  const [editorBlockKeyArr, setEditorBlockKeyArr] = useState([])
  const [darkToLightArr, setDarkToLightArr] = useState([])

  const [tabValue, setTabValue] = useState(0)


  const [panelColorGroupNum, setPanelColorGroupNum] = useState(0)
  const [panelValue, setPanelValue] = useState(0)   //text color panel


  const editingBlockKeyArrRef = useRef([])


  useEffect(function () {

    // console.log(window.getComputedStyle(inputRef.current).width)

    // inputRef.current
  })


  const [gradientStyleArr, setGradientStyleArr] = useState(gradientStyleArr0)

  const [charSizePos, setCharSizePos] = useState(2)

  return (
    <ThemeProvider theme={theme}>

      <StyledThemeProvider theme={theme}>
        <Context.Provider value={{
          //isLight, setIsLight, theme, breakpointsAttribute,
          toPreHtml,
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

          editorBlockKeyArr, setEditorBlockKeyArr,
          darkToLightArr, setDarkToLightArr,

          editingBlockKeyArrRef,
          gradientStyleArr, setGradientStyleArr,
          charSizePos, setCharSizePos,

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
