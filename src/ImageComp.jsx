import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Close';


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


export default function BasicImageList() {


  const [imageArr, setImageArr] = useState([
    "https://picsum.photos/200/300",
    "https://picsum.photos/199/600",
    "https://picsum.photos/201/300",
    //  "https://picsum.photos/200/301",
  ])

  const classes = useStyles({ numOfImage: imageArr.length });
  const target = React.useRef(null)
  const inputRef = React.useRef(null)
  const [imageIndex, setImageIndex] = useState()

  const size = useSize(target)
  const theme = useTheme()

  useEffect(function () {
    //  console.log(size)
  }, [size])

  return (
    <>
      <input ref={inputRef} type="file" multiple={true} style={{ display: "none" }}
        onClick={function (e) { e.currentTarget.value = null; }}
        onChange={function (e) {
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
            ].filter(item => Boolean(item)).filter((item, index) => { return index < 4 })


            setImageArr(pre => {

              pre.splice(imageIndex + 1, 0, ...newFileArr)
              return pre.filter(item => Boolean(item)).filter((item, index) => { return index < 4 })

            })



            console.log(e.currentTarget.files)
            // setPicArr(pre => {
            //   return [...pre, file]
            // })
            // if (!hasImageBlock()) { insertImageBlock(URL.createObjectURL(e.currentTarget.files[0])) }
            // else {   editor.current.focus() }
          }
        }}
      />


      <div className={classes.baseGridCss} ref={target} style={{ backgroundColor: "wheat", height: (size && size.width * 9 / 16) || 0 + "px", }}>

        {
          imageArr.length === 0 &&
          <div
            style={{
              position: "relative", gridColumn: "1/3", gridRow: "1/3", width: "100%",
              height: "100%", display: "flex", justifyContent: "center", alignItems: "center",
            }}>
            <IconButton style={{ backgroundColor: theme.palette.background.paper, }}
              children={<AddIcon style={{ fontSize: "4rem" }} />}
              onClick={function(){
                setImageIndex(-1)
                inputRef.current.click()


              }}
            />


            <IconButton style={{
              backgroundColor: theme.palette.background.paper,
              position: "absolute", top: 0, right: 0,
            }}><DeleteIcon /></IconButton >
          </div>
        }

        {imageArr.map((item, index) => {

          return (
            <div key={index}>
              <div
                className={classes.imageButtonPanelCss}>
                {imageArr.length < 4 && <IconButton
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
                  onClick={function () {
                    setImageArr(pre => {
                      return [...pre.filter((preItem, preIndex) => { return preIndex !== index })]
                    })
                  }}
                />
              </div>
              <img src={item} style={{ position: "absolute", objectFit: "cover", width: "100%", height: "100%", }} />
            </div>

          )

        })}






      </div>
    </>
  );
}