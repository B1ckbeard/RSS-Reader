import elements from './elements';

const renderFeed = (feed, i18) => {
    elements.feedsListGroup.innerHTML = `
        <li class="list-group-item border-0 border-end-0">
          <h3 class="h6 m-0">${feed.title}</h3>
          <p class="m-0 small text-black-50">${feed.description}</p>
        </li>
        ${elements.feedsListGroup.innerHTML}`;
  
    elements.feedsCardTitle.textContent = i18.t('feeds');
  };

const renderPosts = (posts, i18) => {
    console.log(posts);
    const items = posts.map((post) => {
      const postList = document.createElement('li');
      const btn = document.createElement('button');
      const postLink = document.createElement('a');
  
      postList.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      btn.innerHTML = i18.t('btn');
      btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      btn.type = 'button';
  
      postLink.classList.add('fw-bold');
      postLink.rel = 'noopener noreferrer';
      postLink.target = '_blank';
      postLink.id = post.id;
      postLink.href = post.link;
  
      btn.dataset.linkId = post.id;
      btn.dataset.bsTarget = '#modal';
      btn.dataset.bsToggle = 'modal';
  
      postList.prepend(postLink, btn);
      postLink.innerHTML = post.title;
  
      btn.addEventListener('click', () => {
        document.querySelector('.modal-title').textContent = post.title;
        document.querySelector('.modal-body').textContent = post.description;
        const modalBtn = document.querySelector('.full-article');
        modalBtn.href = post.link;
        modalBtn.dataset.linkId = post.id;
      });
  
      postLink.addEventListener('click', () => {
        postLink.classList.remove();
        postLink.classList.add('fw-normal', 'link-secondary');
      });
      return postList;
    });
  
    elements.postsListGroup.replaceChildren(...items);
    elements.postsCardTitle.textContent = i18.t('posts');
  };

  const renderForm = (state, i18) => {
    // console.log(state.form);
    // console.log(`${state.posts}посты`);
    switch (state.form) {
      case 'success': {
        elements.input.classList.remove('is-invalid');
        elements.input.classList.add('is-valid');
        elements.feedback.classList.remove('text-danger');
        elements.feedback.classList.add('text-success');
        elements.feedback.textContent = i18.t('successLoad');
        elements.input.value = '';
        elements.input.focus();
        break;
      }
  
      case 'failed': {
        elements.input.classList.add('is-invalid');
        elements.feedback.classList.add('text-danger');
        break;
      }
      default:
    }
  };

  const readPostsId = (posts, value) => {
    const result = posts.map((post) => {
      if (value.includes(post.id)) {
        const currentLink = document.querySelector('a#');
        currentLink.classList.remove();
        currentLink.classList.add('fw-normal', 'link-secondary');
      }
      return result;
    });
  }
  
  const render = ({
    path, value, state, i18,
  }) => {
    switch (path) {
      case 'exictedUrls':
        document.querySelector('button').disabled = true;
        return;
      case 'feeds': {
        const currentFeed = value[value.length - 1];
        renderFeed(currentFeed, i18);
        break;
      }
      case 'posts': {
        renderPosts(value, i18);
        break;
      }
      case 'form': {
        renderForm(state, i18);
        break;
      }
      case 'uiState': {
        // readPostsId(state.posts, value);
        break;
      }
      default:
    }
  };
  export default render;
