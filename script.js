const apiKey = '91998ca40f3bcb8f89060deb83405953'; // Replace with your OpenWeatherMap API key

// Function to fetch weather data from the API
async function fetchWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
}

// Function to convert temperature from Kelvin to Fahrenheit
function kelvinToFahrenheit(kelvin) {
  return ((kelvin - 273.15) * 9/5 + 32).toFixed(2);
}

// Function to fetch an image URL from Unsplash based on the city
async function fetchCityImage(city) {
  const unsplashApiKey = 'Nh3CPU0mLoUahbWjuPnMuDPTqmkJIayTOoyI0dOgN8o'; // Replace with your Unsplash API key
  const unsplashUrl = `https://api.unsplash.com/photos/random?query=${city}&client_id=${unsplashApiKey}`;

  try {
    const response = await fetch(unsplashUrl);
    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
}

// Function to update the weather information and city image on the page
async function updateWeatherInfo(city, weatherData) {
  const weatherInfo = document.getElementById('weather-info');
  const cityImage = document.getElementById('city-image');

  if (weatherData) {
    const temperatureHigh = kelvinToFahrenheit(weatherData.main.temp_max);
    const temperatureLow = kelvinToFahrenheit(weatherData.main.temp_min);
    const forecast = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;

    weatherInfo.innerHTML = `
      <h2>${city}</h2>
      <p>High: ${temperatureHigh}°F</p>
      <p>Low: ${temperatureLow}°F</p>
      <p>Forecast: ${forecast}</p>
      <p>Humidity: ${humidity}%</p>
    `;

    const imageUrl = await fetchCityImage(city);
    if (imageUrl) {
      // Set the desired width and height values for the image
      const imageWidth = 500;
      const imageHeight = 500;

      // Construct the Unsplash image URL with the specified dimensions
      const resizedImageUrl = `${imageUrl}&w=${imageWidth}&h=${imageHeight}`;

      cityImage.src = resizedImageUrl;
      cityImage.style.width = `${imageWidth}px`; // Set the width of the image element
      cityImage.style.height = `${imageHeight}px`; // Set the height of the image element
    }
  } else {
    weatherInfo.innerHTML = '<p>No weather data found for the entered city.</p>';
    cityImage.src = ''; // Clear the image source if no weather data is found
  }
}

// Function to handle the search button click event
function handleSearch() {
  const searchInput = document.getElementById('search-input');
  const city = searchInput.value.trim();

  if (city !== '') {
    fetchWeatherData(city)
      .then(data => updateWeatherInfo(city, data))
      .catch(error => console.log('Error:', error));
  }
}

// Event listener for the search button click
document.getElementById('search-btn').addEventListener('click', handleSearch);
