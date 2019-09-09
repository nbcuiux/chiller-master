//Search data
//= search-data.js
var scrollPosition;

function handleSearchClick(e) {
  var search = $('<div></div>').addClass('search-overflow'),
  close = $('<div></div>').addClass('search__close chiller-close-weathered').click(handleCloseSearch),

  searchTextfield = $('<input type="text" />')
  .addClass('search__textfield')
  .on('input', handleSearchInput)
  .attr('placeholder', 'Type to Search'),
  searchIcon = $('<div></div>').addClass('search__icon chiller-search-thick-weathered'),
  searchHint = $('<div></div>').addClass('search__hint-text'),
  searchInput = $('<div></div>').addClass('search__input').append(searchIcon, searchTextfield, searchHint),

  searchResults = $('<div></div>').addClass('search__results');

  search.append(close, searchInput, searchResults);
  //searchInput.stick_in_parent();
  renderEmptyState('', searchResults);
  //renderResults(normalizeSearchData(searchItems), searchResults, sectionOrder);
  scrollPosition = $('body').scrollTop();
  var pageContent = $('body').children().wrapAll('<div class="page-content"/>').parent();
  $('body').append(search);
  searchTextfield.focus();
}

//Not pure Renders
//Result render. Render search items to DOM element
function renderResults(data, element, order) {
  element.empty();
  if (order) {
    order.forEach(function(section) {
      element.append(renderSection(data[section]));
    });
  } else {
    for (var section in data) {
      element.append(renderSection(data[section]));
    }
  }
}

//Render empty state
function renderEmptyState(searchText, element) {
  element.empty();
  var /*message = $('<div />').addClass('search__empty-msg').text('Sorry, no results. Check your spelling and try again.'),*/
  hintsTitle = $('<h3 />').addClass('search__hints-title').text(''),
  hintsList = $('<ul />').addClass('search__hints-list'),
  hints = $('<div />').addClass('search__hints').append(hintsTitle, hintsList);

  hintsItems.forEach(function(hint) {
    hintsList.append(renderHint(hint));
  });
  element.append(hints);
}

//
//Renders. Return DOM elements to according data
//

//Hint render
function renderHint(hint) {
  return $('<li />').addClass('search__hint-item').text(hint).click(handleHintClick);
}

//Section render. Return render DOM element
function renderSection(data) {
  if (!data) {
    return;
  }
  var section = $('<div></div>').addClass('search__section'),
  sectionName = $('<div></div>').addClass('search__section-name').text(data.name),
  sectionItems = $('<div></div>').addClass('search__section-items'),
  moreResults = $('<div></div>').addClass('search__more-results').text('More results'/* (' + data.items.length + ')'*/).click(handleShowMore),
  sectionRowLimit = 10,
  sectionRowStep = 2,
  itemsPerRow = 4,
  sortedData = data.items;

  switch (data.type) {
    case 'schedule':
    section.addClass('search__section--schedule');
    sectionName.text('Schedule');
    break;

    case 'media':
    section.addClass('search__section--media');
    break;

    case 'actor':
    section.addClass('search__section--actors');
    sectionName.text('Cast');
    sortedData = data.items.sort(function(a, b) {
      return a.title > b.title ? 1 : -1;
    });
    break;

    case 'post':
    section.addClass('search__section--post');
    sectionName.text('Blog');
    break;

    case 'episode':
    section.addClass('search__section--episode');
    sortedData = data.items.sort(function(a, b) {
      return a.title > b.title ? -1 : 1;
    });
    break;

    case 'show':
    section.addClass('search__section--show');
    sectionName.text('Series');
    break;

    case 'gallery':
    section.addClass('search__section--gallery');
    sectionName.text('Images');
    sortedData = data.items.sort(function(a, b) {
      return a.title > b.title ? -1 : 1;
    });
    break;

    case 'movie':
    section.addClass('search__section--movie');
    break;

    case 'video':
    section.addClass('search__section--video');
    sortedData = data.items.sort(function(a, b) {
      return a.title > b.title ? -1 : 1;
    });
    break;
  }

  var rows = splitIntoGoups(sortedData, itemsPerRow);
  rows.forEach(function(row, i) {
    if (i >= sectionRowLimit) {
      sectionItems.append(renderRow(row).addClass('is-hidden'));
    } else {
      sectionItems.append(renderRow(row));
    }
  });

  section.append(sectionName, sectionItems);
  if (rows.length > sectionRowLimit) {
    //section.addClass('search__section--more');
    //sectionItems.append(moreResults.attr('data-step', sectionRowStep));
  }
  return section;
}

