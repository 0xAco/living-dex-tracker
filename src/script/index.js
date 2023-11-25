// pokedex est importé depuis le html
let main;

// retrieve DOM elements
function getDOMelements() {
  main = document.querySelector('main');
  exportButton = document.querySelector('#export-data');
}

// sets event listeners for static DOM
function setEventsListeners() {
  exportButton.addEventListener('click', exportData);
}

// exports the data as a JSON
function exportData() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const exportedData = [];

  checkboxes.forEach(box => {
    const mon = { 
      'id': parseInt(box.id.split('+')[0]),
      'internalid': box.id,
    }
    exportedData.push(mon);
  })

  saveData(exportedData);
  alert("Données sauvegardées");
}

// click on a pokemon card
function onCardClick(event) {
  const targetTag = event.target.tagName;
  // retrieve the div element
  const card = targetTag === 'IMG' || targetTag === 'INPUT'
    ? event.target.closest('.pokemon__card')
    : event.target;
  const internalid = card.id.split('+').splice(1).join('+');
  document.getElementById(internalid).click();
}

function saveData(data) {
  localStorage.setItem('pokemonData', JSON.stringify(data));
}

function loadData() {
  return JSON.parse(localStorage.getItem('pokemonData'));
}

// create every pokemon
function createPokemon() {
  let previousGen;
  let previousSection;
  let currentGen;

  const existingData = loadData();

  for(pokemon of pokedex) {
    const internalid = `${pokemon.id}+${pokemon.namefr}`;

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
    div.id = `div+${internalid}`;
    div.addEventListener('click', onCardClick);
    img.src = pokemon.spriteshiny;
    img.alt = pokemon.namefr + ' shiny';
    img.classList.add('pokemon__img');
    div.appendChild(img);
    let check = 'checked';
    if (existingData && existingData.some(mon => mon.internalid === internalid)) check = 'checked';
    div.innerHTML += `<input type="checkbox" id="${internalid}" class="pokemon__checkbox" name="${pokemon.namefr}" ${check}/>`;
    previousSection.appendChild(div);
  }
}

document.body.onload = async() => {
  getDOMelements();
  setEventsListeners();
  createPokemon();
};
