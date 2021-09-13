import React, { Component, useContext } from "react"

import { withStyles, makeStyles, useTheme } from '@material-ui/styles'

import { Avatar, Chip, Popover, Typography, Button, } from "@material-ui/core";
import Grow from '@material-ui/core/Grow';

import multiavatar from '@multiavatar/multiavatar';
import classNames from 'classnames';
import styled from 'styled-components'


import { Context } from "./ContextProvider";


function styleObj({ lgTextSizeArr, textSizeArr, breakpointsAttribute, multiplyArr, ...theme }) {
  return {
    avatarCss: ({ size, personName, ...props }) => {
      const size_ = Array.isArray(size)
        ? size
        : typeof (size) === "string"
          ? [size]
          : lgTextSizeArr

      return {
        ...breakpointsAttribute(["width", ...size_], ["height", ...size_]), //avatar size
      }
    },
    chipCss: ({ size, personName, label, bgColor, lift = 3, logoOn = true, labelOn = true, labelSize, ...props }) => {

      const size_ = Array.isArray(size)
        ? size
        : typeof (size) === "string"
          ? [size]
          : lgTextSizeArr

      const labelSize_ = Array.isArray(labelSize)
        ? labelSize
        : typeof (labelSize) === "string"
          ? [labelSize]
          : textSizeArr

      return {

        height: "auto",
        // paddingTop: labelOn ? "2px" : "4px",
        // paddingBottom: labelOn ? "2px" : "4px",

        padding: 0,
        margin: 0,

        boxShadow: theme.shadows[lift],
        backgroundColor: bgColor ? bgColor : theme.isLight ? "#b7e1fc" : theme.palette.primary.light,
        overflow: "hidden",

        ...breakpointsAttribute(["borderRadius", "999999px"]),

        "& .MuiChip-avatar": {
          ...(logoOn && (!labelOn)) && { transform: "scale(0.95)" },
          ...(logoOn && (labelOn)) && { transform: "scale(0.95)" },
          ...breakpointsAttribute(["width", size_], ["height", size_], ["margin", 0]), //avatar size
        },

        "& .MuiChip-label": {
          // fontWeight: "bold",
          userSelect: "text",
          //     backgroundColor: "#a2c3b2",
          lineHeight: "100%",
          margin: 0,
          padding: 0,
          ...breakpointsAttribute(["fontSize", labelSize_], ["paddingLeft", labelOn ? multiplyArr(labelSize_, 0.1) : [0]], ["paddingRight", labelOn ? multiplyArr(labelSize_, 0.3) : [0]]), // label size
        },
        "& .MuiChip-deleteIcon": {
          ...breakpointsAttribute(["width", multiplyArr(labelSize_,0.8)], ["height", multiplyArr(labelSize_,0.8)])
        }

      }

    },

    typoUpCss: ({ size, rightMarginOn, logoOn, labelOn }) => {


      const size_ = Array.isArray(size)
        ? size
        : typeof (size) === "string"
          ? [size]
          : textSizeArr


      return {
        lineHeight: "100%",
        // backgroundColor:"pink",
        margin: 0,
        padding: 0,
        ...breakpointsAttribute(
          ["fontSize", multiplyArr(size_, 60 / 100)],
          //   rightMarginOn ? ["marginRight", multiplyArr(size_, 40 / 100)] : [],
          //   ((!logoOn) && labelOn) ? ["marginLeft", multiplyArr(size_, 40 / 100)] : []// not updating with props updating logoOn labelOn

        ),

      }
    },
    typoDownCss: ({ size, rightMarginOn, logoOn, labelOn }) => {

      const size_ = Array.isArray(size)
        ? size
        : typeof (size) === "string"
          ? [size]
          : textSizeArr

      return {
        lineHeight: "100%",
        //  backgroundColor:"lightblue",
        margin: 0,
        padding: 0,
        ...breakpointsAttribute(
          ["fontSize", multiplyArr(size_, 40 / 100)],
          //    rightMarginOn ? ["marginRight", multiplyArr(size_, 40 / 100)] : [],
          //    ((!logoOn) && labelOn) ? ["marginLeft", multiplyArr(size_, 40 / 100)] : [] // not updating with props updating logoOn labelOn
        ),
      }
    },
    popover: () => { return { pointerEvents: 'none', } },
    paper: () => { return { pointerEvents: "auto", padding: theme.spacing(1), } },
  }
}





class TwoLineLabel_ extends Component {

  static contextType = Context
  static defaultProps = { rightMarginOn: true }
  constructor(props, ctx) {
    super(props, ctx)
    console.log(ctx)

  }

  render() {

    const { lineTop, lineDown, className, } = this.props

    const { typoUpCss, typoDownCss } = this.props.classes

    const allClassNamesTop = classNames({
      [typoUpCss]: true,
      [className]: true
    })
    const allClassNamesDown = classNames({
      [typoDownCss]: true,
      [className]: true
    })
    return (

      <>
        <Typography color="textPrimary" className={allClassNamesTop} >{lineTop}</Typography>
        <Typography color="textSecondary" className={allClassNamesDown} >{lineDown}</Typography>
      </>
    )
  }

}


