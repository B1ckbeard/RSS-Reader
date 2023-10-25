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
    modal: document.getElementById('modal'),
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
  
  export default elements;