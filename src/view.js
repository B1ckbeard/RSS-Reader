export const initRender = (elements) => {
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
};

const renderFeeds = (feeds, i18, elements) => {
  const items = feeds.map((feed) => {
    const feedListElement = document.createElement('li');
    const titleNode = document.createElement('h3');
    const descriptionNode = document.createElement('p');

    feedListElement.classList.add('list-group-item', 'border-0', 'border-end-0');
    titleNode.classList.add('h6', 'm-0');
    descriptionNode.classList.add('m-0', 'small', 'text-black-50');
    feedListElement.id = feed.id;
    titleNode.textContent = feed.title;
    descriptionNode.textContent = feed.description;
    feedListElement.prepend(titleNode, descriptionNode);

    return feedListElement;
  });
  elements.feedsListGroup.replaceChildren(...items);
  elements.feedsCardTitle.textContent = i18('feeds');
};

const renderPosts = (posts, i18, state, elements) => {
  const items = posts.map((post) => {
    const postListElement = document.createElement('li');
    const btn = document.createElement('button');
    const postLink = document.createElement('a');

    postListElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    btn.textContent = i18('btn');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.type = 'button';

    postLink.id = post.id;
    postLink.href = post.link;
    btn.dataset.postId = post.id;
    btn.dataset.bsTarget = '#modal';
    btn.dataset.bsToggle = 'modal';

    postListElement.prepend(postLink, btn);
    postLink.textContent = post.title;
    postLink.rel = 'noopener noreferrer';
    postLink.target = '_blank';

    if (state.uiState.clickedLinksIds.has(post.id)) {
      postLink.classList.add('fw-normal', 'link-secondary');
    } else {
      postLink.classList.add('fw-bold');
    }
    return postListElement;
  });

  elements.postsListGroup.replaceChildren(...items);
  elements.postsCardTitle.textContent = i18('posts');
};

const renderModal = (state) => {
  const selectedPost = state.posts.find(({ id }) => id === state.uiState.selectedPostId);
  document.querySelector('.modal-title').textContent = selectedPost.title;
  document.querySelector('.modal-body').textContent = selectedPost.description;
  const modalBtn = document.querySelector('.full-article');
  modalBtn.href = selectedPost.link;
  modalBtn.dataset.linkId = selectedPost.id;
};

const renderForm = (state, i18, elements) => {
  switch (state.form.state) {
    case 'success': {
      elements.input.classList.remove('is-invalid');
      elements.input.classList.add('is-valid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18('successLoad');
      elements.input.value = '';
      elements.input.focus();
      break;
    }
    case 'failed': {
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      break;
    }
    case 'filling': {
      elements.input.classList.remove('is-invalid');
      break;
    }
    default:
  }
};

export const render = ({
  path, value, state, i18, elements,
}) => {
  switch (path) {
    case 'feeds': {
      renderFeeds(value, i18, elements);
      break;
    }
    case 'posts': {
      renderPosts(value, i18, state, elements);
      break;
    }
    case 'form.state': {
      renderForm(state, i18, elements);
      break;
    }
    case 'form.error': {
      elements.feedback.textContent = i18(state.form.error);
      break;
    }
    case 'isLoading': {
      elements.input.disabled = state.isLoading;
      elements.addBtn.disabled = state.isLoading;
      break;
    }
    case 'uiState.selectedPostId': {
      renderModal(state);
      break;
    }
    case 'uiState.clickedLinksIds': {
      const currentLink = document.getElementById([...value].pop());
      currentLink.classList.remove('fw-bold');
      currentLink.classList.add('fw-normal', 'link-secondary');
      break;
    }
    default:
  }
};