const TwoLineLabelWithTheme = withStyles(styleObj, { withTheme: true })(TwoLineLabel_)
export const TwoLineLabel = styled(TwoLineLabelWithTheme)`
  ${function ({ logoOn, labelOn, breakpointsAttribute, multiplyArr, size, textSizeArr }) {
    const size_ = Array.isArray(size)
      ? size
      : typeof (size) === "string"
        ? [size]
        : textSizeArr
    return {
      ...breakpointsAttribute(
        ((!logoOn) && labelOn) ? ["marginLeft", multiplyArr(size_, 40 / 100)] : []// not updating with props updating logoOn labelOn
      ),
    }
  }} 
`


class AvatarLogo_ extends Component {

  render() {
    const { classes, personName, src, ...rest } = this.props
    const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))
    return <Avatar classes={{ root: classes.avatarCss }} src={this.props.src || src_} {...rest} />

  }
}

class AvatarChip_ extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      transOriginH: "left",
      transOriginV: "top",
      anchorPos: { "top": 0, "left": 0 },
    }
    this.anchorRef = null //  React.createRef();
  };


  handlePopoverOpen = (event) => {

    const { left, right, width, top, bottom, height } = this.anchorRef.getBoundingClientRect() //this.anchorRef.current.getBoundingClientRect()
    const centerX = left + width / 2;
    const centerY = top + height / 2;


    this.setState(pre => {
      return {
        open: true,
        transOriginH: centerX <= window.innerWidth / 2 ? "left" : "right",
        transOriginV: centerY <= window.innerHeight / 2 ? "top" : "bottom",
        anchorPos: {
          "left": centerX <= window.innerWidth / 2 ? Math.round(left) : Math.round(left + width),
          "top": centerY <= window.innerHeight / 2 ? Math.round(top + height) + 8 : Math.round(top) - 8
        },

      }
    });


  };

  handlePopoverClose = () => {
    this.setState(pre => { return { ...pre, open: false } });
  };



  render() {
    const { classes, theme, size, personName, avatarProps, logoOn = true, labelOn = true, ...rest } = this.props

    const { src, ...avatarRest } = this.props.avatarProps || {}

    return (
      // <Grow in={true} >
      <div style={{ width: "fit-content", display: "inline-block" }}    >

        <Chip
          classes={{ root: classes.chipCss }}
          {...logoOn && { avatar: <AvatarLogo size={size} personName={personName} src={this.props.src}{...avatarRest} /> }}
          // avatar={<AvatarLogo size={size} personName={personName} src={this.props.src}{...avatarRest} />}
          label={personName}
          {...rest}

          {...(this.props.label && this.props.label.type && this.props.label.type.Naked && this.props.label.type.Naked.name === "TwoLineLabel_") && labelOn && {

            label: <TwoLineLabel
              {...this.props.label.props}
              logoOn={this.props.logoOn}
              labelOn={this.props.labelOn}
              multiplyArr={theme.multiplyArr} breakpointsAttribute={theme.breakpointsAttribute} textSizeArr={theme.textSizeArr}
              {...(Array.isArray(this.props.labelSize) || (typeof (this.props.labelSize) === "string")) && { size: this.props.labelSize, }}
            />
          }}

          {...(!labelOn) && { label: null }}

          {...this.props.hoverContent && { onMouseEnter: this.handlePopoverOpen }}
          {...this.props.hoverContent && { onMouseLeave: this.handlePopoverClose }}
          // aria-owns={this.state.open ? 'mouse-over-popover' : undefined}
          // aria-haspopup="true"
          // innerRef={this.state.anchorEl}
          //  ref={this.anchorRef}
          ref={(element) => { this.anchorRef = element }}
        />

        {this.props.hoverContent && <Popover

          marginThreshold={0}
          //id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={this.state.open}
          anchorReference="anchorPosition"
          // anchorEl={this.anchorRef.current}
          anchorEl={this.anchorRef}
          anchorOrigin={{
            horizontal: "left",
            vertical: "bottom",
          }}
          anchorPosition={{ ...this.state.anchorPos, }}
          transformOrigin={{
            horizontal: this.state.transOriginH,
            vertical: this.state.transOriginV,
          }}

          //   onClose={this.handlePopoverClose}
          disableRestoreFocus
          PaperProps={{ onMouseEnter: this.handlePopoverOpen, onMouseLeave: this.handlePopoverClose, elevation: 2 }}
        >
          {this.props.hoverContent}
        </Popover>}

      </div>
      // </Grow>
    )
  }
}






export const AvatarLogo = withStyles(styleObj, { withTheme: true })(AvatarLogo_);
export const AvatarChip = withStyles(styleObj, { withTheme: true })(AvatarChip_);


