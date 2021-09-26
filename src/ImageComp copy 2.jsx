import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';


import useResizeObserver from '@react-hook/resize-observer';
import { IconButton } from '@material-ui/core';

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

    baseGrid: ({ numOfImage, ...props }) => {
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
  }
});


export default function BasicImageList() {
  const classes = useStyles({ numOfImage: 3 });
  const target = React.useRef(null)
  const size = useSize(target)
  const theme = useTheme()

  useEffect(function () {
    //  console.log(size)
  }, [size])

  return (
    <div className={classes.baseGrid} ref={target} style={{ backgroundColor: "wheat", height: (size && size.width * 9 / 16) || 0 + "px", }}>

      <div>
        <div style={{ position: "absolute", width: "100%", height: "100%", opacity: 1, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <IconButton style={{ backgroundColor: theme.palette.background.paper }}><AddIcon /></IconButton >
          <IconButton style={{ backgroundColor: theme.palette.background.paper }}><DeleteIcon /></IconButton >
        </div>
        <img src="https://picsum.photos/200/300" style={{ position: "absolute", objectFit: "cover", width: "100%", height: "100%", }} />
      </div>

      <div>
        <div style={{ position: "absolute", width: "100%", height: "100%", opacity: 1, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <IconButton style={{ backgroundColor: theme.palette.background.paper }}><AddIcon /></IconButton >
          <IconButton style={{ backgroundColor: theme.palette.background.paper }}><DeleteIcon /></IconButton >
        </div>
        <img src="https://picsum.photos/200/300" style={{ position: "absolute", objectFit: "cover", width: "100%", height: "100%", }} />
      </div>


      <div>
        <div style={{ position: "absolute", width: "100%", height: "100%", opacity: 1, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <IconButton style={{ backgroundColor: theme.palette.background.paper }}><AddIcon /></IconButton >
          <IconButton style={{ backgroundColor: theme.palette.background.paper }}><DeleteIcon /></IconButton >
        </div>
        <img src="https://picsum.photos/200/300" style={{ position: "absolute", objectFit: "cover", width: "100%", height: "100%", }} />
      </div>



    </div>
  );
}