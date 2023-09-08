import { useEffect, useState } from 'react'
import Card from './Card';
import Pokeinfo from './Pokeinfo';
import axios from 'axios'
import SearchBar from './SearchBar';


const Main = () => {
    const [pokeData,setPokeData]=useState([]);
    const [loading,setLoading]=useState(true);
    const [url,setUrl]=useState("https://pokeapi.co/api/v2/pokemon/")
    const [nextUrl,setNextUrl]=useState();
    const [previousUrl,setPreviousUrl]=useState();
    const [pokeDex,setPokeDex]=useState();
    const [searchResults, setSearchResults] = useState([]);

    const pokeFun = async () => {
        setLoading(true)
        const res = await axios.get(url);
        //console.log(res.data.results);
        setNextUrl(res.data.next);
        setPreviousUrl(res.data.previous);
        getPokemon(res.data.results);
        setLoading(false)
    }

    const getPokemon = async (res) => {
        res.map(async (item) => {
            const result = await axios.get(item.url)
            setPokeData(state => {
                state = [...state, result.data]
                state.sort((a,b) => a.id > b.id ? 1 : -1 )
                return state;
            })
        })
    }

    const handleSearch = async (query) => {
        setLoading(true);
      
        try {
          if (query.trim() !== "") {
            // Fetch data from the API based on the search query
            const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
            const allPokemon = res.data.results;
      
            const filteredResults = allPokemon.filter((pokemon) => {
              const pokemonName = pokemon.name.toLowerCase();
              return pokemonName.includes(query.toLowerCase());
            });
      
            // Fetch data for the filtered Pokémon
            const pokemonData = await Promise.all(
              filteredResults.map(async (pokemon) => {
                const result = await axios.get(pokemon.url);
                return result.data;
              })
            );
      
            // Set the search results based on the fetched data
            setSearchResults(pokemonData);
          } else {
            // If the query is empty, revert to default behavior with pokeData
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Error searching for Pokémon:", error);
          setSearchResults([]); // Clear the search results in case of an error
        } finally {
          setLoading(false);
        }
      };
      
      
      
    

    useEffect(() => {
        pokeFun();
    }, [url])

    return (
        <>
          <div className="search">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="container">
            <div className="left-content">
              <Card
                pokemon={searchResults.length > 0 ? searchResults : pokeData}
                loading={loading}
                infoPokemon={(poke) => setPokeDex(poke)}
              />
    
              <div className="btn-group">
                {previousUrl && (
                  <button
                    onClick={() => {
                      setPokeData([]);
                      setUrl(previousUrl);
                    }}
                  >
                    Previous
                  </button>
                )}
    
                {nextUrl && (
                  <button
                    onClick={() => {
                      setPokeData([]);
                      setUrl(nextUrl);
                    }}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
            <div className="right-content">
              <Pokeinfo data={pokeDex} />
            </div>
          </div>
        </>
    )

    /* return(
        <>  
            <div className="search">
                <SearchBar />
            </div>
            <div className="container">
                
                <div className="left-content">
                    <Card pokemon={pokeData} loading={loading} infoPokemon={poke=>setPokeDex(poke)}/>
                    
                    <div className="btn-group">
                        {  previousUrl && <button onClick={()=>{
                            setPokeData([])
                           setUrl(previousUrl) 
                        }}>Previous</button>}

                        { nextUrl && <button onClick={()=>{
                            setPokeData([])
                            setUrl(nextUrl)
                        }}>Next</button>}

                    </div>
                </div>
                <div className="right-content">
                   <Pokeinfo data={pokeDex}/>
                </div>
            </div>
        </>
    ) */
}

export default Main;
