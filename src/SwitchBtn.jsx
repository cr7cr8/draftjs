import React, { Component, useContext } from "react"

import { withStyles, makeStyles, useTheme, withTheme /*styled*/ } from '@material-ui/styles'

import { Avatar, Chip, Popover, Typography, Button, Switch } from "@material-ui/core";


function styleObj({ textSizeArr, breakpointsAttribute, multiplyArr, ...theme }) {

  return {

    switchCss: ({ factor = [2,2,2,2,2], ...props }) => {
      const factor_ = factor.map(item=>item+"px")
      return {
        // width: 58 * factor,
        // height: 38 * factor,
        // padding: 12 * factor,
        ...breakpointsAttribute(
          ["width", multiplyArr(factor_, 58)],
          ["height", multiplyArr(factor_, 38)],
          ["padding", multiplyArr(factor_, 12)],
        ),
        "& .MuiSwitch-thumb": {
          // width: 20 * factor,
          // height: 20 * factor,
          ...breakpointsAttribute(
            ["width", multiplyArr(factor_, 20)],
            ["height", multiplyArr(factor_, 20)]
          ),
        },
        "& .MuiSwitch-switchBase": {
          // padding: 9 * factor,
          ...breakpointsAttribute(
            ["padding", multiplyArr(factor_, 9)],
          ),
        },
        "& .MuiSwitch-switchBase.Mui-checked": {
        //  transform: `translateX(${20 * factor}px)`,
          ...breakpointsAttribute(["transform", multiplyArr(factor_, 20).map(item => { return `translateX(${item})` })]),
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