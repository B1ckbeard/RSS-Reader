const renderFeed = (elements, feed, i18) => {
    elements.feedsListGroup.innerHTML = `
        <li class="list-group-item border-0 border-end-0">
          <h3 class="h6 m-0">${feed.title}</h3>
          <p class="m-0 small text-black-50">${feed.description}</p>
        </li>
        ${elements.feedsListGroup.innerHTML}`;

    elements.feedsCardTitle.textContent = i18.t('feeds');
};

const renderPosts = (elements, feed, i18) => {
    feed.posts.forEach((post) => {
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
        elements.postsListGroup.prepend(postList);
        postLink.href = post.link;
        postList.append(postLink, btn);
        postLink.innerHTML = post.title;
        elements.postsListGroup.append(postList);
        // console.log(post.title, post.id, post.link);
    });
    elements.postsCardTitle.textContent = i18.t('feeds');
};

const renderForm = (elements, state, i18) => {
    console.log(state.form);
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

const render = ({
    path, value, state, i18, elements,
}) => {
    switch (path) {
        case 'exictedUrls':
            return;
        case 'feeds': {
            const currentFeed = value[value.length - 1];
            renderFeed(elements, currentFeed, i18);
            renderPosts(elements, currentFeed, i18);
            break;
        }
        case 'form': {
            renderForm(elements, state, i18);
            break;
        }
        default:
    }
};
export default render;
