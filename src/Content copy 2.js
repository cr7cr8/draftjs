import { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import { Context1 } from "./Context1Provider"


import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';
import Masonry from 'react-masonry-css';
import { makeStyles, styled, useTheme } from '@material-ui/core/styles';

import { stateToHTML } from 'draft-js-export-html';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2, } from 'react-html-parser';
import reactElementToJSXString from 'react-element-to-jsx-string';
import ReactElementToString from 'react-element-to-string';
import DetectableOverflow from 'react-detectable-overflow';


import createImagePlugin from './ImagePlugin';



import { Typography, Button, ButtonGroup, Container, Paper, Box, Avatar, Grid, Chip, Link } from "@material-ui/core";
import { Image, Brightness4, Brightness5, FormatBold, FormatItalic, FormatUnderlined, InsertEmoticon, NavigateBeforeSharp } from "@material-ui/icons";
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useStyles } from './DraftEditor';
import { useStyles as mentionStyles } from './MentionPlugin';



import {
  isMobile,
  isFirefox,
  isChrome,
  browserName,
  engineName,
} from "react-device-detect";


const { ImageBlog } = createImagePlugin()

export default function Content({ style }) {

  const { editorContent, setEditorContent, lgSizeObj, smSizeObj, deviceSize, picArr, setPicArr,
    postArr, setPostArr,
    postPicArr, setPostPicArr, } = useContext(Context1);

  const theme = useTheme()
  const { editorPaperCss, className1, unstyledBlockCss, imageBlockCss, centerBlockCss, rightBlockCss, } = useStyles({})
  const { mentionHeadRoot, mentionBodyRoot, mentionBodyRoot2, mentionHeadAvatar, mentionHeadLabel, mentionHeadLabel2, mentionBodyLabel, } = mentionStyles();


  function toHtml(preHtml, imgArr) {
    //  alert("bbbb")
    const html = ReactHtmlParser(preHtml, {



      transform: function transformFn(node, index) {





        // if (reactElementToJSXString(convertNodeToElement(node)) === "<br />") {

        //   // alert(reactElementToJSXString(convertNodeToElement(node)))

        //   return <></>
        // }

        if (node.name === "imgtag") {

          //   console.log(node.attribs)
          return (<ImgTag key={index} picArr={imgArr} />)
        }
        if (node.name === "emoji") {

          //   console.log(node.attribs.symbol, node.attribs.imgurl)
          return (
            <Typography variant="body2"
              key={index}
              style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                backgroundSize: "contain",
                display: "inline-block",
                textAlign: "right",
                color: "rgba(0,0,0,0)",
                backgroundImage: node.attribs.imgurl,
                transform: isMobile ? "scale(1.2)" : "scale(1.2)",
                marginLeft: theme.typography.fontSize * 0.12,
                marginRight: theme.typography.fontSize * 0.12,
              }}
            >{node.attribs.symbol}</Typography>
          )
        }
        if (node.name === "longmentionoff_head") {
          return (<span key={index}></span>)
        }
        if (node.name === "longmentionoff_body") {

          const arr = [];
          node.children.forEach(element => {
            arr.push(convertNodeToElement(element))
          })
          return (
            <Chip classes={{ root: mentionBodyRoot2, label: mentionBodyLabel }}
              key={index}
              avatar={< Avatar alt={null} src={node.attribs.imgurl.replace("url(", "").replace(")", "")}   //src={friendObj[person]}
              />}
              label={
                <Typography variant="body2">
                  {arr.map((element, index) => {
                    return <span key={index}>{element}</span>
                  })}
                </Typography>
              }
            // label={< Typography variant="body2" >{node.attribs.person}</Typography >}
            />
          )
        }
        if (Object.keys(node.attribs || {}).includes("colorblock")) {

          // node.children.forEach(item => {
          //   console.log(item.type)
          // })

          const arr = [];
          node.children.forEach(item => {
            console.log(item.type === "text" && item.data)
            arr.push(item.type === "tag" ? item : item.data)
          })

          return <div style={{ backgroundImage: "url(https://mernchen.herokuapp.com/api/picture/download/60a204e70270cc001728285f)" }}>
            {arr.map((item, index) => {

              if (item.type !== "tag") { console.log(item); return item }
              return <span key={index}>{transformFn(item, index)}</span>
            })}</div>

          // return <span key={index}><BackColorTag toHtml={toHtml} node={node} imgArr={imgArr} index={index} /></span>
        }
        if (node.name === "linkoff") {

          const arr = [];
          node.children.forEach(element => {
            arr.push(convertNodeToElement(element))
          })
           return <span key={index}><LinkTag toHtml={toHtml} node={node} imgArr={imgArr} index={index} /></span>

          // return <Link>{arr.map((element, index) => {
          //   return <span key={index}>{element}</span>
          // })}</Link>

          //return <span key={index}><LinkTag0 host={node.attribs.linkhost} address={node.attribs.linkaddress} arr={arr} /></span>

        }




      },



    })

    return html
  }

  const breakpointColumnsObj = {
    [theme.breakpoints.values.xs]: 1,
    [theme.breakpoints.values.sm]: 1,
    [theme.breakpoints.values.md]: 2,
    [theme.breakpoints.values.lg]: 3,
    [theme.breakpoints.values.xl]: 4,

  };

  return (
    <>

      <Container disableGutters={false}   >

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >

          {postArr.map(function (item, index) {

            return (
              <Paper classes={{ root: editorPaperCss }}
                elevation={3}
                style={{ overflow: "auto", padding: "0px" }} key={index}>
                {toHtml(postArr[index], postPicArr[index])}
              </Paper>
            )

          })}


        </Masonry>
      </Container>
    </>
  )

}


