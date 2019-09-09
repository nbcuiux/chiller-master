function createTooltip(target, text) {
    var tooltip = $('<div></div>').addClass('tooltip').click(closeTooltip),
        tooltipText = $('<div></div>').addClass('tooltip__text').text(text),
        tooltipToggle = $('<div></div>').addClass('tooltip__toggle'),
        tooltipToggle_Toggle = $('<input type="checkbox" id="neverShowTooltip" />'),//.on('change', neverShowTooltip),
        tooltipToggle_Label = $('<label for="neverShowTooltip">Got it, don\'t show me this again</label>');

    tooltipToggle.append(tooltipToggle_Toggle, tooltipToggle_Label);
    tooltipToggle.bind('click change', neverShowTooltip);
    tooltip.append(tooltipText, tooltipToggle);
    $(target).parent().append(tooltip);

    tooltip.width(target.width())
            .css('left', target.position().left)
            .css('top', target.position().top + target.height());

    //$(document).bind('click', closeTooltip);
}

function neverShowTooltip(e) {
    console.log('never show', e.target);
    window.localStorage.setItem('tooltip', true);
}

function closeTooltip(e) {
    console.log(e);
    $('.tooltip').remove();
    $(document).unbind('click', closeTooltip);
}
