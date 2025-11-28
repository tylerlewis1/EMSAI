import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App.js';
import Create from './pages/Create.jsx';
import Instructor from './pages/instructor.jsx';
import Crew from './pages/Crew.jsx';
import Dash from './pages/Dash.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from "./pages/Signup.jsx"
import Signin from './pages/Signin.jsx';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <BrowserRouter>
    <Routes>
      <Route path="/" Component={App}/>
      <Route path="/signin" Component={Signin}/>
      <Route path='/signup' Component={Signup}/>
      <Route path='/dash' Component={Dash}/>
      <Route path="/create" Component={Create}/>
      <Route path="/instructor" Component={Instructor}/>
      <Route path="/crew" Component={Crew}/>
   </Routes>
  </BrowserRouter>
);

