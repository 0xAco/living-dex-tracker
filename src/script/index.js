// get all pokemon URL
async function getPokemonHub() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=100000');
    if (await response.status !== 200) throw new Error(response.statusText);
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la requête : ' + error.message);
  }
}

// get specific pokemon info by id or name
async function getPokemonById(id) {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + id);
    if (await response.status !== 200) throw new Error(response.statusText);
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la requête : ' + error.message);
  }
}

// main code
document.body.onload = async() => {
  const sylveon = await getPokemonById('sylveon');
  const keepProps = ['id', 'name', 'types'];
  const sylveonClean = Object.fromEntries(
    Object.entries(sylveon)
      .filter(([key]) => keepProps.includes(key))
  );
  sylveonClean.types = sylveonClean.types.map(t => (t.type.name));
  console.log(sylveonClean);
};