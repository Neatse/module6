// openweathermap API key
const API_KEY = "6134317c10db877014543c36d6f4d45d";

// event listener for when the DOM loads
window.addEventListener("load", function(){
    // initialize the localstroage if it does not exist
    if(localStorage.getItem('cities') == null){
        localStorage.setItem('cities', JSON.stringify([]));
    }

    // display cities from local storage
    displayCitiesFromStorage();
    
    // event listener for the search city button
    document.getElementById("search-btn").addEventListener("click", function(e){
        // get the city
        let city = document.getElementById("city-input").value;
        
        // only search the city if the input is not empty
        if(city !== ""){
            
            // store the city to local storage
            let added = addCityToStorage(city);

            // if the city was added to local storage, add it to the sidebar
            if(added){
                document.getElementById('recent-search').innerHTML += '<button class = "city-btn" value = "' + city + '">' + city + '</button>';
            }

            // display the weather data
            displayWeatherData(city);
            
        }
    });

    // event listener for when the user clicks on the city button
    document.addEventListener('click', function(e){
        if(e.target.className == 'city-btn'){
            let city = e.target.value;
            displayWeatherData(city);
            document.getElementById("city-input").value = city;
        }
    });

    // this function displays the weather data for a city
    function displayWeatherData(city){
        let cityTag = document.getElementById('city');
        let imgTag = document.getElementById('weather-img');
        let tempTag = document.getElementById('temp');
        let windTag = document.getElementById('wind');
        let humidityTag = document.getElementById('humidity');

        // fetch the coordinates from GeoCoding API
        fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + encodeURI(city) + "&appid=" + API_KEY)
        .then(res => res.json())
        .then(res => {
            // city coordinates were found
            if(res.length > 0){
                let lat = res[0].lat;
                let long = res[0].lon;

                // fetch the weather data
                fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&appid=" + API_KEY)
                .then(res1 => res1.json())
                .then(res1 => {
                    

                    let firstDay = res1.list[0].dt_txt.slice(0,10);

                    // update the city
                    cityTag.innerHTML = res[0].name + "(" + formatDate(firstDay) + ")";

                    // set the image display to initial
                    imgTag.style.display = 'initial';
                    imgTag.src = "http://openweathermap.org/img/wn/" + res1.list[0].weather[0].icon + "@2x.png";
                    
                    tempTag.innerHTML = '<p>Temp: ' + res1.list[0].main.temp  + ' &deg;F</p>';
                    windTag.innerHTML = '<p>Wind: ' + res1.list[0].wind.speed + ' MPH</p>';
                    humidityTag.innerHTML = '<p>Humidity: ' + res1.list[0].main.humidity  + '&percnt;</p>';


                    let html = "";

                    for(let i = 0; i < res1.list.length; i++){
                        // get the date portion
                        let weather = res1.list[i];
                        let dt = weather.dt_txt.slice(0,10);
                        
                        if(firstDay != dt){
                            firstDay = dt;

                            console.log(weather);

                            html += '<div>';
                            html += '<p><strong>' + formatDate(dt) + '</strong></p>';
                            html += '<img src="' + "http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png" + '" class="weather-img" alt="weather illustration">';
                            html += '<p>Temp: ' + weather.main.temp  + ' &deg;F</p>';
                            html += '<p>Wind: ' + weather.wind.speed + ' MPH</p>';
                            html += '<p>Humidity: ' + weather.main.humidity  + '&percnt;</p>';
                            html += '</div>';

                        }
                    }

                    document.getElementById("forecast").innerHTML = html;

                    
                    
            
                    
                    console.log(res1);
                })
                .catch(error => {
                    alert(error);
                });
            }
        })
        .catch(error => {
            alert(error);
        });
        
        
    }

    // this functions adds a city to local storage, returns true if city was added to storage, false otherwise
    function addCityToStorage(city){
        let cities = JSON.parse(localStorage.getItem('cities'));

        // only add if it does not already exist
        if(!cities.includes(city)){
            cities.push(city);
            
            // update the local storage
            localStorage.setItem('cities', JSON.stringify(cities));

            return true;
        }

        return false;
    }

    // load the cities from html
    function displayCitiesFromStorage(){
        let cities = JSON.parse(localStorage.getItem('cities'));

        let html = "";

        cities.forEach(function(city){
            html += '<button class = "city-btn" value = "' + city + '">' + city + '</button>';
        });

        document.getElementById('recent-search').innerHTML = html;
    }

    // function to format date
    function formatDate(date){
        year = date.slice(0,4);
        month = date[5] + date[6];
        day = date[8] + date[9];

        return parseInt(month) + "/" + parseInt(day) + "/" + year;
    }
});