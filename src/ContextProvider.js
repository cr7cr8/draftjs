import React, { createContext, useEffect, useState, useReducer, useRef, useMemo, useCallback, useLayoutEffect, useContext, Component } from 'react';

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


function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

export const Context = createContext();



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


export function withContext1(Compo) {
  return class extends Component {

    static contextType = Context
    constructor(props, context) {
      super(props, context)
    }
    render() {
      return (
        <Compo {...this.props} ctx={this.context} />
      )
    }
  }
}

export function withContext2(Compo) {
  return class extends Component {
    render() {
      return (
        <Context.Consumer>
          {(ctx) => <Compo {...this.props} ctx={ctx} />}
        </Context.Consumer>
      )
    }
  }
}

export function withContext3(Compo) {

  return function (props) {
    const ctx = useContext(Context)
    return <Compo {...props} ctx={ctx} />
  }
}

export function withContext4(Compo) {
  return function (props) {
    return <Context.Consumer>{context => <Compo {...props} ctx={context} />}</Context.Consumer>
  }

}




export default function ContextProvider(props) {

  const textSizeArr = ["1rem", "2rem", "4rem", "6rem", "2rem"]
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
        body2: breakpointsAttribute(["fontSize", ...textSizeArr]),
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