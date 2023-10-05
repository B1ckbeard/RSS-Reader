import './styles.scss';
// import 'bootstrap/js/src/modal';
import 'bootstrap';
import * as yup from 'yup';
// import axios from 'axios';

// const urlSchema = yup.string().trim().required().url();
// const urlSchema = yup.string().url('Введите корректный URL адрес');

const feeds = [
  // список RSS-потоков
];

const urlSchema = yup.object().shape({
  url: yup.string().url().required(),
});

// Проверка введенного URL-адреса
/*
const validateUrl = (url) => {
  try {
    urlSchema.validateSync(url);
    console.log('URL-адрес валидный');
    return true;
  } catch (error) {
    console.log('URL-адрес невалидный');
    return false;
  }
};
*/

const form = document.querySelector('.form');
const inputField = document.querySelector('#inputUrl');
document.querySelector('.form').style.borderColor = 'red';

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const url = inputField.value;

  urlSchema
    .validate({ url })
    .then(() => {
      if (feeds.includes(url)) {
        inputField.style.borderColor = 'red';
        alert('Ссылка должна быть валидным URL');
        alert('RSS уже существует');
        throw new Error('URL is duplicate');
      }
      feeds.push(url);
      alert('RSS Added');
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      inputField.value = '';
      inputField.focus();
    });
});
