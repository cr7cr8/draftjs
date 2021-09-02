import React, { createContext, useEffect, useState, useReducer, useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import DraftEditor from "./DraftEditor"
import Content from "./Content"

import CssBaseline from '@material-ui/core/CssBaseline';

import { Typography, Button, ButtonGroup, Container, Paper, Box, Avatar, Grid } from "@material-ui/core";



function App() {


  return (
    <>
      <CssBaseline />

      <Grid container
        direction="row"
        justify="space-around"
        alignItems="flex-start"
        spacing={0}
      >
        <Grid item xs={12} sm={12} md={10} lg={6} xl={6} >
          <DraftEditor />

        </Grid>

      </Grid>

      {/* <div style={{ margin: "0px" }} /> */}



      <Content />


      <div style={{ margin: 100 }} />

    </>
  );
}

export default App;
