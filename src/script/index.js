// pokedex est importé depuis le html
let main;
let isShinyDisplay = false;
let isAsideVisible = false;
let isFilterActive = false;
let exportButton;
let switchDisplay;
let alertSaveData;
let asideToggle;
let asideElement;
let filtersForm;
let clearFiltersBtn;

// retrieve DOM elements
function getDOMelements() {
  main = document.querySelector('main');
  exportButton = document.querySelector('#export-data');
  switchDisplay = document.querySelector('#switch-display');
  alertSaveData = document.querySelector('#data_saved');
  asideToggle = document.querySelector('#aside__toggle-button');
  asideElement = document.querySelector('.aside');
  filtersForm = document.querySelector('#filters__form');
  clearFiltersBtn = document.querySelector('#clear-filters');
}

// sets event listeners for static DOM
function setEventsListeners() {
  exportButton.addEventListener('click', exportData);
  switchDisplay.addEventListener('click', switchToOtherDisplay);
  asideToggle.addEventListener('click', toggleAside);
  filtersForm.addEventListener('submit', filterPokemons);
  clearFiltersBtn.addEventListener('click', clearFilters);
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

function clearFilters() {
  document.querySelector('#num').value = null;
  document.querySelector('#name').value = '';
  document.querySelector('#captured-all').checked = true;
  for (input of document.querySelectorAll('.filters__generation input[checked]'))
    input.checked = false;
  for (input of document.querySelectorAll('.filters__types input[checked]'))
    input.checked = false;

  isFilterActive = false;
  updateClearFilters();
  createPokemon();
}

function filterPokemons(event) {
  event.preventDefault();
  inpouts = event.target.elements;

  const filters = {
    num: parseInt(inpouts.num.value),
    name: inpouts.name.value.toLowerCase(),
    captureState: '',
    generations: [],
    types: []
  }

  for(inpout of inpouts) {
    if (inpout.id.includes('gen') && inpout.checked) 
      filters.generations.push(parseInt(inpout.value));
    else if (inpout.id.includes('type') && inpout.checked)
      filters.types.push(inpout.value.toLowerCase());
    else if (inpout.id.includes('captured') && inpout.checked)
      filters.captureState = inpout.value;
  }

  isFilterActive = true;
  updateClearFilters();
  createPokemon(filters);
}

function updateClearFilters() {
  isFilterActive ?
    clearFiltersBtn.classList.remove('--hidden') :
    clearFiltersBtn.classList.add('--hidden');
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
function createPokemon(filters) {
  let previousGen;
  let previousSection;
  let currentGen;

  main.innerHTML = '';
  const existingData = loadData(isShinyDisplay);

  let filteredPokedex = pokedex;
  if (filters) {
    filteredPokedex = [];
    for (pokemon of pokedex) {
      const internalid = `${pokemon.id}+${pokemon.namefr}`;
      let numTest = !filters.num || pokemon.id === filters.num;
      let nameTest = filters.name === '' || pokemon.namefr.toLowerCase().includes(filters.name) || pokemon.nameen.toLowerCase().includes(filters.name);
      let genTest = filters.generations.length === 0 || filters.generations.indexOf(pokemon.gen) > -1;
      let typeTest = filters.types.length === 0;
      let captureTest = filters.captureState === 'all';
      if (!typeTest) for (type of pokemon.types) {
        if (filters.types.includes(type.toLowerCase())) {
          typeTest = true;
          break;
        }
      }
      if (!captureTest) {
        if (filters.captureState === 'true')
          captureTest = existingData.findIndex(pok => pok.internalid === internalid) > -1;
        else
          captureTest = existingData.findIndex(pok => pok.internalid === internalid) <= -1;
      }

      if (numTest && nameTest && genTest && typeTest && captureTest)
        filteredPokedex.push(pokemon);
    }
  }

  for(pokemon of filteredPokedex) {
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
    const card = document.createElement('div');
    const img = document.createElement('img');
    const imgshiny = document.createElement('img');
    const input = document.createElement('input');
    const infos = document.createElement('div')

    let check = '';
    if (existingData && existingData.some(mon => mon.internalid === internalid)) check = 'checked';
    // card div
    card.classList.add('pokemon__card');
    card.id = `div+${internalid}`;
    card.addEventListener('click', onCardClick);
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
    // infos pokémon
    infos.innerHTML = `<span class="pokemon__id">${pokemon.id}</span><span>${pokemon.namefr}</span>`;
    infos.classList.add('infos__container');
    // checkbox
    input.type = 'checkbox';
    input.id = internalid;
    input.classList.add('pokemon__checkbox');
    input.name = pokemon.namefr;
    input.checked = check;
    input.addEventListener('change', updateShadowEffect);
    // append everything
    card.appendChild(img);
    card.appendChild(imgshiny);
    card.appendChild(input);
    card.appendChild(infos);
    previousSection.appendChild(card);
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
