import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import useResizeObserver from '@react-hook/resize-observer'

//import itemData from './itemData';

import Masonry from 'react-masonry-component';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: "100%",
    // height: 0,
    // padding:0,
    // paddingBottom:"56.25%",
    backgroundColor: "pink",
    // overflow:"hidden",
  },
}));

const useSize = (target) => {
  const [size, setSize] = React.useState()

  React.useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}



const gridItems = [
  { width: "200px", height: "200px" },
  { width: "100px", height: "100px" },
  { width: "100px", height: "100px" }
].map((i, index) => {

  return <div className={`grid-item`} style={{ width: i.width, height: i.height }}>
    <div style={{ backgroundColor: 'green', height: '100%' }}>{index}</div>
  </div>;
})


const itemData = [


  {
    // img: "https://picsum.photos/700/100",
    width: "740px",
    height: "100px",

    // cols: 6,
    // rows: 2
    //rows:  32/64
  },



  {
    //img: "https://picsum.photos/100/100",
    width: "35px",
    height: "600px",

    // cols: 6,
    // rows: 2
    //rows:  32/64
  },
  {
    //img: "https://picsum.photos/100/100",
    width: "45px",
    height: "200px",

    // cols: 6,
    // rows: 2
    //rows:  32/64
  },
  // {
  //   //  img: "https://picsum.photos/50/100",
  //   width: "5%",
  //   height: "100px",
  //   // cols: 14,
  //   //  rows: 32/64,


  // },

  // {
  //   img: "https://picsum.photos/50/100",
  //   title: 'Image',
  //   author: 'author',
  //  // cols: 14,
  //   //  rows: 32/64,


  // },
  // {
  //   img: "https://picsum.photos/300/300",
  //   title: 'Image',
  //   author: 'author',
  //   cols: 2,
  //   // rows: 64/64,
  // },
  // {
  //   img: "https://picsum.photos/400/400",
  //   title: 'Image',
  //   author: 'author',

  //   cols: 6,
  //   rows: 2
  //   //rows:  32/64
  // },
  // {
  //   img: "https://picsum.photos/500/500",
  //   title: 'Image',
  //   author: 'author',
  //   cols: 14,
  //   //  rows: 32/64,


  // },
  // {
  //   img: "https://picsum.photos/50/80",
  //   title: 'Image',
  //   author: 'author',
  //   cols: 14,
  //   //  rows: 32/64,


  // },
  // {
  //   img: "https://picsum.photos/600/600",
  //   title: 'Image',
  //   author: 'author',
  //   cols: 2,
  //   // rows: 64/64,
  // },
  // {
  //   img: "https://picsum.photos/200/200",
  //   title: 'Image',
  //   author: 'author',

  //   cols: 6,
  //   rows: 2
  //   //rows:  32/64
  // },



  // {
  //   img: "https://picsum.photos/200/501",
  //   title: 'Image',
  //   author: 'author',
  //   cols: 1,
  // },
  // {
  //   img: "https://picsum.photos/300/300",
  //   title: 'Image',
  //   author: 'author',
  //   cols: 2,

  // },
];






export default function BasicImageList() {
  const classes = useStyles();
  // const target = React.useRef(null)
  // const size = useSize(target)

  // useEffect(function () {
  //   console.log(size)
  // }, [size])
  const masonryOptions = {
    transitionDuration: 300,

    // initLayout:false,

  };

  const [opacity, setOpcity] = React.useState(1)

  const imagesLoadedOptions = { background: '.my-bg-image-el' }



  return (
    <div style={{
      display: "grid", gap: "1px", backgroundColor: "blue",
      width: "900px",
      gridTemplateColumns: "2rem",
      gridTemplateRows: "2rem",
      //gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",

   //   gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
   //gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",  
   
   gridAutoFlow: "column",
     
     
      gridAutoColumns: "5rem",
      gridAutoRows: "5rem",

     // gridAutoRows: "100px",

    //  gridAutoColumns: "repeat( auto-fit, minmax(650px, 800px) )",

    }}>
      {/* <div
        style={{
          backgroundColor: "pink",
          // gridColumnStart:"1",
          // gridColumnEnd:"2",
          // gridRowStart:"1",
          // gridRowEnd:"2",
          // gridColumn: "1 / 2",
          // gridRow: "1 / 2",
        }}
      >a</div>
      <div style={{
        backgroundColor: "lightgreen",
        // gridColumn: "2 / 4",
        // gridRow: "1 / 2",
      }}>b</div>
      <div>c</div>
      <div>d</div> */}
      <div style={{ backgroundColor: "orange" }}>1</div>
      <div style={{ backgroundColor: "pink" }}>2</div>
    
      {/* <div style={{ backgroundColor: "yellow" }}>3</div>
      <div style={{ backgroundColor: "skyblue" }}>4</div>
      <div style={{ backgroundColor: "orange",  }}>5</div>
      <div style={{ backgroundColor: "purple", gridRow:"1/2",gridColumn:"2/3"  }}>6</div> */}
      <div style={{ backgroundColor: "gray", gridColumn:"2/4", gridRow:"2/3",}}>7</div>
      <div style={{ backgroundColor: "orange",  }}>8</div>



      {/* <div style={{ backgroundColor: "orange" ,gridColumn:"10/11" }}>1</div> */}
      {/* <div style={{ backgroundColor: "orange" }}>2</div>
      <div style={{ backgroundColor: "orange" ,gridRow:"100/101" ,gridColumn:"100/101" }}>3</div>
      <div style={{ backgroundColor: "orange" }}>4</div> */}
      {/* <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div>
      <div style={{ backgroundColor: "orange" }}>e</div>
      <div style={{ backgroundColor: "orange" }}>f</div> */}

    </div>

  )



  return (
    <>
      {/* <ImageList rowHeight={size ? (size.width * (9 / 16)) : 0} className={classes.imageList} cols={12} gap={0} ref={target}>
      {itemData.map((item, index) => (
        <ImageListItem key={item.img} rows={(item.rows||1)*item.cols/12} cols={item.cols || 1} style={{ backgroundColor: index > 0 ? "lightblue" : "wheat" }}>
          <img src={item.img} alt={item.title} />
        </ImageListItem>
      ))}
    </ImageList> */}
      <Masonry

        style={{ opacity, backgroundColor: "pink", }}
        onLayoutComplete={function () { setOpcity(1) }}
        options={{
          //    columnWidth: '.grid-sizer',
          horizontalOrder: true,
          itemSelector: ".iii",
          columnWidth: 1200,
          //  fitWidth:true,
        }}

        // className={'my-gallery-class'}
        // options={masonryOptions} // default {}
        disableImagesLoaded={false} // default false
        updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
        imagesLoadedOptions={imagesLoadedOptions} // default {}

      >
        {itemData.map((item, index) => {
          return <div className="iii" src={item.img} style={{ width: item.width, height: item.height, backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16) }} />


        })}
      </Masonry>

    </>

  );



  return (
    <div className={classes.root}>
      <ImageList rowHeight={160} className={classes.imageList} cols={3} gap={1}>
        {itemData.map((item) => (
          <ImageListItem key={item.img} cols={item.cols || 1}>
            <img src={item.img} alt={item.title} />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}