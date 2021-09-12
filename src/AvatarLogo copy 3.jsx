import React, { Component } from "react"

import { withStyles, makeStyles, useTheme } from '@material-ui/styles'

import { Avatar, Chip, Popover, Typography, } from "@material-ui/core";
import Grow from '@material-ui/core/Grow';

import multiavatar from '@multiavatar/multiavatar';
import classNames from 'classnames';

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

        // ...(!label) && (!personName) && { backgroundColor: "transparent", borderRadius: "999999px", },

        // ...(label) && (!(label && label.props && label.props.children)) && {
        //   backgroundColor: "transparent", borderRadius: "999999px",
        // },

        "& .MuiChip-avatar": {
          // ...((!label) || (!labelOn)) && (!personName) && { marginRight: "-19px" },
          // ...(label) && (!(label && label.props && label.props.children)) && { marginRight: "-19px" },
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
      console.log("---", ((!logoOn) && labelOn))
      return {
        lineHeight: "unset",
        ...breakpointsAttribute(
          ["fontSize", ...multiplyArr(size_, 40 / 100)],
          rightMarginOn ? ["marginRight", ...multiplyArr(size_, 40 / 100)] : [],
          ((!logoOn) && labelOn) ? ["marginLeft", ...multiplyArr(size_, 40 / 100)] : [] // not updating with props updating logoOn labelOn
        ),
      }
    },


    typoCssLeftMargin: ({ size, logoOn, labelOn, randomName }) => {

      const size_ = Array.isArray(size)
        ? size
        : typeof (size) === "string"
          ? [size]
          : textSizeArr
      return {
        ...breakpointsAttribute(

          ["marginLeft", ...multiplyArr(size_, 40 / 100)]
        ),
      }
    },



    popover: () => { return { pointerEvents: 'none', } },
    paper: () => { return { pointerEvents: "auto", padding: theme.spacing(1), } },
  }
}

const useStyles = makeStyles(styleObj)
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
    const { classes, size, personName, avatarProps, logoOn = true, labelOn = true, ...rest } = this.props

    const { src, ...avatarRest } = this.props.avatarProps || {}
    //console.log(this.props.label)

    if (this.props.label && this.props.label.type && this.props.label.type.name === "TwoLineLabel") {

      //   console.log(this.props.label.props)

      // this.props.label.props = { ...this.props.label.props, logoOn:this.props.logoOn, labelOn:this.props.labelOn ,
      //   ...(Array.isArray(this.props.labelSize) || (typeof (this.props.labelSize) === "string")) && { size: this.props.labelSize, }
      // }

      // this.props.label.props.logoOn = this.props.logoOn
      // this.props.label.props.labelOn = this.props.labelOn
      // if(Array.isArray(this.props.labelSize) || (typeof (this.props.labelSize) === "string")) {
      //   this.props.label.props.size = this.props.labelSize
      // }
    }

    if ((this.props.label && this.props.label.type && this.props.label.type.Naked) && labelOn) {
     // console.log(this.props.label.type.Naked.name)
    }

    return (
      // <Grow in={true} >
      <div style={{ width: "fit-content", display: "inline-block" }}    >

        <Chip
          classes={{ root: classes.chipCss }}
          {...logoOn && { avatar: <AvatarLogo size={size} personName={personName} src={this.props.src}{...avatarRest} /> }}


          // avatar={<AvatarLogo size={size} personName={personName} src={this.props.src}{...avatarRest} />}
          label={personName}

          {...rest}




          // {...(this.props.label && this.props.label.type && this.props.label.type.name === "TwoLineLabel") && labelOn && {

          //   label: <TwoLineLabel
          //     logoOn={this.props.logoOn}
          //     labelOn={this.props.labelOn}
          //     {...this.props.label.props}
          //     {...(Array.isArray(this.props.labelSize) || (typeof (this.props.labelSize) === "string")) && { size: this.props.labelSize, }}
          //   />

          // }}

          {...(this.props.label && this.props.label.type && this.props.label.type.Naked  && this.props.label.type.Naked.name === "TwoLineLabel_" ) && labelOn && {

            label: <TwoLineLabel
              logoOn={this.props.logoOn}
              labelOn={this.props.labelOn}
              {...this.props.label.props}
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

class TwoLineLabel_ extends Component {



  render() {

    const { lineTop, lineDown, size, rightMarginOn = false, logoOn, labelOn } = this.props
    console.log(size)
    const { typoUpCss, typoDownCss, typoCssLeftMargin } = this.props.classes

    const allClassNamesTop = classNames({
      [typoUpCss]: true,
      [typoCssLeftMargin]: Boolean((!this.props.logoOn) && this.props.labelOn)
    })

    const allClassNamesDown = classNames({
      [typoDownCss]: true,
      [typoCssLeftMargin]: Boolean((!this.props.logoOn) && this.props.labelOn)
    })


    return (

      <>
        <Typography color="textPrimary" className={typoUpCss} >{lineTop}</Typography>
        <Typography color="textSecondary" className={typoDownCss} >{lineDown}</Typography>
        {/* <Typography color="textPrimary" className={allClassNamesTop} >{lineTop}</Typography>
        <Typography color="textSecondary" className={allClassNamesDown} >{lineDown}</Typography> */}

      </>
    )
  }

}

export const TwoLineLabel = withStyles(styleObj)(TwoLineLabel_)


// export function TwoLineLabel({ lineTop, lineDown, size, rightMarginOn = false, logoOn, labelOn }) {

//   const theme = useTheme()

//   const { typoUpCss, typoDownCss, typoUpCss2, typoDownCss2, typoCssLeftMargin } = useStyles({ size: size || theme.textSizeArr, rightMarginOn, logoOn, labelOn })


//   const allClassNamesTop = classNames({
//     [typoUpCss]: true,
//     [typoCssLeftMargin]: Boolean((!logoOn) && labelOn)
//   })

//   const allClassNamesDown = classNames({
//     [typoDownCss]: true,
//     [typoCssLeftMargin]: Boolean((!logoOn) && labelOn)
//   })



//   console.log(logoOn, labelOn)


//   return (
//     <>



//       <Typography color="textPrimary" className={allClassNamesTop} >{lineTop}</Typography>
//       <Typography color="textSecondary" className={allClassNamesDown} >{lineDown}</Typography>

//     </>
//   )

// }






export const AvatarLogo = withStyles(styleObj)(AvatarLogo_);
export const AvatarChip = withStyles(styleObj)(AvatarChip_);


