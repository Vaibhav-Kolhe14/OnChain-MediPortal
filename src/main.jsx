import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
// import Web3Provider from "./context/Web3Provider";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Web3Provider>    </Web3Provider> */}
      <BrowserRouter>
      <App />
      </BrowserRouter>
  </StrictMode>,
)