//Row render. Return items Row element
function renderRow(data) {
  var row = $('<div></div>').addClass('search__row');
  data.forEach(function(item) {
    row.append(renderItem(item));
  });
  return row;
}

//Item renderer. Return Item DOM element.
function renderItem(data) {
  var item = $('<div></div>').addClass('search__item').attr('data-id', data.id),//.click(handleItemClick),
  title = $('<div></div>').addClass('search__item-title').text(data.title),
  active = $('<div></div>').addClass('search__item-active'),
  schedule = $('<div></div>').addClass('search__item-schedule'),
  date, avatar, subtitle, reference, time;

  if (data.subtitle) {subtitle = $('<div></div>').addClass('search__item-subtitle').text(data.subtitle);}
  if (data.avatar) {avatar = $('<div></div>').addClass('search__item-avatar').css('background-image', 'url(' + data.avatar + ')');}
  if (data.img) {item.css('background-image', 'url('+ data.img + ')');}
  if (data.series) {series = $('<div></div>').addClass('search__item-series').text(data.series);}
  if (data.reference) {reference = $('<div></div>').addClass('search__item-reference').text(data.reference);}
  if (data.time) {time = $('<div></div>').addClass('search__item-time').text(data.time);}
  if (data.date) {date = $('<div></div>').addClass('search__item-date').text(data.date);}

  switch (data.type) {
    case 'schedule':
    return item.addClass('search__item--schedule')
    .append(schedule.append(time, date), title, reference, subtitle, active);

    case 'show':
    return item.addClass('search__item--show')
    .append(title, subtitle, active);

    case 'post':
    if (data.friday) {item.addClass('search__item--friday');}
    return item.addClass('search__item--post')
    .append(title, subtitle, active);

    case 'video':
    return item.addClass('search__item--video')
    .append(title, subtitle, active);

    case 'actor':
    return item.addClass('search__item--actor')
    .append(avatar, title, subtitle, series, active);

    case 'episode':
    return item.addClass('search__item--episode')
    .append(avatar, title, subtitle, active);

    case 'movie':
    return item.addClass('search__item--movie')
    .append(title, subtitle, active);
    case 'gallery':
    return item.addClass('search__item--gallery')
    .append(title, active);

    default:
    return item.append(title, active);
  }
}

function renderInfo(data) {
  var info = $('<div></div>').addClass('search__info'),
  close = $('<div></div>').addClass('info__close chiller-close-weathered').click(handleCloseInfo),
  copy = $('<div></div>').addClass('info__copy'),
  title = $('<div></div>').addClass('info__title').text(data.title),
  subtitle = $('<div></div>').addClass('info__subtitle').text(data.subtitle),
  description = $('<div></div>').addClass('info__description').text(data.description),
  actions = data.actions || [],
  video, gallery, image;

  if (data.video) {video = $('<div></div>').addClass('info__video').css('background-image', 'url(' + data.video + ')').append(renderButton('video').addClass('info__button'));}
  if (data.gallery) {gallery = $('<div></div>').addClass('info__gallery').css('background-image', 'url(' + data.gallery + ')').append(renderButton('image').addClass('info__button'));}
  if (data.image) {image = $('<div></div>').addClass('info__image').css('background-image', 'url(' + data.image + ')');}

  if (actions.length === 0) {
    switch (data.type) {
      case 'schedule':
      actions = ['See Full Schedule'];
      break;
      case 'movie':
      actions = ['Explore'];
      break;

      case 'show':
      actions = ['Explore'];
      break;

      case 'episode':
      actions = ['Read Full Recap'];
      break;

      case 'video':
      actions = ['Explore'];
      break;

      case 'actor':
      actions = ['Explore'];
      break;

      case 'post':
      actions = ['Read More'];
      break;

      case 'gallery':
      actions = ['See Full Gallery'];
      break;
    }
  }

  return info.append(close, copy.append(title, subtitle, description, renderActions(actions)), video, gallery, image);
}

