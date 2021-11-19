import React, { useLayoutEffect, useEffect, useRef, forwardRef } from "react"
import { stateToHTML } from 'draft-js-export-html';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2, } from 'react-html-parser';
import { withTheme, Paper, ThemeProvider, Typography, Zoom, Box } from "@material-ui/core";


import { AvatarChip } from "./AvatarLogo";

import { withContext } from "./ContextProvider";
import reactElementToJSXString from 'react-element-to-jsx-string';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useResizeObserver from '@react-hook/resize-observer';
import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";



const useSize = (target) => {
  const [size, setSize] = React.useState()

  React.useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}


function toHtml({ preHtml, theme, ctx }) {

  //console.log(preHtml)

  const arr = []

  ReactHtmlParser(preHtml, {
    transform: function (node, index) {

      if (node.name === "object" && node.attribs["data-type"] === "color-block") {
        // console.log(node.attribs["data-bgiamge"], index)

        arr.push({ bg: node.attribs["data-bgiamge"], row: index, node })
        return null
      }
      return null
    }
  })

  const arr2 = []

  if (arr.length > 0) {

    arr2.push([arr[0]])
    let preItemValue = arr[0].bg

    arr.reduce((pre, current) => {

      if ((current.bg === "undefined")) {
        arr2[arr2.length - 1].push(current)
      }
      else if (current.bg === pre.bg && (Number(current.row) - Number(pre.row)) === 1) {

        arr2[arr2.length - 1].push(current)
      }
      else if (current.bg === pre.bg && (Number(current.row) - Number(pre.row)) !== 1) {

        arr2.push([current])
      }
      else if (current.bg === preItemValue && (Number(current.row) - Number(pre.row)) !== 1) {
        arr2.push([current])
        //arr2[arr2.length - 1].push(current)
      }
      else if (current.bg === preItemValue && (Number(current.row) - Number(pre.row)) === 1) {
        //arr2.push([current])
        arr2[arr2.length - 1].push(current)
      }

      else {
        arr2.push([current])
        preItemValue = current.bg
      }
      return current

    })
  }

  const headRowArr = []
  arr2.forEach(item => {
    headRowArr.push(item[0].row)
  })
  //console.log(headRowArr)

  const html = ReactHtmlParser(preHtml, {
    transform: function transformFn(node, index) {

      if (node.attribs && (node.attribs.class || node.attribs.textcolor || node.attribs.textbackcolor || node.attribs.textshadow || node.attribs.linkadd)) {

        const styleObj = {}

        node.attribs["class"] && (() => { styleObj["--" + node.attribs["class"]] = node.attribs["class"] })()
        node.attribs["textcolor"] && (() => { styleObj["color"] = node.attribs["textcolor"] })()
        node.attribs["textbackcolor"] && (() => { styleObj["backgroundColor"] = node.attribs["textbackcolor"] })()
        node.attribs["textshadow"] && (() => { styleObj["textShadow"] = node.attribs["textshadow"] })()


        return React.createElement(node.attribs.linkadd ? "a" : "span",
          { style: { ...styleObj }, ...node.attribs.linkadd && { href: node.attribs.linkadd.replace("LINK", ""), target: "_blank" } },
          convertNodeToElement(node, index, transformFn).props.children)

        // if (node.attribs.linkadd) {
        //   return <a key={index} style={{ ...styleObj }} href={node.attribs.linkadd.replace("LINK","")} >
        //   {convertNodeToElement(node, index, transformFn).props.children}
        // </a>
        // }


        // return <span key={index} style={{ ...styleObj }} >
        //   {convertNodeToElement(node, index, transformFn).props.children}
        // </span>
      }


      if (node.name === "object" && node.attribs["data-type"] === "avatar_head") {

        const element = node.children.map((child, index) => {
          return convertNodeToElement(child, index, transformFn)
        })

        return <React.Fragment key={index}></React.Fragment>
        //return <span key={index} style={{ fontSize: 0, width: 0, height: 0, display: "inline-block", overflow: "hidden" }}>{element}</span>

        //fontSize in the  theme.lgTextCss as classname of a span tag will not work, need overfolow hidden to cover hide
        //return <React.Fragment key={index}></React.Fragment>  // work as well
      }



      else if (node.name === "object" && node.attribs["data-type"] === "avatar_body") {

        const element = node.children.map((child, index) => {

          const fontNode = convertNodeToElement(child, index, transformFn)

          if (typeof (fontNode) === "object" && (fontNode.props.className || fontNode.props.textcolor
            || fontNode.props.textbackcolor
            || fontNode.props.linkadd
            || fontNode.props.textshadow)) {

            const styleObj = {
              ...fontNode.props.textshadow && { textShadow: fontNode.props.textshadow },
              ...fontNode.props.textcolor && { color: fontNode.props.textcolor },
              ...fontNode.props.textbackcolor && { backgroundColor: fontNode.props.textbackcolor },
              ...fontNode.props.className && (fontNode.props.className.indexOf("charSize") >= 0) && { ["--" + fontNode.props.className]: fontNode.props.className }
            }



            return React.createElement(
              fontNode.props.linkadd ? "a" : "span",
              { style: { ...styleObj }, ...fontNode.props.linkadd && { href: fontNode.props.linkadd.replace("LINK", ""), target: "_blank" } },
              fontNode.props.children
            )


            // return React.cloneElement(<span />,   { key: index, style: { display: "inline", backgroundColor, color, ...objAttribute } }, fontNode.props.children)
            return <span key={index} style={{ ...styleObj }}>{fontNode.props.children}</span>
          }
          else {
            return <React.Fragment key={index}>{fontNode}</React.Fragment>
          }
        })

        const personName = reactElementToJSXString(<>{element}</>).replace(/(<([^>]*)>)/ig, '').replace(/\s/g, '')
        return <AvatarChip hoverContent={personName} key={index} size={theme.textSizeArr} labelSize={theme.textSizeArr} personName={personName} >{element}</AvatarChip>
      }


      else if (node.name === "object" && node.attribs["data-type"] === "emoji") {

        const element = node.children.map((child, index) => {
          const emojiNode = convertNodeToElement(child, index, transformFn)
          if (typeof (emojiNode) === "object" && (emojiNode.props.className
            || emojiNode.props.textcolor
            || emojiNode.props.linkadd
            || emojiNode.props.textbackcolor
            || emojiNode.props.textshadow)) {


            const styleObj = {

              ...emojiNode.props.textshadow && { textShadow: emojiNode.props.textshadow },
              ...emojiNode.props.textcolor && { color: emojiNode.props.textcolor },
              ...emojiNode.props.textbackcolor && { backgroundColor: emojiNode.props.textbackcolor },
              ...emojiNode.props.className && (emojiNode.props.className.indexOf("charSize") >= 0) && { ["--" + emojiNode.props.className]: emojiNode.props.className }
            }

            return React.createElement(
              emojiNode.props.linkadd ? "a" : "span",
              { style: { ...styleObj }, ...emojiNode.props.linkadd && { href: emojiNode.props.linkadd.replace("LINK", ""), target: "_blank" } },
              emojiNode.props.children
            )
            // return <span key={index} style={{ ...styleObj }}>{emojiNode.props.children}</span>

          }
          else {
            return <React.Fragment key={index}>{emojiNode}</React.Fragment>
          }
        })


        return <React.Fragment key={index}>{element}</React.Fragment>
        //return element

      }
      else if (node.name === "object" && node.attribs["data-type"] === "image-block") {


        const posData = JSON.parse(unescape(node.attribs["data-block_data"]))
        const key = node.attribs["data-block_key"]
        const imageLinkArr = (ctx && ctx.imageBlockObj && ctx.imageBlockObj[key]) || []


        return <ImagePanel key={index} imageLinkArr={imageLinkArr} posData={posData} />

      }
      else if (node.name === "object" && node.attribs["data-type"] === "color-block") {
        const key = node.attribs["data-block_key"]
        const data = JSON.parse(node.attribs["data-block_data"])

        if (!headRowArr.includes(index)) { return <React.Fragment key={index} /> }

        const listArr = arr2.find(arrGroup => { return arrGroup[0].row === index })

        return <div key={node.attribs["data-block_key"]} style={{ position: "relative" }}>
          <div
            style={{
              ...data,
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundPosition: `${data.horizontal}% ${data.vertical}%`,
              // ...data.centerBlock&&{textAlign:"center"},
              // ...data.rightBlock&&{textAlign:"right"},
            }}
          />

          <div style={{position:"relative"}}>
            {
              listArr.map((item, index) => {

                return <div key={index} style={{ textAlign: item.node.attribs["data-text-align"] }}  >{convertNodeToElement(item.node, index, transformFn)}</div>
                // return <React.Fragment key={index}>{convertNodeToElement(item.node, index, transformFn)}</React.Fragment>
              })
            }

          </div>

        </div>
      }

    }
  });
  return html
}

