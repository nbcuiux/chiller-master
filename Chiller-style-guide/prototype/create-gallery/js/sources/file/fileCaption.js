var galleryCaptions = {};

function handleCaptionEdit(e) {
    var fileElement = $(e.target).parents('.file'),
        fileId = fileElement.find('.file__id').text(),
        toggle = fileElement.find('.file__caption-toggle .toggle'),
        file = galleryObjects.filter(function(f) {
            return f.fileData.id === fileId;
        })[0],

        toggleChecked = $(e.target).val() === file.fileData.caption && file.fileData.caption; //If textfield equals the file caption and file caption not empty

    //Save caption to galleryCaptions
    file.caption = $(e.target).val();

    //console.log(file.find('.file__index').text());
    toggle.prop('checked', toggleChecked);
    closeTooltip();
}
function handleCaptionToggleClick(e) {
    //e.stopPropagation();
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
    var tooltipText = 'This caption will only apply to your gallery and not to the image asset.';
    if (!window.localStorage.getItem('tooltip')) {
        createTooltip($(e.target), tooltipText);
    }
}

$('.file__caption-textarea').on('blur input', handleCaptionEdit);
$('.file__caption-textarea').on('focus', handleCaptionStartEditing);
$('.file__caption-toggle .toggle').click(handleCaptionToggleClick);
