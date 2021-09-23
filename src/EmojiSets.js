import React, { useState, useRef, useEffect } from 'react';

import { EditorState, KeyBindingUtil, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, SelectionState, CharacterMetadata } from 'draft-js';


import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Button, ButtonGroup, Container, Paper, Avatar, IconButton, Box, Slide } from "@material-ui/core";

import { height } from '@material-ui/system';

import { withContext } from "./ContextProvider"
import Emoji, { emoji } from "./Emoji"
import classNames from "classnames"



import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { InsertEmoticon, PanToolOutlined, PeopleOutlined, BeachAccessOutlined } from "@material-ui/icons";


import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";
import { AvatarLogo } from './AvatarLogo';

//const emojiRegexRGI = require('emoji-regex/es2015/RGI_Emoji.js');
// const emojiRegex = require('emoji-regex/es2015/index.js');
const emojiRegexText = require('emoji-regex/es2015/text.js');
const emojiRegex = emojiRegexText()

export const emojiArr1 = `
    😃 😄 😁 😆 😅 😂 ☺️ 😊 😇 😉 😌 😍 😘 😚 😋 😝 😜 😎 😏 😒 😞 😔 ☹️ 😣 😖 😫 😩 😢 😭 😤 😠 😡 😳 😱 😨 😰 😥 😓 😶 😐 😲 😪 😵 😷 😈 👿 👹 👺 
    💩 👻 💀 ☠️ 👽 👾 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 
    `
export const emojiArr2 = `👋 ✋ 👌 ✌️ 👈 👉 👆 👇 ☝️ 👍 👎 ✊ 👊 👏 🙌 👐 🙏 ✍️ 💅 💪 👣 👂 👃 👀 👅 👄 💋 
    `
export const emojiArr3 = `👶 👧 🧒 👦 👩 🧑 👨 👩‍🦱 🧑‍🦱 👨‍🦱 👩‍🦰 🧑‍🦰 👨‍🦰 👱‍♀️ 👱 👱‍♂️ 👩‍🦳 🧑‍🦳 👨‍🦳 👩‍🦲 🧑‍🦲 👨‍🦲 🧔 👵 🧓 👴 👲 👳‍♀️ 👳 👳‍♂️ 🧕 👮‍♀️ 👮 👮‍♂️ 👷‍♀️ 
    👷 👷‍♂️ 💂‍♀️ 💂 💂‍♂️ 🕵️‍♀️ 🕵️ 🕵️‍♂️ 👩‍⚕️ 🧑‍⚕️ 👨‍⚕️ 👩‍🌾 🧑‍🌾 👨‍🌾 👩‍🍳 🧑‍🍳 👨‍🍳 👩‍🎓 🧑‍🎓 👨‍🎓 👩‍🎤 🧑‍🎤 👨‍🎤 👩‍🏫 🧑‍🏫 👨‍🏫 👩‍🏭 🧑‍🏭 👨‍🏭 👩‍💻 🧑‍💻 👨‍💻 👩‍💼 🧑‍💼 
    👨‍💼 👩‍🔧 🧑‍🔧 👨‍🔧 👩‍🔬 🧑‍🔬 👨‍🔬 👩‍🎨 🧑‍🎨 👨‍🎨 👩‍🚒 🧑‍🚒 👨‍🚒 👩‍✈️ 🧑‍✈️ 👨‍✈️ 👩‍🚀 🧑‍🚀 👨‍🚀 👩‍⚖️ 🧑‍⚖️ 👨‍⚖️ 👰‍♀️ 👰 👰‍♂️ 🤵‍♀️ 🤵 🤵‍♂️ 👸 🤴 🥷 🦸‍♀️ 🦸 🦸‍♂️ 🦹‍♀️ 🦹 
    🦹‍♂️ 🤶 🧑‍🎄 🎅 🧙‍♀️ 🧙 🧙‍♂️ 🧝‍♀️ 🧝 🧝‍♂️ 🧛‍♀️ 🧛 🧛‍♂️ 🧟‍♀️ 🧟 🧟‍♂️ 🧞‍♀️ 🧞 🧞‍♂️ 🧜‍♀️ 🧜 🧜‍♂️ 🧚‍♀️ 🧚 🧚‍♂️ 👼 🤰 🤱 👩‍🍼 🧑‍🍼 👨‍🍼 🙇‍♀️ 🙇 🙇‍♂️ 💁‍♀️ 💁 💁‍♂️ 🙅‍♀️ 🙅 🙅‍♂️ 🙆‍♀️ 🙆 🙆‍♂️ 
    🙋‍♀️ 🙋 🙋‍♂️ 🧏‍♀️ 🧏 🧏‍♂️ 🤦‍♀️ 🤦 🤦‍♂️ 🤷‍♀️ 🤷 🤷‍♂️ 🙎‍♀️ 🙎 🙎‍♂️ 🙍‍♀️ 🙍 🙍‍♂️ 💇‍♀️ 💇 💇‍♂️ 💆‍♀️ 💆 💆‍♂️ 🧖‍♀️ 🧖 🧖‍♂️ 💅 🤳 💃 🕺 👯‍♀️ 👯 👯‍♂️ 🕴 👩‍🦽 🧑‍🦽 👨‍🦽 👩‍🦼 🧑‍🦼 👨‍🦼 
    🚶‍♀️ 🚶 🚶‍♂️ 👩‍🦯 🧑‍🦯 👨‍🦯 🧎‍♀️ 🧎 🧎‍♂️ 🏃‍♀️ 🏃 🏃‍♂️ 🧍‍♀️ 🧍 🧍‍♂️ 👭 🧑‍🤝‍🧑 👬 👫 👩‍❤️‍👩 💑 👨‍❤️‍👨 👩‍❤️‍👨 👩‍❤️‍💋‍👩 💏 👨‍❤️‍💋‍👨 👩‍❤️‍💋‍👨 👪 👨‍👩‍👦 👨‍👩‍👧 👨‍👩‍👧‍👦 👨‍👩‍👦‍👦 
    👨‍👩‍👧‍👧 👨‍👨‍👦 👨‍👨‍👧 👨‍👨‍👧‍👦 👨‍👨‍👦‍👦 👨‍👨‍👧‍👧 👩‍👩‍👦 👩‍👩‍👧 👩‍👩‍👧‍👦 👩‍👩‍👦‍👦 👩‍👩‍👧‍👧 👨‍👦 👨‍👦‍👦 👨‍👧 👨‍👧‍👦 👨‍👧‍👧 👩‍👦 👩‍👦‍👦 👩‍👧 👩‍👧‍👦 👩‍👧‍👧 🗣 👤 👥 🫂 
    `
