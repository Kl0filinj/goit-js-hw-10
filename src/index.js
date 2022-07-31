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
  const countryName = refs.input.value.trim();
  if (countryName === '') {
    return;
  }
  //   console.log(countryName);
  fetchCountries(countryName)
    .then(data => {
      refs.countryList.innerHTML = '';
      if (data.length >= 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length < 10) {
        refs.countryList.insertAdjacentHTML(
          'afterbegin',
          buildListOfCountries(data)
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
        <span><img class="flag-icon" width='25px' height='15' src='${country.flags.svg}'></img>${country.name.official}</span>
      </li>`
    )
    .join('');
  return markup;
}

refs.input.addEventListener(
  'input',
  debounce(countrySearching, DEBOUNCE_DELAY)
);
