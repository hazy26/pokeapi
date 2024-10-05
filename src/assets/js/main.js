import '../css/style.css'

const pokemonsList = document.querySelector('.pokemons-list');
const pagerHtml = document.querySelector('.pager');
const modal = document.querySelector('.modal');
const btnPrevious = pagerHtml.querySelector('.btn-previous');
const btnNext = pagerHtml.querySelector('.btn-next');
const btnFirstPage = pagerHtml.querySelector('.btn-first');
const btnLastPage = pagerHtml.querySelector('.btn-last');
const btnCurrentPage = pagerHtml.querySelector('.btn-current-page');
const btnNextPage = pagerHtml.querySelector('.btn-next-page');
const btnAfterNextPage = pagerHtml.querySelector('.btn-afternext-page');
const btnOnePageBefore = pagerHtml.querySelector('.btn-one-page-before');
const btnTwoPageBefore = pagerHtml.querySelector('.btn-two-page-before');
let index = 1;
let offset = 0;
let limit = 20;

function fetchURL(url){
  fetch(url).then(response => response.json()).then(data => {
    pokemonsList.innerHTML = '';
    data.results.forEach(result => {
        pokemonsList.innerHTML += `<li class="cursor-pointer font-light tracking-wide"><button class="underline capitalize" item-data="${result.url}">${result.name}</button></li>`;
    });

    btnCurrentPage.textContent = index;
    btnNextPage.textContent = index + 1;
    btnAfterNextPage.textContent = index + 2;
    btnOnePageBefore.textContent = index - 1;
    btnTwoPageBefore.textContent = index - 2;

    btnPrevious.setAttribute('data-url', data.previous);
    btnNext.setAttribute('data-url', data.next);
    btnLastPage.setAttribute('data-url', 'https://pokeapi.co/api/v2/pokemon?offset=1300&limit=20');
    btnFirstPage.setAttribute('data-url', 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
    btnNextPage.setAttribute('data-url', data.next);
    btnOnePageBefore.setAttribute('data-url', data.previous);

    btnAfterNextPage.setAttribute('data-url', `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
    btnTwoPageBefore.setAttribute('data-url', `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);

    console.log(url);

    const pokemons = pokemonsList.querySelectorAll('li>button');
    pokemons.forEach(pokemon => {
      pokemon.addEventListener('click', () => {
        const pokemonDetails = pokemon.getAttribute('item-data');
        openModal(pokemonDetails);
      });
    });
  });
};
fetchURL(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);

function openModal(url){
  fetch(url).then(response => response.json()).then(data => {
    modal.classList.toggle('hidden');

    const name = document.querySelector('.name');
    name.textContent = data.name;

    const height = document.querySelector('.height');
    height.textContent = data.height;
    const weight = document.querySelector('.weight');
    weight.textContent = data.weight;

    const abilities = document.querySelector('.abilities');
    abilities.innerHTML = "";
    for(let i = 0;i < data.abilities.length; i++){
      abilities.innerHTML += `<li>${i+1}) ${data.abilities[i].ability.name}</li>`;
    };

    const sprites = document.querySelector('.sprites');
    sprites.src = data.sprites.front_default;

    const cries = document.querySelector('.cries');
    cries.src = data.cries.latest;

    const types = document.querySelector('.types');
    types.innerHTML = "";
    for(let i = 0;i < data.types.length; i++){
      types.innerHTML += `<li>${i+1}) ${data.types[i].type.name}</li>`;
    };
  });
};

const closeBtn = modal.querySelector('.close-btn');
closeBtn.addEventListener('click', () => {
  modal.classList.toggle('hidden');
});

[btnPrevious, 
  btnNext, 
  btnFirstPage, 
  btnLastPage, 
  btnCurrentPage, 
  btnNextPage, 
  btnAfterNextPage, 
  btnOnePageBefore, 
  btnTwoPageBefore  
].forEach(btn => btn.addEventListener('click', () => {
  const url = btn.getAttribute('data-url');
  const btnClass = btn.getAttribute('class');
  
  if(url !== 'null'){
    fetchURL(url);

    switch(true){
      case btnClass.includes('btn-next'):
      case btnClass.includes('btn-next-page'):
        (index += 1, offset += 20);
        break;
  
      case btnClass.includes('btn-previous'):
      case btnClass.includes('btn-one-page-before'):
        (index -= 1, offset -= 20);
        break;
  
      case btnClass.includes('btn-last'):
        (index = 66, offset = 1300);
        break;
  
      case btnClass.includes('btn-first'):
        (index = 1, offset = 0);
        break;
      
      case btnClass.includes('btn-afternext-page'):
        (index += 2, offset += 40);
        break;
      
      case btnClass.includes('btn-two-page-before'):
        (index -= 2, offset -= 40);
        break;
  
      default:
        console.log('error');
    }

    if(index >= 2){
      btnOnePageBefore.classList.remove('hidden');
      btnPrevious.classList.remove('opacity-50');
      btnFirstPage.classList.remove('opacity-50');
    } else {
      btnOnePageBefore.classList.add('hidden');
      btnPrevious.classList.add('opacity-50');
      btnFirstPage.classList.add('opacity-50');
    }

    if(index >= 3){
      btnTwoPageBefore.classList.remove('hidden');
    } else{
      btnTwoPageBefore.classList.add('hidden');
    }

    if(index >= 65){
      btnAfterNextPage.classList.add('hidden');
    } else{
      btnAfterNextPage.classList.remove('hidden');
    }

    if(index == 66){
      btnNextPage.classList.add('hidden');
    } else{
      btnNextPage.classList.remove('hidden');
    }
  }
  }));