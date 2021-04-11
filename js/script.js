const searchField = document.querySelector(".input-cnt__field");
// searchField.disabled = true;

async function generateCountries(input){
    const value = input.value;
    const countries = fetch("https://www.trackcorona.live/api/countries",{
        method: "GET",
    })
    .then(res=>res.json())
    .then(res=>{
        const sortedCountry = res.data.sort((prev,next)=>{
            return prev.location.localeCompare(next.location);
        });
        const names = sortedCountry.map(country=>{
            return country.location;
        });

        const filteredNames = names.filter(word=>{            
            return word.includes(value);
        });
        return filteredNames;
    })
    return await countries;
}

(async ()=>{
    const searchInput = new ListedInput(searchField, await generateCountries(searchField), {
        showOnStart: true,
        function: await generateCountries,
        arguments: [searchField]
    });
})();