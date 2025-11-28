const catalogData = [
  {
    id: 'google-ads',
    title: 'The Ultimate Google Ads Training Course',
    category: 'Marketing',
    mentor: 'Jerome Bell',
    price: '$100',
    image: './access/1.png'
  },
  {
    id: 'product-management',
    title: 'Product Management Fundamentals',
    category: 'Management',
    mentor: 'Marvin McKinney',
    price: '$480',
    image: './access/2.png'
  },
  {
    id: 'hr-analytics',
    title: 'HR Management and Analytics',
    category: 'HR & Recruiting',
    mentor: 'Leslie Alexander',
    price: '$200',
    image: './access/3.png'
  },
  {
    id: 'brand-communications',
    title: 'Brand Management & PR Communications',
    category: 'Marketing',
    mentor: 'Eleanor Pena',
    price: '$300',
    image: './access/4.png'
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design Basic',
    category: 'Design',
    mentor: 'Guy Hawkins',
    price: '$500',
    image: './access/5.png'
  },
  {
    id: 'business-development',
    title: 'Business Development Management',
    category: 'Management',
    mentor: 'Dianne Russell',
    price: '$400',
    image: './access/6.jpg'
  },
  {
    id: 'architecture',
    title: 'Highload Software Architecture',
    category: 'Development',
    mentor: 'Brooklyn Simmons',
    price: '$600',
    image: './access/7.png'
  },
  {
    id: 'hr-selection',
    title: 'Human Resources — Selection and Recruitment',
    category: 'HR & Recruiting',
    mentor: 'Kathryn Murphy',
    price: '$150',
    image: './access/8.png'
  },
  {
    id: 'ux-human-centered',
    title: 'User Experience. Human-centered Design',
    category: 'Design',
    mentor: 'Cody Fisher',
    price: '$240',
    image: './access/9.png'
  }
];

const selectors = {
  search: document.querySelector('[data-search]'),
  filters: document.querySelector('[data-categories]'),
  grid: document.querySelector('[data-grid]'),
  empty: document.querySelector('[data-empty]'),
  count: document.querySelector('[data-count]')
};

const categoryCounts = catalogData.reduce(
  (acc, item) => {
    acc.all = (acc.all ?? 0) + 1;
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  },
  { all: 0 }
);

const state = {
  search: '',
  category: 'all'
};

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightCopy = (text, query) => {
  if (!query) return text;
  const pattern = new RegExp(escapeRegExp(query), 'gi');
  return text.replace(pattern, (match) => `<mark>${match}</mark>`);
};

const categoryTheme = {
  Marketing: 'card__category--marketing',
  Management: 'card__category--management',
  'HR & Recruiting': 'card__category--hr',
  Development: 'card__category--development',
  Design: 'card__category--design'
};

const buildCard = (item, query) => {
  const categoryClass = categoryTheme[item.category] ?? '';
  return `
    <article class="card" data-category="${item.category}">
      <img class="card__photo" src="${item.image}" alt="${item.title}" loading="lazy" />
      <div class="card_info_wrapper">
        <span class="card__category ${categoryClass}">${item.category}</span>
        <h3 class="card__title">${highlightCopy(item.title, query)}</h3>
        <div class="card__meta-line">
          <span class="card__price">${item.price}</span>
          <span class="card__mentor">by ${item.mentor}</span>
        </div>
      </div>
    </article>
  `;
};

const renderCards = (items) => {
  selectors.grid.innerHTML = '';

  if (!items.length) {
    selectors.empty.hidden = false;
    if (selectors.count) {
      selectors.count.textContent = '0 courses';
    }
    return;
  }

  selectors.empty.hidden = true;
  const fragment = document.createDocumentFragment();
  const temp = document.createElement('div');
  temp.innerHTML = items.map((item) => buildCard(item, state.search)).join('');
  fragment.append(...temp.children);
  selectors.grid.append(fragment);

  if (selectors.count) {
    selectors.count.textContent = `${items.length} courses`;
  }
};

const applyFilters = () => {
  const query = state.search.trim().toLowerCase();
  const category = state.category;

  const filtered = catalogData.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const haystack = `${item.title} ${item.mentor}`.toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    return matchesCategory && matchesSearch;
  });

  renderCards(filtered);
};

const renderCategories = () => {
  const categories = Array.from(new Set(catalogData.map((item) => item.category)));
  const fragment = document.createDocumentFragment();

  const decorateButton = (button, label, key) => {
    button.innerHTML = `
      <span class="filters__label">${label}</span>
      <span class="filters__badge">${categoryCounts[key] ?? 0}</span>
    `;
  };

  const allButton = selectors.filters.querySelector('[data-category="all"]');
  if (allButton) {
    const label = allButton.textContent.trim() || 'All';
    decorateButton(allButton, label, 'all');
  }

  categories.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filters__button';
    button.dataset.category = category;
    decorateButton(button, category, category);
    fragment.appendChild(button);
  });

  selectors.filters.appendChild(fragment);
};

const syncActiveCategory = (nextCategory) => {
  selectors.filters.querySelectorAll('[data-category]').forEach((button) => {
    button.classList.toggle('filters__button--active', button.dataset.category === nextCategory);
  });
};

const handleCategoryClick = (event) => {
  const target = event.target.closest('[data-category]');
  if (!target) return;

  const next = target.dataset.category;
  if (next === state.category) return;

  state.category = next;
  syncActiveCategory(next);
  applyFilters();
};

let searchDebounceId = null;

const handleSearchInput = (event) => {
  const nextValue = event.target.value;
  window.clearTimeout(searchDebounceId);
  searchDebounceId = window.setTimeout(() => {
    state.search = nextValue;
    applyFilters();
  }, 350);
};

const init = () => {
  if (!selectors.grid) return;
  renderCategories();
  syncActiveCategory(state.category);
  applyFilters();

  selectors.filters.addEventListener('click', handleCategoryClick);
  selectors.search.addEventListener('input', handleSearchInput);
};

init();
