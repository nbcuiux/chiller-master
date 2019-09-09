function createFileElement(fileData, dataIndex, option) {

    //create basic element
    var file = $('<div></div>')
                .addClass('file file_type_img')
                .addClass(function() {return fileData.justUploaded ? 'selected' : '';}),
        fileIndex = $('<div></div>').addClass('hidden file__index').text(dataIndex),

        fileArragement = $('<div></div>').addClass('file__arragement'),
        fileArragementInput = $('<input type="text" />').addClass('file__aragement-input').on('change', handleIndexFieldChange),
        fileArragementSettings = $('<div><i class="fa fa-ellipsis-v"></i></div>')
                                    .addClass('file__aragement-settings')
                                    .click(showRearrangeMenu),

        fileImg = $('<div></div>')
                    .addClass('file__img')
                    .css('background-color', fileData.color),
        fileControls = $('<div></div>').addClass('file__controls').click(toggleFileSelect),
        fileCheckmark = $('<div></div>').addClass('file__checkmark').click(toggleFileSelect),
        fileDelete = $('<div></div>').addClass('file__delete').click(deleteFile),
        fileType = $('<div><i class="fa fa-camera"></i></div>').addClass('file__type'),
        fileEdit = $('<button>Edit</button>').addClass('button whiteOutline').click(editFile),

        fileCaption = $('<div></div>').addClass('file__caption'),
        fileCaptionTextarea = $('<textarea></textarea>')
                                .addClass('file__caption-textarea')
                                .val(fileData.caption)
                                .on('blur input', handleCaptionEdit)
                                .on('focus', handleCaptionStartEditing),

        fileCaptionToggle = $('<div></div>').addClass('file__caption-toggle'),
        fileCaptionToggle_Toggle = $('<input type="checkbox" checked />').addClass('toggle switch').click(handleCaptionToggleClick),
        fileCaptionToggle_Label = $('<label>Keep original caption</label>');



    fileArragement.append(fileArragementInput, fileArragementSettings);

    fileControls.append(fileCheckmark, fileDelete, fileType, fileEdit);
    fileImg.append(fileControls);

    fileCaptionToggle.append(fileCaptionToggle_Toggle, fileCaptionToggle_Label);
    fileCaption.append(fileCaptionTextarea, fileCaptionToggle);

    file.append(fileIndex, fileArragement, fileImg);

    if (option) {
        var fileCaptions = $('<div></div>').addClass('file__captions'),
            originalCaption = $('<div></div>').addClass('file__caption file__caption_original'),
            originalCaption_Title = $('<div></div>').addClass('file__caption-title').text('Original caption'),
            originalCaption_Caption = $('<div></div>').addClass('file__caption-text').text(fileData.caption),

            galleryCaption_Title = $('<div></div>').addClass('file__caption-title').text('Caption for Gallery');

        fileCaptionToggle_Toggle.prop('checked', false);
        originalCaption.append(originalCaption_Title, originalCaption_Caption);
        fileCaption.empty().append(fileCaptionToggle, galleryCaption_Title, fileCaptionTextarea);
        fileCaptions.append(originalCaption, fileCaption);

        file.append(fileCaptions);
    } else {
        file.append(fileCaption);
    }

    return file;
}

function addFile(file) {
    var fileSection = $('.files .section__files');

    if (fileSection.hasClass('section__files_view_grid')) {
        file.addClass('file_view_grid');
    }
    if (fileSection.hasClass('section__files_view_list')) {
        file.addClass('file_view_list');
    }

    fileSection.prepend(file);
    normalizeIndex();
}

function setGridView(e) {
    $(e.target).parent().children().removeClass('active');
    $(e.target).addClass('active');

    $('.files .section__files')
        .addClass('section__files_view_grid')
        .removeClass('section__files_view_list');

    $('.files .section__files .file')
        .addClass('file_view_grid')
        .removeClass('file_view_list');
}
function setListView(e) {
    $(e.target).parent().children().removeClass('active');
    $(e.target).addClass('active');

    console.log($('.files .section__files'));
    $('.files .section__files')
        .addClass('section__files_view_list')
        .removeClass('section__files_view_grid');

    $('.files .section__files .file')
        .addClass('file_view_list')
        .removeClass('file_view_grid');
}
function normalizeAssetsCount() {
    $('#assets-count').text(galleryObjects.length + ' Assets total');
}

function updateGallery() {
    $('.files .section__files').empty();
    galleryObjects.forEach(function(f, i) {
        if ($('#galery-version-2').length > 0) {
            addFile(createFileElement(f, i, true));
        } else {
            addFile(createFileElement(f, i));
        }
        f.justUploaded = false;
    });
    normalizeSelecteion();
    normalizeAssetsCount();
    normalizeIndex();
    if ($('.files .section__files .file.selected').length === 1) {
        editFile();
    } else if ($('.files .section__files .file.selected').length > 1){
        multiEdit();
    }
}

$(document).ready(function() {
    updateGallery();
    updateAL();
    $('.ct .section__files').sortable({
    	placeholder: 'img__placeholder',
        //forcePlaceholderSize: true,
    	cursor: '-webkit-grabbing',
    	helper: 'clone',
    	opacity: 0.5,
        /*start: function(e, ui ){
            ui.placeholder.height(ui.helper.outerHeight());
        },*/
        stop: function() {
            normalizeIndex();
            $('.files .section__files .file').removeAttr('style');
        }
    });

    $('#addFromALButton').click(function(){
        addSelectedFiles();
        closeModal();
    });

    $('#gridView').click(setGridView);
    $('#listView').click(setListView);

});
