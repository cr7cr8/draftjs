

import React from "react"
import { stateToHTML } from 'draft-js-export-html';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2, } from 'react-html-parser';
import { withTheme, Paper, ThemeProvider } from "@material-ui/core";


import { AvatarChip } from "./AvatarLogo";

import { withContext } from "./ContextProvider"











function toHtml({ preHtml, theme }) {

  const html = ReactHtmlParser(preHtml, {
    transform: function transformFn(node, index) {
      let personName = ""
      if (node.name === "object" && node.attribs["data-type"] === "avatar_head") {
        return <React.Fragment key={index}></React.Fragment>
      }
      else if (node.name === "object" && node.attribs["data-type"] === "avatar_body") {

        const element = node.children.map((child, index) => {

          if (child.type === "text") { personName += child.data }
          //  console.log(personName)
          return convertNodeToElement(child, index, transformFn)
        })

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

