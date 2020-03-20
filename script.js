const formSearch = document.querySelector(".form-search"), //search
  inputCitiesFrom = document.querySelector(".input__cities-from"), //from
  dropdownCitiesFrom = document.querySelector(".dropdown__cities-from"), //list from
  inputCitiesTo = document.querySelector(".input__cities-to"), //to
  dropdownCitiesTo = document.querySelector(".dropdown__cities-to"), //list to
  inputDateDepart = document.querySelector(".input__date-depart"); //date


//main datas

//http://api.travelpayouts.com/data/ru/cities.json
const citiesAPI = 'http://api.travelpayouts.com/data/ru/cities.json',
  proxy = 'https://cors-anywhere.herokuapp.com/', //proxy to not blocking api
  API_KEY = '2b2dffaf1eee1f0a1823fa188a8d2958', //token
  calendar = 'http://min-prices.aviasales.ru/calendar_preload';//calendar

let city = []; //to write cities into array

//functions

//get api data
const getData = (url, callbackFoo) => {
  const request = new XMLHttpRequest();

  request.open('GET', url);//open data

  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;

    //requests from server
    if (request.status === 200) {
      callbackFoo(request.response);
    } else {
      console.error(request.status);
    }
  });

  request.send();//send data
};

const callbackFoo = () => {

};

//show city in dynamic search fields
const showCity = (input, list) => {
  list.textContent = ""; //clear input string every new symbol

  if (inputCitiesFrom.value === "") {
    return;
  } //unnecessary
  if (input.value !== "") {
    const cityFilter = city.filter(item => {
      if (item.name) {
        const fixItem = item.name.toLowerCase();
        return fixItem.includes(input.value.toLowerCase());
      } else {

      }
    });

    cityFilter.forEach(item => {
      const lielements = document.createElement("li"); //add element in dynamic searching

      lielements.classList.add("dropdown__city");
      lielements.textContent = item.name;

      list.append(lielements); //displaying
    });
  }
};

const handlerCity = (event, input, list) => {
  const target = event.target;
  if (target.tagName.toLowerCase() === "li") {
    input.value = target.textContent;
    list.textContent = "";
  }
}


//events

inputCitiesFrom.addEventListener("input", () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesFrom.addEventListener("click", (event) => {
  handlerCity(event, inputCitiesFrom, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener("input", () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesTo.addEventListener("click", (event) => {
  handlerCity(event, inputCitiesTo, dropdownCitiesTo)
});


//function calls

getData(proxy + citiesAPI, (data) => {
  city = JSON.parse(data).filter((item) => item.name);


});

//https://jsonplaceholder.typicode.com/todos/1