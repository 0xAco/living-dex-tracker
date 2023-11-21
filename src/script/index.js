// pokedex est importé depuis le html
let main;

function getDOMelements() {
  main = document.querySelector('main');
}

function createPokemon() {
  let previousGen;
  let previousSection;
  let currentGen;

  for(pokemon of pokedex) {

    // créations des sections pour les générations
    currentGen = pokemon.gen;
    if(currentGen !== previousGen) {
      previousGen = currentGen;
      const genSection = document.createElement('section');
      previousSection = genSection;
      genSection.classList.add('blue');
      genSection.innerText = 'Génération ' + pokemon.gen;
      main.appendChild(genSection);
    }

    // ajout des images
    const img = document.createElement('img');
    img.src = pokemon.spriteshiny;
    img.alt = pokemon.namefr + ' shiny';
    previousSection.appendChild(img);
    console.log(pokemon.id, pokemon.namefr);
  }
}

document.body.onload = async() => {
  getDOMelements();
  createPokemon();
};