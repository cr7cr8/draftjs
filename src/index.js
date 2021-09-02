import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Context1Provider from "./Context1Provider";

ReactDOM.render(


  <React.StrictMode>
    <Context1Provider>
      <App />
    </Context1Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

