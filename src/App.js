import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ChainInfo from './chain-info';
import FakeBayc from './FakeBayc'; // Import de la page Fake BAYC
import TokenInfo from "./TokenInfo";//importe de token info
import ErrorPage from './ErrorPage'; // Import de la page d'erreur
import FakeNefturians from './FakeNefturians';//import nefturian
import FakeNefturiansTokens from './FakeNefturiansTokens';
import FakeMeebits from './FakeMeebits';

function App() {
  return (
    <div className="App">
      <header className="App-header">
         <nav>
           <ul>
            
             <li>
               <Link to="/" style={{ color: "#ff6347" }}>Home</Link>
            </li>
            <li>
               <Link to="/chain-info" style={{ color: "#ff6347" }}>Chain Info</Link>
            </li>
            <li>
               <Link to="/fakeBayc" style={{ color: "#ff6347" }}>Fake BAYC</Link>
            </li>
            <li>
              <Link to="/fakeNefturians" style={{ color: "#ff6347" }}>Fake Nefturians</Link>
            </li>
            <li>
              <Link to="/fakeMeebits" style={{ color: "#ff6347" }}>Fake Meebits</Link>
            </li>
          </ul>
        </nav>

        {/* Définir les routes pour chaque page */}
        <Routes>
          <Route path="/" element={<h1>Welcome to the Home Page!</h1>} />
          <Route path="/chain-info" element={<ChainInfo />} />
          <Route path="/fakeBayc" element={<FakeBayc />} />
          <Route path="/fakeBayc/:tokenId" element={<TokenInfo />} />
          <Route path="/fakeNefturians" element={<FakeNefturians />} />
          <Route path="/fakeNefturians/:userAddress" element={<FakeNefturiansTokens />} />
          <Route path="/fakeMeebits" element={<FakeMeebits />} />
          <Route path="/error" element={<ErrorPage />} /> {/* Route pour la page d'erreur */}
        </Routes>
      </header>
    </div>
  );
}

export default App;
