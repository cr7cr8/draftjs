import React, { createContext, useEffect, useState, useReducer, useRef, useMemo, useCallback, useLayoutEffect, useContext, Component } from 'react';

import { createTheme, ThemeProvider, responsiveFontSizes, List, Avatar } from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import colorIndigo from '@material-ui/core/colors/indigo';

import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';


//import { makeStyles, styled, useTheme, } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import { stateToHTML } from 'draft-js-export-html';

import styled, { ThemeProvider as StyledThemeProvider } from "styled-components"
import Immutable from "immutable"


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

import yellow from '@material-ui/core/colors/yellow';
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

    heightCss: ({ textSizeArr }) => {
      return {
        ...breakpointsAttribute(["height", multiplyArr(textSizeArr, 1)]),
        "& button": {
          verticalAlign: "unset"
        }
      }
    },

    smSizeCss: ({ textSizeArr }) => {
      return {
        ...breakpointsAttribute(["width", multiplyArr(textSizeArr, 0.8)], ["height", multiplyArr(textSizeArr, 0.8)]),
      }
    },

  }
})


function createMyTheme({ textSizeArr, isLight, setIsLight, sizeCss, smSizeCss, heightCss, widthCss, myTheme }) {

  return responsiveFontSizes(createTheme(
    {



      textSizeArr,
      factor: 1.3,
      get lgTextSizeArr() { return this.multiplyArr(this.textSizeArr, this.factor) },
      multiplyArr,
      isLight,
      setIsLight,
      breakpointsAttribute,

      sizeCss,
      smSizeCss,
      heightCss,
      widthCss,
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


const entityStyleFn = (entity) => {

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

      inlineStyleFn: (styleName) => {



        // let color = styleName.filter((value) => value.startsWith("BOLD")).first();

        // console.log(styleName.toArray())

        // if (color) {
        //   return {
        //     element: 'p',
        //     style: {
        //       color: "red",
        //     },
        //     attributes:{
        //       "data-type": "xxxx",
        //     }
        //   };
        // }


      },


      entityStyleFn,


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
        colorBlock: function (block) {
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


//const MyEditor = withContext3(DraftEditor)

export default function ContextProvider({ myTheme = {}, ...props }) {


  const [textSizeArr, setTextSizeArr] = useState(["4rem", "4rem", "1rem", "6rem", "2rem"])
  const [isLight, setIsLight] = useState(true)

  const editorRef = useRef()
  const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText('')))


  const [showContent, setShowContent] = useState(false)
  const [showMention, setShowMention] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [avatarHint, setAvatarHint] = useState(false)


  const [showEmojiPanel, setShowEmojiPanel] = useState(false)
  const [emojiCtxStr, setEmojiCtxStr] = useState("😃😄😁😆😅😂")

  const [imageBlockObj, setImageBlockObj] = useState({})

  const { sizeCss, smSizeCss, heightCss, widthCss, } = useStyles({ textSizeArr })
  const theme = useCallback(createMyTheme({ textSizeArr, isLight, setIsLight, sizeCss, smSizeCss, myTheme, heightCss, widthCss, }), [textSizeArr, isLight, setIsLight,])

  //const [bgImageObj_, setBgImageObj] = useState({})
  const bgImageObj = useRef({})

  useEffect(function () {


  }, [imageBlockObj])

  // useEffect(function () {
  //   setTimeout(() => {
  //     console.log(editorRef.current.editor.editor.getBoundingClientRect())
  //   }, 500)

  // })


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
          avatarHint, setAvatarHint,
          showEmojiPanel, setShowEmojiPanel,
          emojiCtxStr, setEmojiCtxStr,
          imageBlockObj, setImageBlockObj,
          bgImageObj, //setBgImageObj,
          gradientStyleArr: [
            { backgroundImage: "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)", color: "white" },
            { backgroundImage: "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)", color: "orange" },
            {
              backgroundImage: "linear-gradient(to top, rgba(207,217,223,0.5) 0%, rgba(226,235,240,0.5) 100%),  url(https://picsum.photos/600/300)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              color: "#666"
            },
            {
              backgroundImage: "linear-gradient(to top, rgba(207,217,223,0.5) 0%, rgba(226,235,240,0.5) 100%),  url(https://picsum.photos/500/700)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              color: "#666"
            },
            { backgroundImage: "linear-gradient(45deg, red 0%, blue 100%)", color: "#666" },
          ],


          //     imageArr, setImageArr,
          //  editorTop, setEditorTop,
        }}>

          <CssBaseline />
          {/* <BasicImageList /> */}

          <FormGroup row >
            <FormControlLabel
              control={<SwitchBtn checked={showContent} onChange={() => { setShowContent(pre => !pre) }} name="showContent" color="primary" />}
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

          <Content />

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