function ImgTag({ picArr, ...props }) {

  //  const { editorContent, setEditorContent, lgSizeObj, smSizeObj, deviceSize, picArr, setPicArr } = useContext(Context1);
  const theme = useTheme()
  const picNum = picArr.length
  const imgArr = picArr


  if (picNum === 1) {
    return (<div style={{

      position: "relative",
      width: "100%",
      height: 0,
      paddingBottom: "56.25%",

      backgroundRepeat: "no-repeat",
      backgroundPositionX: "center",
      backgroundPositionY: "center",
      backgroundSize: "cover",
      backgroundImage: "url(" + imgArr[0] + ")",

      backgroundColor: theme.palette.divider,   //"skyblue",
      overflow: "hidden",

    }} />
    )
  }
  else if (picNum === 2) {
    return (
      <div style={{
        position: "relative",
        width: "100%",
        height: 0,
        paddingBottom: "56.25%",
        backgroundPositionX: "center",
        backgroundPositionY: "center",
        backgroundColor: theme.palette.divider,   //"skyblue",
        overflow: "hidden",
        //    padding:0,

      }}>


        <div style={{
          position: "absolute",
          width: "50%",
          height: "100%",
          //  paddingBottom: "25%",//  "112.5%", 
          backgroundColor: "pink",
          left: "0%",
          top: "0%",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          backgroundSize: "cover",
          backgroundImage: "url(" + imgArr[0] + ")",
          transform: "translateX(-1px) translateY(0px)",
          backgroundColor: "wheat",
        }}
          onClick={function () {
            //    setPicArr(pre => [pre[1]])
          }}

        />
        <div style={{
          position: "absolute",
          width: "50%",
          height: "100%",
          //  paddingBottom: "25%",//  "112.5%", 
          backgroundColor: "wheat",
          left: "50%",
          top: "0%",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          backgroundSize: "cover",
          backgroundImage: "url(" + imgArr[1] + ")",
          transform: "translateX(1px) translateY(0px)",
          backgroundColor: "wheat",
        }}
          onClick={function () {
            //    setPicArr(pre => [pre[0]])
          }}
        />

      </div>
    )
  }
  else if (picNum === 3) {
    return (
      <div style={{
        position: "relative",
        width: "100%",
        height: 0,
        paddingBottom: "56.25%",
        backgroundPositionX: "center",
        backgroundPositionY: "center",
        backgroundColor: theme.palette.divider,   //"skyblue",
        overflow: "hidden",
        //    padding:0,
      }}>


        <div style={{
          position: "absolute",
          width: "50%",
          height: "100%",
          //  paddingBottom: "25%",//  "112.5%", 
          backgroundColor: "pink",
          left: "0%",
          top: "0%",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          backgroundSize: "cover",
          backgroundImage: "url(" + imgArr[0] + ")",
          transform: "translateX(-1px) translateY(0px)",
          backgroundColor: "wheat",
        }}
          onClick={function () {
            //    setPicArr(pre => [pre[1], pre[2]])
          }}

        />
        <div style={{
          position: "absolute",
          width: "50%",
          height: "50%",
          backgroundColor: "wheat",
          left: "50%",
          top: "0%",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          backgroundSize: "cover",
          backgroundImage: "url(" + imgArr[1] + ")",
          transform: "translateX(1px) translateY(-1px)",


        }} onClick={
          function () {
            //   setPicArr(pre => [pre[0], pre[2]])
          }} />

        <div style={{
          position: "absolute",
          width: "50%",
          height: "50%",
          backgroundColor: "wheat",
          left: "50%",
          top: "50%",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          backgroundSize: "cover",
          backgroundImage: "url(" + imgArr[2] + ")",
          transform: "translateX(1px) translateY(1px)",

        }} onClick={
          function () {
            //   setPicArr(pre => [pre[0], pre[1]])
          }} />

      </div>
    )
  }

  else {
    return (
      <div style={{
        position: "relative",
        width: "100%",
        height: 0,
        paddingBottom: "56.25%",
        backgroundPositionX: "center",
        backgroundPositionY: "center",
        backgroundColor: theme.palette.divider,   //"skyblue",
        overflow: "hidden",
        //   padding:0,
      }}>


        <div style={{
          position: "absolute",
          width: "50%",
          height: "50%",
          backgroundColor: "wheat",
          top: "0%",
          left: "0%",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          backgroundSize: "cover",
          backgroundImage: "url(" + imgArr[0] + ")",
          transform: "translateX(-1px) translateY(-1px)",

        }} onClick={function () {
          //  setPicArr(pre => [pre[1], pre[2], pre[3]])
        }} />

        <div style={{
          position: "absolute",
          width: "50%",
          height: "50%",
          backgroundColor: "wheat",
          top: "0%",
          left: "50%",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          backgroundSize: "cover",
          backgroundImage: "url(" + imgArr[1] + ")",
          transform: "translateX(1px) translateY(-1px)",

        }} onClick={function () {
          //   setPicArr(pre => [pre[0], pre[2], pre[3]])
        }} />

        <div style={{
          position: "absolute",
          width: "50%",
          height: "50%",
          backgroundColor: "wheat",
          top: "50%",
          left: "0%",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          backgroundSize: "cover",
          backgroundImage: "url(" + imgArr[2] + ")",
          transform: "translateX(-1px) translateY(1px)",
        }}
          onClick={
            function () {
              //      setPicArr(pre => [pre[0], pre[1], pre[3]])
            }}
        />

        <div style={{
          position: "absolute",
          width: "50%",
          height: "50%",
          backgroundColor: "wheat",
          top: "50%",
          left: "50%",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          backgroundSize: "cover",
          backgroundImage: "url(" + imgArr[3] + ")",
          transform: "translateX(1px) translateY(1px)",

        }} onClick={
          function () {
            //   setPicArr(pre => [pre[1], pre[2], pre[3]])
          }} />


      </div>





    )



  }







}

