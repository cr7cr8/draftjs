import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Close';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import useResizeObserver from '@react-hook/resize-observer';
import { IconButton, Zoom } from '@material-ui/core';

const useSize = (target) => {
  const [size, setSize] = React.useState()

  React.useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}

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

    imageButtonPanelCss: () => {

      return {
        position: "absolute",
        zIndex: 100,
        width: "100%",
        height: "100%",
        opacity: 0.5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transitionProperty: "opacity",
        transitionDuration: "300ms",
        "&:hover": {
          opacity: 1
        }

      }
    }

  }
});


export default function ImagePanel({ blockKey, setImageBlockData,
  deleteImageBlock, /*imageArr, setImageArr,*/ editor, editorState, setEditorState, imageBlockObj, setImageBlockObj, className, ...props }) {


  // const [imageArr, setImageArr] = useState([
  //   "https://picsum.photos/200/300",
  //   "https://picsum.photos/199/600",
  //   "https://picsum.photos/201/300",
  //   //  "https://picsum.photos/200/301",
  // ])

  // const [imageArr, setImageArr] = useState([
  //   "https://picsum.photos/200/300",
  //   "https://picsum.photos/199/600",
  //   "https://picsum.photos/201/300",
  //   //  "https://picsum.photos/200/301",
  // ])

  const classes = useStyles({ numOfImage: Array.isArray(imageBlockObj[blockKey]) ? imageBlockObj[blockKey].length : 0 });
  const target = React.useRef(null)
  const inputRef = React.useRef(null)
  const [imageIndex, setImageIndex] = useState()

  const size = useSize(target)
  const theme = useTheme()




  function update(e) {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget.files[0].name.trim().match(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i)) {
      // const file = e.currentTarget.files[0]
      // file.localUrl = URL.createObjectURL(e.currentTarget.files[0])
      //   console.log(e.currentTarget)


      const files = e.currentTarget.files
      const newFileArr = [
        files[0] && URL.createObjectURL(files[0]),
        files[1] && URL.createObjectURL(files[1]),
        files[2] && URL.createObjectURL(files[2]),
        files[3] && URL.createObjectURL(files[3]),

      ]
        .filter(item => Boolean(item))
        .filter((item, index) => { return index < 4 })



      // setImageArr(pre => {
      //   const pre_ = [...pre]
      //   pre_.splice(imageIndex + 1, 0, ...newFileArr)
      //   return pre_
      // })




      setImageBlockObj(pre => {
        //  alert("dsdf")

        const pre_ = Array.isArray(pre[blockKey]) ? [...pre[blockKey]] : []
        pre_.splice(imageIndex + 1, 0, ...newFileArr)

        return {
          ...pre,

          [blockKey]: pre_
        }

      })

      setImageBlockData("deleteAll", blockKey)
      setTimeout(() => {
        editor.current.focus()
      }, 0);

    }

  }

  useEffect(function () {

    //  setTimeout(
    //     function () {
    inputRef.current.click()
    //     }


    //     , 0)

    setImageBlockObj(pre => {
      return {
        ...pre,
        [blockKey]: []
      }

    })

  }, [])

  useEffect(function () {
    // console.log("+++", imageArr)
    // console.log("===", imageBlockObj[blockKey])
    //  console.log(imageArr[0] === imageBlockObj[blockKey][0])
  })


  return (
    <div className={className}>
      <input ref={inputRef} type="file" multiple={true} style={{ display: "none" }}
        onClick={function (e) { e.currentTarget.value = null; }}
        onChange={update}
      />


      <div className={classes.baseGridCss} ref={target}
        style={{
          backgroundColor: "wheat",
          height: (size && size.width * 9 / 16) || 0 + "px",
        }}
      >

        {
          (Array.isArray(imageBlockObj[blockKey]) ? imageBlockObj[blockKey].length : 0) === 0 &&
          <div
            style={{
              position: "relative", gridColumn: "1/3", gridRow: "1/3", width: "100%",
              height: "100%", display: "flex", justifyContent: "center", alignItems: "center",
            }}>
            <IconButton style={{ backgroundColor: theme.palette.background.paper, }}
              children={<AddIcon style={{ fontSize: "4rem" }} />}
              onClick={function () {
                setImageIndex(-1)
                inputRef.current.click()
                // console.log(Date.now())
              }}
            />


            <IconButton
              style={{
                backgroundColor: theme.palette.background.paper,
                position: "absolute", top: 0, right: 0,
              }}
              onClick={function () {
                deleteImageBlock && deleteImageBlock()

                setImageBlockObj(pre => {

                  delete pre[blockKey]


                  return { ...pre }

                })


              }}
              children={<DeleteIcon />}
            />
          </div>
        }

        {Array.isArray(imageBlockObj[blockKey]) && imageBlockObj[blockKey].map((pic, index) => {

          return (
            // <ImagePic setImageBlockObj imageBlockObj editor blockKey theme index inputRef classes setImageIndex pic={pic} key={index} />
            <div key={index}>
              <ImagePic setImageBlockObj={setImageBlockObj}
                imageBlockObj={imageBlockObj}
                editor={editor}
                blockKey={blockKey}
                theme={theme}
                index={index}
                inputRef={inputRef}
                classes={classes}
                setImageIndex={setImageIndex}
                pic={pic}
                setImageBlockData={setImageBlockData}
              />
            </div>

          )
        })}
      </div>
    </div>
  );
}