//Render actions
function renderActions(data) {
  var actions = $('<div></div>').addClass('info__actions');
  data.forEach(function(action) {
    actions.append(renderAction(action));
  });
  return actions;
}
function renderAction(action) {
  switch (action) {
    case 'Watch Clip':
    var a = $('<a></a>').addClass('info__action-link link-wrapper'),
    iconContainer = $('<div></div>').addClass('icon-container'),
    iconLeft = $('<div></div>').addClass('icon-left chiller-video-weathered'),
    iconRight = $('<div></div>').addClass('icon-right chiller-video-weathered'),
    spanText = $('<span></span>').addClass('info__action-text').text(action);
    return a.append(iconContainer.append(iconLeft, iconRight), spanText);
    default:
    return $('<div></div>').addClass('info__action').text(action);
  }
}

//Render Button
function renderButton(type) {
  var iconLeft = $('<div></div>').addClass('icon-left'),
  iconRight = $('<div></div>').addClass('icon-right'),
  iconContainer = $('<div></div>').addClass('icon-container').append(iconLeft, iconRight);

  switch (type) {
    case 'video':
    iconLeft.addClass('chiller-video-weathered');
    iconRight.addClass('chiller-video-weathered');
    break;

    case 'image':
    iconLeft.addclass('chiller-photo-weathered');
    iconRight.addclass('chiller-photo-weathered');
    break;

    default:
  }
  return iconContainer;
}

//Helpers

//Return data object from items array, so render function could use it to build sections
function normalizeSearchData(srcData) {
  return srcData.reduce(function(data, item) {
    if (data[item.type]) {
      data[item.type].items.push(item);
    } else {
      data[item.type] = {
        name: sectionName(item.type),
        type: item.type,
        items: [item]
      };
    }
    return data;
  }, {});
}

function sectionName(type) {
  switch (type) {
    default:
    return type.slice(0,1).toUpperCase() + type.slice(1) + 's';
  }
}

//Split array into groups with defined step
function splitIntoGoups(data, itemsPerGroup) {
  return data.reduce(function(acc, item, index) {
    if (acc.length > 0) {
      var lastGroup = acc[acc.length - 1];
      if (lastGroup.length < itemsPerGroup) {
        lastGroup.push(item);
      } else {
        acc.push([item]);
      }
    } else {
      acc.push([item]);
    }
    return acc;
  }, []);
}

function autoScrollToEnd(endElement, scrollElement) {
  var rowBottomEnd = endElement.get(0).getBoundingClientRect().top + endElement.height(),
  elementTop = endElement.offset().top;
  if (rowBottomEnd + 60 > $(window).height()) {
    scrollElement.animate( { scrollTop: '+=' + Math.round(rowBottomEnd + 60 - $(window).height()).toString() }, 600);
  }
}

function updateInfo(data, infoEl) {
  infoEl.find('.info__title').text(data.title);
  infoEl.find('.info__subtitle').text(data.subtitle);
  infoEl.find('.info__description').text(data.description);
  infoEl.find('.info__actions').remove();
  infoEl.find('.info__button').remove();

  var imgUrl = data.video || data.gallery || data.image,
  imageEl = infoEl.find('.info__video, .info__gallery, .info__image'),
  actions = data.actions || [];

  if (imgUrl) {imageEl.css('background-image', 'url(' + imgUrl + ')');}
  if (data.video) {imageEl.append(renderButton('video').addClass('info__button'));}
  if (data.gallery) {imageEl.append(renderButton('image').addClass('info__button'));}

  if (actions.length === 0) {
    switch (data.type) {
      case 'schedule':
      actions = ['See Full Schedule'];
      break;
      case 'movie':
      actions = ['Explore'];
      break;

      case 'show':
      actions = ['Explore'];
      break;

      case 'episode':
      actions = ['Read Full Recap'];
      break;

      case 'video':
      actions = ['Explore'];
      break;

      case 'actor':
      actions = ['Explore'];
      break;

      case 'post':
      actions = ['Read More'];
      break;

      case 'gallery':
      actions = ['See Full Gallery'];
      break;
    }
  }


  infoEl.find('.info__copy').append(renderActions(actions));
}

