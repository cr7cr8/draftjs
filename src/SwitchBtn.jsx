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

    switchCss: ({ factor = ["2px", "2px", "2px", "1.8px", "1.5px"], ...props }) => {
      return {
        // width: 58 * factor,
        // height: 38 * factor,
        // padding: 12 * factor,


        ...breakpointsAttribute(
          ["width", multiplyArr(factor, 58)],
          ["height", multiplyArr(factor, 38)],
          ["padding", multiplyArr(factor, 12)],

        ),

        "& .MuiSwitch-thumb": {
          // width: 20 * factor,
          // height: 20 * factor,

          ...breakpointsAttribute(
            ["width", multiplyArr(factor, 20)],
            ["height", multiplyArr(factor, 20)]
          ),
        },
        "& .MuiSwitch-switchBase": {

          // padding: 9 * factor,
          ...breakpointsAttribute(
            ["padding", multiplyArr(factor, 9)],

          ),


        },
        "& .MuiSwitch-switchBase.Mui-checked": {
        //  transform: `translateX(${20 * factor}px)`,
          ...breakpointsAttribute(["transform", multiplyArr(factor, 20).map(item => { return `translateX(${item})` })]),

        },
        "& .MuiSwitch-track": {
          borderRadius: 1000,
        }
      }

    }
  }
}
//const useStyles = makeStyles(styleObj)


// export default function SwitchBtn({   ...props }) {
//   const classes = useStyles({ factor: 5 })
//   return (
//     <Switch className={classes.switchCss}       {...props} />
//   )


// }



export default withStyles(styleObj, { withTheme: true })(
  function SwitchBtn({ classes, factor, size, ...props }) {

    return (
      <Switch className={classes.switchCss}       {...props} />
    )


  }
)