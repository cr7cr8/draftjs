import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
//import itemData from './itemData';

const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'grid',
    // gridTemplateColumns:"1fr 1fr",
    // gridTemplateRows:"1fr 1fr",




    // justifyContent: 'space-around',
    // overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: "100%",
    height: "100%",
    display: 'grid',
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    backgroundColor: "pink",
    // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
    transform: 'translateZ(0)',

    "& > .MuiImageListItem-root": {


      backgroundColor: "lightyellow",
    }
  },






  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
}));


const itemData = [
  {
    img: "https://picsum.photos/200/300",
    title: 'Image',
    author: 'author',
    featured: true,
    col: 1,
    row: 2,
  },
  {
    img: "https://picsum.photos/200/300",
    title: 'Image',
    author: 'author',
    featured: true,
    col: 1,
    row: 1,
  },
  {
    img: "https://picsum.photos/200/300",
    title: 'Image',
    author: 'author',
    col: 1,
    row: 1,
  },


];


export default function AdvancedImageList() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ImageList rowHeight={200} gap={1} className={classes.imageList}>
        {itemData.map((item) => (
          <ImageListItem key={item.img} cols={1} rows={1} style={{width:"100%"}}>
            <img src={item.img} alt={item.title} />




            {/* <ImageListItemBar
              title={item.title}
              position="top"
              actionIcon={
                <IconButton aria-label={`star ${item.title}`} className={classes.icon}>
                  <StarBorderIcon />
                </IconButton>
              }
              actionPosition="left"
              className={classes.titleBar}
            /> */}
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}
