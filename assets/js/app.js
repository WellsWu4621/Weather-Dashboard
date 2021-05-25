// declare global variables
const cityBasic = (ID, apiRef) => {
  document.getElementById(ID).innerHTML = (apiRef)
}
// api call

axios.get(`https://api.openweathermap.org/data/2.5/weather?q=london&units=imperial&appid=434a58fea48829eb0588c0c22b406b14`)
.then(res => {
  let coord = res.data.coord
  console.log(coord)
  axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly&units=imperial&appid=434a58fea48829eb0588c0c22b406b14`)
  .then(({data})=>{
    let current = data.current
    console.log(data)
    cityBasic('cityName', `
    ${res.data.name}
    <img src="http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="${current.weather[0].main}">
    `)
    cityBasic('cityDate', Date())
    cityBasic('cityTemp', `Temperature: ${current.temp} &degF`)
    cityBasic('cityHumid', `Humidity: ${current.humidity}%`)
    cityBasic('cityWSpd', `Wind Speed: ${current.wind_speed} MPH`)
    cityBasic('cityUV', `UV Index: <span class="badge" id="UVText">${current.uvi}</span>`)
    if (current.uvi >= 0 && current.uvi < 3) {
      document.getElementById("UVText").classList.add("bg-success")
    } else if (current.uvi >= 3 && current.uvi < 6) {
      document.getElementById("UVText").classList.add("bg-warning")
    } else if (current.uvi >= 6 && current.uvi < 9) {
      document.getElementById("UVText").classList.add("bg-danger")
    } else {
      document.getElementById("UVText").classList.add("bg-dark")
    }
    
  })
})