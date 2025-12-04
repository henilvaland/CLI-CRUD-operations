import axios from 'axios';

export async function getWeather(city = 'London') {
  try {
    const response = await axios.get(
      `https://wttr.in/${city}?format=j1`,
      {
        timeout: 5000,
        headers: {
          'User-Agent': 'Task-Tracker-CLI'
        }
      }
    );
    
    if (response.data && response.data.current_condition) {
      const current = response.data.current_condition[0];
      return {
        city,
        temperature: current.temp_C,
        condition: current.weatherDesc[0].value,
        humidity: current.humidity,
        windSpeed: current.windspeedKmph,
        success: true
      };
    }
    
    throw new Error('Invalid weather data received');
  } catch (error) {
    if (error.response) {
      throw new Error(`Weather API error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Unable to connect to weather service');
    } else {
      throw new Error(`Weather fetch error: ${error.message}`);
    }
  }
}

export async function getMotivationalQuote() {
  try {
    const response = await axios.get('https://api.quotable.io/random', {
      timeout: 5000
    });
    
    return {
      text: response.data.content,
      author: response.data.author,
      success: true
    };
  } catch (error) {
    return {
      text: 'The way to get started is to quit talking and begin doing.',
      author: 'Walt Disney',
      success: false
    };
  }
}

export async function getWeatherBasedSuggestions(city = 'London') {
  try {
    const weather = await getWeather(city);
    const suggestions = [];
    
    if (parseInt(weather.temperature) < 10) {
      suggestions.push({
        title: 'Plan indoor activities',
        description: 'Cold weather - perfect for indoor tasks',
        priority: 'low',
        category: 'planning'
      });
    }
    return {
      weather,
      suggestions,
      success: true
    };
  } catch (error) {
    return {
      weather: null,
      suggestions: [],
      success: false,
      error: error.message
    };
  }
}