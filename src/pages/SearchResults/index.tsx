import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {Link} from 'react-router-dom';
import {FiArrowLeft, FiFilter} from 'react-icons/fi';
import axios from 'axios';

import api from '../../services/api';

import './styles.css';

import logo from '../../assets/logo-horizontal.png';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  whatsapp: string;
  email: string;
  image: string;
  image_url: string;
  uf: string;
  city: string;
}

interface IBGEUfResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const SearchResults = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  // const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(position => {

  //     const { latitude, longitude } = position.coords;

  //     // setInitialPosition([latitude, longitude]);
  //   })
  // }, []);

  useEffect(() => {
    api.get('items').then(res => {
      setItems(res.data);
    })
  }, []);

  useEffect(() => {
    axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
      const ufInitials = res.data.map( uf => uf.sigla);
      
      setUfs(ufInitials);
    })
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return
    }
    // Carregar as cidades toda cez que a uf mudar
    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(res => {
        const cityNames = res.data.map( uf => uf.nome);

      setCities(cityNames);
    });

  },[selectedUf]);

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([ ...selectedItems, id]);
    }
  }

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    
    const uf = selectedUf;
    const city = selectedCity;
    const items= selectedItems;

    api.get('points', {
      params: {
        city: city,
        uf: uf,
        items: items.join(',')
      }
    }).then(res => {
      console.log(res.data);
      setPoints(res.data);
    });
  }
  

  return (
    <div id="page-serach-results">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta"/>
          <Link to="/">
            <span> <FiArrowLeft /></span>
            <strong>Voltar para a Home</strong>
          </Link>
        </header>

        <main>

          <form onSubmit={handleSubmit}>
            <fieldset>
            <legend>
                <h2>Filtrar localização</h2>
                
              </legend>

              <div className="field-group">
                <div className="field">
                  <label htmlFor="uf">Estado (UF)</label>
                  <select  
                    name="uf" 
                    id="uf" 
                    value={selectedUf} 
                    onChange={handleSelectUf}
                  >
                    <option value="0">Selecione um UF</option>
                    {ufs.map(uf => ((
                      <option 
                        value={uf} 
                        key={uf}
                      >
                          {uf}
                      </option>
                    )))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="city">Cidade</label>
                  <select  
                    name="city" 
                    id="city" 
                    value={selectedCity} 
                    onChange={handleSelectCity}
                  >
                    <option value="0">Selecione uma cidade</option>
                    {cities.map(city => ((
                      <option 
                        value={city} 
                        key={city}
                      >
                          {city}
                      </option>
                    )))}
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <h2>Filtrar itens de coleta</h2>
                <span>Selecione um ou mais itens abaixo</span>
              </legend>

              <ul className="items-grid">
                {items.map(item => (
                  <li 
                    key={item.id} 
                    onClick={() => handleSelectItem(item.id)} 
                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                  >
                    <img src={item.image_url} alt={item.title}/>
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </fieldset>

            <button type="submit">
              <span>
                <FiFilter />
              </span>
              <strong>Filtrar</strong>
            </button>
          </form>

          <h4>
            <strong>{points.length} pontos </strong>
            encontrados
          </h4>

          <div className="cards">
            {points.map(point => (
              <div className="card" key={point.id}>
                <img src={point.image_url} alt={point.name}/>
                <div className="card-desc">
                  <h1>{point.name}</h1>
                  <p>{point.uf}, {point.city}</p>
                  <p>{point.whatsapp}</p>
                  <p>{point.email}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SearchResults;