export const emojiArr3Chrome = `👶 👧 👦 👩 👨 👱‍♀️ 👱 👱‍♂️ 👵 👴 👲 👳‍♀️ 👳 👳‍♂️ 👮‍♀️ 👮 👮‍♂️ 👷‍♀️ 
    👷 👷‍♂️ 💂‍♀️ 💂 💂‍♂️ 👩‍⚕️ 👨‍⚕️ 👩‍🌾 👨‍🌾 👩‍🍳 👨‍🍳 👩‍🎓 👨‍🎓 👩‍🎤 👨‍🎤 👩‍🏫 👨‍🏫 👩‍🏭 👨‍🏭 👩‍💻 👨‍💻 👩‍💼 
    👨‍💼 👩‍🔧 👨‍🔧 👨‍🔬 👩‍🎨 👨‍🎨 👩‍🚒 👨‍🚒 👩‍✈️ 👨‍✈️ 👩‍🚀 👨‍🚀 👩‍⚖️ 👨‍⚖️ 👰‍♀️ 👰 👰‍♂️ 👸 
    🎅 👼 🙇‍♀️ 🙇 🙇‍♂️ 💁‍♀️ 💁 💁‍♂️ 🙅‍♀️ 🙅 🙅‍♂️ 🙆‍♀️ 🙆 🙆‍♂️ 
    🙋‍♀️ 🙋 🙋‍♂️ 🙎‍♀️ 🙎 🙎‍♂️ 🙍‍♀️ 🙍 🙍‍♂️ 💇‍♀️ 💇 💇‍♂️ 💆‍♀️ 💆 💆‍♂️ 💅 💃 👯‍♀️ 👯 👯‍♂️ 
    🚶‍♀️ 🚶 🚶‍♂️ 🏃‍♀️ 🏃 🏃‍♂️ 👫 👩‍❤️‍👩 💑 👨‍❤️‍👨 👩‍❤️‍👨 👩‍❤️‍💋‍👩 💏 👨‍❤️‍💋‍👨 👩‍❤️‍💋‍👨 👪 👨‍👩‍👦 👨‍👩‍👧 👨‍👩‍👧‍👦 👨‍👩‍👦‍👦 
    👨‍👩‍👧‍👧 👨‍👨‍👦 👨‍👨‍👧 👨‍👨‍👧‍👦 👨‍👨‍👦‍👦 👨‍👨‍👧‍👧 👩‍👩‍👦 👩‍👩‍👧 👩‍👩‍👧‍👦 👩‍👩‍👦‍👦 👩‍👩‍👧‍👧 👨‍👦 👨‍👦‍👦 👨‍👧 👨‍👧‍👦 👨‍👧‍👧 👩‍👦 👩‍👦‍👦 👩‍👧 👩‍👧‍👦 👩‍👧‍👧 👤 
    `



export const emojiArr4 = `🧳 🌂 ☂️ 🧵 🪡 🪢 🧶 👓 🕶 🥽 🥼 🦺 👔 👕 👖 🧣 🧤 🧥 🧦 👗 👘 🥻 🩴 🩱 🩲 🩳 👙 👚 👛 👜 👝 🎒 👞 👟 🥾 🥿 👠 👡 🩰 👢 👑 👒 🎩 🎓 🧢 ⛑ 🪖 💄 💍 💼`
export const emojiArr4Chrome = `🌂 ☂️ 👓 👔 👕 👖 👗 👘 👙 👚 👛 👜 👝 🎒 👞 👟 👠 👡 👢 👑 👒 🎩 🎓 💄 💍 💼`

