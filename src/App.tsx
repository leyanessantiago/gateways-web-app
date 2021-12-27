import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ApiProvider } from './api';
import './App.css';
import GatewaysList from './pages/Gateways/List';
import GatewaysDetails from './pages/Gateways/Details';

function App() {
  return (
    <div className="App">
      <main>
          <ApiProvider>
            <BrowserRouter>
              <Routes>
                <Route path="" element={<GatewaysList />} />
                <Route path="/details/:id" element={<GatewaysDetails />} />
              </Routes>
            </BrowserRouter>
          </ApiProvider>
      </main>
    </div>
  );
}

export default App;
