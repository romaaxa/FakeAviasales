const formSearch = document.querySelector(".form-search"), //search
  inputCitiesFrom = document.querySelector(".input__cities-from"), //from
  dropdownCitiesFrom = document.querySelector(".dropdown__cities-from"), //list from
  inputCitiesTo = document.querySelector(".input__cities-to"), //to
  dropdownCitiesTo = document.querySelector(".dropdown__cities-to"), //list to
  inputDateDepart = document.querySelector(".input__date-depart"), //date
  cheapestTicket = document.getElementById('cheapest-ticket'), //not in form, so getElementById exept of querySelector
  otherCheapTickets = document.getElementById('other-cheap-tickets');


//main datas

const citiesAPI = 'http://api.travelpayouts.com/data/ru/cities.json',
  proxy = 'https://cors-anywhere.herokuapp.com/', //proxy to not blocking api
  API_KEY = '2b2dffaf1eee1f0a1823fa188a8d2958', //token
  calendar = 'http://min-prices.aviasales.ru/calendar_preload',//calendar
  MAX_COUNT = 10;

let city = []; //to write cities into array

//functions

//get api data
const getData = (url, callbackFoo, reject = console.error) => {
  try {
    const request = new XMLHttpRequest();

    request.open('GET', url);//open data

    request.addEventListener('readystatechange', () => {
      if (request.readyState !== 4) return;

      //requests from server
      if (request.status === 200) {
        callbackFoo(request.response);
      } else {
        reject(request.status);
      }
    });

    request.send();
  } catch (e) {
    console.log(e);
  }
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
        return fixItem.startsWith(input.value.toLowerCase());   //includes -> startsWith (should start with current letter)
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

const getNameCity = (code) => {
  const objCity = city.find((item) => item.code === code);
  return objCity.name;
};

const getDate = (date) => {
  return new Date(date).toLocaleString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const getChanges = (num) => {
  if (num) {
    return num === 1 ? 'With one stop' : 'With two stops';
  } else {
    return 'Without stopping';
  }
};


const getLinkAviasales = (data) => {
  let link = 'https://www.aviasales.ru/search/';

  link += data.origin;

  const date = new Date(data.depart_date);

  const day = date.getDate();
  link += day < 10 ? '0' + day : day; //0 before day < 10

  const month = date.getMonth() + 1;
  link += month < 10 ? '0' + month : month;//0 before month < 10
  link += data.destination;

  link += 1;

  return link;
}

//creating card
const createCard = (data) => {
  const ticket = document.createElement('article');
  ticket.classList.add('ticket');

  let deep = '';

  if (data) {
    deep = `
    <h3 class="agent">${data.gate}</h3>
    <div class="ticket__wrapper">
	<div class="left-side">
		<a href="${getLinkAviasales(data)}" class="button button__buy" target="_blank">Price ${data.value}₽</a>
	</div>
	<div class="right-side">
		<div class="block-left">
			<div class="city__from">Flying from
				<span class="city__name">${getNameCity(data.origin)}</span>
			</div>${getDate(data.depart_date)}</div>
		</div>

		<div class="block-right">
			<div class="changes">${getChanges(data.number_of_changes)}</div>
			<div class="city__to">City destination:
				<span class="city__name">${getNameCity(data.destination)}</span>
			</div>
		</div>
	</div>
</div>
    `;
  } else {
    deep = '<h3>There are no tickets on the current date!</h3>'
  }

  ticket.insertAdjacentHTML('afterbegin', deep);

  return ticket;
};

const renderCheapDay = (cheapTicket) => {
  cheapestTicket.style.display = 'block';
  cheapestTicket.innerHTML = '<h2>The most cheapest tickets on current date</h2>';


  const ticket = createCard(cheapTicket[0]); //creating by...

  cheapestTicket.append(ticket);
};

const renderCheapYear = (cheapTickets) => {
  otherCheapTickets.style.display = 'block';
  otherCheapTickets.innerHTML = '<h2>The most cheapest tickets on other dates</h2>';
  //sorting cheap tickets
  cheapTickets.sort((a, b) => {
    if (a.value > b.value) {
      return 1;
    }
    if (a.value < b.value) {
      return -1;
    }
    return 0;
  });

  for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
    const ticket = createCard(cheapTickets[i]);
    otherCheapTickets.append(ticket);
  }

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
    from: cityFrom,
    to: cityTo,
    when: inputDateDepart.value,
  };

  if (formData.from && formData.to) {
    const requestData = '?depart_date=' +
      formData.when + '&origin=' +
      formData.from.code + '&destination=' +
      formData.to.code + '&one_way=true&token=' + API_KEY;

    getData(proxy + calendar + requestData, (response) => {
      renderCheap(response, formData.when);
    }, error => {
      alert('There are no flying on this way!');
      console.log('Error catched: ', error);
    });
  } else {
    alert('Input correct city name!');
  }
});

//function calls

getData(proxy + citiesAPI, (data) => {
  city = JSON.parse(data).filter((item) => item.name);

  //sorting cities
  city.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });
});