export const emojiArr5 = `👋🏻 🤚🏻 🖐🏻 ✋🏻 🖖🏻 👌🏻 🤌🏻 🤏🏻 ✌🏻 🤞🏻 🤟🏻 🤘🏻 🤙🏻 👈🏻 👉🏻 👆🏻 🖕🏻 👇🏻 ☝🏻 👍🏻 👎🏻 ✊🏻 👊🏻 🤛🏻 🤜🏻 👏🏻 🙌🏻 👐🏻 🤲🏻 🙏🏻 ✍🏻 💅🏻 🤳🏻
     💪🏻 🦵🏻 🦶🏻 👂🏻 🦻🏻 👃🏻 👶🏻 👧🏻 🧒🏻 👦🏻 👩🏻 🧑🏻 👨🏻 👩🏻‍🦱 🧑🏻‍🦱 👨🏻‍🦱 👩🏻‍🦰 🧑🏻‍🦰 👨🏻‍🦰 👱🏻‍♀️ 👱🏻 👱🏻‍♂️ 👩🏻‍🦳 🧑🏻‍🦳
      👨🏻‍🦳 👩🏻‍🦲 🧑🏻‍🦲 👨🏻‍🦲 🧔🏻 👵🏻 🧓🏻 👴🏻 👲🏻 👳🏻‍♀️ 👳🏻 👳🏻‍♂️ 🧕🏻 👮🏻‍♀️ 👮🏻 👮🏻‍♂️ 👷🏻‍♀️ 👷🏻 👷🏻‍♂️ 💂🏻‍♀️ 💂🏻 💂🏻‍♂️ 🕵🏻‍♀️ 🕵🏻 🕵🏻‍♂️ 👩🏻‍⚕️ 🧑🏻‍⚕️ 👨🏻‍⚕️
       👩🏻‍🌾 🧑🏻‍🌾 👨🏻‍🌾 👩🏻‍🍳 🧑🏻‍🍳 👨🏻‍🍳 👩🏻‍🎓 🧑🏻‍🎓 👨🏻‍🎓 👩🏻‍🎤 🧑🏻‍🎤 👨🏻‍🎤 👩🏻‍🏫 🧑🏻‍🏫 👨🏻‍🏫 👩🏻‍🏭 🧑🏻‍🏭 👨🏻‍🏭 👩🏻‍💻 🧑🏻‍💻 👨🏻‍💻 👩🏻‍💼 🧑🏻‍💼 👨🏻‍💼
        👩🏻‍🔧 🧑🏻‍🔧 👨🏻‍🔧 👩🏻‍🔬 🧑🏻‍🔬 👨🏻‍🔬 👩🏻‍🎨 🧑🏻‍🎨 👨🏻‍🎨 👩🏻‍🚒 🧑🏻‍🚒 👨🏻‍🚒 👩🏻‍✈️ 🧑🏻‍✈️ 👨🏻‍✈️ 👩🏻‍🚀 🧑🏻‍🚀 👨🏻‍🚀 👩🏻‍⚖️ 🧑🏻‍⚖️ 👨🏻‍⚖️ 👰🏻‍♀️ 👰🏻 👰🏻‍♂️ 🤵🏻‍♀️ 🤵🏻 🤵🏻‍♂️
         👸🏻 🤴🏻 🥷🏻 🦸🏻‍♀️ 🦸🏻 🦸🏻‍♂️ 🦹🏻‍♀️ 🦹🏻 🦹🏻‍♂️ 🤶🏻 🧑🏻‍🎄 🎅🏻 🧙🏻‍♀️ 🧙🏻 🧙🏻‍♂️ 🧝🏻‍♀️ 🧝🏻 🧝🏻‍♂️ 🧛🏻‍♀️ 🧛🏻 🧛🏻‍♂️ 🧜🏻‍♀️ 🧜🏻 🧜🏻‍♂️ 🧚🏻‍♀️ 🧚🏻 🧚🏻‍♂️ 👼🏻 🤰🏻 🤱🏻 👩🏻‍🍼 🧑🏻‍🍼 👨🏻‍🍼
    🙇🏻‍♀️ 🙇🏻 🙇🏻‍♂️ 💁🏻‍♀️ 💁🏻 💁🏻‍♂️ 🙅🏻‍♀️ 🙅🏻 🙅🏻‍♂️ 🙆🏻‍♀️ 🙆🏻 🙆🏻‍♂️ 🙋🏻‍♀️ 🙋🏻 🙋🏻‍♂️ 🧏🏻‍♀️ 🧏🏻 🧏🏻‍♂️ 🤦🏻‍♀️ 🤦🏻 🤦🏻‍♂️ 🤷🏻‍♀️ 🤷🏻 🤷🏻‍♂️ 🙎🏻‍♀️ 🙎🏻 🙎🏻‍♂️ 🙍🏻‍♀️ 🙍🏻 🙍🏻‍♂️ 💇🏻‍♀️ 💇🏻 💇🏻‍♂️
    💆🏻‍♀️ 💆🏻 💆🏻‍♂️ 🧖🏻‍♀️ 🧖🏻 🧖🏻‍♂️ 💃🏻 🕺🏻 🕴🏻 👩🏻‍🦽 🧑🏻‍🦽 👨🏻‍🦽 👩🏻‍🦼 🧑🏻‍🦼 👨🏻‍🦼 🚶🏻‍♀️ 🚶🏻 🚶🏻‍♂️ 👩🏻‍🦯 🧑🏻‍🦯 👨🏻‍🦯 🧎🏻‍♀️ 🧎🏻 🧎🏻‍♂️ 🏃🏻‍♀️ 🏃🏻 🏃🏻‍♂️ 🧍🏻‍♀️ 🧍🏻 🧍🏻‍♂️ 👭🏻
    🧑🏻‍🤝‍🧑🏻 👬🏻 👫🏻 🧗🏻‍♀️ 🧗🏻 🧗🏻‍♂️ 🏇🏻 🏂🏻 🏌🏻‍♀️ 🏌🏻 🏌🏻‍♂️ 🏄🏻‍♀️ 🏄🏻 🏄🏻‍♂️ 🚣🏻‍♀️ 🚣🏻 🚣🏻‍♂️ 🏊🏻‍♀️ 🏊🏻 🏊🏻‍♂️ ⛹🏻‍♀️ ⛹🏻 ⛹🏻‍♂️ 🏋🏻‍♀️ 🏋🏻 🏋🏻‍♂️ 🚴🏻‍♀️ 🚴🏻 🚴🏻‍♂️ 🚵🏻‍♀️ 🚵🏻 🚵🏻‍♂️
    🤸🏻‍♀️ 🤸🏻 🤸🏻‍♂️ 🤽🏻‍♀️ 🤽🏻 🤽🏻‍♂️ 🤾🏻‍♀️ 🤾🏻 🤾🏻‍♂️ 🤹🏻‍♀️ 🤹🏻 🤹🏻‍♂️ 🧘🏻‍♀️ 🧘🏻 🧘🏻‍♂️ 🛀🏻 🛌🏻 
`
export const emojiArr6 = `👋🏼 🤚🏼 🖐🏼 ✋🏼 🖖🏼 👌🏼 🤌🏼 🤏🏼 ✌🏼 🤞🏼 🤟🏼 🤘🏼 🤙🏼 👈🏼 👉🏼 👆🏼 🖕🏼 👇🏼 ☝🏼 👍🏼 👎🏼 ✊🏼 👊🏼 🤛🏼 🤜🏼 👏🏼 🙌🏼 👐🏼 🤲🏼 🙏🏼 ✍🏼 💅🏼 🤳🏼 
    💪🏼 🦵🏼 🦶🏼 👂🏼 🦻🏼 👃🏼 👶🏼 👧🏼 🧒🏼 👦🏼 👩🏼 🧑🏼 👨🏼 👩🏼‍🦱 🧑🏼‍🦱 👨🏼‍🦱 👩🏼‍🦰 🧑🏼‍🦰 👨🏼‍🦰 👱🏼‍♀️ 👱🏼 👱🏼‍♂️ 👩🏼‍🦳 🧑🏼‍🦳 👨🏼‍🦳 👩🏼‍🦲 🧑🏼‍🦲 👨🏼‍🦲 🧔🏼 👵🏼 🧓🏼 👴🏼 👲🏼 👳🏼‍♀️ 👳🏼 
    👳🏼‍♂️ 🧕🏼 👮🏼‍♀️ 👮🏼 👮🏼‍♂️ 👷🏼‍♀️ 👷🏼 👷🏼‍♂️ 💂🏼‍♀️ 💂🏼 💂🏼‍♂️ 🕵🏼‍♀️ 🕵🏼 🕵🏼‍♂️ 👩🏼‍⚕️ 🧑🏼‍⚕️ 👨🏼‍⚕️ 👩🏼‍🌾 🧑🏼‍🌾 👨🏼‍🌾 👩🏼‍🍳 🧑🏼‍🍳 👨🏼‍🍳 👩🏼‍🎓 🧑🏼‍🎓 👨🏼‍🎓 👩🏼‍🎤 🧑🏼‍🎤 👨🏼‍🎤 👩🏼‍🏫 🧑🏼‍🏫 
    👨🏼‍🏫 👩🏼‍🏭 🧑🏼‍🏭 👨🏼‍🏭 👩🏼‍💻 🧑🏼‍💻 👨🏼‍💻 👩🏼‍💼 🧑🏼‍💼 👨🏼‍💼 👩🏼‍🔧 🧑🏼‍🔧 👨🏼‍🔧 👩🏼‍🔬 🧑🏼‍🔬 👨🏼‍🔬 👩🏼‍🎨 🧑🏼‍🎨 👨🏼‍🎨 👩🏼‍🚒 🧑🏼‍🚒 👨🏼‍🚒 👩🏼‍✈️ 🧑🏼‍✈️ 👨🏼‍✈️ 👩🏼‍🚀 🧑🏼‍🚀 👨🏼‍🚀 👩🏼‍⚖️ 
    🧑🏼‍⚖️ 👨🏼‍⚖️ 👰🏼‍♀️ 👰🏼 👰🏼‍♂️ 🤵🏼‍♀️ 🤵🏼 🤵🏼‍♂️ 👸🏼 🤴🏼 🥷🏼 🦸🏼‍♀️ 🦸🏼 🦸🏼‍♂️ 🦹🏼‍♀️ 🦹🏼 🦹🏼‍♂️ 🤶🏼 🧑🏼‍🎄 🎅🏼 🧙🏼‍♀️ 🧙🏼 🧙🏼‍♂️ 🧝🏼‍♀️ 🧝🏼 🧝🏼‍♂️ 🧛🏼‍♀️ 🧛🏼 🧛🏼‍♂️ 🧜🏼‍♀️ 🧜🏼 🧜🏼‍♂️ 🧚🏼‍♀️ 🧚🏼 🧚🏼‍♂️ 👼🏼 
    🤰🏼 🤱🏼 👩🏼‍🍼 🧑🏼‍🍼 👨🏼‍🍼 🙇🏼‍♀️ 🙇🏼 🙇🏼‍♂️ 💁🏼‍♀️ 💁🏼 💁🏼‍♂️ 🙅🏼‍♀️ 🙅🏼 🙅🏼‍♂️ 🙆🏼‍♀️ 🙆🏼 🙆🏼‍♂️ 🙋🏼‍♀️ 🙋🏼 🙋🏼‍♂️ 🧏🏼‍♀️ 🧏🏼 🧏🏼‍♂️ 🤦🏼‍♀️ 🤦🏼 🤦🏼‍♂️ 🤷🏼‍♀️ 🤷🏼 🤷🏼‍♂️ 🙎🏼‍♀️ 🙎🏼 🙎🏼‍♂️ 🙍🏼‍♀️ 🙍🏼 🙍🏼‍♂️ 💇🏼‍♀️ 
    💇🏼 💇🏼‍♂️ 💆🏼‍♀️ 💆🏼 💆🏼‍♂️ 🧖🏼‍♀️ 🧖🏼 🧖🏼‍♂️ 💃🏼 🕺🏼 🕴🏼 👩🏼‍🦽 🧑🏼‍🦽 👨🏼‍🦽 👩🏼‍🦼 🧑🏼‍🦼 👨🏼‍🦼 🚶🏼‍♀️ 🚶🏼 🚶🏼‍♂️ 👩🏼‍🦯 🧑🏼‍🦯 👨🏼‍🦯 🧎🏼‍♀️ 🧎🏼 🧎🏼‍♂️ 🏃🏼‍♀️ 🏃🏼 🏃🏼‍♂️ 🧍🏼‍♀️ 🧍🏼 🧍🏼‍♂️ 👭🏼 🧑🏼‍🤝‍🧑🏼 👬🏼 👫🏼 
    🧗🏼‍♀️ 🧗🏼 🧗🏼‍♂️ 🏇🏼 🏂🏼 🏌🏼‍♀️ 🏌🏼 🏌🏼‍♂️ 🏄🏼‍♀️ 🏄🏼 🏄🏼‍♂️ 🚣🏼‍♀️ 🚣🏼 🚣🏼‍♂️ 🏊🏼‍♀️ 🏊🏼 🏊🏼‍♂️ ⛹🏼‍♀️ ⛹🏼 ⛹🏼‍♂️ 🏋🏼‍♀️ 🏋🏼 🏋🏼‍♂️ 🚴🏼‍♀️ 🚴🏼 🚴🏼‍♂️ 🚵🏼‍♀️ 🚵🏼 🚵🏼‍♂️ 🤸🏼‍♀️ 🤸🏼 🤸🏼‍♂️ 🤽🏼‍♀️ 🤽🏼 🤽🏼‍♂️ 🤾🏼‍♀️ 🤾🏼 🤾🏼‍♂️ 
    🤹🏼‍♀️ 🤹🏼 🤹🏼‍♂️ 🧘🏼‍♀️ 🧘🏼 🧘🏼‍♂️ 🛀🏼 🛌🏼
    `

