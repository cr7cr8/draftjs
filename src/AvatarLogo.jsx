import React, { Component } from "react"



import { withStyles, makeStyles, } from '@material-ui/styles'

import { Avatar, Chip, Popover, Typography } from "@material-ui/core";
import Grow from '@material-ui/core/Grow';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import multiavatar from '@multiavatar/multiavatar'

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
const breakpoints = createBreakpoints({})

function multiplyArr(factor) {

  return this.map((item) => {

    const num = Number(item.replace(/[^\d\.]/g, ''))
    const unit = String(item.replace(/[\d\.]/g, ''))

    return String(num * factor + unit)
  })



}


////////////////////////////////////////////////////////////////////////////

const makingStyleObj = function (theme) {

  return {
    avatarCss: ({ size, personName, ...props }) => {

      const size_ = Array.isArray(size)
        ? size
        : typeof (size) === "string"
          ? [size]
          : multiplyArr.call(theme.textSizeArr, 1.3)





      return {

        ...breakpointsAttribute(["width", ...size_], ["height", ...size_]), //avatar size

      }

    },
    chipCss: ({ size, personName, label, ...props }) => {
      // const size_ = Array.isArray(size) ? size : [size]
      // const size_ = size || multiplyArr.call(theme.textSizeArr, 1.3)
      const size_ = Array.isArray(size)
        ? size
        : typeof (size) === "string"
          ? [size]
          : multiplyArr.call(theme.textSizeArr, 1.3)
      const avatarSize_ = ["1.25rem", "2.5rem", "3.75rem", "5rem", "8rem"]

      return {

        height: "auto",
        paddingTop: "4px",
        paddingBottom: "4px",

        ...breakpointsAttribute(["borderRadius", "100000px"]),

        ...(!label) && (!personName) && { backgroundColor: "transparent", borderRadius: "1000px", },

        ...(label) && (!(label && label.props && label.props.children)) && {
          backgroundColor: "transparent", borderRadius: "1000px",
        },


        "& .MuiChip-avatar": {
          ...(!label) && (!personName) && { marginRight: "-19px" },
          ...(label) && (!(label && label.props && label.props.children)) && { marginRight: "-19px" },

          ...breakpointsAttribute(["width", ...size_], ["height", ...size_]), //avatar size

        },

        "& .MuiChip-label": {
          fontWeight: "bold",
          userSelect: "text",


          ...breakpointsAttribute(["fontSize", ...theme.textSizeArr]), // label size
        },






      }

    },
    popover: () => {
      return {
        pointerEvents: 'none',
      }
    },
    paper: () => {
      return {
        pointerEvents: "auto",
        //  padding: muiTheme.spacing(1),
        padding: theme.spacing(1),
      }
    },

  }
}


class AvatarLogo_ extends Component {

  render() {
    const { classes, personName, src, ...rest } = this.props
    const src_ = "data:image/svg+xml;base64," + btoa(personName && multiavatar(personName))

    return <Avatar classes={{ root: classes.avatarCss }} src={this.props.src || src_} {...rest} />

  }
}




export const AvatarLogo = withStyles(makingStyleObj)(AvatarLogo_);

class AvatarChip_ extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      transOriginH: "left",
      transOriginV: "top",
      anchorPos: { "top": 0, "left": 0 },
      //firstTime: true,

    }

    this.anchorRef = null //  React.createRef();

  };

  // componentDidMount() {
  //   this.setState(pre => {
  //     return {
  //       ...pre,
  //       firstTime: false
  //     }
  //   })
  // }

  componentWillUpdate() {
    // this.setState(pre => {
    //   return {
    //     ...pre,
    //     firstTime: false
    //   }
    // })

  }


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
    const { classes, size, personName, avatarProps, noAvatar = false, ...rest } = this.props

    const { src, ...avatarRest } = this.props.avatarProps || {}

    return (
      // <Grow in={true} >
      <div style={{ width: "fit-content", display: "inline-block" }}    >

        <Chip
          classes={{ root: classes.chipCss }}
          {...!noAvatar && { avatar: <AvatarLogo size={size} personName={personName} src={this.props.src}{...avatarRest} /> }}


          // avatar={<AvatarLogo size={size} personName={personName} src={this.props.src}{...avatarRest} />}
          label={personName}

          {...rest}
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





export const AvatarChip = withStyles(makingStyleObj)(AvatarChip_);


