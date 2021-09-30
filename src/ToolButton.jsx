import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Image, AddPhotoAlternateOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({

  speedDial: {
    position: 'absolute',

    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      // bottom: theme.spacing(2),

      ...theme.breakpointsAttribute(["right", [theme.multiplyArr(theme.textSizeArr, -1.1)]])
    },
    "& .MuiFab-root": {
      // opacity:0,
      minHeight: "unset",
      boxShadow: theme.shadows[1],

      ...theme.breakpointsAttribute(["width", [theme.textSizeArr]], ["height", [theme.textSizeArr]])
    },
    "& .MuiSpeedDialAction-staticTooltipLabel": {
      display: "none"
    },
    "& .MuiSpeedDialAction-staticTooltip": {
      //     right: theme.spacing(3),
      marginRight: theme.spacing(-1),
      //   ...theme.breakpointsAttribute(["right", [theme.multiplyArr(theme.textSizeArr, 1)]]),
      //   ...theme.breakpointsAttribute(["marginRight", [theme.multiplyArr(theme.textSizeArr, 0.1)]]),


    },
    "& .MuiSpeedDial-fab": {
      // display: "none"
    }

    // '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
    // //  top: theme.spacing(2),
    //   left: theme.spacing(2),
    // },
  },

  speedDial2: {
    position: 'absolute',
    transform: "translateX(-30%)",
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {


      ...theme.breakpointsAttribute(["right", [theme.multiplyArr(theme.textSizeArr, -1.1)]])
    },
    "& .MuiFab-root": {

      minHeight: "unset",
      boxShadow: theme.shadows[1],

      ...theme.breakpointsAttribute(["width", [theme.textSizeArr]], ["height", [theme.textSizeArr]])
    },
    "& .MuiSpeedDialAction-staticTooltipLabel": {
      display: "none"
    },
    "& .MuiSpeedDialAction-staticTooltip": {
      //     right: theme.spacing(3),
      marginRight: theme.spacing(-1),
      //   ...theme.breakpointsAttribute(["right", [theme.multiplyArr(theme.textSizeArr, 1)]]),
      //   ...theme.breakpointsAttribute(["marginRight", [theme.multiplyArr(theme.textSizeArr, 0.1)]]),
    },
    "& .MuiSpeedDial-fab": {
      // display: "none"
    }

  },


}));



// export function ToolButton2({ addImage, hover, top = 0, left = 100, ...props }) {
//   const classes = useStyles();

//   const [open, setOpen] = React.useState(false);
//   const [hidden, setHidden] = React.useState(false);


//   const actions = useMemo(() => {


//     return [
//       { icon: <AddPhotoAlternateOutlined />, name: `Copy`, clickFn: addImage },
//       { icon: <SaveIcon />, name: 'Save' },
//       // { icon: <PrintIcon />, name: 'Print' },
//       // { icon: <ShareIcon />, name: 'Share' },
//       // { icon: <FavoriteIcon />, name: 'Like' },
//     ]
//   }, [addImage]);


//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   return (


//     <SpeedDial
//       style={{ top, left, transitionProperty: "" }}
//       ariaLabel="SpeedDial example"
//       className={classes.speedDial2}

//       icon={<SpeedDialIcon />}
//       onClose={handleClose}
//       onOpen={handleOpen}

//       hidden={false} //hidden={!hover}
//       open={open}//open={hover}
//       direction={"right"}
//     // hidden={!hover}

//     >
//       {actions.map((action) => (
//         <SpeedDialAction
//           key={action.name}
//           icon={action.icon}
//           //tooltipTitle={action.name}
//           tooltipTitle={<></>}
//           onClick={action.clickFn}
//           tooltipPlacement="bottom"
//           tooltipOpen={true}

//         />
//       ))}
//     </SpeedDial>


//   );
// }



export default function SpeedDials({  blockKey, clickFn, hidden, readOnly, setReadOnly, insertImageBlock, ...props }) {
  const classes = useStyles();

  //const [open, setOpen] = React.useState(false);
  // const [hidden, setHidden] = React.useState(false);


  const actions = useMemo(() => {


    return [
      { icon: <AddPhotoAlternateOutlined />, name: `Copy`, clickFn },
      { icon: <SaveIcon />, name: 'Save' },
      // { icon: <PrintIcon />, name: 'Print' },
      // { icon: <ShareIcon />, name: 'Share' },
      // { icon: <FavoriteIcon />, name: 'Like' },
    ]
  }, [clickFn]);


  const [open, setOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false);
    setReadOnly(false)
  };

  const handleOpen = () => {
    setOpen(true);
    setReadOnly(true)
  };

  return (

    <SpeedDial
      ariaLabel="SpeedDial example"
      className={classes.speedDial}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      hidden={true} //hidden={!hover}
      open={!hidden}
      direction={"left"}
    // hidden={!hover}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          //tooltipTitle={action.name}
          tooltipTitle={<></>}
          //  onMouseDown={action.clickFn}
       
          onMouseDown={function () {
       
            setTimeout(() => {
               insertImageBlock(blockKey)
            }, 0);
           
          }}
          tooltipPlacement="bottom"
          tooltipOpen={true}

        />
      ))}
    </SpeedDial>


  );
}