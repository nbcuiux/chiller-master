function createALElement(fileData, dataIndex) {

    //create basic element
    var file = $('<div></div>').addClass('file file_view_modal file_type_img'),
        fileIndex = $('<div></div>').addClass('hidden file__index').text(dataIndex),

        fileImg = $('<div></div>').addClass('file__img').css('background-color', fileData.color),
        fileControls = $('<div></div>').addClass('file__controls').click(toggleFileSelect),
        fileCheckmark = $('<div></div>').addClass('file__checkmark').click(toggleFileSelect),
        fileType = $('<div><i class="fa fa-camera"></i></div>').addClass('file__type'),

        fileTitle = $('<div></div>').addClass('file__title').text(fileData.title);

    fileControls.append(fileCheckmark, fileType);
    fileImg.append(fileControls);

    file.append(fileIndex, fileImg, fileTitle);
    return file;
}

function addAlElement(file) {
    var fileSection = $('.al .files .section-files');
    fileSection.prepend(file);
}
function updateAL() {
    $('.al .files .section-files').empty();
    assetLibraryObjects.forEach(function(f, i) {
        addAlElement(createALElement(f, i));
    });
}

function addSelectedFiles() {
    var selectedFiles = $('.al .files .section-files .file.selected');

    if (selectedFiles.length > 0) {
        selectedFiles.each(function(i, el) {
            var fileIndex = parseInt($(el).find('.file__index').text());
            galleryObjects.push(assetLibraryObjects[fileIndex]);
        });

        updateGallery();
    }
    selectedFiles.removeClass('selected');   
}
/*$(document).ready(function() {
    updateAL();
});*/
