const pokedexSection = document.querySelector(".pokedex-section");
const header = document.querySelector(".header");
const homeSection = document.querySelector(".home-section");
const pokedexLink = header.querySelector(".pokedex-link ");
const homeLink = header.querySelector(".home-link ");
const pokedexList = pokedexSection.querySelector(".pokedex-list");
const baseUrl = "https://pokeapi.co/api/v2/pokemon";
const pokemonInfoSection = document.querySelector(".pokemon-info-section");
const swiperWrapper = document.querySelector(".swiper-wrapper");
const pageLinks = document.querySelectorAll(".page-link-num");
const pageLinkPrev = document.querySelector(".page-link-prev");
const pageLinkNext = document.querySelector(".page-link-next");
const pageItemPrev = document.querySelector(".page-item-prev");
const pageItems = document.querySelectorAll(".page-item-nums");
const paginationContainer = document.querySelector(".pagination-container");
const gameBlock = document.querySelector(".game-block");
const loader = document.querySelector(".loader");
const resultDiv = document.querySelector("#result");
const gameContainer = document.querySelector(".game-container");
const pokemonsRemaining = document.querySelector(".pokemons-remaining");
const loaderSec = document.querySelector(".loader-sec");
const audioElement = document.getElementById("gameAudio");
let basePokedexURL = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20";
let basePokedexPrevURL = "https://pokeapi.co/api/v2/pokemon";
let basePokedexNextURL = "https://pokeapi.co/api/v2/pokemon?offset=10&limit=10";
let offsetPokemons;
let limitPokemons;
let initialSlidePokemonInfo;
let offset = 0;
let offsetForNextPokemons;
let isPokedexOpen = false;
let isHomeSectionOpen = true;
let isPokemonOpen = false;
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#searchInput");

