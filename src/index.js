import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index';
// import axios from 'axios';
// import onChange from 'on-change';

const app = async () => {
  const defaultLanguage = 'ru';
  const i18nInstance = i18next.createInstance();
  await i18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

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
  yup.setLocale({
    mixed: {
      notOneOf: 'errors.urlExist',
    },
    string: {
      url: 'errors.notUrl',
    },
  });

  const validate = (field) => yup
    .string().trim().required().url()
    .notOneOf(state.existedUrls)
    .validate(field);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');

    validate(inputValue).then(() => {
      elements.input.classList.remove('is-invalid');
      elements.input.classList.add('is-valid');
      state.existedUrls.push(inputValue);
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18nInstance.t('successLoad');
      elements.input.value = '';
      elements.input.focus();
    })
      .catch((error) => {
        elements.input.classList.add('is-invalid');
        elements.feedback.classList.add('text-danger');
        elements.feedback.textContent = error.errors.map((errorKey) => i18nInstance.t(errorKey)).join('\n');
        state.errors = error;
        console.log(state.errors);
        console.log(state.existedUrls);
      });
  });
};

app();

export default app;
