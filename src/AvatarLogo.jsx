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
        : typeof (size) === "string"
          ? [labelSize]
          : textSizeArr

      return {

        height: "auto",
        paddingTop: labelOn ? "2px" : "4px",
        paddingBottom: labelOn ? "2px" : "4px",
        boxShadow: theme.shadows[lift],
        backgroundColor: bgColor ? bgColor : theme.isLight ? "#b7e1fc" : theme.palette.primary.light,
        overflow: "hidden",

        ...breakpointsAttribute(["borderRadius", "999999px"]),

        "& .MuiChip-avatar": {
          ...(logoOn && (!labelOn)) && { marginRight: "-19px" },
          ...(logoOn && (labelOn)) && { marginRight: "-6px" },
          ...breakpointsAttribute(["width", ...size_], ["height", ...size_]), //avatar size
        },

        "& .MuiChip-label": {
          // fontWeight: "bold",
          userSelect: "text",
          ...breakpointsAttribute(["fontSize", ...labelSize_]), // label size
        },
      }

    },

    typoUpCss: ({ size, rightMarginOn, logoOn, labelOn }) => {


      const size_ = Array.isArray(size)
        ? size
        : typeof (size) === "string"
          ? [size]
          : textSizeArr


      return {
        lineHeight: "unset",
        ...breakpointsAttribute(
          ["fontSize", ...multiplyArr(size_, 60 / 100)],
          rightMarginOn ? ["marginRight", ...multiplyArr(size_, 40 / 100)] : [],
          ((!logoOn) && labelOn) ? ["marginLeft", ...multiplyArr(size_, 40 / 100)] : []// not updating with props updating logoOn labelOn

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
        lineHeight: "unset",
        ...breakpointsAttribute(
          ["fontSize", ...multiplyArr(size_, 40 / 100)],
          rightMarginOn ? ["marginRight", ...multiplyArr(size_, 40 / 100)] : [],
          ((!logoOn) && labelOn) ? ["marginLeft", ...multiplyArr(size_, 40 / 100)] : [] // not updating with props updating logoOn labelOn
        ),
      }
    },
    popover: () => { return { pointerEvents: 'none', } },
    paper: () => { return { pointerEvents: "auto", padding: theme.spacing(1), } },
  }
}





class TwoLineLabel_ extends Component {

  constructor(props, ctx) {
    super(props, ctx)
    console.log(ctx)

  }

  render() {

    const { lineTop, lineDown, className, rightMarginOn = true } = this.props

    const { typoUpCss, typoDownCss, typoCssLeftMargin } = this.props.classes

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
TwoLineLabel_.defaultProps = { rightMarginOn: true }
TwoLineLabel_.contextType = Context


export const TwoLineLabel = withStyles(styleObj, { withTheme: true })(TwoLineLabel_)
const TwoLineLabelCompoStyled = styled(TwoLineLabel)`
  ${function ({ logoOn, labelOn, breakpointsAttribute, multiplyArr, size, textSizeArr }) {
    const size_ = Array.isArray(size)
      ? size
      : typeof (size) === "string"
        ? [size]
        : textSizeArr
    return {
      ...breakpointsAttribute(
        ((!logoOn) && labelOn) ? ["marginLeft", ...multiplyArr(size_, 40 / 100)] : []// not updating with props updating logoOn labelOn
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

  componentDidUpdate(preProp, preState) {
  }

  render() {
    const { classes, theme, size, personName, avatarProps, logoOn = true, labelOn = true, ...rest } = this.props

    const { src, ...avatarRest } = this.props.avatarProps || {}
    //console.log(this.props.label)

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

            label: <TwoLineLabelCompoStyled
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


