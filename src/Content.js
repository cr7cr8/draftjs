import React from "react"
import { stateToHTML } from 'draft-js-export-html';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2, } from 'react-html-parser';
import { withTheme, Paper, ThemeProvider, Typography, Zoom } from "@material-ui/core";


import { AvatarChip } from "./AvatarLogo";

import { withContext } from "./ContextProvider";
import reactElementToJSXString from 'react-element-to-jsx-string';



import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";


function toHtml({ preHtml, theme, ctx }) {

  const html = ReactHtmlParser(preHtml, {
    transform: function transformFn(node, index) {

      if (node.name === "object" && node.attribs["data-type"] === "avatar_head") {


        const element = node.children.map((child, index) => {
          return convertNodeToElement(child, index, transformFn)
        })

        return <span key={index} style={{ fontSize: 0, width: 0, height: 0, display: "inline-block" }}><span><span>{element}</span></span></span>

        return <React.Fragment key={index}></React.Fragment>  // work as well
      }
      else if (node.name === "object" && node.attribs["data-type"] === "avatar_body") {

        const element = node.children.map((child, index) => {
          return convertNodeToElement(child, index, transformFn)
        })

        const personName = reactElementToJSXString(<>{element}</>).replace(/(<([^>]*)>)/ig, '').replace(/\s/g, '')
        return <AvatarChip hoverContent={personName} key={index} size={theme.textSizeArr} labelSize={theme.textSizeArr} personName={personName} >{element}</AvatarChip>
      }

      // else if (node.name === "object" && node.attribs["data-type"] === "emoji" && !isMobile) {

      //   return <Emoji key={index}>{node.attribs["data-emoji_symbol"]}</Emoji>

      // }
      else if (node.name === "object" && node.attribs["data-type"] === "emoji") {
        const element = node.children.map((child, index) => {
          return convertNodeToElement(child, index, transformFn)
        })
        //  return <React.Fragment key={index}>{element}</React.Fragment>
        return <span key={index}><span>{element}</span></span>

      }
      else if (node.name === "object" && node.attribs["data-type"] === "image-block") {

        //   console.log(JSON.parse(node.attribs["data-block_data"]))

        const posData = JSON.parse(unescape(node.attribs["data-block_data"]))
        const key = node.attribs["data-block_key"]
        const imageLinkArr = (ctx&&ctx.imageBlockObj&&ctx.imageBlockObj[key])||[]
     

        return <span key={index}>
          {imageLinkArr.map((imageSrc, index) => {

            return <img key={index} src={imageSrc} />
          })}


        </span>

      }
    }
  });
  return html
}

export default withTheme(withContext(function Content({ theme, ctx, ...props }) {

  const { editorState, setEditorState, toPreHtml } = ctx

  return (
    <Zoom in={ctx.showContent} unmountOnExit={true}>
      <Paper>{
        toHtml({ preHtml: toPreHtml(editorState), theme, ctx })
      }
      </Paper>
    </Zoom>

  );
}))

