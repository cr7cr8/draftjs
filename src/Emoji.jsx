import React, { useState, useRef, useEffect } from 'react';
import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, IconButton } from "@material-ui/core";
import { InsertEmoticon } from "@material-ui/icons";
import { height } from '@material-ui/system';

import { withContext } from "./ContextProvider"




import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";
import { AvatarLogo } from './AvatarLogo';

//<img src="/emoji/❤.png" />
let emojiArr = [
  '\u2620',
  '\u2764',
  '\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC69',
  '\uD83D\uDC7F',
  '\uD83D\uDC80',
  '\uD83D\uDCA9',
  '\uD83D\uDE01',
  '\uD83D\uDE02',
  '\uD83D\uDE03',
  '\uD83D\uDE04',
  '\uD83D\uDE05',
  '\uD83D\uDE06',
  '\uD83D\uDE07',
  '\uD83D\uDE08',
  '\uD83D\uDE09',
  '\uD83D\uDE0A',
  '\uD83D\uDE0B',
  '\uD83D\uDE0C',
  '\uD83D\uDE0D',
  '\uD83D\uDE0E',
  '\uD83D\uDE0F',
  '\uD83D\uDE10',
  '\uD83D\uDE12',
  '\uD83D\uDE13',
  '\uD83D\uDE14',
  '\uD83D\uDE16',
  '\uD83D\uDE18',
  '\uD83D\uDE1A',
  '\uD83D\uDE1C',
  '\uD83D\uDE1D',
  '\uD83D\uDE1E',
  '\uD83D\uDE20',
  '\uD83D\uDE21',
  '\uD83D\uDE22',
  '\uD83D\uDE23',
  '\uD83D\uDE24',
  '\uD83D\uDE25',
  '\uD83D\uDE28',
  '\uD83D\uDE29',
  '\uD83D\uDE2A',
  '\uD83D\uDE2B',
  '\uD83D\uDE2D',
  '\uD83D\uDE30',
  '\uD83D\uDE31',
  '\uD83D\uDE32',
  '\uD83D\uDE33',
  '\uD83D\uDE35',
  '\uD83D\uDE36',
  '\uD83D\uDE37',
  '\uD83D\uDE47\u200D\u2640\uFE0F',
  '\uD83E\uDD24',
  '\uD83E\uDD71'
]

const emojiUrl = `url(/emoji/`
export const emoji = {}


emojiArr.forEach(icon => {

  emoji[icon] = emojiUrl + icon + ".png)"
})



const styleObj = ({ breakpointsAttribute, ...theme }) => {

  return {
    emojiButtonCss: (props) => {
      return {
        padding: 0,
        borderRadius: 0,
      }
    },

    emojiCss: (props) => {



      return {

        backgroundRepeat: "no-repeat",

        backgroundPosition: "center center",
        backgroundSize: "contain",
        display: "inline-block",
        verticalAlign: "middle",
        textAlign: "right",

        overflow: "hidden",

        ...breakpointsAttribute(["width", theme.textSizeArr], ["height", theme.textSizeArr]),


      }

    },

  }
}



export default withStyles(styleObj, { withTheme: true })(function Emoji({ children, decoratedText,classes,...props }) {


  return (

    <span
      className={classes.emojiCss}
      style={{ backgroundImage: emoji[decoratedText||children], }}
    >
      <span style={{ clipPath: "circle(0% at 50% 50%)" }}>
        {children}
      </span>
    </span>


  )

})
