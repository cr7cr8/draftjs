import React from "react"
import { stateToHTML } from 'draft-js-export-html';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2, } from 'react-html-parser';
import { withTheme, Paper, ThemeProvider, Typography, Zoom } from "@material-ui/core";


import { AvatarChip } from "./AvatarLogo";

import { withContext } from "./ContextProvider";
import reactElementToJSXString from 'react-element-to-jsx-string';

import Emoji from "./Emoji"

import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";


function toHtml({ preHtml, theme }) {

  const html = ReactHtmlParser(preHtml, {
    transform: function transformFn(node, index) {

      if (node.name === "object" && node.attribs["data-type"] === "avatar_head") {
        return <React.Fragment key={index}></React.Fragment>
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
        return <React.Fragment key={index}>{element}</React.Fragment>

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
        toHtml({ preHtml: toPreHtml(editorState), theme })
      }
      </Paper>
    </Zoom>

  );
}))

