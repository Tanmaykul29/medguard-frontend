import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUploader from './components/ImageUploader';
import Navbar from './components/Navbar';
import Home from './components/Home';
import './App.css';

function App() {
  return (
      // <div className="App" style={{background: 'linear-gradient(191deg, rgba(255, 255, 255, 1) 0%, rgba(171, 199, 245, 1) 49%, rgba(255, 255, 255, 1) 100%)'}}>
      //     <Navbar/>
      //     <ImageUploader />
      // </div>
      <div className="App" style={{width: '100vw', background: 'linear-gradient(191deg, rgba(255, 255, 255, 1) 0%, rgba(171, 199, 245, 1) 49%, rgba(255, 255, 255, 1) 100%)'}}>
        <Navbar/>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<ImageUploader />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App