export const emojiArr7 = `🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐻‍❄️ 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🪱 🐛 🦋 🐌 🐞 🐜 🪰 🪲 🪳 🦟 
    🦗 🕷 🕸 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🦧 🦣 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🦬 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🦮 🐕‍🦺 🐈 🐈‍⬛ 🪶 🐓 🦃 🦤 🦚 🦜 🦢 🦩 🕊 🐇 🦝 🦨 🦡 
    🦫 🦦 🦥 🐁 🐀 🐿 🦔 🐾 🐉 🐲 🌵 🎄 🌲 🌳 🌴 🪵 🌱 🌿 ☘️ 🍀 🎍 🪴 🎋 🍃 🍂 🍁 🍄 🐚 🪨 🌾 💐 🌷 🌹 🥀 🌺 🌸 🌼 🌻 🌞 🌝 🌛 🌜 🌚 🌕 🌖 🌗 🌘 🌑 🌒 🌓 🌔 🌙 🌎 🌍 🌏 🪐 💫 ⭐️ 🌟 ✨ ⚡️ ☄️ 💥 🔥 
    🌪 🌈 ☀️ 🌤 ⛅️ 🌥 ☁️ 🌦 🌧 ⛈ 🌩 🌨 ❄️ ☃️ ⛄️ 🌬 💨 💧 💦 ☔️ ☂️ 🌊 🌫`

export const emojiArr7Chrome = `🐶 🐱 🐭 🐹 🐰 🐻 🐼 🐻‍❄️ 🐨 🐯 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🐺 🐗 🐴 🐝 🐛 🐌 🐞 🐜 
    🐢 🐍 🐙 🐡 🐠 🐟 🐬 🐳 🐘 🐫 🐎 🐑 🐩
    🐾 🐲 🌵 🎄 🌴 🌱 🌿 ☘️ 🍀 🎍 🎋 🍃 🍂 🍁 🍄 🐚 🌾 💐 🌷 🌹 🌺 🌸 🌼 🌻🌛 🌕 🌑 🌓 🌔 🌙 🌏 💫 ⭐️ 🌟 ✨ ⚡️ ☄️ 💥 🔥 
    🌈 ☀️ ⛅️ ☁️ ❄️ ☃️ ⛄️ 💨 💧 💦 ☔️ ☂️ 🌊`


export const emojiArr8 = `🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🥦 🥬 🥒 🌶 🫑 🌽 🥕 🫒 🧄 🧅 🥔 🍠 🥐 🥯 🍞 🥖 🥨 🧀 🥚 🍳 🧈 🥞 🧇 🥓 🥩 🍗 🍖 🦴 🌭 🍔 🍟 🍕 🫓 
    🥪 🥙 🧆 🌮 🌯 🫔 🥗 🥘 🫕 🥫 🍝 🍜 🍲 🍛 🍣 🍱 🥟 🦪 🍤 🍙 🍚 🍘 🍥 🥠 🥮 🍢 🍡 🍧 🍨 🍦 🥧 🧁 🍰 🎂 🍮 🍭 🍬 🍫 🍿 🍩 🍪 🌰 🥜 🍯 🥛 🍼 🫖 ☕️ 🍵 🧃 🥤 🧋 🍶 🍺 🍻 🥂 🍷 🥃 🍸 🍹 
    🧉 🍾 🧊 🥄 🍴 🍽 🥣 🥡 🥢 🧂`

