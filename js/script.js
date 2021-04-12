const searchField = document.querySelector(".input-cnt__field");
const searchButton = document.querySelector(".input-cnt__button");
const content = document.querySelector(".content");
const resultCnt = document.querySelector(".content__result");
searchField.disabled = true;
searchButton.disabled = true;

async function generateCountries(input){
    const value = input.value.toLowerCase();
    const countries = fetch("https://api.covid19api.com/summary")
    .then(res=>res.json())
    .then(res=>res.Countries)
    .then(res=>{
        const sortedCountry = res.sort((prev,next)=>{
            return prev.Country.localeCompare(next.Country);
        });

        const names = sortedCountry.map(ob=>{
            return ob.Country;
        });

        const filtered = names.filter(word=>{
            return word.toLowerCase().includes(value);
        });
        return filtered;
    });
    return await countries;
}

(async ()=>{
    const searchInput = new ListedInput(searchField, await generateCountries(searchField), {
        showOnStart: true,
        function: await generateCountries,
        arguments: [searchField]
    });
    searchField.disabled = false;
    searchButton.disabled = false;
})();



searchButton.addEventListener("click",e=>{
    const loadingBar = document.createElement("div");
    loadingBar.classList.add("loading-bar");
    content.appendChild(loadingBar);
    const value = searchField.value.toLowerCase();
    fetch(`https://api.covid19api.com/summary`)
    .then(res=>res.json())
    .then(res=>{
        const currentCountry = res.Countries.filter(country=>{
            if(country.Country.toLowerCase() === value) return country.Country;
        })[0];
        return currentCountry;
    })
    .then(country=>{
                const {Country: name, TotalDeaths: dead, TotalRecovered: saved, TotalConfirmed: confirmed, Date: updated} = country;
                const encodedName = encodeURIComponent(name);
                (async ()=>{
                    const data = await fetch(`http://countryapi.gear.host/v1/Country/getCountries?pName=${encodedName}`)
                    .then(res=>res.json())
                    .then(res=>res.Response[0]);
                resultCnt.innerHTML = `
                <div class="country">
                <h1 class="country__title">${name}</h1>
                <div class="country__info">
                <div class="base-info">
                    <div class="flag"><img class="flag__svg" src="${data.Flag}" alt=""></div>
                <div class="boxes">
                <div class="box-info">
                    <span class="box-info__header">
                        <h2 class="box-info__title">Confirmed</h2><i class="box-info__icon box-info__icon--viruses fas fa-viruses"></i>
                    </span>
                    <span class="box-info__count box-info__count--confirmed">${confirmed}</span>
                </div>

                <div class="box-info">
                    <span class="box-info__header">
                        <h2 class="box-info__title">Dead</h2><i class="box-info__icon box-info__icon--skull fas fa-skull-crossbones"></i>
                    </span>
                    <span class="box-info__count box-info__count--lost">${dead}</span>
                </div>

                <div class="box-info">
                    <span class="box-info__header">
                        <h2 class="box-info__title">Recovered</h2><i class="box-info__icon box-info__icon--heart fas fa-heart"></i>
                    </span>
                    <span class="box-info__count box-info__count--saved">${saved}</span>
                </div>
                </div>
                </div>
                <div class="statistics">
                    <span class="statistics__info">Population: 23443534</span>
                    <div class="chart">
                        <img src="img/grid2.png" alt="" class="chart__bg">
                        <div class="chart__post chart__post--yellow" style="height: ${(confirmed/country.population*100)*2.5}px" >
                            <div class="count">11%</div>
                        </div>
                        <div class="chart__post chart__post--red" style="height: ${(dead/country.population*100)*2.5}px">
                            <div class="count">23%</div>
                        </div>
                        <div class="chart__post chart__post--green" style="height: ${(saved/country.population*100)*2.5}px">
                            <div class="count">34%</div>
                        </div>
                    </div>
                    <span class="legend">
                        <span class="legend__mark legend__mark--yellow" >
                            <div class="color"></div>
                            <div class="label">Confirmed</div>
                        </span>
                        <span class="legend__mark legend__mark--red" >
                            <div class="color"></div>
                            <div class="label">Dead</div>
                        </span>
                        <span class="legend__mark legend__mark--green" >
                            <div class="color"></div>
                            <div class="label">Recovered</div>
                        </span>
                    </span>
                    <span class="statistics__info">Number of dead, comfirmed and recovered in ${name}, relative to population:</span>
                </div>
                </div>
                <div class="place-info">
                    <h2 class="place-info__title">Last update</h2>
                    <span class="place-info__count">${updated}</span>
                </div>
                </div>
            </div>
            `;
        if(error) error.remove();
        })();
    })
    .catch(err=>{
        const com = document.createElement("p");
        const error = document.createElement("span");
        error.classList.add("error");
        const cry = document.createElement("i");
        cry.classList.add("far","fa-sad-tear", "error__face");
        com.textContent = "We cannot connect with server";
        com.classList.add("error__com");
        error.appendChild(com);
        error.appendChild(cry);
        content.append(error);
    })
    .finally(()=>{
        loadingBar.remove();
        const error = document.querySelector(".error").remove();
    })
});