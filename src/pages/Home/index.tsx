import React from 'react';
import {FiLogIn, FiSearch} from 'react-icons/fi';
import {Link} from 'react-router-dom';

import './styles.css';

import logo from '../../assets/logo-horizontal.png';

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoponto"/>
          <Link to="/create-point">
            <span> <FiLogIn /></span>
            <strong>Cadastrar Novo Ponto</strong>
          </Link>

        </header>

        <main>
          <h1>Um mundo sustentável bem na palma da sua mão!</h1>
          <p>A coleta de resíduos cada vez mais perto de você.</p> 

          <Link to="/search-results">
            <span>
              <FiSearch />
            </span>
            <strong>Buscar pontos</strong>
          </Link>
        </main>
      </div>
    </div>
  );

}

export default Home;