import React from 'react';
import { Route , BrowserRouter }  from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePonint';
import SearchResults from './pages/SearchResults';


const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact/>
      <Route component={CreatePoint} path="/create-point"/>
      <Route component={SearchResults} path="/search-results"/>
    </BrowserRouter>
  )
}

export default Routes;