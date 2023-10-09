import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
// import axios from 'axios';
// import onChange from 'on-change';

const elements = {
  form: document.querySelector('form'),
  input: document.getElementById('url-input'),
  feedback: document.querySelector('.feedback'),
  errorField: document.querySelector('.text-danger'),
};

const state = {
  existedUrls: [],
  errors: {},
};

const validate = (field) => yup
  .string().trim().required().url()
  .notOneOf(state.existedUrls)
  .validate(field);

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const inputValue = formData.get('url');
  elements.input.value = '';
  elements.input.focus();

  validate(inputValue).then(() => {
    elements.input.classList.remove('is-invalid');
    elements.input.classList.add('is-valid');
    state.existedUrls.push(inputValue);
    // eslint-disable-next-line no-console
    console.log('done');
  })
    .catch((error) => {
      elements.input.classList.add('is-invalid');
      state.errors = error;
      // eslint-disable-next-line no-console
      console.log(state.errors);
      // eslint-disable-next-line no-console
      console.log(state.existedUrls);
    });
});