export default withTheme(withContext(function Content({ theme, ctx, ...props }) {

  const { editorState, setEditorState, toPreHtml } = ctx


  return (
    <Zoom in={ctx.showContent} unmountOnExit={true}>
      <Paper style={{ wordBreak: "break-all" }}>{
        toHtml({ preHtml: toPreHtml(editorState), theme, ctx })
        //toHtml({ preHtml: toPreHtml(), theme, ctx })
      }
      </Paper>
    </Zoom>

  );
}))




const useStyles = makeStyles((theme) => {
  const arr = [
    [
      { gridColumn: "1/3", gridRow: "1/3" }
    ],
    [
      { gridColumn: "1/2", gridRow: "1/3" },
      { gridColumn: "2/3", gridRow: "1/3" },
    ],
    [
      { gridColumn: "1/2", gridRow: "1/3" },
      { gridColumn: "2/3", gridRow: "1/2" },
      { gridColumn: "2/3", gridRow: "2/3" },
    ],
    [
      { gridColumn: "1/2", gridRow: "1/2" },
      { gridColumn: "2/3", gridRow: "1/2" },
      { gridColumn: "1/2", gridRow: "2/3" },
      { gridColumn: "2/3", gridRow: "2/3" },
    ]
  ]

  return {

    baseGridCss: ({ numOfImage, ...props }) => {
      //    alert(numOfImage)
      const numOfImage_ = Math.min(4, numOfImage)
      return {
        display: 'grid',
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gridGap: "4px",

        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,

        ...numOfImage > 0 && {
          "& > *:nth-child(1)": {
            position: "relative",
            ...arr[numOfImage_ - 1][0],
          }
        },
        ...numOfImage > 1 && {
          "& > *:nth-child(2)": {
            position: "relative",
            backgroundColor: "#ffa",
            ...arr[numOfImage_ - 1][1]
          }
        },
        ...numOfImage > 2 && {
          "& > *:nth-child(3)": {
            position: "relative",
            backgroundColor: "#afa",
            ...arr[numOfImage_ - 1][2]
          }
        },
        ...numOfImage > 3 && {
          "& > *:nth-child(4)": {
            position: "relative",
            backgroundColor: "#aaf",
            ...arr[numOfImage_ - 1][3]
          }
        },
        ...numOfImage > 4 && {
          "& > *:nth-child( n + 5 )": {
            display: "none",
          }
        },

        // "& + &": {
        //   marginTop:"4px"
        // }
      }
    },



  }
});
function ImagePanel({ imageLinkArr = [], posData = {}, ...props }) {

  const classes = useStyles({ numOfImage: imageLinkArr.length })
  const target = React.useRef(null)
  const size = useSize(target)


  return (
    <div className={classes.baseGridCss} ref={target}
      style={{
        backgroundColor: "wheat",
        width: "100%",
        height: (size && size.width * 9 / 16) || 0 + "px",
        //paddingBottom: "56.25%"
        //   height: (size && size.width * 9 / 16) || 0 + "px",
      }}
    >
      {

        imageLinkArr.map((pic, index) => {
          const { horizontal = 50, vertical = 50 } = posData["pos" + index] || {}

          return <div key={index}>

            <img src={pic} style={{
              position: "absolute", objectFit: "cover", width: "100%", height: "100%",
              objectPosition: horizontal + "%" + " " + vertical + "%"
            }} />

          </div>

        })
      }
    </div>

  )
}