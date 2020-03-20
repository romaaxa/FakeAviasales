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
};

const renderCheapDay = (cheapTicket) => {
  console.log(cheapTicket);
};

const renderCheapYear = (cheapTickets) => {
  console.log(cheapTickets);
};

const renderCheap = (data, date) => {
  const cheapTicketsYear = JSON.parse(data).best_prices;

  const cheapTicketDay = cheapTicketsYear.filter((item) => {
    return item.depart_date === date;
  });

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketsYear);
};


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

formSearch.addEventListener('submit', (event) => {
  event.preventDefault();

  const cityFrom = city.find((item) => {
    return inputCitiesFrom.value === item.name;
  });
  const cityTo = city.find((item) => {
    return inputCitiesTo.value === item.name
  });

  const formData = {
    from: cityFrom.code,
    to: cityTo.code,
    when: inputDateDepart.value,
  };

  if (formData.from === formData.to) {
    alert("Identic cities cannot be chosen!");
    return;
  }

  const requestData = '?depart_date=' +
    formData.when + '&origin=' +
    formData.from + '&destination=' +
    formData.to + '&one_way=true&token=' + API_KEY;

  getData(proxy + calendar + requestData, (response) => {
    renderCheap(response, formData.when);
  });
});

//function calls

getData(proxy + citiesAPI, (data) => {
  city = JSON.parse(data).filter((item) => item.name);
});



// getData(proxy + calendar + '?depart_date=2020-05-25&origin=SVX&destination=KGD&one_way=true&token=' + API_KEY, (data) => {
//   const cheapTicket = JSON.parse(data).best_prices.filter(item => item.depart_date === '2020-05-25');
// });

//https://jsonplaceholder.typicode.com/todos/1