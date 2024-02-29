let url_origine = "https://tyradex.vercel.app/api/v1/pokemon";
let pokemons;

if (localStorage.getItem("pokemons_MF")) { 
    pokemons = JSON.parse(localStorage.getItem("pokemons_MF"));
    //console.log(pokemons);
} else {
    fetch(url_origine) 
    .then(response => response.json()) 
    .then(response => {
        localStorage.setItem("pokemons_MF", JSON.stringify(response));
        pokemons = JSON.parse(localStorage.getItem("pokemons_MF"));
        //console.log(pokemons);
    })
    .catch(error => alert(error))
}

// Fonction permettant de créer la page avec tous les pokémons

function normal_pokemons(nb) {
    if (nb == 1) {
        let doc = document.querySelector("body");
        doc.innerHTML = "";
        doc.insertAdjacentHTML("afterbegin", `<div id="all"><div id="grid"></div><button id='add_pokes' class="pointer" onClick="">Découvrir de nouveaux pokémons</button></div>`)
    }

    doc = document.querySelector("#grid");
    for (let i=nb*100-99; i<=nb*100; i++) {
        if (i < pokemons.length) {
            let poke = pokemons[i];
            doc.insertAdjacentHTML("beforeend", 
                `<button class='boite pointer' onClick="afficherPokemon(${i})">
                    <p class="nom">${poke.name["fr"]}</p>
                    <img src=${poke.sprites["regular"]} alt="Image du pokemon" class="photo">
                    <div class="types">
                        <img src=${poke.types[0].image} alt="Logo du premier type">
                        ${poke.types[1] ? `<img src=${poke.types[1].image} alt="Logo du second type">` : ``}
                    </button>
                `);
        }
    }

    if (nb != Math.ceil(pokemons.length/100)) {
        document.getElementById("add_pokes").setAttribute("onClick", `normal_pokemons(${nb+1})`);
    } else {
        document.getElementById("add_pokes").remove();
    }
}

// Fonction permettant d'afficher la fiche d'un pokemon