function LinkTag0({ address, host, arr, ...props }) {

  const [content, setContent] = useState(host.substr(1))
  const theme = useTheme()



  return <Link
    target="_blank"
    //  key={index}
    style={{
      color: theme.palette.primary.main,
      cursor: "pointer"
    }}

    onClick={function (e) {
      e.stopPropagation()
      // e.preventDefault()
      //e.target.innerHTML = `<a target="_blank" style="text-decoration: none;" href=${address}>${host.substr(0)}</a>`         ////.substr(1)
      // e.target.innerHTML === node.attribs.linkhost && e.preventDefault()
      // e.target.innerHTML = node.attribs.linkaddress
      // e.target.href = node.attribs.linkaddress.substr(1)
      setContent(
        <Link href={address} target="_blank" rel="noopener">
          {arr.map((element, index) => {
            return <span key={index}>{element}</span>
          })}
        </Link>
      )
    }}
  >
    {content}
  </Link>

}

function LinkTag({ toHtml, node, index, imgArr, ...props }) {

  const theme = useTheme()
  const host = node.attribs.linkhost;
  const address = node.attribs.linkaddress;



  const [content, setContent] = useState(host.substr(1))

  const arr = [];
  node.children.forEach((element, index) => {
    arr.push(convertNodeToElement(element))
  })

  return (
    <Link
      target="_blank"
      //  key={index}
      style={{
        color: theme.palette.primary.main,
        cursor: "pointer"
      }}
      onClick={function (e) {
        e.stopPropagation()


        setContent(
          <Link href={address} target="_blank" rel="noopener">
            {arr.map((element, index) => {


              return element //toHtml(reactElementToJSXString(element), imgArr)
              //     return <span key={index}>{element}</span>
            })}
          </Link>
        )

      }}
    >
      {content}
    </Link>




  )
}

