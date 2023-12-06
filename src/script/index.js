// pokedex est importé depuis le html
let main;
let isShinyDisplay = false;
let isAsideVisible = false;
let exportButton;
let switchDisplay;
let alertSaveData;
let asideToggle;
let asideElement;

// retrieve DOM elements
function getDOMelements() {
  main = document.querySelector('main');
  exportButton = document.querySelector('#export-data');
  switchDisplay = document.querySelector('#switch-display');
  alertSaveData = document.querySelector('#data_saved');
  asideToggle = document.querySelector('#aside__toggle-button');
  asideElement = document.querySelector('.aside');
}

// sets event listeners for static DOM
function setEventsListeners() {
  exportButton.addEventListener('click', exportData);
  switchDisplay.addEventListener('click', switchToOtherDisplay);
  asideToggle.addEventListener('click', toggleAside);
}

// exports the data as a JSON
function exportData() {
  const checkboxes = document.querySelectorAll('.pokemon__checkbox:checked');
  const exportedData = [];

  checkboxes.forEach(box => {
    const mon = { 
      'id': parseInt(box.id.split('+')[0]),
      'internalid': box.id,
    }
    exportedData.push(mon);
  })

  saveData(exportedData, isShinyDisplay);
  alertSaveData.classList.remove("display_none"); 
  setTimeout(()=>alertSaveData.classList.add('display_none'), 3500);
}

// update checkboxes when changing display mode
function updateCheckboxes() {
  const checkboxes = document.querySelectorAll('.pokemon__checkbox');
  const existingData = loadData(isShinyDisplay);
  checkboxes.forEach(box => {
    if (existingData) box.checked = existingData.some(mon => mon.internalid === box.id);
    else box.checked = false;
    updateShadowEffect(box);
  });
}

// switch display to shiny or back 
function switchToOtherDisplay() {
  // save current display data
  exportData(isShinyDisplay);

  // update internal value
  isShinyDisplay = !isShinyDisplay;

  // replace images
  const shinies = document.querySelectorAll('.--shiny');
  const normals = document.querySelectorAll('.--non-shiny');
  if (isShinyDisplay) {
    shinies.forEach(mon => mon.classList.remove('--hidden'));
    normals.forEach(mon => mon.classList.add('--hidden'));
  } else {
    shinies.forEach(mon => mon.classList.add('--hidden'));
    normals.forEach(mon => mon.classList.remove('--hidden'));
  }

  // update checkboxes
  updateCheckboxes(isShinyDisplay);
}

// collapse or show aside
function toggleAside() {
  isAsideVisible = !isAsideVisible;
  if (isAsideVisible) asideElement.classList.remove('--collapsed');
  else asideElement.classList.add('--collapsed');
}

// click on a pokemon card
function onCardClick(event) {
  const targetTag = event.target.tagName;

  // clicked on the input directly
  if (targetTag === 'INPUT') return;

  // retrieve the card element
  card = event.target;
  if (targetTag === 'IMG') card = event.target.closest('.pokemon__card');
  const internalid = card.id.split('+').splice(1).join('+');
  const check = document.getElementById(internalid);
  check.click();
}

function saveData(data) {
  const itemName = 'pokemonData' + (isShinyDisplay ? '-shiny' : '');
  localStorage.setItem(itemName, JSON.stringify(data));
}

function loadData() {
  const itemName = 'pokemonData' + (isShinyDisplay ? '-shiny' : '');
  return JSON.parse(localStorage.getItem(itemName));
}

// create every pokemon
function createPokemon() {
  let previousGen;
  let previousSection;
  let currentGen;

  const existingData = loadData(isShinyDisplay);

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
    const imgshiny = document.createElement('img');
    const input = document.createElement('input');

    let check = '';
    if (existingData && existingData.some(mon => mon.internalid === internalid)) check = 'checked';
    // card div
    div.classList.add('pokemon__card');
    div.id = `div+${internalid}`;
    div.addEventListener('click', onCardClick);
    // images
    img.src = pokemon.sprite;
    img.alt = pokemon.namefr;
    img.classList.add('pokemon__img', '--non-shiny');
    if (!check) img.classList.add('--shadow');
    img.dataset.internalid = internalid;
    imgshiny.src = pokemon.spriteshiny;
    imgshiny.alt = pokemon.namefr + ' shiny';
    imgshiny.classList.add('pokemon__img', '--shiny', '--hidden');
    if (!check) imgshiny.classList.add('--shadow');
    imgshiny.dataset.internalid = internalid;
    // checkbox
    input.type = 'checkbox';
    input.id = internalid;
    input.classList.add('pokemon__checkbox');
    input.name = pokemon.namefr;
    input.checked = check;
    input.addEventListener('change', updateShadowEffect);
    // append everything
    div.appendChild(img);
    div.appendChild(imgshiny);
    div.appendChild(input);
    previousSection.appendChild(div);
  }
}

function updateShadowEffect(event) {
  const checkbox = event.target ? event.target : event;
  const internalid = checkbox.id;
  const image = document.querySelector(`.pokemon__img${isShinyDisplay ? '.--shiny' : '.--non-shiny'}[data-internalid="${internalid}"]`);
  if (checkbox.checked) image.classList.remove('--shadow');
  else image.classList.add('--shadow');
}

document.body.onload = async() => {
  getDOMelements();
  setEventsListeners();
  createPokemon();
};
