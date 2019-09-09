//Chiller data
//= get-chiller-data.js

function renderNetworks(data) {
  var networks = $('<div />').addClass('get__networks').append('<div class="video__purchase__container"><a href="http://www.amazon.com/Digging-Your-Grave-Teeth/dp/B01CKFDJMS/ref=sr_1_1?s=instant-video&ie=UTF8&qid=1457193067&sr=1-1&keywords=Chiller" target="_blank"><div class="video__supplier"><img src="img/amazon-video.png" /></div></a><a href="https://itunes.apple.com/us/tv-show/slasher/id1076673739" target="_blank"><div class="video__supplier"><img src="img/apple-store.png" /></div></a></div>');

  if (data.length > 0) {
    data.forEach(function(network) {
      networks.append(renderNetwork(network));
    });
  }

  return networks;
}

function renderNetwork(data) {
  var network = $('<div />').addClass('network'),
  networkMain = $('<div />').addClass('network__main'),
  title = $('<div />').addClass('network__title').text(data.title),
  networkSubtitle = $('<div />').addClass('network__subtitle'),
  phone = $('<span />').addClass('network__phone').text(data.phone),
  link = $('<a />').text(data.linkText).attr('href', data.link).attr('target', 'blank'),
  channels = $('<div />').addClass('network__channels');

  if (data.channels.length > 0) {
    var channelText = data.channels.length > 1 ? 'channels' : 'channel';
    channels.append($('<span></span>').addClass('network__channels-text').text(channelText));
    data.channels.forEach(function(channel) {
      channels.append(renderChannel(channel));
    });
  } else {
    channels.append(renderTextButton('Demand Chiller', handleDemandAction));
    network.addClass('on-demand');
  }

  return network.append(networkMain.append(title, networkSubtitle.append(phone, link)), channels);
}

function renderChannel(channel) {
  return $('<span />').addClass('network__channel').text(channel);
}

function renderTextButton(text, callback) {
  var button = $('<div></div>').addClass('button').text(text),
  buttonLeft = $('<div></div>').addClass('button1-left').append(button),
  buttonRight = $('<div></div>').addClass('button1-right').append(button.clone()),
  buttonContainer = $('<div></div>').addClass('button-container').append(buttonLeft, buttonRight);

  if (callback) {buttonContainer.click(callback);}

  return buttonContainer;
}

function renderDemandChiller(network) {
  var demand = $('<div></div>').addClass('demand'),
  demandClose = $('<div></div>').addClass('demand__close chiller-chevron-previous').click(handleCloseDemand),
  demandForm = $('<div></div>').addClass('demand__form'),
  demandCredits = $('<div></div>').addClass('demand__credits'),

  demandFirstName = $('<input type="text" name="firstName" placeholder="First Name" id="demandFirstName" />')
  .addClass('demand__input')
  .on('input', handleDemandInput),
  demandLastName = $('<input type="text" name="lastName" placeholder="Last Name" id="demandLastName" />')
  .addClass('demand__input')
  .on('input', handleDemandInput),

  demandMail = $('<input type="email" name="email" placeholder="Email" id="demandEmail" />')
  .addClass('demand__input')
  .on('input', handleDemandInput),

  demandTheme = $('<div />')
  .addClass('demand__theme')
  .text('I Want Chiller!'),

  demandText = $('<div />')
  .addClass('demand__msg')
  .text(initialDemandMsg),

  demandCheckbox = $('<input type="checkbox" name="demandCheckbox" id="demandCheckbox" />')
  .addClass('demand__input demand__checkbox')
  .on('input', handleDemandInput),
  demandCheckboxLabel = $('<label for="demandCheckbox" />')
  .addClass('demand__label')
  .text('Subscribe to Chiller newsletters'),
  demandCheck = $('<div />').addClass('demand__check');

  demandConfirm = renderTextButton('Send', handleSendDemand).addClass('demand__send').attr('id', 'demandSend');

  demandText.elastic();

  return demand.append(demandClose, demandForm.append(demandCredits.append(demandFirstName, demandLastName), demandMail, demandTheme, demandText, /*demandCheck.append(demandCheckbox, demandCheckboxLabel),*/ demandConfirm), renderDemandConfirmation());

}

function renderDemandConfirmation() {
  var confirm = $('<div></div>').addClass('demand__confirm'),
  title = $('<div></div>').addClass('demand__title').text('Request Sent!'),
  text = $('<p></p>').addClass('demand__text').text('Thank you for your interest in getting Chiller. Hope you can get a good scare through your TV soon!'),
  button = renderTextButton('Back to Home!', handleDemandConfirm).addClass('demand__confirm-btn').attr('id', 'demandConfirm').css('position', 'relative');

  return confirm.append(title, text, button);
}

