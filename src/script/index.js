// get all pokemon URL
async function getPokemonHub(){
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=100000');
    if (await response.status !== 200) throw new Error(response.statusText);
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la requête : ' + error.message);
  }
}

// get specific pokemon info by id
async function getPokemonById(id) {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/'+ id)
    if (await response.status !== 200) throw new Error(response.statusText);
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la requête : " + error.message);
  }
}

// main code
document.body.onload = async() => {
  // const pokemonHub = await getPokemonHub();
  console.log(await getPokemonById(700));
};