function createTooltip(target, text) {
    var tooltip = $('<div></div>').addClass('tooltip').click(closeTooltip),
        tooltipText = $('<div></div>').addClass('tooltip__text').text(text),
        tooltipToggle = $('<div></div>').addClass('tooltip__toggle'),
        tooltipToggle_Toggle = $('<input type="checkbox" id="neverShowTooltip" />'),//.on('change', neverShowTooltip),
        tooltipToggle_Label = $('<label for="neverShowTooltip">Got it, don\'t show me this again</label>');

    tooltipToggle.append(tooltipToggle_Toggle, tooltipToggle_Label);
    tooltipToggle.bind('focus click change', neverShowTooltip);
    tooltip.append(tooltipText, tooltipToggle);
    $(target).parent().append(tooltip);

    tooltip.width(target.width());
    //console.log($('body').width() - target.o().left - target.width() - target.width() - 20, $('body').width());
    if ($('body').width() - target.offset().left - target.width() - target.width() - 20 > 0 ) {
        tooltip.css('left', target.position().left + target.width() + 10);
    } else {
        tooltip.css('left', target.position().left - target.width() - 10);
    }

            //.css('top', target.position().top + target.height());

    $('html').click(closeTooltip);
}

function neverShowTooltip(e) {
    e.stopPropagation();
    console.log('never show', e.target);
    window.localStorage.setItem('tooltip', true);
    closeTooltip();
}

function closeTooltip(e) {
    //console.log('closetooltip', e);
    $(document).unbind('click', closeTooltip);
    var tooltips = $('.tooltip');
    window.setTimeout(function() {
        tooltips.remove();
    }, 300);


}