export const emojiArr8Chrome = `🍏 🍎 🍊 🍌 🍉 🍇 🍓 🍈 🍒 🍑 🍍 🍅 🍆 🌽  🍠 🍞 🍳 🍗 🍖 🍔 🍟 🍕 
    🍝 🍜 🍲 🍛 🍣 🍱 🍤 🍙 🍚 🍘 🍥 🍢 🍡 🍧 🍨 🍦🍰 🎂 🍮 🍭 🍬 🍫 🍿 🍩 🍪 🌰 🍯 ☕️ 🍵 🍶 🍺 🍻 🍷 🍸 🍹 🍴`


export const emojiArr9 = `⚽️ 🏀 🏈 ⚾️ 🥎 🎾 🏐 🏉 🥏 🎱 🪀 🏓 🏸 🏒 🏑 🥍 🏏 🪃 🥅 ⛳️ 🪁 🏹 🎣 🤿 🥊 🥋 🎽 🛹 🛼 🛷 ⛸ 🥌 🎿 ⛷ 🏂 🪂 🏋️‍♀️ 🏋️ 🏋️‍♂️ 🤼‍♀️ 🤼 🤼‍♂️ 🤸‍♀️ 🤸 🤸‍♂️ ⛹️‍♀️ ⛹️ ⛹️‍♂️ 🤺 🤾‍♀️ 🤾 🤾‍♂️ 🏌️‍♀️ 🏌️ 🏌️‍♂️ 
    🏇 🧘‍♀️ 🧘 🧘‍♂️ 🏄‍♀️ 🏄 🏄‍♂️ 🏊‍♀️ 🏊 🏊‍♂️ 🤽‍♀️ 🤽 🤽‍♂️ 🚣‍♀️ 🚣 🚣‍♂️ 🧗‍♀️ 🧗 🧗‍♂️ 🚵‍♀️ 🚵 🚵‍♂️ 🚴‍♀️ 🚴 🚴‍♂️ 🏆 🥇 🥈 🥉 🏅 🎖 🏵 🎗 🎫 🎟 🎪 🤹 🤹‍♂️ 🤹‍♀️ 🎭 🩰 🎨 🎬 🎤 🎧 🎼 🎹 🥁 🪘 🎷 🎺 🪗 🎸 🪕 🎻 🎲 ♟ 🎯 
    🎳 🎮 🎰 🧩`

export const emojiArr9Chrome = `⚽️ 🏀 🏈 ⚾️ 🎾 🎱 ⛳️ 🎣 🎿 🏂 
    🏄‍♀️ 🏄 🏄‍♂️ 🏊‍♀️ 🏊 🏊‍♂️ 🏆 🎫 🎪 🎭 🎨 🎬 🎤 🎧 🎼 🎹 🎷 🎺 🎸 🎻 🎲 ♟ 🎯 
    🎳 🎮 🎰`


export const emojiArr10 = `🚗 🚕 🚙 🚌 🚎 🏎 🚓 🚑 🚒 🚐 🛻 🚚 🚛 🚜 🦯 🦽 🦼 🛴 🚲 🛵 🏍 🛺 🚨 🚔 🚍 🚘 🚖 🚡 🚠 🚟 🚃 🚋 🚞 🚝 🚄 🚅 🚈 🚂 🚆 🚇 🚊 🚉 ✈️ 🛫 🛬 🛩 💺 🛰 🚀 🛸 🚁 🛶 ⛵️ 🚤 🛥 🛳 ⛴ 
    🚢 ⚓️ 🪝 ⛽️ 🚧 🚦 🚥 🚏 🗺 🗿 🗽 🗼 🏰 🏯 🏟 🎡 🎢 🎠 ⛲️ ⛱ 🏖 🏝 🏜 🌋 ⛰ 🏔 🗻 🏕 ⛺️ 🛖 🏠 🏡 🏘 🏚 🏗 🏭 🏢 🏬 🏣 🏤 🏥 🏦 🏨 🏪 🏫 🏩 💒 🏛 ⛪️ 🕌 🕍 🛕 🕋 ⛩ 🛤 🛣 🗾 🎑 🏞 🌅 🌄 🌠 
    🎇 🎆 🌇 🌆 🏙 🌃 🌌 🌉 🌁 `


export const emojiArr10Chrome = `🚗 🚕 🚙 🚌 🚓 🚑 🚒 🚚 🚲 🚨 🚃 🚄 🚅 🚇 🚉 ✈️ 💺 🚀 ⛵️ 🚤
    🚢 ⚓️ ⛽️ 🚧 🚥 🚏 🗿 🗽 🗼 🏰 🏯 🎡 🎢 🎠 ⛲️ 🌋 🗻 ⛺️ 🏠 🏡 🏭 🏢 🏬 🏣 🏥 🏦 🏨 🏪 🏫 🏩 💒 ⛪️ 🗾 🎑 🌅 🌄 🌠 
    🎇 🎆 🌇 🌆 🌃 🌌 🌉 🌁 `


export const emojiArr11 = `⌚️ 📱 📲 💻 ⌨️ 🖥 🖨 🖱 🖲 🕹 🗜 💽 💾 💿 📀 📼 📷 📸 📹 🎥 📽 🎞 📞 ☎️ 📟 📠 📺 📻 🎙 🎚 🎛 🧭 ⏱ ⏲ ⏰ 🕰 ⌛️ ⏳ 📡 🔋 🔌 💡 🔦 🕯 🪔 🧯 🛢 💸 💵 💴 💶 💷 🪙 💰 💳 💎 ⚖️ 
    🪜 🧰 🪛 🔧 🔨 ⚒ 🛠 ⛏ 🪚 🔩 ⚙️ 🪤 🧱 ⛓ 🧲 🔫 💣 🧨 🪓 🔪 🗡 ⚔️ 🛡 🚬 ⚰️ 🪦 ⚱️ 🏺 🔮 📿 🧿 💈 ⚗️ 🔭 🔬 🕳 🩹 🩺 💊 💉 🩸 🧬 🦠 🧫 🧪 🌡 🧹 🪠 🧺 🧻 🚽 🚰 🚿 🛁 🛀 🧼 🪥 🪒 🧽 🪣 🧴 🛎 🔑 🗝 🚪 🪑 🛋 🛏 🛌 
    🧸 🪆 🖼 🪞 🪟 🛍 🛒 🎁 🎈 🎏 🎀 🪄 🪅 🎊 🎉 🎎 🏮 🎐 🧧 ✉️ 📩 📨 📧 💌 📥 📤 📦 🏷 🪧 📪 📫 📬 📭 📮 📯 📜 📃 📄 📑 🧾 📊 📈 📉 🗒 🗓 📆 📅 🗑 📇 🗃 🗳 🗄 📋 📁 📂 🗂 🗞 📰 📓 📔 📒 📕 📗 📘 
    📙 📚 📖 🔖 🧷 🔗 📎 🖇 📐 📏 🧮 📌 📍 ✂️ 🖊 🖋 ✒️ 🖌 🖍 📝 ✏️ 🔍 🔎 🔏 🔐 🔒 🔓 
    `

