import React, { Component, useContext } from "react"

import { withStyles, makeStyles, useTheme, withTheme /*styled*/ } from '@material-ui/styles'

import { Avatar, Chip, Popover, Typography, Button, Switch } from "@material-ui/core";


function styleObj({ textSizeArr, breakpointsAttribute, multiplyArr, ...theme }) {
  


  //factor={[2, 2, 0.5, 3, 1]} //"4rem", "4rem", "1rem", "6rem", "2rem"


  const defaultFactor = textSizeArr.map((item) => {
    const num = Number(item.replace(/[^\d\.]/g, ''))
    const unit = String(item.replace(/[\d\.]/g, ''))
    //return String(num * factor + unit)

    return num/2
  })



  return {

    switchCss: ({ factor = defaultFactor, ...props }) => {
      const factor_ = factor.map(item => item + "px")
      return {
        // width: 58 * factor,
        // height: 38 * factor,
        // padding: 12 * factor,

        //   ...inToolBlock && {
        //    position: "absolute",
        //       transform:`    translateY(-100%)`,
        //    transform: `translateX(-${100 * (shiftX+3 )}%)       translateY(-100%)`,
        //    right: 0,
        //   transform: `translateX(-${100 * (gradientStyleArr.length + 1)}%) translateY(-50%)`,

        //   },


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
    // console.log(props.style)
    return (
      <Switch className={classes.switchCss}   {...props} contentEditable={false}

      // onClick={function (e) {
      //   e.preventDefault();
      //   e.stopPropagation();
      // }}
      />
    )


  }
)