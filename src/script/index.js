// pokedex est importé depuis le html
let main;

// retrieve DOM elements
function getDOMelements() {
  main = document.querySelector('main');
  exportButton = document.querySelector('#export-data');
}

// sets event listeners for static DOM
function setEventsListeners() {
  exportButton.addEventListener('click', exportData)
}

// exports the data as a JSON
function exportData() {
  console.log('todo - export data');
}

// create every pokemon
function createPokemon() {
  let previousGen;
  let previousSection;
  let currentGen;

  for(pokemon of pokedex) {

    // créations des sections pour les générations
    currentGen = pokemon.gen;
    if(currentGen !== previousGen) {
      const genSection = document.createElement('section');
      const genTitle = document.createElement('h2');
      const genContent = document.createElement('div');
      
      genSection.classList.add('generation__section');
      genTitle.classList.add('generation__title');
      genContent.classList.add('generation__content');
      
      genTitle.innerText = 'Génération ' + pokemon.gen;
      
      genSection.appendChild(genTitle);
      genSection.appendChild(genContent);
      main.appendChild(genSection);
      
      previousGen = currentGen;
      previousSection = genContent;
    }

    // ajout des images
    const div = document.createElement('div');
    const img = document.createElement('img');
    div.classList.add('pokemon__card');
    img.src = pokemon.sprite // shiny;
    img.alt = pokemon.namefr // + ' shiny';
    img.classList.add('pokemon__img');
    div.appendChild(img);
    div.innerHTML += `<input type="checkbox" id="${pokemon.id}-${pokemon.namefr}" name="${pokemon.namefr}" checked/>`;
    previousSection.appendChild(div);
    // console.log(pokemon.id, pokemon.namefr);
  }
}

document.body.onload = async() => {
  getDOMelements();
  setEventsListeners();
  createPokemon();
};
