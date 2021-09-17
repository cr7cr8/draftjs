import React, { createContext, useEffect, useState, useReducer, useRef, useMemo, useCallback, useLayoutEffect, useContext, Component } from 'react';

import { createTheme, ThemeProvider, responsiveFontSizes, } from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import colorIndigo from '@material-ui/core/colors/indigo';

import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';


//import { makeStyles, styled, useTheme, } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import { stateToHTML } from 'draft-js-export-html';
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
import { AvatarChip, TwoLineLabel, AvatarLogo } from "./AvatarLogo";

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

export const Context = createContext();




function createMyTheme({ textSizeArr, isLight, setIsLight, myTheme }) {

  return responsiveFontSizes(createTheme(
    {
      textSizeArr,
      factor: 1.3,
      get lgTextSizeArr() { return this.multiplyArr(this.textSizeArr, this.factor) },
      multiplyArr,
      isLight,
      setIsLight,
      breakpointsAttribute,
      palette: {
        primary: colorIndigo,
        type: isLight ? 'light' : "dark",
      },
      typography: {
        fontSize: 14,
        button: { textTransform: 'none' },
        body2: breakpointsAttribute(["fontSize", ...textSizeArr]),
      },


      overrides: {
        MuiChip: {
          root: {
            //     ...breakpointsAttribute(["borderRadius", ...textSizeArr])
          }
        },
        MuiPaper: {
          root: {
            
            fontSize:"3rem",
            ...breakpointsAttribute(["fontSize", textSizeArr])
          }
        }
      },

    }, myTheme))
}
function toPreHtml(editorState) {

  const preHtml = stateToHTML(
    editorState.getCurrentContent(),
    {
      defaultBlockTag: "div",
      entityStyleFn: (entity) => {
        console.log(entity.getType())

        if (entity.getType().indexOf("HEAD") > 0) {
          return {
            element: 'avatar_head',

          }
        }
        else if (entity.getType().indexOf("BODY") > 0) {
          return {
            element: 'avatar_body',

          }
        }
      }
    }
  )
  return preHtml
}


//const MyEditor = withContext3(DraftEditor)

export default function ContextProvider({ myTheme = {}, ...props }) {

  const [textSizeArr, setTextSizeArr] = useState(["1rem", "2rem", "4rem", "6rem", "2rem"])
  const [isLight, setIsLight] = useState(true)
  const theme = useCallback(createMyTheme({ textSizeArr, isLight, setIsLight, myTheme }), [textSizeArr, isLight, setIsLight])

  const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText('')))

  const [show,setShow]=useState(false)

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={{
        //isLight, setIsLight, theme, breakpointsAttribute,
        editorState, setEditorState,toPreHtml

      }}>

        <DraftEditor />
        {show&&<Content />}
        <div><button onClick={function(){setShow(pre=>!pre)}}>show</button></div>
      </Context.Provider>
    </ThemeProvider>
  )


  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={{
        isLight, setIsLight, theme, breakpointsAttribute,
      }}>
        {props.children}
        <button onClick={function () {
          setTextSizeArr(pre => multiplyArr(pre, 1.1))
        }}>add</button>
      </Context.Provider>
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
