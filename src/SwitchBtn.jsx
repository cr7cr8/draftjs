import React, { Component, useContext } from "react"

import { withStyles, makeStyles, useTheme, withTheme /*styled*/ } from '@material-ui/styles'

import { Avatar, Chip, Popover, Typography, Button, Switch } from "@material-ui/core";
import Grow from '@material-ui/core/Grow';

import multiavatar from '@multiavatar/multiavatar';
import classNames from 'classnames';
import styled from 'styled-components'


import { Context, withContext1, withContext2, withContext3, withContext4 } from "./ContextProvider";


import useMediaQuery from '@material-ui/core/useMediaQuery';
import { CodeSharp } from "@material-ui/icons";


function styleObj({ textSizeArr, breakpointsAttribute, multiplyArr, ...theme }) {

  return {

    switchCss: (props) => {
      return {
        width:"6rem",
        height: "2.5rem",
     //   backgroundColor:"skyblue",
       // ...breakpointsAttribute(["width", multiplyArr(textSizeArr, 4)], ["height", multiplyArr(textSizeArr,2)]),

        "& .MuiSwitch-thumb": {
          width:"2rem",
          height:"2rem",
          margin:0,
        //  ...breakpointsAttribute(["width", multiplyArr(textSizeArr, 1.25)], ["height", multiplyArr(textSizeArr, 1.25)]),
        },
        "& .MuiSwitch-switchBase":{
      //    backgroundColor:"lightgreen",
          borderRadius:0,
          padding:9,
          top:1,

        },
        "& .MuiSwitch-switchBase.Mui-checked": {
          transform:"translateX(41px)"
       //   ...breakpointsAttribute(["transform", multiplyArr(textSizeArr,2).map(item=>{   return  `translateX(${item})`  })]),
        
        }
      }

    }
  }
}



export default withStyles(styleObj, { withTheme: true })(
  function SwitchBtn({ classes, ...props }) {

    return (
      <Switch className={classes.switchCss}       {...props} />
    )


  }
)