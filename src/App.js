import React, { useEffect, useState } from 'react';
import './App.css';
import Formulario from './components/Formulario';
import ListaPokemons from './components/ListaPokemons';
import PokemonCard from './components/PokemonCard';
import { getPokemons } from './services/api';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const fetchPokemons = async () => {
    try {
      const data = await getPokemons();
      setPokemons(data);
    } catch (err) {
      console.error('Error obteniendo pokemons', err);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const handleSelect = (p) => setSelectedPokemon(p);

  const handleUpdatePokemon = (updated) => {
    setPokemons((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
    setSelectedPokemon(updated);
  };

  return (
    <div className="App app-bg">
      <header className="App-header">
        <h1>pokemon</h1>
      </header>

      <main className="container">
        <section className="left">
          <Formulario onAdded={fetchPokemons} />
          <PokemonCard pokemon={selectedPokemon} onSave={handleUpdatePokemon} />
        </section>

        <section className="right">
          <ListaPokemons pokemons={pokemons} onSelect={handleSelect} selectedId={selectedPokemon ? selectedPokemon.id : null} />
        </section>
      </main>
    </div>
  );
}

export default App;
