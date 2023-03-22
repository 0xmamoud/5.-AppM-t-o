const apiKey = "3525935a47f4e171310b0f32dcd77288";
const loader = document.querySelector(".loader")

if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(location => {
    const longitude = location.coords.longitude;
    const latitude = location.coords.latitude;
    // console.log("Latitude : " + latitude + " Longitude : " + longitude);
    getWeatherData(longitude, latitude)
  }, () => {
    loader.textContent = "Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner, veuillez l'activer."
  })
}


async function getWeatherData(longitude, latitude) {
    try {

        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&lang=fr&appid=${apiKey}`)
        if(!response.ok){
            throw new error(`${response.status}`)
        }
        const data = await response.json()
        // console.log(data);
        
        populateMainInfo(data);
        handleHours(data.hourly);
        handleDays(data.daily);

        loader.classList.add("fade-out")
    }
    catch(error) {
        loader.textContent = error;
    }
}

const position = document.querySelector(".position");
const temperature = document.querySelector(".temperature");
const weatherImage = document.querySelector(".weather-image");

const currentHour = new Date().getHours();

function populateMainInfo(data) {
    temperature.textContent = `${Math.trunc(data.current.temp)}°`;
    position.textContent = `${data.timezone}`;
    if(currentHour >= 6 && currentHour < 21) {
        weatherImage.src = `./ressources/jour/${data.current.weather[0].icon}.svg`
    } else {
        weatherImage.src = `./ressources/nuit/${data.current.weather[0].icon}.svg`
    }
}

const hourNameBlocks = document.querySelectorAll(".hour-name");
const hourTemperatures = document.querySelectorAll(".hour-temp")

function handleHours(data){
    hourNameBlocks.forEach((block, index) => {
        const incrementedHour = currentHour + index * 3;
        // console.log(incrementedHour,index);
        if(incrementedHour > 24) {
            const calcul = incrementedHour - 24;
            hourNameBlocks[index].textContent = `${calcul === 24 ? "00": calcul}h`;
        }
        else if(incrementedHour === 24) {
            hourNameBlocks[index].textContent = "00h";
        }
        else {
            hourNameBlocks[index].textContent = `${incrementedHour}h`
        }
        hourTemperatures[index].textContent = `${Math.trunc(data[index * 3].temp)}°`
    })
}

const weekDays = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche"
]

const currentDay = new Date().toLocaleDateString("fr-FR", {weekday: "long"});
// console.log(currentDay);

const orderedDays = weekDays.slice(weekDays.indexOf(currentDay) + 1).concat(weekDays.slice(0, weekDays.indexOf(currentDay) + 1));
// console.log(orderedDays);

const daysName = document.querySelectorAll(".day-name");
const perDayTemperature = document.querySelectorAll(".day-temp");

function handleDays(data) {
    orderedDays.forEach((day, index) => {
        daysName[index].textContent = orderedDays[index].charAt(0).toLocaleUpperCase() + orderedDays[index].slice(1, 3);

        perDayTemperature[index].textContent = `${Math.trunc(data[index + 1].temp.day)}°`
    })
}

const tabsBtns = [...document.querySelectorAll(".tabs button")];
const tabsContents = [...document.querySelectorAll(".forecast")];

tabsBtns.forEach(btn => btn.addEventListener("click", handleTabs));

function handleTabs(e) {
    const indexToRemove = tabsBtns.findIndex(tab => tab.classList.contains("active"));
    tabsBtns[indexToRemove].classList.remove("active");
    tabsContents[indexToRemove].classList.remove("active")

    const indexToShow = tabsBtns.indexOf(e.target);

    tabsBtns[indexToShow].classList.add("active");
    tabsContents[indexToShow].classList.add("active")
}