//Event handlers
function handleShowMore(e) {
  var step = e.target.dataset.step || 4,
  section = $(e.target).parents('.search__section'),
  hiddenRows = section.find('.search__row.is-hidden'),
  stepHiddenRows = hiddenRows.slice(0, step),
  hiddenRowsLeft = hiddenRows.length - step;

  stepHiddenRows.each(function(index, row) {
    $(row).removeClass('is-hidden').addClass('is-visible').css('animation-delay', Math.round(80*index).toString() + 'ms');
  });

  if (hiddenRowsLeft <= 0) {
    $(e.target).addClass('is-hidden');
  }

  //Auto scroll page when adding row below screen bottom edge
  autoScrollToEnd(stepHiddenRows.last(), $('.search__results'));
  //Close all infoEl
  handleCloseInfo();
}

function handleCloseSearch() {
  $('.search-overflow').remove();
  $('.page-content').children().unwrap();
  $('body').scrollTop(scrollPosition);
}

function handleSearchInput(e) {
  var searchText = e.target.value.toLowerCase(),
      searchResults = searchItems.filter(function(item) {
        var title = item.title ? item.title.toLowerCase().indexOf(searchText) : -1,
            subtitle = item.subtitle ? item.subtitle.toLowerCase().indexOf(searchText)  : -1,
            date = item.date ? item.date.toLowerCase().indexOf(searchText) : -1;
            series = item.series ? item.series.toLowerCase().indexOf(searchText) : -1;
            reference = item.reference ? item.reference.toLowerCase().indexOf(searchText) : -1;
        return title > -1 || subtitle > -1 || date > -1 || reference > -1 || series > -1;
      });

  $('.search__hint-text').text('');
  if (searchText === 'all') {
    renderResults(normalizeSearchData(searchItems), $('.search__results'), sectionOrder);
  } else if (searchText === '') {
    renderEmptyState('', $('.search__results'));
  } else if (searchResults.length === 0) {
    renderEmptyState(searchText, $('.search__results'));
    $('.search__hint-text').text('Sorry, no results. Check your spelling and try again.');
  } else {
    renderResults(normalizeSearchData(searchResults), $('.search__results'), sectionOrder);
  }
}

function handleHintClick(e) {
  $('.search__textfield').val($(e.target).text()).focus();
  var event = new UIEvent('input');
  $('.search__textfield').get(0).dispatchEvent(event);
}

function handleItemClick(e) {
  if (window.innerWidth > 992) {
    var row = $(e.target).parents('.search__row'),
    rowNext = row.next('.search__info');
    itemEl = $(e.target);

    if (!itemEl.hasClass('search__item')) {
      itemEl = itemEl.parents('.search__item');
    }
    var id = parseInt(itemEl.get(0).dataset.id);

    if (!isNaN(id)) {
      var data = searchItems.filter(function(item) {
        return item.id === id;
      })[0];

      $('.search__item.is-active').removeClass('is-active');
      itemEl.addClass('is-active');

      if (rowNext.get(0)) {
        updateInfo(data, rowNext);
      } else {
        $('.search__info').remove();
        var infoEl = renderInfo(data);
        row.after(infoEl);
        //Auto scroll page when adding row below screen bottom edge
        autoScrollToEnd(infoEl, $('.search__results'));
      }
    }
  }
}
function handleCloseInfo(e) {
  $('.search__info').remove();
  $('.search__item.is-active').removeClass('is-active');
}
//

$('.nav .chiller-search-thick-weathered, .series-nav .chiller-search-thick-weathered, .movies-nav .chiller-search-thick-weathered, .side-navigation .side-navigation-search').click(handleSearchClick);


//test
