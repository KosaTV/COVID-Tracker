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
        if(res){
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
        }
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
    searchButton.disabled = true;
    const loadingBar = document.createElement("div");
    loadingBar.classList.add("loading-bar");
    content.appendChild(loadingBar);
    resultCnt.innerHTML = "";

    const com = document.createElement("p");
    const error = document.createElement("span");
    error.classList.add("error");
    const cry = document.createElement("i");
    cry.classList.add("far","fa-sad-tear", "error__face");
    com.textContent = "We cannot connect with server";
    com.classList.add("error__com");
    error.appendChild(com);
    error.appendChild(cry);

    const value = searchField.value.toLowerCase();
    fetch(`https://api.covid19api.com/summary`)
    .then(res=>{
        if(res.status === 200){
            return res.json()
        }
        content.appendChild(error);
        return Promise.reject("Can not get data from server");
    })
    .then(res=>{
        const currentCountry = res.Countries.filter(country=>{
            if(country.Country.toLowerCase() === value) return country.Country;
        })[0];
        return currentCountry;
    })
    .then(country=>{
                const {Country: name, TotalDeaths: dead, TotalRecovered: saved, TotalConfirmed: confirmed, Date: updated} = country;
                const encodedName = encodeURIComponent(name);
                const noSpaceName = name.replaceAll(" ","-");
                (async ()=>{
                    let data = await fetch(`http://countryapi.gear.host/v1/Country/getCountries?pName=${encodedName}`)
                    .then(res=>res.json())
                    .then(res=>res.Response[0])

                    if(!data) data = {Flag:"../img/flag-undefined.png"};

                    function addZero(num){
                        if(num <= 9) return `0${num}`;
                        return num;
                    }

                    let now = new Date();
                    const year = now.getFullYear();
                    const day = addZero(now.getDate());
                    const month = addZero(now.getMonth()+1);

                    const lastMonth = addZero(now.getMonth());
                    const lastWeek = new Date();
                    lastWeek.setDate(now.getDate()-8);
                    const lastDay = new Date();
                    lastDay.setDate(now.getDate()-2);
                    const lastDayed = new Date();
                    lastDayed.setDate(now.getDate());

                    const countryLastDay = await fetch(`https://api.covid19api.com/country/${noSpaceName}?from=${lastDay.getFullYear()}-${addZero(lastDay.getMonth()+1)}-${addZero(lastDay.getDate())}T00:00:00Z&to=${year}-${month}-${day}T00:00:00Z`)
                    .then(res=>res.json())
                    .then(res=>{
                            res.pop();
                        return res;
                    });

                    const countryLastWeek = await fetch(`https://api.covid19api.com/country/${noSpaceName}?from=${lastWeek.getFullYear()}-${addZero(lastWeek.getMonth()+1)}-${addZero(lastWeek.getDate())}T00:00:00Z&to=${year}-${month}-${day}T00:00:00Z`)
                    .then(res=>res.json())
                    .then(res=>{
                            res.pop();
                        return res;
                    });

                    const countryLastMonth = await fetch(`https://api.covid19api.com/country/${noSpaceName}?from=${year}-${lastMonth}-${day}T00:00:00Z&to=${year}-${month}-${day}T00:00:00Z`)
                    .then(res=>res.json())
                    .then(res=>{
                            res.pop();
                        return res;
                    });

                    if(country){
                        resultCnt.innerHTML = `
                        <div class="country">
                        <h1 class="country__title">${name}</h1>
                        <div class="country__flag"><img class="flag-svg" src="${data.Flag}" alt="Flag"></div>
                        <div class="country__info">
                        <div class="base-info">
                            <h2 class="base-info__title">Generally</h2>
                            <div class="bas-info__content">
                                <div class="boxes">
                                    <div class="box-info">
                                        <span class="box-info__header">
                                            <h2 class="box-info__title">Confirmed<i class="box-info__icon box-info__icon--viruses fas fa-viruses"></i></h2>
                                        </span>
                                        <span class="box-info__count box-info__count--confirmed">${confirmed}</span>
                                    </div>
        
                                    <div class="box-info">
                                        <span class="box-info__header">
                                            <h2 class="box-info__title">Dead<i class="box-info__icon box-info__icon--skull fas fa-skull-crossbones"></i></h2>
                                        </span>
                                        <span class="box-info__count box-info__count--lost">${dead}</span>
                                    </div>
        
                                    <div class="box-info">
                                        <span class="box-info__header">
                                            <h2 class="box-info__title">Recovered<i class="box-info__icon box-info__icon--heart fas fa-heart"></i></h2>
                                        </span>
                                        <span class="box-info__count box-info__count--saved">${saved}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="place-info">
                            <h2 class="place-info__title">Last update</h2>
                            <span class="place-info__count">${updated}</span>
                        </div>
                        </div>
        
                        <div class="statistics">
                            <span class="statistics__info">Population: Lack Data</span>
                            <div class="chart">
                                <div class="chart__post chart__post--yellow" style="height: ${(confirmed/country.population*100)*2.5}px" >
                                    <div class="count">Lack Data</div>
                                </div>
                                <div class="chart__post chart__post--red" style="height: ${(dead/country.population*100)*2.5}px">
                                    <div class="count">Lack Data/div>
                                </div>
                                <div class="chart__post chart__post--green" style="height: ${(saved/country.population*100)*2.5}px">
                                    <div class="count">Lack Data</div>
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
                        </div>
                    </div>
                    `;
                    } else{
                        content.append(error);
                    }

                    if(countryLastDay || countryLastWeek || countryLastMonth){
                            const lastDayConfirmed = countryLastDay[countryLastDay.length-1].Confirmed - countryLastDay[0].Confirmed;
                            const lastDayDeadths = countryLastDay[countryLastDay.length-1].Deaths - countryLastDay[0].Deaths;
                            const lastDayrecovered = countryLastDay[countryLastDay.length-1].Recovered - countryLastDay[0].Recovered;

                            const lastWeekConfirmed = countryLastWeek[countryLastWeek.length-1].Confirmed - countryLastWeek[0].Confirmed;
                            const lastWeekDeadths = countryLastWeek[countryLastWeek.length-1].Deaths - countryLastWeek[0].Deaths;
                            const lastWeekrecovered = countryLastWeek[countryLastWeek.length-1].Recovered - countryLastWeek[0].Recovered;

                            const lastMonthConfirmed = countryLastMonth[countryLastMonth.length-1].Confirmed - countryLastMonth[0].Confirmed;
                            const lastMonthDeadths = countryLastMonth[countryLastMonth.length-1].Deaths - countryLastMonth[0].Deaths;
                            const lastMonthrecovered = countryLastMonth[countryLastMonth.length-1].Recovered - countryLastMonth[0].Recovered;

                            function checkGrow(num){
                                if(num > 0) return `<i class="fas fa-chart-line chart-icon chart-icon--grow"></i>+${num}`
                                return `<i class="fas fa-chart-line-down chart-icon chart-icon--fall"></i>${num}`
                            }

                        if(countryLastDay){
                            const content = document.querySelector(".country__info");
                            content.innerHTML +=`
                            <div class="base-info">
                                <h2 class="base-info__title">From last Day</h2>
                                <div class="bas-info__content">
                                    <div class="boxes">
                                        <div class="box-info">
                                            <span class="box-info__header">
                                                <h2 class="box-info__title">Confirmed<i class="box-info__icon box-info__icon--viruses fas fa-viruses"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--confirmed">${checkGrow(lastDayConfirmed)}</span>
                                        </div>

                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Dead<i class="box-info__icon box-info__icon--skull fas fa-skull-crossbones"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--lost">${checkGrow(lastDayDeadths)}</span>
                                        </div>

                                        <div class="box-info">
                                            <span class="box-info__header">
                                                <h2 class="box-info__title">Recovered<i class="box-info__icon box-info__icon--heart fas fa-heart"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--saved">${checkGrow(lastDayrecovered)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `
                        } else{
                            const content = document.querySelector(".country__info");
                            content.innerHTML +=`
                            <div class="base-info disabled">
                                <h2 class="base-info__title">From last Day</h2>
                                <div class="bas-info__content">
                                    <div class="boxes">
                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Confirmed<i class="box-info__icon box-info__icon--viruses fas fa-viruses"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--confirmed">-</span>
                                        </div>

                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Dead<i class="box-info__icon box-info__icon--skull fas fa-skull-crossbones"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--lost">-</span>
                                        </div>

                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Recovered<i class="box-info__icon box-info__icon--heart fas fa-heart"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--saved">-</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="place-info">
                                    <h2 class="place-info__title">Last update</h2>
                                    <span class="place-info__count">-</span>
                                </div>
                            </div>
                            `
                        }

                        if(countryLastWeek){
                            const content = document.querySelector(".country__info");
                            content.innerHTML +=`
                            <div class="base-info">
                                <h2 class="base-info__title">From last Week</h2>
                                <div class="bas-info__content">
                                    <div class="boxes">
                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Confirmed<i class="box-info__icon box-info__icon--viruses fas fa-viruses"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--confirmed">${checkGrow(lastWeekConfirmed)}</span>
                                        </div>

                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Dead<i class="box-info__icon box-info__icon--skull fas fa-skull-crossbones"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--lost">${checkGrow(lastWeekDeadths)}</span>
                                        </div>

                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Recovered<i class="box-info__icon box-info__icon--heart fas fa-heart"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--saved">${checkGrow(lastWeekrecovered)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `
                        } else{
                            const content = document.querySelector(".country__info");
                            content.innerHTML +=`
                            <div class="base-info disabled">
                                <h2 class="base-info__title">From last Week</h2>
                                <div class="bas-info__content">
                                    <div class="boxes">
                                        <div class="box-info">
                                            <span class="box-info__header">
                                                <h2 class="box-info__title">Confirmed<i class="box-info__icon box-info__icon--viruses fas fa-viruses"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--confirmed">-</span>
                                        </div>

                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Dead<i class="box-info__icon box-info__icon--skull fas fa-skull-crossbones"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--lost">-</span>
                                        </div>

                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Recovered<i class="box-info__icon box-info__icon--heart fas fa-heart"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--saved">-</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="place-info">
                                    <h2 class="place-info__title">Last update</h2>
                                    <span class="place-info__count">-</span>
                                </div>
                            </div>
                            `
                        }

                        if(countryLastMonth){
                            const content = document.querySelector(".country__info");
                            content.innerHTML +=`
                            <div class="base-info">
                                <h2 class="base-info__title">From last Month</h2>
                                <div class="bas-info__content">
                                    <div class="boxes">
                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Confirmed<i class="box-info__icon box-info__icon--viruses fas fa-viruses"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--confirmed">${checkGrow(lastMonthConfirmed)}</span>
                                        </div>

                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Dead<i class="box-info__icon box-info__icon--skull fas fa-skull-crossbones"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--lost">${checkGrow(lastMonthDeadths)}</span>
                                        </div>

                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Recovered<i class="box-info__icon box-info__icon--heart fas fa-heart"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--saved">${checkGrow(lastMonthrecovered)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `
                        } else{
                            const content = document.querySelector(".country__info");
                            content.innerHTML +=`
                            <div class="base-info disabled">
                                <h2 class="base-info__title">From last Month</h2>
                                <div class="bas-info__content">
                                    <div class="boxes">
                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Confirmed<i class="box-info__icon box-info__icon--viruses fas fa-viruses"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--confirmed">-</span>
                                        </div>

                                        <div class="box-info">
                                            <span class="box-info__header">
                                                <h2 class="box-info__title">Dead<i class="box-info__icon box-info__icon--skull fas fa-skull-crossbones"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--lost">-</span>
                                        </div>

                                        <div class="box-info">
                                            <span class="box-info__header">
                                            <h2 class="box-info__title">Recovered<i class="box-info__icon box-info__icon--heart fas fa-heart"></i></h2>
                                            </span>
                                            <span class="box-info__count box-info__count--saved">-</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="place-info">
                                    <h2 class="place-info__title">Last update</h2>
                                    <span class="place-info__count">-</span>
                                </div>
                            </div>
                            `
                        }
                    }
        })();
    })
    .catch(err=>{
        content.append(error);
    })
    .finally(()=>{
        if(loadingBar) loadingBar.remove();
        if(error) error.remove()
        searchButton.disabled = false;
    })
});