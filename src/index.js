import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18n from 'i18next';
import resources from './locales/index';
import axios from 'axios';
import parser from './parser';
import onChange from 'on-change';
import _ from 'lodash';
import uniqueId from 'lodash/uniqueId.js';
import render from './view';

const app = async () => {
    const defaultLanguage = 'ru';
    const i18nInstance = i18n.createInstance();
    await i18nInstance.init({
        lng: defaultLanguage,
        debug: false,
        resources,
    });

    const state = {
        isValid: false,
        form:
            'filling',
        loadingProcess: {
            state: 'initial',
            error: null,
        },
        existedUrls: [],
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

    const validate = (field) => yup.string().trim().required().url()
        .notOneOf(state.existedUrls)
        .validate(field);

    const elements = {
        formEl: document.querySelector('form'),
        input: document.getElementById('url-input'),
        feedback: document.querySelector('.feedback'),
        feedsContainer: document.querySelector('.feeds'),
        postsContainer: document.querySelector('.posts'),
        feedsCard: document.createElement('div'),
        feedsCardBody: document.createElement('div'),
        feedsCardTitle: document.createElement('h2'),
        feedsListGroup: document.createElement('ul'),
        postsCard: document.createElement('div'),
        postsCardBody: document.createElement('div'),
        postsCardTitle: document.createElement('h2'),
        postsListGroup: document.createElement('ul'),
    };

    elements.feedsCard.append(elements.feedsCardBody);
    elements.feedsCard.classList.add('card', 'border-0');
    elements.feedsCardBody.append(elements.feedsCardTitle);
    elements.feedsCardBody.classList.add('card-body');
    elements.feedsContainer.append(elements.feedsCard);
    elements.feedsCard.append(elements.feedsListGroup);
    elements.feedsCardTitle.classList.add('card-title', 'h4');
    elements.feedsListGroup.classList.add('list-group', 'border-0', 'rounded-0');
    elements.postsCard.append(elements.postsCardBody);
    elements.postsCard.classList.add('card', 'border-0');
    elements.postsCardBody.append(elements.postsCardTitle);
    elements.postsCardBody.classList.add('card-body');
    elements.postsContainer.append(elements.postsCard);
    elements.postsCard.append(elements.postsListGroup);
    elements.postsCardTitle.classList.add('card-title', 'h4');
    elements.postsListGroup.classList.add('list-group', 'border-0', 'rounded-0');

    const getFeed = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);

    const watchedState = onChange(state, (path, value) => {
        switch (path) {
            case 'existedUrls': {
                const currentFeed = value[value.length - 1];
                getFeed(currentFeed)
                    .then((response) => {
                        watchedState.loadingProcess.state = 'success';
                        watchedState.form = 'success';
                        watchedState.loadingProcess.data = response.data.contents;
                    })
                    .catch((err) => {
                        // console.log(err);
                        if (err.response) {
                            watchedState.loadingProcess.state = 'failed';
                            watchedState.form = 'failed';
                            watchedState.loadingProcess.error = 'error';
                            elements.feedback.textContent = i18nInstance.t('errors.responceErr');
                        }
                        if (err.request) {
                            watchedState.loadingProcess.state = 'failed';
                            watchedState.form = 'failed';
                            watchedState.loadingProcess.error = 'error';
                            elements.feedback.textContent = i18nInstance.t('errors.networkError');
                        } else {
                            // elements.feedback.textContent = err.errors.map((errorKey) => i18nInstance.t(errorKey)).join('\n');
                        }
                    });
                break;
            }
            case 'loadingProcess.data': {
                parser(value)
                    .then((parsedResult) => {
                        const doc = parsedResult.documentElement;
                        const posts = doc.querySelectorAll('item');

                        watchedState.feeds.push({
                            id: uniqueId('feed'),
                            title: doc.querySelector('channel title').textContent,
                            description: doc.querySelector('channel description').textContent,
                            posts: [...posts].map((post) => ({
                                id: uniqueId('post'),
                                title: post.querySelector('title').textContent,
                                link: post.querySelector('link').textContent,
                            })),
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .then(() => {
                        watchedState.existedUrls.forEach((url) => {
                            setTimeout(() => getFeed(url), 5000);
                        });
                    });
                break;
            }
            default:
                break;
        }
        render({
            path, value, state, i18: i18nInstance, elements,
        });
    });

    const validation = (url) => validate(url)
        .then((validUrl) => {
            watchedState.existedUrls.push(validUrl);
            watchedState.form = 'success';
            watchedState.isValid = true;
        })
        .catch((err) => {
            watchedState.form = 'failed';
            watchedState.isValid = false;
            elements.feedback.textContent = err.errors.map((errorKey) => i18nInstance.t(errorKey)).join('\n');
        });

    elements.formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        i18nInstance.t('notUrl');
        const formData = new FormData(e.target);
        const url = formData.get('url');
        validation(url);
    });

    elements.postsContainer.addEventListener('click', (e) => {
    });
};

app();

export default app;
