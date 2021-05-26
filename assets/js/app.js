let history = JSON.parse(localStorage.getItem('history')) || []
// declare global functions
const cityBasic = (ID, apiRef) => {
  document.getElementById(ID).innerHTML = (apiRef)
}
// long date
const stringDate = (dt) => {
  let dateObject = new Date(dt*1000)
  let humanDateFormat = dateObject.toLocaleString()
  let weekDay = dateObject.toLocaleString("en-US", { weekday: "long" })
  let Time = dateObject.toLocaleString("en-US", { timeZoneName: "short" })
  return weekDay +", "+ Time
}
// short date
const shortDate = (dt) =>{
  let dateObject = new Date(dt * 1000)
  let humanDateFormat = dateObject.toLocaleString()
  let sdate = dateObject.toLocaleString("en-US", { weekday: "long" }) + ", " + dateObject.toLocaleString("en-US", { month: "numeric" }) + "/" + dateObject.toLocaleString("en-US", { day: "numeric" }) + "/" + dateObject.toLocaleString("en-US", {year: "numeric"})
  return sdate
}
// API Call Function
const Display = (userSearch) =>{
  // ${document.getElementById('citySearch').value}
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${userSearch}&units=imperial&appid=434a58fea48829eb0588c0c22b406b14`)
  .then(res => {
    let coord = res.data.coord
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly&units=imperial&appid=434a58fea48829eb0588c0c22b406b14`)
    .then(({data})=>{
      let current = data.current
      let future = data.daily
      
      // Store Search History Function
      let resultName = res.data.name
      // history = JSON.parse(localStorage.getItem('history')) || []
      history.push({resultName})
      localStorage.setItem('history', JSON.stringify(history))
      // push Search History
      document.getElementById('searchHist').innerHTML = ''
      if (history.length > 20) {
        history.shift()
      }
      for (let h = history.length-1; h > -1; h--) {
        document.getElementById('searchHist').innerHTML+=`
        <button type="button" class="list-group-item list-group-item-action" data-val="${history[h].resultName}">${history[h].resultName}</button>
        `
      }
      
      // Basic City info
      cityBasic('cityName', `
      ${res.data.name}
      <img src="http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="${current.weather[0].main}">
      `)
      cityBasic('cityDate', stringDate(current.dt))
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

      // Forecast Loop
      for (let i = 0; i < 6; i++) {
        cityBasic(`day-${i}`,
        `
        <div class="card">
        <div class="card-body">
        <h5 class="card-title">${shortDate(future[i].dt)}</h5>
        <img src="http://openweathermap.org/img/wn/${future[i].weather[0].icon}@2x.png" alt="${current.weather[0].main}">
        <h6 class="card-text">Max: ${future[i].temp.max} &degF</h6>
        <h6 class="card-text">Min: ${future[i].temp.min} &degF</h6>
        <h6 class="card-text">Humidity: ${future[i].humidity}%</h6>
        </div>
        </div>
        `
        )
      }
      document.getElementById('citySearch').value = ''
    })
    .catch(err => console.error(err))
  })
  .catch(err => console.error(err))
}

// event from Search button
document.getElementById('submit').addEventListener('click', event => {
    event.preventDefault()
    Display(document.getElementById('citySearch').value)
  })

// Event from Search history buttons
document.addEventListener('click', event => {
  if (event.target.classList.contains('list-group-item')) {
    let histVal = event.target.getAttribute('data-val')

    Display(histVal)

  }
})

// Clear history
document.getElementById('clearHistory').addEventListener('click', event => {
  event.preventDefault()
  let clearH = confirm('Are you sure you want to clear your history?')
  if (clearH) {
    localStorage.removeItem('history')
    document.getElementById('searchHist').innerHTML = ""
    history = []
  }
})

Display(history[history.length-1].resultName)
history.pop()