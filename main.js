setup()
function setup() {
    // Use try and catch to handle when there is no pollution measurements
    navigator.geolocation.getCurrentPosition(async position => {
        let latitude, longitude, airEl, weatherEl // Save airEl and weatherEl to database
        latitude = position.coords.latitude
        longitude = position.coords.longitude
        document.getElementById('latitude').innerText = `Latitude: ${latitude}°`
        document.getElementById('longitude').innerText = `Longitude: ${longitude}°`

        const api_key = process.env.API_KEY
        const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`
        const weatherResponse = await fetch(WEATHER_URL)
        const weatherJson = await weatherResponse.json()
        airEl = weatherJson // Save to database
        const { name, main, weather } = weatherJson
        const celsius = Math.floor(main.temp - 273.15)
        try {
            const AQ_URL = `https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/latest?limit=100&page=1&offset=0&sort=desc&coordinates=${latitude},${longitude}&radius=1000&order_by=lastUpdated&dumpRaw=false`
            const AQ_response = await fetch(AQ_URL)
            const AQ_json = await AQ_response.json()
            // Add the description
            weatherEl = AQ_json.results[0].measurements[0]
            const { value, unit, lastUpdated } = AQ_json.results[0].measurements[0]
            document.querySelector('.description').innerHTML = `${name} is ${weather[0].description} with a temperature of ${celsius}℃. The concentration of particulate matter(pm25) is ${value}${unit} last updated on ${lastUpdated}`
        }
        catch(error) {
            if(error) console.error('The location doesnt have the pollution data!');
            document.querySelector('.description').innerHTML = `${name} is ${weather[0].description} with a temperature of ${celsius}℃. The concentration of particulate matter(pm25) is not currently available`
        }

        // Save to the database
        const data = { latitude, longitude, airEl, weatherEl }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const response = await fetch('/api', options)
        const json = await response.json()
        console.log(json);
    })
}
