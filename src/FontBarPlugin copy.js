import { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context, withContext } from "./ContextProvider"

import { AvatarChip, AvatarLogo, TwoLineLabel } from "./AvatarLogo"
import { EditorBlock, EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';

import { makeStyles, styled, useTheme, withStyles, withTheme } from '@material-ui/core/styles';
import { Typography, Chip, Popover, Button, ButtonGroup, Container, Paper, Avatar, Box, Grow, Zoom, Slide } from "@material-ui/core";
import { Image, AlternateEmailSharp } from "@material-ui/icons";


import AvatarChipList from "./AvatarChipList";

import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";
import ImagePanel from "./ImagePanel"

import { CropOriginal, Brightness4, Brightness5, FormatBold, FormatItalic, AddPhotoAlternateOutlined } from "@material-ui/icons";
import ToolButton from "./ToolButton"
import { add } from 'date-fns/esm';


import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';


import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
const { hasCommandModifier } = KeyBindingUtil;


const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));


const styleObj = function ({ breakpointsAttribute, ...theme }) {


  return {
    popover: () => {
      return {
        pointerEvents: 'none',

      }
    },
    paper: () => {
      return {
        pointerEvents: "auto", padding: "8px",

      }
    },

  }
}



export default function createFontBarPlugin() {
  let externalES = null;
  let externalSetEditorState = null;
  let fontBarEntityKey = "";
  let firstOne = true

  function fontBarStrategy(contentBlock, callback, contentState) {


    contentBlock.findEntityRanges(
      function (character) {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === "FONTBAR"

        );
      },
      callback
    );
  };

  function FontBarComp({ ...props }) {
    const classes = useStyles()
    const anchorRef = useRef()

    return <>
      <div style={{ display: "inline-block" }} ref={anchorRef}>{props.children}</div>
      <Popover
        elevation={1}
        marginThreshold={0}
        //id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={true}

        // anchorReference="anchorPosition"
        anchorEl={anchorRef.current}
        // anchorEl={this.anchorRef}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        // anchorPosition={{ ...this.state.anchorPos, }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}

      // //   onClose={this.handlePopoverClose}
      // disableRestoreFocus
      // PaperProps={{ onMouseEnter: this.handlePopoverOpen, onMouseLeave: this.handlePopoverClose, elevation: 2 }}
      >
        aasdffdsf
      </Popover>
    </>

  }



  function taggingFontBar() {



    const oldSelection = externalES.getSelection();
    let newContent = externalES.getCurrentContent();
    let newSelection = externalES.getSelection();


    console.log(oldSelection.serialize())
    externalES.getCurrentContent().getBlocksAsArray().forEach(function (block) {

      const [blockKey, blockType, blockText, metaArr] = block.toArray()

      metaArr.forEach(function (item, index) {
        const itemEntityKey = item.getEntity()


        if (itemEntityKey) {
          const entityType = newContent.getEntity(itemEntityKey).getType()
          if (entityType === "FONTBAR") {

            newSelection = newSelection.merge({
              anchorKey: blockKey,
              anchorOffset: index,
              focusKey: blockKey,
              focusOffset: index + 1,
              isBackward: false,
              hasFocus: false,
            })
            newContent = Modifier.applyEntity(newContent, newSelection, null)
          }
        }
      })
    })

    if (oldSelection.isCollapsed()) {

      externalES = EditorState.push(externalES, newContent, "apply-entity");
      externalES = EditorState.acceptSelection(externalES, oldSelection);
      return externalES


    }
    else {
      if (!fontBarEntityKey) {
        newContent = newContent.createEntity(`FONTBAR`, "MUTABLE", {});
        fontBarEntityKey = newContent.getLastCreatedEntityKey();
      }


      newContent = Modifier.applyEntity(newContent, oldSelection, fontBarEntityKey)

      externalES = EditorState.push(externalES, newContent, "apply-entity");
      externalES = EditorState.acceptSelection(externalES, oldSelection);
      return externalES
    }


  }


  function markingFontBarBlock() {



    let selection = externalES.getSelection()
    const allBlocks = externalES.getCurrentContent()
  //  console.log(selection.isCollapsed())

    allBlocks.getBlockMap().forEach(function (block) {
      if (block.getType() === "FontBarBlock") {
        const blockKey = block.getKey()
        let newSelection = SelectionState.createEmpty(blockKey)
        newSelection = newSelection.merge({
          focusKey: blockKey,
          focusOffset: 0,
          anchorOffset: blockKey,
          anchorOffset: 0,
          hasFocus: false
        });
        const newContent = Modifier.setBlockType(
          allBlocks,
          newSelection, // selection,//  newSelection,
          "unstyled"
        );
        externalES = EditorState.push(externalES, newContent, 'change-block-type');
      }
    })



    //externalES = EditorState.forceSelection(externalES, selection)

    //  return externalES



    if (!selection.isCollapsed()) {
      let startKey = selection && selection.getStartKey()
      const allBlocks = externalES.getCurrentContent()

      console.log(allBlocks.getBlockForKey(startKey).getType())
      while (allBlocks.getBlockForKey(startKey).getType() !== "unstyled") {
        startKey = getBlockAfter(startKey).getKey()

      }


      if (startKey) {
        let newSelection = SelectionState.createEmpty(startKey)
        newSelection = newSelection.merge({
          focusKey: startKey,
          focusOffset: 0,
          anchorOffset: startKey,
          anchorOffset: 0,
          hasFocus: false
        });

        const newContent = Modifier.setBlockType(
          allBlocks,
          newSelection, // selection,//  newSelection,
          "FontBarBlock"
        );
        externalES = EditorState.push(externalES, newContent, 'change-block-type');
      }


    }
    externalES = EditorState.forceSelection(externalES, selection)
    return externalES
  }


  return {


    fontBarPlugin: {

      keyBindingFn(e, { getEditorState, setEditorState, ...obj }) {
        return getDefaultKeyBinding(e);
      },
      handleKeyCommand(command, editorState, evenTimeStamp, { setEditorState }) {
        // better to place each command detail in draft.js, not here
        if (command === "cancel-delete") {

        }

        return 'not-handled';
      },



      onChange: function (editorState, { setEditorState }) {
        externalES = editorState
        externalSetEditorState = setEditorState
        //    externalES = taggingFontBar()
        externalES = markingFontBarBlock()
        return externalES
        // setEditorState
      },


      decorators: [{

        strategy: fontBarStrategy,
        component: withStyles(styleObj, { withTheme: true })(withContext(FontBarComp))                       //withTheme(withContext(EmojiComp))
      }],

      handleReturn: function (e, newState, { getEditorState, setEditorState }) {

      },
    },
    markingFontBarBlock,



  }


}