const toggleElems = (...elems) => {
  elems.forEach((item) => {
    item.classList.toggle("hide");
  });
};
const headerFetch = {
  accept: "application/json",
  "Content-Type": "application/json",
};
const showPokedex = async (e) => {
  e.preventDefault();
  if (!isPokedexOpen) {
    toggleElems(pokedexSection, loader, loaderSec);
    loaderSec.classList.add("hide");
    audioElement.pause();
    await allPokemons();
    isPokedexOpen = true;
    if (!homeSection.classList.contains("hide")) {
      toggleElems(homeSection);
      isHomeSectionOpen = false;
    }
    if (isPokemonOpen) {
      toggleElems(pokemonInfoSection);
      isPokemonOpen = false;
    }
  }
};
const allPokemons = async () => {
  const result = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  if (result.ok) {
    const dataPokedex = await result.json();
    console.log(dataPokedex);
    if (offset === 0) {
      pageItemPrev.classList.add("disabled");
    } else {
      pageItemPrev.classList.remove("disabled");
    }
    const dataPokedexResults = dataPokedex.results;

    const pokemonDataPromises = dataPokedexResults.map(async (pokemon) => {
      const pokemonResult = await fetch(pokemon.url, {
        method: "GET",
        headers: headerFetch,
      });
      if (pokemonResult.ok) {
        return pokemonResult.json();
      }
    });
    const pokemonData = await Promise.all(pokemonDataPromises);
    console.log(pokemonData);
    pokemonData.forEach((data) => {
      insertPokedex(data);
    });
    toggleElems(loader);
    if (!loader.classList.contains("hide")) {
      toggleElems(loader);
    }
  }
};
const insertPokedex = async (data) => {
  const pokedexCard = `
    <div class="pokemon-card">
    <span class="pokemon-id" data-id="${data.id}">${data.id}</span>
    <img src="${data.sprites.front_default}" alt="Pokemon-img">
     <span class="pokemon-name">${data.name}</span>
    </div>
`;
  pokedexList.insertAdjacentHTML("beforeend", pokedexCard);
  paginationContainer.classList.remove("hide");
};
const insertSearchPokedex = async (data) => {
  const pokedexCard = `
    <div class="pokemon-card">
    <span class="pokemon-id" data-id="${data.id}">${data.id}</span>
    <img src="${data.sprites.front_default}" alt="Pokemon-img">
     <span class="pokemon-name">${data.name}</span>
    </div>
`;
  pokedexList.insertAdjacentHTML("beforeend", pokedexCard);
};
const insertPokemonInfo = async (data) => {
  const pokemonInfoBlock = `
  <div class="swiper-slide">
  <div class="pokemon-info-block">
    <div class="pokemon-info-left">
      <div class="pokemon-info-left-top">
        <div class="left-top-text">
          <span>#${data.id}</span>
          <h2>${data.name}</h2>
        </div>
        <div class="cries">
        <h5>Cries</h5>
        <audio controls>
        <source src="${data.cries.latest}" type="audio/mpeg">
        </audio>
      </div>
      </div>
      <div class="pokemon-info-left-bot">
      <h5>Basic sprites</h5>
        <div class="left-bot-images">
          <div class="images-top">
            <img src="${data.sprites.front_default}" alt="" />
            <img src="${data.sprites.back_default}" alt="" />
          </div>
          <div class="images-top">
          <img src="${data.sprites.other.home.front_default}" alt="" />
          <img src="${data.sprites.other.showdown.front_default}" alt="" class='gif-img'/>
        </div>
        </div>
      </div>
    </div>
    <div class="pokemon-info-center">
      <img
        src="${data.sprites.other.dream_world.front_default}"
        alt=""
      />
    </div>
    <div class="pokemon-info-right">
      <div class="pokemon-info-right-top">
        <div class="type-info">
          <h2>Type</h2>
          <div class="types">
          </div>
        <div class="abilities-info">
          <h2>Abilities</h2>
          <div class="abilities">
          </div>
        </div>
      </div>
      <div class="pokemon-info-right-bot">
        <div class="stats">
          <label for="range">HP:${data.stats[0].base_stat}</label>
          <input
          min="0" max="200"
          value="${data.stats[0].base_stat}"
            type="range"
            name="range"
            id="hpRange"
            disabled
          />
        </div>
        <div class="stats">
          <label for="range">Attack:${data.stats[1].base_stat}</label>
          <input
          min="0" max="200"
          value="${data.stats[1].base_stat}"
            type="range"
            name="range"
            id="hpRange"
            disabled
          />
        </div>
        <div class="stats">
          <label for="range">Defense:${data.stats[2].base_stat}</label>
          <input
          min="0" max="200"
          value="${data.stats[2].base_stat}"
            type="range"
            name="range"
            id="hpRange"
            disabled
          />
        </div>
        <div class="stats">
          <label for="range">Special-attack:${data.stats[3].base_stat}</label>
          <input
          min="0" max="200"
          value="${data.stats[3].base_stat}"
            type="range"
            name="range"
            id="hpRange"
            disabled
          />
        </div>
        <div class="stats">
          <label for="range">Special-defense:${data.stats[4].base_stat}</label>
          <input
          min="0" max="200"
          value="${data.stats[4].base_stat}"
            type="range"
            name="range"
            id="hpRange"
            disabled
          />
        </div>
        <div class="stats">
          <label for="range">Speed:${data.stats[5].base_stat}</label>
          <input
          min="0" max="100"
          value="${data.stats[5].base_stat}"
            type="range"
            name="range"
            id="hpRange"
            disabled
          />
        </div>
      </div>
    </div>
  </div>
</div>
`;
  swiperWrapper.insertAdjacentHTML("afterbegin", pokemonInfoBlock);

  const typeInfo = document.querySelector(".types");
  for (let i = 0; i < data.types.length; i++) {
    let typeName = data.types[i].type.name;
    let typeClass = "";
    if (typeName === "normal") {
      typeClass = "normal-class";
    } else if (typeName === "fire") {
      typeClass = "fire-class";
    } else if (typeName === "water") {
      typeClass = "water-class";
    } else if (typeName === "electric") {
      typeClass = "electric-class";
    } else if (typeName === "grass") {
      typeClass = "grass-class";
    } else if (typeName === "ice") {
      typeClass = "ice-class";
    } else if (typeName === "fighting") {
      typeClass = "fighting-class";
    } else if (typeName === "poison") {
      typeClass = "poison-class";
    } else if (typeName === "ground") {
      typeClass = "ground-class";
    } else if (typeName === "flying") {
      typeClass = "flying-class";
    } else if (typeName === "psychic") {
      typeClass = "psychic-class";
    } else if (typeName === "bug") {
      typeClass = "bug-class";
    } else if (typeName === "rock") {
      typeClass = "rock-class";
    } else if (typeName === "ghost") {
      typeClass = "ghost-class";
    } else if (typeName === "dragon") {
      typeClass = "dragon-class";
    } else if (typeName === "dark") {
      typeClass = "dark-class";
    } else if (typeName === "steel") {
      typeClass = "steel-class";
    } else if (typeName === "fairy") {
      typeClass = "fairy-class";
    } else {
      typeClass = "default-class";
    }
    const typesDivs = `
            <div class="${typeClass}">${data.types[i].type.name}</div>
        </div>`;
    typeInfo.insertAdjacentHTML("beforeend", typesDivs);
  }
  const abilitiesInfo = document.querySelector(".abilities");
  for (let i = 0; i < data.abilities.length; i++) {
    const abilitiesDivs = `
    <div >${data.abilities[i].ability.name}</div>
    `;
    abilitiesInfo.insertAdjacentHTML("beforeend", abilitiesDivs);
  }
};
const showHome = (e) => {
  e.preventDefault();
  if (!isHomeSectionOpen) {
    if (isPokemonOpen) {
      toggleElems(pokemonInfoSection);
      isPokemonOpen = false;
    }

    if (isPokedexOpen) {
      toggleElems(pokedexSection);
      isPokedexOpen = false;
    }
    toggleElems(homeSection);
    isHomeSectionOpen = true;
  }
};