export const emojiArr11Chrome = `⌚️ 📱 📲 💻 ⌨️ 💽 💾 💿 📀 📼 📷 📹 🎥 📞 ☎️ 📟 📠 📺 📻 ⏰ ⌛️ ⏳ 📡 🔋 🔌 💡 🔦 💸 💵 💴 💰 💳 💎 ⚖️ 
   🔧 🔨 ⚒ 🔩 ⚙️ 🔫 💣  🔪 ⚔️ 🚬 🔮 💈 ⚗️ 💊 💉 🚽 🛀 🔑 🚪 
 🎁 🎈 🎏 🎀  🎊 🎉 🎎 🏮 🎐 ✉️ 📩 📨 📧 💌 📥 📤 📦 📪 📫 📮📜 📃 📄 📑 📊 📈 📉 📆 📅 📇 📋 📁 📂 📰 📓 📔 📒 📕 📗 📘 
    📙 📚 📖 🔖 🔗 📎 📐 📏 📌 📍 ✂️ ✒️ 📝 ✏️ 🔍 🔎 🔏 🔐 🔒 🔓`

export const emojiArr12 = `❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 ☮️ ✝️ ☪️ 🕉 ☸️ ✡️ 🔯 🕎 ☯️ ☦️ 🛐 ⛎ ♈️ ♉️ ♊️ ♋️ ♌️ ♍️ ♎️ ♏️ ♐️ ♑️ ♒️ ♓️ 🆔 ⚛️ 🉑 ☢️ ☣️ 📴 📳 🈶 🈚️ 🈸 🈺 🈷️ ✴️ 🆚 
    💮 🉐 ㊙️ ㊗️ 🈴 🈵 🈹 🈲 🅰️ 🅱️ 🆎 🆑 🅾️ 🆘 ❌ ⭕️ 🛑 ⛔️ 📛 🚫 💯 💢 ♨️ 🚷 🚯 🚳 🚱 🔞 📵 🚭 ❗️ ❕ ❓ ❔ ‼️ ⁉️ 🔅 🔆 〽️ ⚠️ 🚸 🔱 ⚜️ 🔰 ♻️ ✅ 🈯️ 💹 ❇️ ✳️ ❎ 🌐 💠 Ⓜ️ 🌀 💤 🏧 🚾 ♿️ 🅿️ 🛗 🈳 🈂️ 🛂 
    🛃 🛄 🛅 🚹 🚺 🚼 ⚧ 🚻 🚮 🎦 📶 🈁 🔣 ℹ️ 🔤 🔡 🔠 🆖 🆗 🆙 🆒 🆕 🆓 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟 🔢 #️⃣ *️⃣ ⏏️ ▶️ ⏸ ⏯ ⏹ ⏺ ⏭ ⏮ ⏩ ⏪ ⏫ ⏬ ◀️ 🔼 🔽 ➡️ ⬅️ ⬆️ ⬇️ ↗️ ↘️ ↙️ ↖️ ↕️ ↔️ ↪️ ↩️ ⤴️ ⤵️ 
    🔀 🔁 🔂 🔄 🔃 🎵 🎶 ➕ ➖ ➗ ✖️ ♾ 💲 💱 ™️ ©️ ®️ 〰️ ➰ ➿ 🔚 🔙 🔛 🔝 🔜 ✔️ ☑️ 🔘 🔴 🟠 🟡 🟢 🔵 🟣 ⚫️ ⚪️ 🟤 🔺 🔻 🔸 🔹 🔶 🔷 🔳 🔲 ▪️ ▫️ ◾️ ◽️ ◼️ ◻️ 🟥 🟧 🟨 🟩 🟦 🟪 ⬛️ ⬜️ 🟫 🔈 🔇 🔉 🔊 🔔 🔕 
    📣 📢 👁‍🗨 💬 💭 🗯 ♠️ ♣️ ♥️ ♦️ 🃏 🎴 🀄️ 🕐 🕑 🕒 🕓 🕔 🕕 🕖 🕗 🕘 🕙 🕚 🕛 🕜 🕝 🕞 🕟 🕠 🕡 🕢 🕣 🕤 🕥 🕦 🕧 
    `

export const emojiArr12Chrome = `❤️ 💛 💚 💙 💜 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 ☮️ ✝️ ☪️ ☸️ ✡️ 🔯 ☯️ ☦️ ⛎ ♈️ ♉️ ♊️ ♋️ ♌️ ♍️ ♎️ ♏️ ♐️ ♑️ ♒️ ♓️ 🆔 ⚛️ 🉑 ☢️ ☣️ 📴 📳 🈶 🈚️ 🈸 🈺 🈷️ ✴️ 🆚 
    💮 🉐 ㊙️ ㊗️ 🈴 🈵 🈹 🈲 🅰️ 🅱️ 🆎 🆑 🅾️ 🆘 ❌ ⭕️ ⛔️ 📛 🚫 💯 💢 ♨️ 🔞 🚭 ❗️ ❕ ❓ ❔ ‼️ ⁉️ 〽️ ⚠️ 🔱 ⚜️ 🔰 ♻️ ✅ 🈯️ 💹 ❇️ ✳️ ❎ 💠 Ⓜ️ 🌀 💤 🏧 🚾 ♿️ 🅿️ 🛗 🈳 🈂️ 
    🚹 🚺 🚼 ⚧ 🚻 🎦 📶 🈁 🔣 ℹ️ 🔤 🔡 🔠 🆖 🆗 🆙 🆒 🆕 🆓 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟 🔢 #️⃣ *️⃣ ⏏️ ▶️ ⏩ ⏪ ⏫ ⏬ ◀️ 🔼 🔽 ➡️ ⬅️ ⬆️ ⬇️ ↗️ ↘️ ↙️ ↖️ ↕️ ↔️ ↪️ ↩️ ⤴️ ⤵️ 
    🔃 🎵 🎶 ➕ ➖ ➗ ✖️ ♾ 💲 💱 ™️ ©️ ®️ 〰️ ➰ ➿ 🔚 🔙 🔛 🔝 🔜 ✔️ ☑️ 🔘 🔴 🔵 ⚫️ ⚪️ 🔺 🔻 🔸 🔹 🔶 🔷 🔳 🔲 ▪️ ▫️ ◾️ ◽️ ◼️ ⬛️ 🔊 🔔
    📣 📢 💬 ♠️ ♣️ ♥️ ♦️ 🃏 🎴 🀄️ 🕐 🕑 🕒 🕓 🕔 🕕 🕖 🕗 🕘 🕙 🕚 🕛
    `

