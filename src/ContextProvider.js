import React, { createContext, useEffect, useState, useReducer, useRef, useMemo, useCallback, useLayoutEffect } from 'react';

import { createTheme, ThemeProvider, responsiveFontSizes } from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import primaryColor from '@material-ui/core/colors/indigo';

import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';


import { makeStyles, styled, useTheme, } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
  BrowserTypes,
  deviceDetect
} from "react-device-detect";

//import axios from 'axios';
//import url, { axios } from './config';
//import jwtDecode from 'jwt-decode';

import yellow from '@material-ui/core/colors/yellow';
import { PhoneMissed } from '@material-ui/icons';





export const Context = createContext();
const breakpoints = createBreakpoints({})

function breakpointsAttribute(...args) {

  let xs = {}
  let sm = {}
  let md = {}
  let lg = {}
  let xl = {}

  args.forEach(item => {
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



// Object.prototype.myUcase = function () {
//     // for (let i = 0; i < this.length; i++) {
//     //   this[i] = this[i].toUpperCase();
//     // }
// };


export default function ContextProvider(props) {



  const textSizeArr = ["1rem", "2rem", "3rem", "4rem", "2rem"]

  const theme_ = useTheme()

  // const iconSizeArr = ["1.8rem", "1.8rem", "1.8rem", "1.8rem", "1.8rem"]
  //const iconSizeArr = ["1.5rem", "1.5rem", "1.5rem", "1.5rem", "1.5rem"]

  const [isLight, setIsLight] = useState(true)

  const theme = useMemo(function () {

    let muiTheme = createTheme({

     
      textSizeArr,
      factor: 1.3,
      get lgTextSizeArr() { return this.multiplyArr(this.textSizeArr, this.factor) },
       

      multiplyArr,
      isLight,
      breakpointsAttribute,


      



      palette: {
        primary: primaryColor,
        type: isLight ? 'light' : "dark",
      },
      typography: {
        fontSize: 14,
        button: { textTransform: 'none' },
        body2: breakpointsAttribute(["fontSize", ...textSizeArr])

      },
      overrides: {
        MuiChip: {
          root: {


            //     ...breakpointsAttribute(["borderRadius", ...textSizeArr])
          }

        }

      }

    })

    return muiTheme
  }, [isLight])



  // const xs = useMediaQuery(theme.breakpoints.only('xs'));
  // const sm = useMediaQuery(theme.breakpoints.only('sm'));
  // const md = useMediaQuery(theme.breakpoints.only('md'));
  // const lg = useMediaQuery(theme.breakpoints.only('lg'));
  // const xl = useMediaQuery(theme.breakpoints.only('xl'));

  // const deviceSize = xs ? "xs" : sm ? "sm" : md ? "md" : lg ? "lg" : "xl"
  // const lgSizeObj = { xs: "1.5rem", sm: "1.5rem", md: "1.5rem", lg: "1.5rem", xl: "1.5rem" }
  // const smSizeObj = { xs: "0.8rem", sm: "0.8rem", md: "0.8rem", lg: "0.8rem", xl: "0.8rem" }





  const [editorContent, setEditorContent] = useState(
    EditorState.createWithContent(ContentState.createFromText(''))
  );









  return (
    <Context.Provider value={{
      isLight, setIsLight, theme, breakpointsAttribute,
    }}>
      <ThemeProvider theme={theme}>
        {props.children}
      </ThemeProvider>
    </Context.Provider>
  )


}