const nextPage = async () => {
  offset += 20;
  pokedexList.innerHTML = "";
  await allPokemons();
  updatePageNumbers();
  updateActivePage(offset / 20 + 1);
};
const prevPage = async () => {
  offset -= 20;
  pokedexList.innerHTML = "";
  await allPokemons();
  updatePageNumbers();
  updateActivePage(offset / 20 + 1);
};
const goToPage = async (e) => {
  e.preventDefault();
  const page = +e.target.textContent;
  offset = (page - 1) * 20;
  pokedexList.innerHTML = "";
  await allPokemons();
  updatePageNumbers();
  updateActivePage(page);
};

const updatePageNumbers = (e) => {
  const currentPage = offset / 20 + 1;
  const totalPokemonCount = 1302;
  const totalPages = Math.ceil(totalPokemonCount / 20);
  const midIndex = Math.floor(pageLinks.length / 2);
  const startPage = Math.max(1, currentPage - midIndex);
  const endPage = Math.min(totalPages, startPage + pageLinks.length - 1);

  for (let i = 0; i < pageLinks.length; i++) {
    const pageNumber = startPage + i;
    if (pageNumber <= endPage) {
      pageLinks[i].textContent = pageNumber;
    } else {
      pageLinks[i].textContent = "";
    }
  }
};

