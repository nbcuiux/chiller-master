// Change element indexes to an actual ones
function normalizeIndex() {
    var files = $('.tab .files .section__files .file');

    files.each(function(index, el) {
        $(el).find('.file__aragement-input').val(index + 1);
    });
}

function handleIndexFieldChange(e) {
    var length = $('.tab .files .section__files .file').length,
        index = parseInt($(e.target).val()) - 1,
        file = $(e.target).parents('.file');

    if (index + 1 >= length) {
        putBottom(file);
    } else {
        file.detach().insertBefore($('.tab .files .section__files .file').slice(index, index+1));
    }
    normalizeIndex();
}

function putBottom(file) {
    file.detach().insertAfter($('.tab .files .section__files .file').last());
    normalizeIndex();
}
function putTop(file) {
    file.detach().insertBefore($('.tab .files .section__files .file').first());
    normalizeIndex();
}

function handleSendToTopClick(e) {
    putTop($(e.target).parents('.file'));
    //closeMenu($(e.target).parents('select__menu'));
}
function handleSendToBottomClick(e) {
    putBottom($(e.target).parents('.file'));
    //closeMenu($(e.target).parents('select__menu'));
}
function closeMenu(e) {
    console.log('closeMenu');
    $('.select__menu').detach();
    $('body').unbind('click', closeMenu);
}

function showRearrangeMenu(e) {
    console.log('rearrange menu', e.target);
    //e.stopPropagation();
    if ($(e.target).parents('.file__arragement').find('.select__menu').length <= 0) {
        var menu = $('<div></div>').addClass('select__menu'),
            ul = $('<ul></ul>'),
            item1 = $('<li>Send to Top</li>').click(handleSendToTopClick),
            item2 = $('<li>Send to Bottom</li>').click(handleSendToBottomClick);

        ul.append(item1, item2);
        menu.append(ul);
        $(e.target).append(menu);
        $('body').on('click', closeMenu);

    } else {
        closeMenu();
    }

}
