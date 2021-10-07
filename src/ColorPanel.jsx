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


export default function ColorPanel() {



  return (
    <>



    </>
  )


}