function afficherPokemon(i) {
    window.scrollTo(0,0);
    //console.log(pokemons[i]);
    let poke = pokemons[i];
    let doc = document.querySelector("body");
    doc.innerHTML = "";
    doc.insertAdjacentHTML("beforeend",
        `<div id="haut">
            <img src=${poke.types[0].image} alt="Logo du premier type" class="logo-types">
            <h3 id="poke_nom">${poke.name["fr"]}</h3>
            ${poke.types[1] ? `<img src=${poke.types[1].image} alt="Logo du second type" class="logo-types">` : ``}
        </div>
        <table id="tb-evo">
            <tr>
                <th class="en-tete">Pré-évolution</th>
                <th class="en-tete">Génération</th>
                <th class="en-tete">Évolution</th>
            </tr>
            <tr id="boite-evo">
                ${poke.evolution ? `${poke.evolution["pre"] ? `<td class="cellules-evo"><button class="boite petit" onClick="afficherPokemon(${poke.evolution["pre"][poke.evolution["pre"].length-1]["pokedexId"]})"><img src=${pokemons[poke.evolution["pre"][poke.evolution["pre"].length-1]["pokedexId"]].sprites["regular"]} class="logo-evo"><p>${poke.evolution["pre"][poke.evolution["pre"].length-1]["name"]}</p></button></td>` : `<td class="cellules-evo"><p id="">Aucune</p></td>`}` : `<td class="cellules-evo"><p id="">Aucune</p></td>`}
                <td class="cellules-evo"><p>${poke.generation}</p></td>
                ${poke.evolution ? `${poke.evolution["next"] ? `<td class="cellules-evo"><button class="boite petit" onClick="afficherPokemon(${poke.evolution["next"][0]["pokedexId"]})"><img src=${pokemons[poke.evolution["next"][0]["pokedexId"]].sprites["regular"]} class="logo-evo"><p>${poke.evolution["next"][0]["name"]}</p></button></td>` : `<td class="cellules-evo"><p>Aucune<p></td>`}` : `<td class="cellules-evo"><p>Aucune<p></td>`}
            </tr>
        </table>
        <div id="milieu">
            <ul id="stat-list">
                <li class="stats">Attaque : ${poke.stats["atk"]}</li>
                <li class="stats">Attaque spéciale : ${poke.stats["spe_atk"]}</li>
                <li class="stats">Défense : ${poke.stats["def"]}</li>
                <li class="stats">Défense spéciale : ${poke.stats["spe_def"]}</li>
                <li class="stats">Points de vie : ${poke.stats["hp"]}</li>
                <li class="stats">Vitesse : ${poke.stats["vit"]}</li>
            </ul>
            <img src=${poke.sprites["regular"]} alt="Image du pokemon" class="photos">
        </div>
        <div id="all-resi">
            <table id="t-faibl">
                <tr>
                    <th class="en-tete">Très faible</th>
                </tr>
            </table>
            <table id="faibl">
                <tr>
                    <th class="en-tete">Faible</th>
                </tr>
            </table>
            <table id="resi">
                <tr>
                    <th class="en-tete">Résistant</th>
                </tr>
            </table>
            <table id="t-resi">
                <tr>
                    <th class="en-tete">Très résistant</th>
                </tr>
            </table>
            <table id="immu">
                <tr>
                    <th class="en-tete">Immunisé</th>
                </tr>
            </table>
        </div>
        <div id="change-poke">
            ${i>1 ? `<div class="poke-around"><p class="around big">&#10094;</p><button class="boite around petit" onClick="afficherPokemon(${i-1})"><img src=${pokemons[i-1].sprites["regular"]} class="logo-around"><p>${pokemons[i-1].name["fr"]}</p></button></div>` : ``}
            <button id="retour" onClick="retour(${i})">Retourner à l'ensemble des pokémons</button>
            ${i<pokemons.length-1 ? `<div class="poke-around"><button class="boite around petit" onClick="afficherPokemon(${i+1})"><img src=${pokemons[i+1].sprites["regular"]} class="logo-around "><p>${pokemons[i+1].name["fr"]}</p></button><p class="around big">&#10095;</p></div>` : ``}
        </div>
    `);
    print_resi(poke);
}

// Fonction créant le tableau de résistance sur la fiche pokémon

function print_resi(poke) {
    let tab;
    for (let resi of poke.resistances) {
        if (resi["multiplier"]==4) {
            tab = document.getElementById("t-faibl");
            tab.insertAdjacentHTML("beforeend", `<tr><td>${resi["name"]}</td></tr>`);
        }
        if (resi["multiplier"]==2) {
            tab = document.getElementById("faibl");
            tab.insertAdjacentHTML("beforeend", `<tr><td>${resi["name"]}</td></tr>`);
        }
        if (resi["multiplier"]==0.5) {
            tab = document.getElementById("resi");
            tab.insertAdjacentHTML("beforeend", `<tr><td>${resi["name"]}</td></tr>`);
        }
        if (resi["multiplier"]==0.25) {
            tab = document.getElementById("t-resi");
            tab.insertAdjacentHTML("beforeend", `<tr><td>${resi["name"]}</td></tr>`);
        }
        if (resi["multiplier"]==0) {
            tab = document.getElementById("immu");
            tab.insertAdjacentHTML("beforeend", `<tr><td>${resi["name"]}</td></tr>`);
        }
    }
    
}

// Fonction pour passer entre la page d'accueil et les pages avec les pokémons

function pokedex() {
    let frame = document.getElementById("frame");
    frame.setAttribute("src", "./pages/pokemons.html");
    let framePage = frame.contentWindow;
    frame.addEventListener('load', function(){framePage.normal_pokemons(1)}, {once: true});
    framePage.window.scrollTo(0,0);
}

function accueil() {
    let frame= document.getElementById("frame");
    frame.setAttribute("src", "./pages/accueil.html");
}

// Fonction permettant l'affichage d'un pokémon aléatoire

function randomPoke() {
    let frame = document.getElementById("frame");
    frame.setAttribute("src", "./pages/pokemons.html");
    let framePage = frame.contentWindow;
    let id = Math.floor(Math.random() * 1017) + 1;
    frame.addEventListener('load', function(){framePage.afficherPokemon(id);}, {once: true});
}

// Fonctions permettant l'affichage des pokémons selon un type

function pokeType(type) {
    let frame = document.getElementById("frame");
    frame.setAttribute("src", "./pages/pokemons.html");
    let framePage = frame.contentWindow;
    frame.addEventListener('load', function(){framePage.showPokeType(type)}, {once: true});
}

function showPokeType(type) { 
    let doc = document.querySelector("body");
    doc.innerHTML = "";
    doc.insertAdjacentHTML("afterbegin", `<div id="grid-type"></div>`)
    doc = document.querySelector("#grid-type");
    for (poke of pokemons) {
        if (poke.types) {
            for (let pokemon_type of poke.types) {
                if (pokemon_type["name"] == type) {
                    doc.insertAdjacentHTML("beforeend", 
                        `<button class='boite pointer' onClick="afficherPokemon(${poke.pokedexId})">
                            <p class="nom">${poke.name["fr"]}</p>
                            <img src=${poke.sprites["regular"]} alt="Image du pokemon" class="photo">
                            <div class="types">
                                <img src=${poke.types[0].image} alt="Logo du premier type">
                                ${poke.types[1] ? `<img src=${poke.types[1].image} alt="Logo du second type">` : ``}
                            </button>
                        `);
                }
            }
        }
    }
}

// Fonctions permettant de revenir à la ligne du pokémon dont on vient de regarder la fiche

function retour(id) {
    for (let i=1; i<=Math.floor((id-1)/100)+1; i++) {
        normal_pokemons(i);
    }
    window.scrollTo(0,0);
    window.scrollTo(0, 8+(396*Math.floor((id-1)/4)));
}

// Fonction permettant le fonctionnement de la barre de recherche

function searchPoke() {
    let list = document.getElementById('search-list');
    list.innerHTML = '';
    let name = document.getElementById("search-bar").value;
    name = name.toUpperCase();
    let result = pokemons.filter((pokemon) => pokemon.name["fr"].toUpperCase().startsWith(name));
    if (result.length <= 10) {
        for (let poke of result) {
            list.insertAdjacentHTML("beforeend", `<li><button class="pointer" onClick="goPoke(${poke.pokedexId})">${poke.name["fr"]}</button></li>`)
        }
    }
}

function goPoke(id) {
    document.getElementById('search-list').innerHTML = '';
    document.getElementById("search-bar").value = '';
    let frame = document.getElementById("frame");
    frame.setAttribute("src", "./pages/pokemons.html");
    let framePage = frame.contentWindow;
    frame.addEventListener('load', function(){framePage.afficherPokemon(id);}, {once: true});
}

function notSearchPoke() {
    document.getElementById('search-list').innerHTML = '';
}