//
//Handlers
//
function handleNetworkSearch(e) {
  //$('.promo').addClass('is-hidden');
  $('.get__main').addClass('is-active');
  $('#getResults').empty().append($('<div class="get-results__close chiller-close-weathered"></div>').click(handleNetworkClose));
  var networksList = renderNetworks(networks),
  heightDelta = window.innerWidth < 992 ? window.innerWidth < 550 ? -150 : 0 : 0;
  $('#getResults').append(networksList);
  $('#getResults').css('min-height', networksList.outerHeight() - heightDelta);
}

function handleDemandAction(e) {
  $('.get__networks').addClass('is-hidden').removeClass('is-coming-back');
  $('.get__section').not('.get__section--results').addClass('is-dimmed');
  var demandForm = $('.demand');
  if (!demandForm.get(0)) {
    demandForm = renderDemandChiller();
    $('#getResults').append(demandForm);
  } else {
    demandForm.removeClass('is-canceled');
  }
  demandForm.addClass('is-appearing');
  $('#getResults').css('min-height', demandForm.outerHeight() + 50);
  autoScroll(demandForm, $('body'), 200, 150);

}
function handleSendDemand(e) {
  $('.demand').addClass('is-confermed');
  $('.demand .demand__title').textillate();
  $('.demand .demand__text').textillate();

}

function handleCloseDemand(e) {
  $('.get__networks').removeClass('is-hidden').addClass('is-coming-back');
  $('.demand').addClass('is-canceled').removeClass('is-appearing');
  $('.get__section').not('.get__section--results').removeClass('is-dimmed');
  $('#getResults').css('min-height', $('.get__networks').outerHeight());
}


function handleZipInput(e) {
  if (e.target.value.length >= 5) {
    $('#searchNetwork').removeClass('is-disabled');
  } else {
    $('#searchNetwork').addClass('is-disabled');
  }
}
function handleSubscribeInput(e) {
  var firstname = $('#subscribeFirstName').val(),
  lastname = $('#subscribeLastName').val(),
  mail = $('#subscribeMail').val();

  if (firstname !== '' && lastname !== '' && mail !== '') {
    $('#subscribeBtn').removeClass('is-disabled');
  } else {
    $('#subscribeBtn').addClass('is-disabled');
  }
}
function handleDemandInput(e) {
  var name = $('#demandName').val(),
  mail = $('#demandMail').val(),
  theme = $('#demandTheme').val();

  if (name !== '' && mail !== '') {
    $('#demandSend').removeClass('is-disabled');
  } else {
    $('#demandSend').addClass('is-disabled');
  }

  switch (e.target.id) {
    case 'demandName':
    if (e.target.value !== '') {$('#demandText').text(initialDemandMsg + e.target.value);}
    else {$('#demandText').text(initialDemandMsg);}
    break;
  }
}

function handleSubscribeSend(e) {
  $('#subscribe').addClass('is-confermed');
  $('#subscribe .confirmation__text').textillate();
}
function handleDemandConfirm(e) {
  window.location.href = 'index.html';
}
function handleNetworkClose(e) {
  $('.get__main').removeClass('is-active');
  $('#getResults').empty().css('min-height', 0);
  $('.get__section').removeClass('is-dimmed');
  $('#zipField').val('');
  $('#searchNetwork').addClass('is-disabled');
}

function handleResize() {
  if ($('#getResults').children().length > 0) {
    var
    activeElement = $('#getResults .demand:not(.is-canceled)').get(0) || $('#getResults .get__networks:not(.is-hidden)').get(0);
    //, #getResults .get__networks:not(.is-hidden)

    if (activeElement) {
      $('#getResults').css('min-height', $(activeElement).outerHeight(true));
    }
  }
}

/*
* Helpers
*/

function autoScroll(element, scrollElement, deltaTop, deltaBottom) {
  var deltaT = deltaTop || 60;
  var deltaB = deltaBottom || 60;
  var elementTopEnd = element.get(0).getBoundingClientRect().top,
  elementBottomEnd = elementTopEnd + element.height();

  if (elementTopEnd < deltaTop) {
    scrollElement.animate( { scrollTop: '+=' + Math.round(elementTopEnd - deltaTop).toString() }, 600);
  }

  if (elementBottomEnd + deltaB > $(window).height()) {
    scrollElement.animate( { scrollTop: '+=' + Math.round(elementBottomEnd + deltaB - $(window).height()).toString() }, 600);
  }
}

//
// Init
//

$('#searchNetwork').click(handleNetworkSearch);
$('#zipField').on('input', handleZipInput);
$('#subscribeFirstName, #subscribeLastName').on('input', handleSubscribeInput);
$('#subscribeMail').on('input', handleSubscribeInput);
$('.get__main-close.chiller-close-weathered').click(handleNetworkClose);
$('#subscribeBtn').click(handleSubscribeSend);

$(window).on('resize', handleResize);