function LinkTag2() {


  return (
    <>


    </>
  )
}



function BackColorTag({ toHtml, node, index, imgArr, ...props }) {

  const arr = [];
  node.children.forEach((element, index) => {

    //  arr.push(element.type === "tag" ? convertNodeToElement(element) : element.data)
    arr.push(element.type === "tag" ? element : element.data)
  })

  const [isOverFlow, setIsOverFlow] = useState(false)

  return (
    <DetectableOverflow

      onChange={function (overFlow) {
        setIsOverFlow(overFlow)
      }}

      key={index}
      style={{
        backgroundImage: "url(https://mernchen.herokuapp.com/api/picture/download/60a204e70270cc001728285f)",
        position: "relative",

        backgroundColor: "wheat",
        width: "100%",
        height: 0,

        paddingBottom: "56.25%",
        display: "flex",
        alignItems: isOverFlow ? "flex-start" : "center",
        justifyContent: "center",
        overflow: "auto",

      }}
    >

      <div style={{
        textAlign: "center",
        position: isOverFlow ? "block" : "absolute",
        ...!isOverFlow && { top: "50%" },
        ...!isOverFlow && { transform: "translateY(-50%)" },
        color: "white",

        padding: "8px",

      }}>
        {arr.map((element, index) => {

          // if(element.type){
          //   console.log(reactElementToJSXString(element))
          // }

          const elementType = element.name

          //console.log(elementType)
          if (elementType === "emoji" || elementType === "longmentionoff_head" || elementType === "longmentionoff_body" || elementType === "linkoff___") {
            return <span key={index}>{toHtml(reactElementToJSXString(convertNodeToElement(element)), imgArr)}</span>
            //return <span></span>
          }
          else if (elementType === "linkoff") {


            //   console.log(element.attribs.linkhost)
            // console.log(reactElementToJSXString(convertNodeToElement(element)))
            // return <span key={index}>{toHtml(reactElementToJSXString(convertNodeToElement(element)), imgArr)}</span>

            const arr = [];
            node.children.forEach(element => {
              arr.push(convertNodeToElement(element))

              return <span key={index}>{toHtml(reactElementToJSXString(convertNodeToElement(element)), imgArr)}</span>
            })


            // return <Link>{arr.map((element, index) => {
            //   return <span key={index}>{element}</span>
            // })}</Link>








          }
          else {
            return <span key={index}>{element}</span>
          }



        })}

      </div>
    </DetectableOverflow>
  )


}