export const emojiArr13 = `✢ ✣ ✤ ✥ ✦ ✧ ★ ☆ ✯ ✡︎ ✩ ✪ ✫ ✬ ✭ ✮ ✶ ✷ ✵ ✸ ✹ → ⇒ ⟹ ⇨ ⇾ ➾ ⇢ ☛ ☞ ➔ ➜ ➙ ➛ ➝ ➞ ♠︎ ♣︎ ♥︎ ♦︎ ♤ ♧ ♡ ♢ ♚ ♛ 
    ♜ ♝ ♞ ♟ ♔ ♕ ♖ ♗ ♘ ♙ ⚀ ⚁ ⚂ ⚃ ⚄ ⚅ 🂠 ⚈ ⚉ ⚆ ⚇ 𓀀 𓀁 𓀂 𓀃 𓀄 𓀅 𓀆 𓀇 𓀈 𓀉 𓀊 𓀋 𓀌 𓀍 𓀎 𓀏 𓀐 𓀑 𓀒 𓀓 𓀔 𓀕 𓀖 𓀗 𓀘 𓀙 𓀚 𓀛 𓀜 𓀝`

export const emojiArr13Chrome = `✢ ✣ ✤ ✥ ✦ ✧ ★ ☆ ✯ ✡︎ ✩ ✪ ✫ ✬ ✭ ✮ ✶ ✷ ✵ ✸ ✹ → ⇒ ⟹ ⇨ ⇾ ➾ ⇢ ☛ ☞ ➔ ➜ ➙ ➛ ➝ ➞ ♠︎ ♣︎ ♥︎ ♦︎ ♤ ♧ ♡ ♢ ♚ ♛ 
    ♜ ♝ ♞ ♟`

export const emojiArr14 = `🏳️ 🏴 🏁 🚩 🏳️‍🌈 🏳️‍⚧️ 🏴‍☠️ 🇦🇫 🇦🇽 🇦🇱 🇩🇿 🇦🇸 🇦🇩 🇦🇴 🇦🇮 🇦🇶 🇦🇬 🇦🇷 🇦🇲 🇦🇼 🇦🇺 🇦🇹 🇦🇿 🇧🇸 🇧🇭 🇧🇩 🇧🇧 🇧🇾 🇧🇪 🇧🇿 🇧🇯 🇧🇲 🇧🇹 🇧🇴 🇧🇦 🇧🇼 🇧🇷 🇮🇴 🇻🇬 🇧🇳 🇧🇬 🇧🇫 
    🇧🇮 🇰🇭 🇨🇲 🇨🇦 🇮🇨 🇨🇻 🇧🇶 🇰🇾 🇨🇫 🇹🇩 🇨🇱 🇨🇳 🇨🇽 🇨🇨 🇨🇴 🇰🇲 🇨🇬 🇨🇩 🇨🇰 🇨🇷 🇨🇮 🇭🇷 🇨🇺 🇨🇼 🇨🇾 🇨🇿 🇩🇰 🇩🇯 🇩🇲 🇩🇴 🇪🇨 🇪🇬 🇸🇻 🇬🇶 🇪🇷 🇪🇪 🇪🇹 🇪🇺 🇫🇰 🇫🇴 🇫🇯 🇫🇮 🇫🇷 🇬🇫 🇵🇫 🇹🇫 🇬🇦 🇬🇲 🇬🇪 🇩🇪 🇬🇭 🇬🇮 🇬🇷 🇬🇱 
    🇬🇩 🇬🇵 🇬🇺 🇬🇹 🇬🇬 🇬🇳 🇬🇼 🇬🇾 🇭🇹 🇭🇳 🇭🇰 🇭🇺 🇮🇸 🇮🇳 🇮🇩 🇮🇷 🇮🇶 🇮🇪 🇮🇲 🇮🇱 🇮🇹 🇯🇲 🇯🇵 🎌 🇯🇪 🇯🇴 🇰🇿 🇰🇪 🇰🇮 🇽🇰 🇰🇼 🇰🇬 🇱🇦 🇱🇻 🇱🇧 🇱🇸 🇱🇷 🇱🇾 🇱🇮 🇱🇹 🇱🇺 🇲🇴 🇲🇰 🇲🇬 🇲🇼 🇲🇾 🇲🇻 🇲🇱 🇲🇹 
    🇲🇭 🇲🇶 🇲🇷 🇲🇺 🇾🇹 🇲🇽 🇫🇲 🇲🇩 🇲🇨 🇲🇳 🇲🇪 🇲🇸 🇲🇦 🇲🇿 🇲🇲 🇳🇦 🇳🇷 🇳🇵 🇳🇱 🇳🇨 🇳🇿 🇳🇮 🇳🇪 🇳🇬 🇳🇺 🇳🇫 🇰🇵 🇲🇵 🇳🇴 🇴🇲 🇵🇰 🇵🇼 🇵🇸 🇵🇦 🇵🇬 🇵🇾 🇵🇪 🇵🇭 🇵🇳 🇵🇱 🇵🇹 🇵🇷 🇶🇦 🇷🇪 🇷🇴 🇷🇺 🇷🇼 🇼🇸 🇸🇲 🇸🇦 
    🇸🇳 🇷🇸 🇸🇨 🇸🇱 🇸🇬 🇸🇽 🇸🇰 🇸🇮 🇬🇸 🇸🇧 🇸🇴 🇿🇦 🇰🇷 🇸🇸 🇪🇸 🇱🇰 🇧🇱 🇸🇭 🇰🇳 🇱🇨 🇵🇲 🇻🇨 🇸🇩 🇸🇷 🇸🇿 🇸🇪 🇨🇭 🇸🇾 🇹🇼 🇹🇯 🇹🇿 🇹🇭 🇹🇱 🇹🇬 🇹🇰 🇹🇴 🇹🇹 🇹🇳 🇹🇷 🇹🇲 🇹🇨 🇹🇻 🇻🇮 
    🇺🇬 🇺🇦 🇦🇪 🇬🇧 🏴󠁧󠁢󠁥󠁮󠁧󠁿 🏴󠁧󠁢󠁳󠁣󠁴󠁿 🏴󠁧󠁢󠁷󠁬󠁳󠁿 🇺🇳 🇺🇸 🇺🇾 🇺🇿 🇻🇺 🇻🇦 🇻🇪 🇻🇳 🇼🇫 🇪🇭 🇾🇪 🇿🇲 🇿🇼 `

