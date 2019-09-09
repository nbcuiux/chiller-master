// Create DOM element for File from data
function createFileElement(f) {
    var fileData = f.fileData;
    //create basic element
    var file = $('<div></div>').addClass('file file_type_img'),
        fileIndex = $('<div></div>').addClass('hidden file__id').text(fileData.id),

        fileArragement = $('<div></div>').addClass('file__arragement'),
        fileArragementInput = $('<input type="text" />').addClass('file__aragement-input').on('change', handleIndexFieldChange),
        fileArragementSettings = $('<div><i class="fa fa-ellipsis-v"></i></div>')
                                    .addClass('file__aragement-settings')
                                    .click(showRearrangeMenu),

        fileImg = $('<div></div>')
                    .addClass('file__img')
                    .css('background-image', 'url(' + fileData.url + ')'),
        fileControls = $('<div></div>').addClass('file__controls').click(toggleFileSelect),
        fileCheckmark = $('<div></div>').addClass('file__checkmark').click(toggleFileSelect),
        fileDelete = $('<div></div>').addClass('file__delete').click(deleteFile),
        fileType = $('<div><i class="fa fa-camera"></i></div>').addClass('file__type'),
        fileEdit = $('<button>Edit</button>').addClass('button whiteOutline').click(handleFiledEditButtonClick),

        fileTitle = $('<div></div>').addClass('file__title').text(fileData.title),

        fileCaption = $('<div></div>').addClass('file__caption'),
        fileCaptionTitle = $('<div></div>').addClass('file__caption-title').text('Gallery caption'),
        fileCaptionTextarea = $('<textarea></textarea>')
                                .addClass('file__caption-textarea')
                                .val(f.caption ? f.caption : fileData.caption)
                                .on('blur input', handleCaptionEdit)
                                .on('focus', handleCaptionStartEditing),

        fileCaptionToggle = $('<div></div>').addClass('file__caption-toggle'),
        fileCaptionToggle_Toggle = $('<input type="checkbox" />').addClass('toggle switch').click(handleCaptionToggleClick).prop('checked', function() {return f.caption? false : true;}),
        fileCaptionToggle_Label = $('<label>Keep metadata caption</label>'),

        fileEditButton = $('<button>Edit</button>').addClass('button grayOutline').click(handleFiledEditButtonClick);

    if (!fileData.caption) {
        fileCaptionToggle.addClass('disabled');
        fileCaptionToggle_Toggle.prop('checked', false).prop('disabled', true);

        if (fileCaptionTextarea.val()) {
            fileCaptionTextarea.attr('placeholder', 'Don\'t have metadata caption');
        }
    }

    fileArragement.append(fileArragementInput, fileArragementSettings);

    fileControls.append(fileCheckmark, fileDelete, fileType, fileEdit);
    fileImg.append(fileControls);

    fileCaptionToggle.append(fileCaptionToggle_Toggle, fileCaptionToggle_Label);
    fileCaption.append(fileCaptionTitle, fileCaptionTextarea, fileCaptionToggle, fileEditButton);

    file.append(fileIndex, fileArragement, fileImg, fileTitle, fileCaption);

    /*if (option) {
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
    }*/
    //file.append(fileEditButton);

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
    fileSection.append(file);
    /*if (index) {
        file.detach().insertBefore(fileSection.find('.file').eq(index));
    }*/

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
    $('#assets-count').text(galleryObjects.length ? galleryObjects.length + ' Assets total' : '');
}

function updateGallery() {
    var justUploaded = false, scrollIndex = 0;

    // Remember position and selection of files
    $('.ct .files .file').each(function(index, el) {
        var file = galleryObjects.filter(function(f) {
            return f.fileData.id === $(el).find('.file__id').text();
        })[0];
        file.position = index;
        file.selected = $(el).hasClass('selected');
    });

    //Clear files section
    $('.files .section__files').empty();

    //Sort array acording files position
    galleryObjects.sort(function(a, b) {
        return a.position - b.position;
    });

    //Create files from data and add them to the page
    for (var i = 0; i<galleryObjects.length; i++ ) {
        var f = galleryObjects[i],
            file = createFileElement(f);

        if (f.selected) {file.addClass('selected');}
        if (f.justUploaded) {
            file.addClass('selected');
            f.justUploaded = false;
            justUploaded = true;
        }
        addFile(file);
    }

    normalizeSelecteion();
    normalizeAssetsCount();
    normalizeIndex();

    if (justUploaded) {editFiles($('.ct .files .file.selected'));}
    if (scrollIndex) {
        var scrollTop = $('.ct .files .file').last().offset().top;
        console.log(scrollTop);
        $('.ct').animate({
            scrollTop: scrollTop
        }, 400);
    }
}