const updateActivePage = (page) => {
  pageItems.forEach((item) => {
    if (+item.textContent === +page) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};
const searchPokemon = async (e) => {
  e.preventDefault();
  const searchInputValue = searchInput.value.toLowerCase();
  const searchPokemonResult = await fetch(`${baseUrl}/${searchInputValue}`, {
    method: "GET",
    headers: headerFetch,
  });
  if (searchPokemonResult.ok) {
    const searchPokemonData = await searchPokemonResult.json();
    console.log(searchPokemonData);
    if (isPokedexOpen) {
      pokedexList.innerHTML = "";
      paginationContainer.classList.add("hide");
      await insertSearchPokedex(searchPokemonData);
    }
    if (isPokemonOpen) {
      const pokemonID = searchPokemonData.id;
      const swiper = new Swiper(".mySwiper", {
        navigation: {
          nextEl: ".button-next",
          prevEl: ".button-prev",
        },
        mousewheel: true,
        keyboard: true,
        spaceBetween: 0,
        initialSlide: pokemonID - 1,
      });
    }
  }
};
const clearGameBlock = () => {
  while (gameBlock.firstChild) {
    gameBlock.removeChild(gameBlock.firstChild);
  }
};
let lives = 3;
let pokemonCount = 0;

const updateLives = () => {
  document.getElementById("lives").textContent = `Lives: ${lives}`;
};
const resetGame = () => {
  lives = 3;
  pokemonCount = 0;
  clearGameBlock();
  updateLives();
  pokemonsRemaining.textContent = `Pokemons remaining ${pokemonCount - 5}`;
  resultDiv.textContent = `Who is that POKEMON?`;
  toggleElems(gameContainer);
  getPokemonsForGame();
  toggleElems(loaderSec);

  audioElement.pause();
  audioElement.currentTime = 0;
};

const getPokemonsForGame = async (e) => {
  toggleElems(gameContainer);

  if (pokemonCount >= 5 || lives === 0) {
    clearGameBlock();
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", resetGame);
    gameBlock.appendChild(restartButton);
    return;
  }
  clearGameBlock();
  updateLives();
  const correctPokemonName = await getRandomPokemonName();
  const incorrectPokemonNames = await getRandomIncorrectPokemonNames(
    correctPokemonName
  );
  const allNames = [correctPokemonName, ...incorrectPokemonNames];
  shuffleArray(allNames);
  toggleElems(loaderSec);
  await Promise.all(
    allNames.map(async (name) => {
      if (!name.sprites) {
        const pokemonData = await fetch(name.url).then((res) => res.json());
        name.sprites = pokemonData.sprites;
      }
    })
  );
  const gameCard = `
    <div class="game-card">
      <img src="${
        correctPokemonName.sprites.front_default
      }" alt="Guess-pokemon" />
      <div class="poke-names">
        ${allNames
          .map((name) => `<div class="poke-name">${name.name}</div>`)
          .join("")}
      </div>
    </div>`;
  gameBlock.insertAdjacentHTML("afterbegin", gameCard);
  pokemonCount++;

  audioElement.play();
  document.querySelectorAll(".poke-name").forEach((nameElement) => {
    nameElement.addEventListener("click", () => {
      if (nameElement.textContent === correctPokemonName.name) {
        resultDiv.textContent = "Correct! Who is that POKEMON?";
        clearGameBlock();
        toggleElems(gameContainer);
        toggleElems(loaderSec);
        getPokemonsForGame();

        pokemonsRemaining.textContent = `Pokemons remaining ${
          pokemonCount - 5
        }`;
        if (pokemonCount === 5) {
          resultDiv.textContent = "You win!";
        }
      } else {
        nameElement.classList.add("shake-element");

        lives--;
        updateLives();
        resultDiv.textContent = "Incorrect! Try again";
        if (lives === 0) {
          clearGameBlock();
          const restartButton = document.createElement("button");
          restartButton.textContent = "Restart";
          restartButton.addEventListener("click", resetGame);
          pokemonsRemaining.textContent = `Pokemons remaining ${0}`;
          gameBlock.appendChild(restartButton);
        } else {
          resultDiv.textContent = "Incorrect! Try again";
        }
      }
    });
  });
};

const getRandomPokemonName = async () => {
  const randomPokemonID = Math.floor(Math.random() * 1025);
  const pokemonsGameResult = await fetch(`${baseUrl}/${randomPokemonID}`);
  if (pokemonsGameResult.ok) {
    return await pokemonsGameResult.json();
  }
};
const getRandomIncorrectPokemonNames = async (correctName) => {
  const incorrectNames = [];
  while (incorrectNames.length < 3) {
    const randomPokemon = await getRandomPokemonName();
    if (
      randomPokemon.name !== correctName.name &&
      !incorrectNames.some((name) => name.name === randomPokemon.name)
    ) {
      incorrectNames.push(randomPokemon);
    }
  }
  return incorrectNames;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
    console.log(i);
  }
};

const init = async () => {
  updatePageNumbers();
  await generatePokemonsForSwipper();
  updateLives();
  getPokemonsForGame();
};
const generatePokemonsForSwipper = async () => {
  const PokemonsInfoResult = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=34&offset=0`,
    {
      method: "GET",
      headers: headerFetch,
    }
  );
  if (PokemonsInfoResult.ok) {
    const dataPokemonsInfo = await PokemonsInfoResult.json();
    const dataPokedexResults = dataPokemonsInfo.results;
    const pokemonDataPromises = dataPokedexResults.map(async (pokemon) => {
      const pokemonResult = await fetch(pokemon.url, {
        method: "GET",
        headers: headerFetch,
      });
      if (pokemonResult.ok) {
        return pokemonResult.json();
      }
    });
    const pokemonData = (await Promise.all(pokemonDataPromises)).reverse();
    console.log(pokemonData);
    pokemonData.forEach((data) => {
      insertPokemonInfo(data);
    });
  }
};
const getPokemonData = async (e) => {
  e.preventDefault();
  const target = e.target.closest(".pokemon-card");
  if (target) {
    let pokemonID = target.querySelector(".pokemon-id");
    let pokemonDataID = +pokemonID.textContent - 1;

    isPokemonOpen = true;
    isPokedexOpen = false;
    isHomeSectionOpen = false;
    if (isPokemonOpen) {
      var swiper = new Swiper(".mySwiper", {
        navigation: {
          nextEl: ".button-next",
          prevEl: ".button-prev",
        },

        mousewheel: true,
        keyboard: true,
        spaceBetween: 0,

        initialSlide: pokemonDataID,
      });
      toggleElems(pokedexSection);
      loader.classList.remove("hide");
      setTimeout(() => {
        toggleElems(pokemonInfoSection, paginationContainer);
      }, 1000);
      setTimeout(() => {
        loader.classList.add("hide");
      }, 5000);
    }
  }
};
pokedexList.addEventListener("click", async (e) => {
  getPokemonData(e);
});
pokedexLink.addEventListener("click", (e) => {
  pokedexList.innerHTML = "";
  showPokedex(e);
});
homeLink.addEventListener("click", showHome);
if (!pageItemPrev.classList.contains("disabled")) {
  pageLinkPrev.addEventListener("click", prevPage);
}

pageLinkNext.addEventListener("click", nextPage);
pageLinks.forEach((page) => {
  page.addEventListener("click", goToPage);
});
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await searchPokemon(e);
});
init();