function ImagePic({ setImageBlockData, setImageBlockObj, imageBlockObj, editor, blockKey, theme, index, classes, inputRef, setImageIndex, pic, ...props }) {

  const [horizontal, setHorizontal] = useState(50)
  const [verticle, setVerticle] = useState(50)

  const imageRef = React.useRef()
  let width = 50;
  let height = 50;

  useEffect(function () {

    //console.log(window.getComputedStyle(imageRef.current).width, window.getComputedStyle(imageRef.current).height)


    // width = Number(window.getComputedStyle(imageRef.current).width.replace("px", ""))
    //  height = Number(window.getComputedStyle(imageRef.current).height.replace("px", ""))

  }, [])

  return (
    <>
      <div
        className={classes.imageButtonPanelCss}>
        {imageBlockObj[blockKey].length < 4 &&
          <IconButton
            style={{
              backgroundColor: theme.palette.background.paper,
            }}
            children={<AddIcon style={{ fontSize: "4rem" }} />}
            onClick={function (e) {
              setImageIndex(index)
              inputRef.current.click()

            }}
          />}

        <IconButton
          style={{
            backgroundColor: theme.palette.background.paper,
            position: "absolute", top: 0, right: 0,
          }}
          children={<DeleteIcon />}
          onClick={function (e) {
            // e.preventDefault()
            // e.stopPropagation()

            setImageBlockObj(pre => {
              const arr = pre[blockKey].filter((preItem, preIndex) => { return preIndex !== index })
              //...pre.filter((preItem, preIndex) => { return preIndex !== index })]
              return {
                ...pre,

                [blockKey]: arr

              }
            })
            setImageBlockData("deleteAll", blockKey)
            setTimeout(() => {
              editor.current.focus()
            }, 0);

          }}
        />



        {verticle > 0 && <IconButton
          style={{
            backgroundColor: theme.palette.background.paper,
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)"
          }}
          children={<KeyboardArrowUpIcon />}
          onClick={
            function () {
              setVerticle(pre => {
                setImageBlockData({ ["pos" + index]: { horizontal, verticle: Math.max(0, Math.min(pre - 25, 100)) } }, blockKey)
                return Math.max(0, Math.min(pre - 25, 100))

              })


              //  setTimeout(() => {
              //   editor.current.focus()
              //  }, 0);

            }
          }
        />}

        {verticle < 100 && <IconButton
          style={{
            backgroundColor: theme.palette.background.paper,
            position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)"
          }}
          children={<KeyboardArrowDownIcon />}
          onClick={
            function () {
              setVerticle(pre => {
                setImageBlockData({ ["pos" + index]: { horizontal, verticle: Math.max(0, Math.min(pre + 25, 100)) } }, blockKey)
                return Math.max(0, Math.min(pre + 25, 100))

              })

            }
          }
        />}

        {horizontal > 0 && <IconButton
          style={{
            backgroundColor: theme.palette.background.paper,
            position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)"
          }}
          children={<KeyboardArrowLeftIcon />}
          onClick={
            function () {
              setHorizontal(pre => {
                setImageBlockData({ ["pos" + index]: { horizontal: Math.max(0, Math.min(pre - 25, 100)), verticle } }, blockKey)
                return Math.max(0, Math.min(pre - 25, 100))

              })

            }
          }
        />}

        {horizontal < 100 && <IconButton
          style={{
            backgroundColor: theme.palette.background.paper,
            position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)"
          }}
          children={<KeyboardArrowRightIcon />}
          onClick={
            function () {

              setHorizontal(pre => {
                setImageBlockData({ ["pos" + index]: { horizontal: Math.max(0, Math.min(pre +25, 100)), verticle } }, blockKey)
                return Math.max(0, Math.min(pre + 25, 100))

              })
            
            }
          }
        />}

      </div>
      <img src={pic} ref={imageRef} style={{ position: "absolute", objectFit: "cover", width: "100%", height: "100%", objectPosition: horizontal + "%" + " " + verticle + "%" }} />
    </>

  )
} 