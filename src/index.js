import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;
const debounce = require('lodash.debounce');

const refs = {
  input: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

function countrySearching() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
  const countryName = refs.input.value.trim();
  if (countryName === '') {
    return;
  }
  //   console.log(countryName);
  fetchCountries(countryName)
    .then(data => {
      if (data.length >= 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length < 10) {
        refs.countryList.insertAdjacentHTML(
          'afterbegin',
          buildListOfCountries(data)
        );
      } else if (data.length === 1) {
        refs.countryInfo.insertAdjacentHTML(
          'afterbegin',
          buildCountrySelfCard(data)
        );
      }
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function buildListOfCountries(countries) {
  const markup = countries
    .map(
      country => `<li class="country-item">
        <span class='country-item__name'><img class="flag-icon" width='30px' height='20' src='${country.flags.svg}'></img>${country.name.common}</span>
      </li>`
    )
    .join('');
  return markup;
}

function buildCountrySelfCard(countries) {
  const markup = countries
    .map(
      country => `<div>
        <span class="country-head"><img class='flag-icon__self' src="${
          country.flags.svg
        }" alt="" width='45' height='25'>${country.name.common}</span>
        <ul>
          <li class="country-item">
            <span class='country-item__name'><b>Capital: </b>${
              country.capital
            }</span>
          </li>
          <li class="country-item">
            <span class='country-item__name'><b>Population : </b>${
              country.population
            }</span>
          </li>
          <li class="country-item">
            <span class='country-item__name'><b>Languages: </b>${Object.values(
              country.languages
            )}</span>
          </li>
        </ul>
      </div>`
    )
    .join('');
  return markup;
}

refs.input.addEventListener(
  'input',
  debounce(countrySearching, DEBOUNCE_DELAY)
);
