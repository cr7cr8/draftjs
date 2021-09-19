

import React from "react"
import { stateToHTML } from 'draft-js-export-html';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2, } from 'react-html-parser';
import { withTheme, Paper, ThemeProvider, Typography } from "@material-ui/core";


import { AvatarChip } from "./AvatarLogo";

import { withContext } from "./ContextProvider";
import reactElementToJSXString from 'react-element-to-jsx-string';




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

        return <AvatarChip key={index} size={theme.textSizeArr} labelSize={theme.textSizeArr} personName={personName} >{element}</AvatarChip>

      }

    }
  });
  return html
}

export default withTheme(withContext(function Content({ theme, ctx, ...props }) {

  const { editorState, setEditorState, toPreHtml } = ctx




  return (

    <Paper>{
      toHtml({ preHtml: toPreHtml(editorState), theme })
    }
    </Paper>


  );
}))

