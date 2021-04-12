const searchField = document.querySelector(".input-cnt__field");
const searchButton = document.querySelector(".input-cnt__button");
const resultCnt = document.querySelector(".content__result");
searchField.disabled = true;
searchButton.disabled = true;

async function generateCountries(input){
    const value = input.value;
    const countries = fetch("https://restcountries.eu/rest/v2/all")
    .then(res=>res.json())
    .then(res=>{
        const sortedCountry = res.sort((prev,next)=>{
            return prev.name.localeCompare(next.name);
        });
        const namesAndCodes = sortedCountry.map(country=>{
            return [country.name, country.alpha2Code];
        });

        const filtered = namesAndCodes.filter(word=>{            
            return word[0].includes(value);
        });
        return filtered;
    })
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

// searchButton.addEventListener("click",e=>{
//     const value = searchField.value.toLowerCase();
//     fetch(`https://restcountries.eu/rest/v2/alpha/${searchField.dataset.code}`)
//     .then(res=>res.json())
//     .then(res=>res.name.toLowerCase() === value ? res : false)
//     .then(res=>{
//         (async ()=>{          
//             const country = res;
//             const info = await generateCountries(searchField);
//             const code = info[0][1];
//             fetch(`https://www.trackcorona.live/api/countries/${code}`)
//             .then(res=>res.json())
//             .then(res=>{
//                 const {location: name, dead, recovered: saved, confirmed, updated} = res.data[0];
//                 resultCnt.innerHTML = `
//             <div class="country">
//                         <h1 class="country__title">${name}</h1>
//                         <div class="country__info">
//                         <div class="flag"><img class="flag__svg" src="${country.flag}" alt=""></div>
//                         <div class="boxes">
//                         <div class="box-info">
//                             <h2 class="box-info__title">Confirmed</h2>
//                             <span class="box-info__count box-info__count--confirmed">${confirmed}</span>
//                         </div>
    
//                         <div class="box-info">
//                             <h2 class="box-info__title">Dead</h2>
//                             <span class="box-info__count box-info__count--lost">${dead}</span>
//                         </div>
    
//                         <div class="box-info">
//                             <h2 class="box-info__title">Recovered</h2>
//                             <span class="box-info__count box-info__count--saved">${saved}</span>
//                         </div>
//                         </div>
//                         <div class="statistics">
//                             <span class="statistics__info">Population: ${country.population}</span>
//                             <div class="chart">
//                                 <div class="chart__post chart__post--yellow" style="height: ${(confirmed/country.population*100)*2.5}px" >
//                                     <div class="count">${(confirmed/country.population*100).toFixed(2)}%</div>
//                                 </div>
//                                 <div class="chart__post chart__post--red" style="height: ${(dead/country.population*100)*2.5}px">
//                                     <div class="count">${(dead/country.population*100).toFixed(2)}%</div>
//                                 </div>
//                                 <div class="chart__post chart__post--green" style="height: ${(saved/country.population*100)*2.5}px">
//                                     <div class="count">${(saved/country.population*100).toFixed(2)}%</div>
//                                 </div>
//                             </div>
//                             <span class="legend">
//                                 <span class="legend__mark legend__mark--yellow" >
//                                     <div class="color"></div>
//                                     <div class="label">Confirmed</div>
//                                 </span>
//                                 <span class="legend__mark legend__mark--red" >
//                                     <div class="color"></div>
//                                     <div class="label">Dead</div>
//                                 </span>
//                                 <span class="legend__mark legend__mark--green" >
//                                     <div class="color"></div>
//                                     <div class="label">Recovered</div>
//                                 </span>
//                             </span>
//                             <span class="statistics__info">Number of dead, comfirmed and recovered in ${name}, relative to population:</span>
//                         </div>
//                         </div>
//                         <div class="place-info">
//                             <h2 class="place-info__title">Last update</h2>
//                             <span class="place-info__count">${updated}</span>
//                         </div>
//                         </div>
//                     </div>
//             `;
//             })
//     })()
//     })
//     // .catch(err=>{
//     //     console.log("error");
//     // })
// });