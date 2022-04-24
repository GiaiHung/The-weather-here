getData()

// Create map
const map = L.map('map').setView([0, 0], 1);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

async function getData() {
    const response = await fetch('/all')
    const data = await response.json()
    console.log(data);

    for (item of data) {
        // Create marker
        const { latitude, longitude, airEl } = item
        const { name, main, weather } = airEl
        const celsius = Math.floor(main.temp - 273.15)
        let text
        if(item.hasOwnProperty('weatherEl')) {
            const { value, unit, lastUpdated } = item.weatherEl
            text = `${name} is ${weather[0].description} with a temperature of ${celsius}℃. The concentration of particulate matter(pm25) is ${value}${unit} last updated on ${lastUpdated}`
        }
        else {
            text = `${name} is ${weather[0].description} with a temperature of ${celsius}℃. The concentration of particulate matter(pm25) is not currently available`
        }
        const marker = L.marker([latitude, longitude]).addTo(map).bindPopup(text)
    }
}