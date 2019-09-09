function handleCaptionEdit(e) {
    var file = $(e.target).parents('.file'),
        fileIndex = parseInt(file.find('.file__index').text()),
        toggle = file.find('.file__caption-toggle .toggle');
        toggleChecked = $(e.target).val() === galleryObjects[fileIndex].caption;

    //console.log(file.find('.file__index').text());
    toggle.prop('checked', toggleChecked);
    closeTooltip();
}
function handleCaptionToggleClick(e) {
    var file = $(e.target).parents('.file'),
        fileIndex = parseInt(file.find('.file__index').text()),
        textarea = file.find('.file__caption-textarea'),
        originalCaption = galleryObjects[fileIndex].caption;

    if ($(e.target).prop('checked')) {
        textarea.val(originalCaption);
    } else {
        textarea.focus();
    }
}
function handleCaptionStartEditing(e) {
    var tooltipText = 'This caption will only apply to your gallery and not to the asset library.';
    console.log(window.localStorage.getItem('tooltip'));
    if (!window.localStorage.getItem('tooltip')) {
        createTooltip($(e.target), tooltipText);
    }
}

$('.file__caption-textarea').on('blur input', handleCaptionEdit);
$('.file__caption-textarea').on('focus', handleCaptionStartEditing);
$('.file__caption-toggle .toggle').click(handleCaptionToggleClick);
