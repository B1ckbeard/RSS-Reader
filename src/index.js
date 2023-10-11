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
        posts: document.querySelector('.posts'),
    };

    const state = {
        existedUrls: [],
        errors: {},
        feeds: [],
        posts: [],
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

        if (!feeds.querySelector('.card.border-0')) {
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
          }

        const listGroup = feeds.querySelector('.list-group');

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

    const postsRender = () => {
        const posts = elements.posts;
        posts.innerHTML = '';

        if (!posts.querySelector('.card.border-0')) {
            const card = document.createElement('div');
            card.classList.add('card', 'border-0');
            posts.appendChild(card);

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            card.appendChild(cardBody);

            const cardTitle = document.createElement('h2');
            cardTitle.classList.add('card-title', 'h4');
            cardTitle.textContent = i18nInstance.t('posts');
            cardBody.appendChild(cardTitle);

            const listGroup = document.createElement('ul');
            listGroup.classList.add('list-group', 'border-0', 'rounded-0');
            card.appendChild(listGroup);
        }

        const listGroup = posts.querySelector('.list-group');

        state.posts.forEach((post) => {
            const listGroupItem = document.createElement('li');
            listGroupItem.classList.add(
                'list-group-item',
                'd-flex',
                'justify-content-between',
                'align-items-start',
                'border-0',
                'border-end-0'
            );
            listGroup.appendChild(listGroupItem);

            const titledLink = document.createElement('a');
            titledLink.classList.add('fw-bold');
            titledLink.target = '_blank';
            titledLink.rel = 'noopenner noreferrer';
            titledLink.href = post.postLink.textContent;
            // titledLink.dataset.id = post.postId;
            titledLink.textContent = post.postTitle.textContent;
            listGroupItem.appendChild(titledLink);

            titledLink.addEventListener('click', () => {
                titledLink.classList.remove('fw-bold');
                titledLink.classList.add('fw-normal', 'link-secondary');
            });
        });
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
                const posts = doc.querySelectorAll('item');
                state.feeds.push({ feedTitle, feedDescription });
                posts.forEach((post) =>{
                    const postTitle = post.querySelector('title');
                    const postDescription = post.querySelector('description');
                    const postLink = post.querySelector('link');
                    state.posts.push({postTitle, postDescription, postLink});
                })
                feedRender();
                postsRender();
            })
    });
};

app();

export default app;
