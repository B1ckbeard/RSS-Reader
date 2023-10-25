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
import { uniqBy } from 'lodash';
import render from './view';
import elements from './elements';

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
        posts: [],
        uiState: [],
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

    const getFeed = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);

    const watchedState = onChange(state, (path, value) => {
        render({
            path, value, state, i18: i18nInstance,
        });
    });

    document.querySelector('.full-article').addEventListener('click', (e) => {
        const { linkId } = e.target.dataset;
        const link = document.getElementById(linkId);
        link.classList.remove();
        link.classList.add('fw-normal', 'link-secondary');
        watchedState.uiState.push(linkId);
    });

    const validation = (url) => validate(url)
        .then((validUrl) => {
            watchedState.existedUrls.push(validUrl);
            watchedState.isValid = true;
            return validUrl;
        })
        .catch((err) => {
            watchedState.form = 'failed';
            watchedState.isValid = false;
            elements.feedback.textContent = err.errors.map((errorKey) => i18nInstance.t(errorKey)).join('\n');
            return Promise.reject();
        });

    const updatePosts = (url) => {
        setTimeout(() => getFeed(url)
            .then((response) => parser(response.data.contents))
            .then((data) => {
                // console.log(`${data}timeout`);
                const newPosts = data.querySelectorAll('item');
                watchedState.posts = uniqBy([...watchedState.posts, ...createPosts(newPosts)], 'link');
                updatePosts(url);
            })
            .catch((err) => {
                console.log(err);
                elements.feedback.textContent = i18nInstance.t('errors.parserError');
            }), 5000);
    };

    const createFeed = (doc, url) => ({
        id: uniqueId('feed'),
        title: doc.querySelector('channel title').textContent,
        link: url,
        description: doc.querySelector('channel description').textContent,
    });

    const createPosts = (posts) => [...posts].map((post) => ({
        id: uniqueId('post'),
        title: post.querySelector('title').textContent,
        link: post.querySelector('link').textContent,
        description: post.querySelector('description').textContent,
    }));

    elements.formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        i18nInstance.t('notUrl');
        const formData = new FormData(e.target);
        const url = formData.get('url');
        validation(url)
            .then(getFeed)
            .then((response) => {
                watchedState.loadingProcess.state = 'success';
                watchedState.form = 'success';
                watchedState.loadingProcess.data = response.data.contents;
                return response.data.contents;
            })
            .catch((err) => {
                watchedState.loadingProcess.state = 'failed';
                watchedState.form = 'failed';
                watchedState.loadingProcess.error = 'error';
                let errorName = '';
                if (err.response) {
                    errorName = 'errors.responceErr';
                } else if (err.request) {
                    errorName = 'networkError';
                }
                elements.feedback.textContent = i18nInstance.t(errorName);
                return Promise.reject();
            })
            .then(parser)
            .then((doc) => {
                const posts = doc.querySelectorAll('item');
                watchedState.feeds.push(createFeed(doc, url));
                watchedState.posts = [...watchedState.posts, ...createPosts(posts)];
            })
            .then(updatePosts(url));
    });
};

app();

export default app;
