import React from 'react';
import 'flowbite';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ChatProvider from './context/ChatProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
 
        <Router>
               <ChatProvider>
           
                <Routes>
                    <Route path="/*" element={<App/>}/>
                </Routes>
                </ChatProvider>
        </Router>
      
    
);

  


