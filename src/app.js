import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import { uniqBy, uniqueId } from 'lodash';
import i18n from 'i18next';
import resources from './locales/index';
import render from './view';
import parse from './parser';

const elements = {
  formEl: document.querySelector('form'),
  addBtn: document.querySelector('form button'),
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
  modal: document.getElementById('modal'),
};

const timeOut = 5000;

const getFeed = (url) => {
  const feedUrl = new URL('get', 'https://allorigins.hexlet.app');
  feedUrl.searchParams.append('disableCache', true);
  feedUrl.searchParams.append('url', url);

  return axios.get(feedUrl)
    .then((response) => ({ data: response.data.contents }))
    .catch((err) => {
      if (!err) {
        return { error: 'errors.commonErr' };
      }
      if (err.response) {
        return { error: 'errors.responseErr' };
      } if (err.request) {
        return { error: 'errors.networkError' };
      }
      return { error: 'errors.commonErr' };
    });
};

const updatePosts = (state) => {
  const promises = state.feeds.map((feed) => getFeed(feed.link)
    .then((result) => {
      if (result.error) {
        throw new Error(result.error);
      }
      const parsedResult = parse(result.data);

      const newPosts = parsedResult.posts.map((post) => ({
        ...post,
        id: uniqueId('post'),
      }));

      state.posts = uniqBy([...state.posts, ...newPosts], 'link');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    }));
  Promise.all(promises)
    .then(setTimeout(() => updatePosts(state), timeOut));
};

const app = () => {
  const defaultLanguage = 'ru';
  const i18nInstance = i18n.createInstance();
  return i18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  }).then((i18) => {
    const state = {
      isLoading: false,
      form: {
        state: 'filling',
        error: null,
      },
      feeds: [],
      posts: [],
      uiState: {
        clickedLinksIds: new Set(),
        selectedPostId: null,
      },
    };

    yup.setLocale({
      mixed: {
        notOneOf: 'errors.urlExist',
      },
      string: {
        url: 'errors.notUrl',
      },
    });

    const watchedState = onChange(state, (path, value) => {
      render({
        path, value, state, i18, elements,
      });
    });

    const validate = (field) => yup.string().trim().required().url()
    .notOneOf(watchedState.feeds.map((feed) => feed.link))
    .validate(field);

    elements.input.addEventListener('input', () => {
      if (watchedState.form.error) {
        watchedState.form.error = null;
        watchedState.form.state = 'filling';
      }
    });

    elements.postsListGroup.addEventListener('click', (e) => {
      const postId = e.target.dataset.postId || e.target.id;
      if (postId) {
        if (e.target.tagName.toLowerCase() === 'button') {
          watchedState.uiState.selectedPostId = postId;
        }
        watchedState.uiState.clickedLinksIds.add(postId);
      }
    });

    elements.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.form.error = null;
      const formData = new FormData(e.target);
      const url = formData.get('url');

      validate(url)
        .then((validUrl) => {
          watchedState.isLoading = true;
          updatePosts(watchedState);
          getFeed(validUrl)
            .then((result) => {
              if (result.error) {
                throw new Error(result.error);
              }
              const parsedResult = parse(result.data);

              const newFeed = {
                ...parsedResult.feed,
                id: uniqueId('feed'),
                link: validUrl,
              };
              const newPosts = parsedResult.posts.map((post) => ({
                ...post,
                id: uniqueId('post'),
              }));

              watchedState.feeds.unshift(newFeed);
              watchedState.posts = uniqBy([...newPosts, ...watchedState.posts], 'link');
              watchedState.isLoading = false;
              watchedState.form.state = 'success';
            })
            .catch((err) => {
              // eslint-disable-next-line no-console
              console.error(err.message);
              watchedState.isLoading = false;
              watchedState.form.state = 'failed';
              watchedState.form.error = err.message;
            });
        })
        .catch((err) => {
          watchedState.form.state = 'failed';
          watchedState.form.error = err.errors.pop();
        });
    });
  });
};

export default app;