export const emojiArr14Chrome = `🏁 🚩 🇧🇸 🇧🇩 🇧🇧 🇧🇪 🇧🇯 🇧🇹 🇧🇷 🇧🇳 🇧🇬 🇧🇫 
    🇧🇮 🇨🇫 🇹🇩 🇨🇳 🇨🇬 🇨🇩 🇨🇰 🇨🇷 🇨🇮 🇨🇺 🇩🇰 🇩🇯 🇪🇨 🇪🇬 🇪🇷 🇪🇪 🇪🇹 🇪🇺 🇫🇰 🇫🇯 🇫🇮 🇫🇷 🇬🇫 🇵🇫 🇹🇫 🇬🇪 🇩🇪 🇬🇮 🇬🇷 
    🇬🇩 🇬🇵 🇬🇺 🇬🇹 🇬🇬 🇬🇳 🇮🇸 🇮🇳 🇮🇩 🇮🇷 🇮🇪 🇮🇹 🇯🇵 🎌 🇯🇪 🇰🇪 🇰🇮 🇰🇬
    🇳🇷 🇳🇵 🇳🇨 🇳🇮 🇳🇪 🇳🇬 🇳🇺 🇳🇫 🇰🇵 🇵🇰 🇵🇸 🇵🇬 🇵🇪 🇵🇳 🇵🇹 🇵🇷 🇷🇪 🇷🇺 
    🇸🇳 🇷🇸 🇸🇨 🇸🇬 🇸🇰 🇸🇮 🇬🇸 🇸🇧 🇰🇷 🇸🇸 🇪🇸 🇰🇳 🇸🇩 🇸🇷 🇸🇪 🇹🇯 🇹🇬 🇹🇰 🇹🇹 🇹🇳 🇹🇷 🇹🇨 🇹🇼
    🇺🇬 🇬🇧 🇺🇳 🇺🇸`


const emojiArr = [
  { symbolStr: emojiArr1, category: "😃", slideOn: true },
  { symbolStr: emojiArr2, category: "👋" },

  isChrome ? { symbolStr: emojiArr3Chrome, category: "👨" } : { symbolStr: emojiArr3, category: "🧑‍⚕️" },

  isChrome ? { symbolStr: emojiArr4Chrome, category: "👕" } : { symbolStr: emojiArr4, category: "👕" },


  !isChrome && { symbolStr: emojiArr5, category: "👦🏻" },
  !isChrome && { symbolStr: emojiArr6, category: "👱🏼‍♀️" },




  isChrome ? { symbolStr: emojiArr7Chrome, category: "🐶" } : { symbolStr: emojiArr7, category: "🐶" },
  isChrome ? { symbolStr: emojiArr8Chrome, category: "🍜" } : { symbolStr: emojiArr8, category: "🍜" },
  isChrome ? { symbolStr: emojiArr9Chrome, category: "🏈" } : { symbolStr: emojiArr9, category: "🏈" },
  isChrome ? { symbolStr: emojiArr10Chrome, category: "🚗" } : { symbolStr: emojiArr10, category: "🚗" },
  isChrome ? { symbolStr: emojiArr11Chrome, category: "🎁" } : { symbolStr: emojiArr11, category: "🎁" },
  isChrome ? { symbolStr: emojiArr12Chrome, category: "🅰️" } : { symbolStr: emojiArr12, category: "🅰️" },
  isChrome ? { symbolStr: emojiArr13Chrome, category: "✤" } : { symbolStr: emojiArr13, category: "✤" },
  isChrome ? { symbolStr: emojiArr14, category: "🏁" } : { symbolStr: emojiArr14, category: "🏁" },
]

const tabSymbolArr = [

  <InsertEmoticon fontSize="large" />,
  <PanToolOutlined fontSize="large" />,
  <PeopleOutlined fontSize="large" />,
  <BeachAccessOutlined fontSize="large" />,
  "🐚"

]



const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
    // overflow: "hidden",
    //position: "relative",
    "& .MuiTab-root": {
      minWidth: "unset",
      padding: 0,
      lineHeight: 1,
    },
    "& .MuiBox-root": {
      padding: 0,
      margin: 0,
      overflow: "hidden",
    },
    //  width: 500,
  },
  emojiCss: (props) => {
    return {
      //  cursor: "pointer",
      borderWidth: 0,
      margin: 0,
      padding: 0,
      borderRadius: 0,
      //backgroundColor: theme.palette.background.default,
      display: "inline-block",
      // backgroundColor:"wheat",
      ...theme.breakpointsAttribute(["fontSize", theme.textSizeArr]),

    }
  },
  emojiButtonCss: (props) => {
    return {
      margin: 1,
      cursor: "pointer",
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.action.hover,
      "&:hover": {
        backgroundColor: theme.palette.action.selected,
      },
      "&:active": {
        backgroundColor: theme.palette.divider,
      }

    }
  },


}));




export default function FullWidthTabs({ insertEmoji, theme, ...props }) {
  const classes = useStyles();

  const [dataArr, setDataArr] = useState(emojiArr.filter(item => Boolean(item)).map(item => {

    return { slideOn: false, direction: "right", ...item }

  }))

  const [tabValue, setTabValue] = React.useState(0);

  // const [direction, setDirection] = React.useState("right")


  return (
    <div className={classes.root}>

      {/* <div style={{ backgroundColor: "skyblue" }}><br /><br /><br /><br /><br /></div> */}

      <AppBar position="static" color="default" elevation={0}>
        <Tabs
          indicatorColor="primary"
          value={tabValue}
          selectionFollowsFocus={true}
          //onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        //variant="scrollable" 
        //scrollButtons="on"

        >
          {
            dataArr.map((item, index) => {
              return <Tab value={index} label={<span style={{ fontSize: "2rem" }}>{item.category}</span>} key={index} onClick={() => {


                setDataArr(pre => {
                  const newDataArr = pre.map(oldItem => ({ ...oldItem, slideOn: false, direction: index > tabValue ? "right" : "left" }))
                  newDataArr[index].slideOn = true
                  newDataArr[index].direction = index > tabValue ? "left" : "right"
                  return [...newDataArr]
                })
                setTabValue(index)

              }} />
            })
          }

        </Tabs>
      </AppBar>


      <div style={{ overflow: "hidden", /*backgroundColor: "wheat",*/ position: "relative", width: "100%", height: "30vh", overflowX: "hidden", overflowY: "auto" }}>


        {dataArr.map((item, index) => {

          let match;
          const arr = [];
          while (match = emojiRegex.exec(item.symbolStr)) {
            const emoji = match[0];
            arr.push(emoji)

          }
          const allClassNames = classNames({
            [classes.emojiCss]: true,
            [classes.emojiButtonCss]: true

          })

          return <Slide

            in={item.slideOn} unmountOnExit={true} timeout={300} direction={item.direction} key={index} >

            <div style={{ /*backgroundColor: "pink",*/ overflowWrap: "anywhere", width: "100%", position: "absolute" }}  >

              {arr.map(item => {
                return (
                  <button key={item} //disableRipple
                    className={allClassNames}
                    onClick={function () {
                      insertEmoji(item)
                    }}
                  >{item}</button>
                )
              })}
            </div>
          </Slide>
        })}

      </div>





    </div >
  );
}