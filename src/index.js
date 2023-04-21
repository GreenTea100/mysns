import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
//console.log(firebase);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <App />

);