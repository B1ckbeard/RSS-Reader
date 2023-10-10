import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index';
import axios from 'axios';
import parser from './parser';
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
        feeds: document.querySelector('.feeds'),

        feedsCard: document.createElement('div'),
        cardBody: document.createElement('div'),
        cardTitle: document.createElement('h2'),
        listGroup: document.createElement('ul'),
    };

    const state = {
        existedUrls: [],
        errors: {},
        feeds: [],
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

    const feedRender = () => {
        const feeds = elements.feeds;
        feeds.innerHTML = '';

        const card = document.createElement('div');
        card.classList.add('card', 'border-0');
        feeds.appendChild(card);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        card.appendChild(cardBody);

        const cardTitle = document.createElement('h2');
        cardTitle.classList.add('card-title', 'h4');
        cardTitle.textContent = i18nInstance.t('feeds');
        cardBody.appendChild(cardTitle);

        const listGroup = document.createElement('ul');
        listGroup.classList.add('list-group', 'border-0', 'rounded-0');
        card.appendChild(listGroup);

        state.feeds.forEach(feed => {
            const listGroupItem = document.createElement('li');
            listGroupItem.classList.add(
                'list-group-item',
                'border-0',
                'border-end-0'
            );

            listGroup.insertBefore(listGroupItem, listGroup.firstChild);

            const feedItemTitle = document.createElement('h3');
            feedItemTitle.classList.add('h6', 'm-0');
            feedItemTitle.textContent = feed.feedTitle;
            listGroupItem.appendChild(feedItemTitle);

            const feedItemDescription = document.createElement('p');
            feedItemDescription.classList.add('m-0', 'small', 'text-black-50');
            feedItemDescription.textContent = feed.feedDescription;
            listGroupItem.appendChild(feedItemDescription);
        })
    };

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
                // console.log(state.errors);
                // console.log(state.existedUrls);
            })
        axios
            .get(
                `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
                    inputValue
                )}`
            )
            .then(response => {
                return response.data.contents;
            })
            .then(parser)
            .then((parsedResult) => {
                const doc = parsedResult.documentElement;
                const feedTitle = doc.querySelector('channel title').textContent;
                const feedDescription = doc.querySelector('channel description').textContent;

                // console.log(doc, feedTitle.textContent, feedDescription.textContent);
                state.feeds.push({ feedTitle, feedDescription });
                feedRender();
            })
    });
};

app();

export default app;
