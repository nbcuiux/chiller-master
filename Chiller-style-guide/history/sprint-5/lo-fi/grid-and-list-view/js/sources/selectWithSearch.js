function openMenu(el, data) {
    console.log(el);

    var width = $(el).find('input').outerWidth(),
        height = $(el).height(),
        offset = $(el).offset(),
        documentHeight = $(document).height(),
        bottomspace = documentHeight - offset.top - height - 200;

        bottom = bottomspace > 0 ? true : false,

        console.log(offset.top, height, documentHeight, bottom, (offset.top + height + 200 - documentHeight));

        dropdown = $('<div></div>')
                    .addClass('dropdown__menu')
                    .addClass(function() {return bottom ? 'dropdown__menu_bottom' : 'dropdown__menu_up'})
                    .css('width', width)
                    .css('height', function() {return bottom ? bottomspace + 200 : 300})
                    .attr('id', 'dropdownList'),
        search = $('<input type="text" placeholder="Show, season, event"/>').addClass('dropdown__search').on('input', filterList),
        list = $('<div></div').addClass('dropdown__list'),
        listUl = $('<ul></ul>');

    if (data) {
        for (var i = 0; i < data.length; i++) {
            var item = $('<li></li>').text(data[i]).click(itemSelect);
            listUl.append(item);
        }
    }

    list.append(listUl);
    dropdown.append(search, list);
    $(el).append(dropdown);//.unbind('click').click(closeDropDown);
    search.focus();
    $('*').click(closeDropDown);
}

function closeDropDown(e) {
    $('*').unbind('click', closeDropDown);
    $('#dropdownList').parents('.dropdown').blur();
    $('#dropdownList').remove();
    //$('.dropdown').click(function(event) {openMenu(event.target, showList);});
}

$('.dropdown').click(function(e) {openMenu(e.target, showList);});

function filterList(e) {

}
function itemSelect(e) {

}
