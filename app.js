// Get DOM elements
const background = document.querySelector('.main-container');
const form = document.querySelector('.search-form');
const inputField = document.querySelector('#search');
const resultsList = document.querySelector('.results');
const startingInfo = document.querySelector('.information');
const download = document.querySelector('.download');
let showLoading = false; // This determines if "loading.." should be shown or not

// Array that will be populated with list of cities of page load
const cities = [];

// This will get the cities from .json file.
const getCities = async () => {
    const data = await fetch('./cities.json');
    const dataJson = await data.json();
    cities.push(...dataJson);
}

window.addEventListener('load', getCities);


// Find the matches from the list for user input
const findCity = (searchedCity, cityList) => {
    return cityList.filter(place => {
        const regex = new RegExp(searchedCity, 'gi');
        return place.city.match(regex);
    });
}

// Create and display list of search matches
const displayResults = () => {
    // If input field is empty, clear it
    if (inputField.value === '') {
        return clearResults();
    }

    const lowerInput = (inputField.value).toLowerCase(); // This ensures the uppercase letters won't be in the middle of matches
    const matches = findCity(lowerInput, cities);
    
    // Highlight the user's input in the matched cities
    const results = matches.map(result => {
        const regex = new RegExp(lowerInput, 'gi');
        const highlight = result.city.replace(regex, `<span class="highlight">${lowerInput}</span>`);

        return `
                <li>
                    <span>${highlight}, ${result.admin_name}</span>
                    <span>${formatNumber(result.population)}</span>
                </li>`
    }).join('');
    resultsList.innerHTML = results;
}


// Add a dot between every 3 digits
const formatNumber = (number) => {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

// Clear results if the search box is empty
const clearResults = () => {
    resultsList.innerHTML = '';
}


// Change background when user clicks on a city name
const changeBackground = async (place) => {
    loading(); // Show loading while fetching image
    const errorLink = 'https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200';
    const defaultBackground = 'https://images.unsplash.com/photo-1595586551885-12db6bd260eb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'; // Default/starting image

    // Get either horizontal or vertical image depending on screen dimensions
    if (window.innerWidth > window.innerHeight) {
        const response = await fetch(`https://source.unsplash.com/1920x1080/?${place}`);
        showLoading = false;
        loading(); // Remove loading as soon as image has been fetched
        if (response.url === errorLink) {
            background.style.background = `url('${defaultBackground}') center no-repeat`;
            background.style.backgroundSize = 'cover';
            download.href = defaultBackground;
        } else {
            background.style.background = `url('${response.url}') center no-repeat`;
            background.style.backgroundSize = 'cover';
            download.href = response.url;
        }
    } else {
        const response = await fetch(`https://source.unsplash.com/768x1024/?${place}`);
        showLoading = false;
        loading(); // Remove loading as soon as image has been fetched
        if (response.url === errorLink) {
            background.style.background = `url('${defaultBackground}') center no-repeat`;
            background.style.backgroundSize = 'cover';
            download.href = defaultBackground;
        } else {
            background.style.background = `url('${response.url}') center no-repeat`;
            background.style.backgroundSize = 'cover';
            download.href = response.url;
        }
    }
}


// Get the city name when you click on one of the results
resultsList.addEventListener('click', (e) => {
    let chosenCity = [];

    if (e.target.nodeName !== 'LI') { // Make sure to grab only the <li>s
        chosenCity = (e.target.parentElement.innerText).split(', ')
    } else {
        chosenCity = (e.target.innerText).split(', ');
    }

    // Clear input field and results list
    showLoading = true;
    changeBackground(chosenCity[0]);
    form.reset();
    clearResults();
})

// Adds and removes the "loading..." sign
const loading = () => {
    if (showLoading) {
        const info = document.createElement('h5')
        info.className = 'loading';
        info.innerHTML = 'Loading...'
        form.appendChild(info);
    } else {
        form.lastChild.remove();
    }
}


// Listen for user's input
inputField.addEventListener('keyup', displayResults);
inputField.addEventListener('focus', displayResults);
form.addEventListener('submit', e => e.preventDefault());


// Remove the starting info after certain time
setTimeout(() => {
    startingInfo.style.top = '25%'
    startingInfo.style.opacity = '0'
}, 10000)





