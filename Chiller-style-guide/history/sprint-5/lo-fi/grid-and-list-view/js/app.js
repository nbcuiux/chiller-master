var scrollPosition;

/* global document, $*/
function handleDragEnter(e) {
	e.stopPropagation();
    e.preventDefault();
	e.dataTransfer.dropEffect = "copy";
	//e.dataTransfer.effectAllowed = "copy";
	//$("#dropZone").removeClass('hidden');
	$('#dropZone-1').addClass('modal').removeClass('hidden');
	document.getElementById("dropZone-1").addEventListener('dragleave', handleDragLeave, true);

}
function handleDragLeave(e) {
	e.preventDefault();
	e.stopPropagation();
	$("#dropZone-1").removeClass('modal').addClass('hidden');
	document.getElementById("wrapper").classList.remove('locked');

}
function handleDrop(e) {
	e.stopPropagation();
    e.preventDefault();
	$("#dropZone-1").removeClass('modal').addClass('hidden');
	var files = e.dataTransfer.files;
	if (files.length > 0) {
		handleFiles(files);
		/*for (var i=0; i<files.length; i++) {
			readFile(files[i]).then(createFile);
			/*var file = files[i];
			var reader = new FileReader();
			reader.readAsDataURL(file);*/
		//}
	}
}
function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
}

document.addEventListener('dragenter', handleDragEnter, true);
if (document.getElementById("dropZone-1")) {document.getElementById("dropZone-1").addEventListener('dragleave', handleDragLeave, true);}
document.addEventListener('dragover', handleDragOver, false);
document.addEventListener('drop', handleDrop, false);
$("#savePreview").click(handleSavePreview);
$("#closePreview").click(handleClosePreview);
$("#uploadFiles").click(handleUploadFilesClick);

function handleClosePreview(e) {
	$('.pr').addClass("willClose");
	$('.pr .preview').removeClass('focal line full rect point');
	$('.focalPoint').removeAttr('style');
	$('.focalRect').removeAttr('style');
	$('#focalPointToggle').removeClass('active');
	$('#focalRectToggle').removeClass('active');
	$('.purposes-container .purpose .purpose-img').removeAttr('style');
	$('.ct .file').find('button').css('display', '');
	e.target.classList.remove('modal', 'willClose');
	e.target.classList.add('hidden');
	$('#wrapper').removeClass('overflow');
	//deselectAll();
}
function handleSavePreview(e) {

}
function closeEditScreen() {
	$('.pr').addClass("willClose");
	$('.pr .preview').removeClass('focal line full rect point');
	$('.focalPoint').removeAttr('style');
	$('.focalRect').removeAttr('style');
	$('#focalPointToggle').removeClass('active');
	$('#focalRectToggle').removeClass('active');
	$('.purposes-container .purpose .purpose-img').removeAttr('style');
	$('.ct .file').find('button').css('display', '');
	//deselectAll();
	e.target.classList.remove('modal', 'willClose');
	e.target.classList.add('hidden');
	$('#wrapper').removeClass('overflow');
}
function closeModal() {
	$('.modal').addClass('hidden').removeClass('modal');
	$('#wrapper').removeClass('overflow');
}

function handleUploadFilesClick(e) {
	var filesInput = document.getElementById("filesInput");
    if (!filesInput) {
    	filesInput = document.createElement("input");
        filesInput.type = "file";
        filesInput.multiple = "true";
        filesInput.hidden = true;
        filesInput.accept = "image/*, audio/*, video/*";
        filesInput.id = "filesInput";
        filesInput.addEventListener("change", function(e) {
				console.log(e.target.files);
               handleFiles(e.target.files);
            });
        document.body.appendChild(filesInput);
    }
    filesInput.click();
}

$('#searchField').focus(function(e) {e.target.parentNode.classList.add('active');});
$('#searchField').blur(function(e) {
	if ($('#filterMenu').hasClass('hidden')) {
		e.target.parentNode.classList.remove('active');
	}
});

/*$('.fm-toogle').click(function(e) {
	e.stopPropagation();
	var section = e.target.parentNode.parentNode;
	var filterName = section.id;
	var
	var query = $('searchField').val();

})*/
$('.lm li').click(function(e) {
	$('.lm li').removeClass('open');
	$('.lm li ul').removeClass('open');

	$(e.target).addClass('open');
	$(e.target).children('ul').addClass('open');

	/*if (subItems.length > 0) {
		$('.lm li').removeClass('open');

		for (var i=0; i<subItems.length; i++) {
			var subItem = subItems[i];
			subItem.classList.toggle('open');
			$(e.target).toggleClass('open');
		}
	}*/
});
$('#menuToggle').click(function(e) {
	$('.lm').toggleClass('open');
	$('.ct').toggleClass('locked');
});
$('.lm > .close, .lm > .logo').click(function(e) {
	$('.lm').toggleClass('open');
	$('.ct').toggleClass('locked');
});

$('.al, .ct').click(function(e) {
	if ($('.lm').hasClass('open')) {
		$('.lm').toggleClass('open');
		$('#wrapper').removeClass('locked');
	}
});

$('#assetLibrary').click(function(e) {
	$('#al').removeClass('hidden');
	$('#al').addClass('modal');
	$('#wrapper').addClass('overflow');
});
/*$('.al .file').each(function(i, el) {
	var duration = Math.floor(Math.random()*50)/10,
		delay = Math.floor(Math.random()*15)/10;

	console.log(duration, delay);
	console.log(el.classList);
	el.style.anumationDuration = duration.toString + "s";
	el.style.animationDelay = delay.toString + "s";
});*/

$('.progressBar .loaded').animate({width: "100%"},
	2300,
	'linear',
	function() {this.parentNode.classList.add('hidden');}
);


/* Select control */
function openSelect(e) {
	//console.log(e.target);
	//e.target.classList.toggle('open');
	$(e.target).toggleClass('open');
}
function setSelect(e) {
	var select = $(e.target).parent().parent(),
		item = $(e.target),
		spanString = select.children('span').text();

	if (select.hasClass('multiple')) {
		if (item.hasClass('active')) {
			item.removeClass('active');
			var searchString = itemText + ", ";
			var index = spanString.slice(spanString.search(searchString));
			var newSpan = spanString()
		}
		$(e.target).toggleClass('active');
		var string
		select.children('span').text()

	} else {
		var select = e.target.parentNode.parentNode;
		var span = select.getElementsByTagName('span')[0];
		span.innerHTML = e.target.innerHTML;
		select.classList.add('selected');
		select.classList.remove('open');
		var items = select.getElementsByTagName('li');
		for (var i=0; i<items.length; i++) {
			items[i].classList.remove('active');
		}
		e.target.classList.add('active');
	}
	//console.log(select.parent());
	if ($(select).parent().hasClass('file-purpose')) {
		if ($('.ct .file.selected').length > 0) {
			$('.ct .file.selected .select').addClass('selected');
			$('.ct .file.selected .select span').text(e.target.innerHTML);
			deselectAll();
		}
	}
}
$('.select').click(openSelect);
$('.select li').click(setSelect);
$('*').not('.select li, .select').click(function(e) {
	if ($('.select').hasClass('open')) {
		$('.select').removeClass('open');
	}
});

/* Multiselect control */
$('.multiSelect').not('.tag').click(function(e) {
	e.target.classList.add('open');
});
$('.multiSelect li').click(function(e) {
	var select = $(e.target).parent().parent(),
		item = $(e.target),
		tag = $('<div></div>').addClass('tag').text(item.text());

	select.append(tag);
	select.children('span').text('');
});
$('.multiSelect > .tag').click(function(e) {
	e.target.parentNode.removeChild(e.target);
});

$('*').not('.multiSelect li, .multiSelect').click(function(e) {
	if ($('.multiSelect').hasClass('open')) {
		$('.multiSelect').removeClass('open');
	}
});






/* Click on File*/
/*$('.file-controls .button').click(editFile);/*function(e) {

	if ($('.ct .files .file.selected').length > 0) {
		$('.pr .files').empty();
		$('.ct .file.selected').each(function(i, el) {
			var img = $(el).children('.file-img').css('background-image');
			var src = img.slice(img.indexOf('img/'), -1);

			var file = document.createElement('div'),
				fileImg = document.createElement('div');

			$(fileImg).addClass('file-img').css("background-image", "url(" + src + ")");
			$(file).addClass('file').append(fileImg);
			$('.pr .files').append(file);
			$('.pr').removeClass('hidden video')
				.addClass('bulk modal');
			$('#wrapper').addClass('overflow');
		});
	} else {
		var img;
		if (e.target.classList.contains('button')) {
			img = e.target.parentNode.parentNode;
		} else if (e.target.classList.contains('file-controls')) {
			img = e.target.parentNode;
		}
		var imgBg = img.style.backgroundImage;
		var file = img.parentNode;
		var src = imgBg.slice(imgBg.indexOf('img/'), -1);
		$('.pr').removeClass('video');
		if (file.classList.contains('video')) {
			$('.pr').addClass('video');
		}
		$('.pr')
			.removeClass('hidden bulk')
			.addClass('modal');
		$('.pr .img > .img-wrapper > img').attr('src', src);
		$('.pr .purpose-img').css("background-image", "url(" + src + ")");
		$('#wrapper').addClass('overflow');
	}
});*/


/*Bulk Edit */
/*$('#bulkEdit').click(editFile);/*function() {
	$('.pr .files').empty();
	$('.ct .file.selected').each(function(i, el) {
		var img = $(el).children('.file-img').css('background-image');
		var src = img.slice(img.indexOf('img/'), -1);

		var file = document.createElement('div'),
			fileImg = document.createElement('div');

		$(fileImg).addClass('file-img').css("background-image", "url(" + src + ")");
		$(file).addClass('file').append(fileImg);
		$('.pr .files').append(file);
		$('.pr').removeClass('hidden video')
			.addClass('bulk modal');
		$('#wrapper').addClass('overflow');
	});
});*/

/*Bulk Remove */
$('#bulkRemove').click(function() {
	$('#deleteFiles').toggleClass('modal hidden');
	$('.ct .file.selected').addClass('sbr');
});

/*Close Delete Prompt */
$('#cancelPrompt').click(function () {
	$('#deleteFiles').toggleClass('modal hidden');
	deselectAll();
});

/* Delete ConfirmationPrompt */
$('#deleteConf').click(function () {
	$('#deleteFiles').toggleClass('modal hidden');

	var filesToBeDeleted = $('.ct .files .file.sbr');
	filesToBeDeleted.each(function(i, el) {
		var fileIndex;
	});

	$('.ct .file.sbr').detach();
	deselectAll();

	if ($('#al')) {
		$('.file .section').each(function(i, el) {
			if ($(el).children('.file').length === 0) {
				$(el).detach();
			}
		});
		if ($('.file .section').length === 1) {
			$('.file .section .section-title').addClass('hidden');
		}
	}
});

/* Bulk Set Use */
$('#bulkSetUse').click(function(e) {
	$(e.target).toggleClass('open');

});
$('#bulkSetUse li').click(function(e) {
	$('#bulkSetUse').removeClass('open');
	$('.ct .file.selected .select').addClass('selected');
	$('.ct .file.selected .select span').text(e.target.innerHTML);
	deselectAll()

});
$('*').not('.bulkSelect, .bulkSelect li').click(function(e) {
	if ($('.bulkSelect').hasClass('open')) {
		$('.bulkSelect').removeClass('open');
	}
});

/* Select All */
$('#selectAll').click(function(e) {
	if ($(e.target).hasClass('all')) {
		deselectAll();
	} else {
		selectAll();
	}
});


/*Close file Preview */
/*$('.pr, .pr > .close, .pr > .controls').click(function() {
	//$('.pr').addClass('willClose');
	//deselectAll();
	$('.modal').addClass('hidden').removeClass('modal');
	$('#wrapper').removeClass('overflow');
});*/
$('.al > .close, .al > .controls, .al .button').click(function() {
	//$('.al').addClass('willClose');
	//deselectAll();
	$('.modal').addClass('hidden').removeClass('modal');
	$('#wrapper').removeClass('overflow');
});

/*Focal Point Edit*/
$('#focalPointToggle').click(function(e) {
	if ($(e.target).hasClass('active')) {
		$('.pr > .preview').removeClass('focal line point');
		$(e.target).removeClass('active');
		e.target.removeAttribute("style");
	} else {
		/*if (!$('.pr > .preview').hasClass('focal')) {
			$('.focalPoint').draggable({ containment: "#previewImg", scroll: false });
		}*/
		$('.pr > .preview').addClass('focal line point');
		$('.pr > .preview').removeClass('rect');
		$('#focalRectToggle').removeClass('active');
		$(e.target).addClass('active');
		$('.focalPoint').draggable({ containment: "#previewImg", scroll: false , stop: dragStop});
		setPurposePagination();
	}
});
function dragStop(e, ui) {
	var img = $('#previewImg'),
		iWidth = img.width(),
		iHeight = img.height(),
		iOffset = img.offset(),

		pWidth = $(e.target).width(),
		pHeight = $(e.target).height(),
		pOffset = $(e.target).offset(),

		fTop = Math.round((pOffset.top - iOffset.top + pHeight/2)*100 / iHeight);
		fLeft = Math.round((pOffset.left - iOffset.left + pWidth/2) * 100 / iWidth);

	//console.log(fTop, fLeft);
	$('.purposes-container .purpose .purpose-img').css('background-position', fLeft.toString() + '% ' + fTop.toString() + '%');
}

/*Previews scroll */
$('#scrollLeft').click(function(e) {
	$('#purposeWrapper').animate( { scrollLeft: '-=460' }, 800);
});
$('#scrollRight').click(function(e) {
	$('#purposeWrapper').animate( { scrollLeft: '+=460' }, 800);
});


/* Handle Purposes scroll */
$('#purposeWrapper').scroll(function() {
	setPurposePagination();
});
/* Init Purpose Paginator */

function setPurposePagination() {
	var scrollOffset = $('#purposeWrapper').scrollLeft();
	var width = document.getElementById('purposeWrapper').getBoundingClientRect().width;
	var firstIndex = Math.floor(scrollOffset/140) + 1;
	var lastIndex = firstIndex + Math.round(width/140) - 1;
	var count = $('#purposeWrapper .purpose').length;

	lastIndex = lastIndex < count ? lastIndex : count;

	$('#p-paginator').text(firstIndex + ' — ' + lastIndex + ' of ' + count);
}

/* Searchfield filter */
$('.filterIcon').click(function(e) {
	e.stopPropagation();
	var searchField = $(e.target).parent();
	searchField.addClass('active');
	searchField.children('.filter').toggleClass('open');
});
$('*').not('.searchField, searchField > input, .filter, .filter > .section, .filter > .section-title, .filter > .section-options, .filter .toggle, .filter label, .filterIcon').click(function(e) {

	e.stopPropagation();
	if (!e.target.classList.contains('toggle') && !e.target.classList.contains('toggle-label') && e.target.id !== 'searchField') {
		$('.searchField').removeClass('active');
		$('.filter').removeClass('open');
	}
});

/* Close Modal Window */
$('.modal').click(function(e) {
	//e.target.classList.add('willClose');
	e.target.classList.remove('modal', 'willClose');
	e.target.classList.add('hidden');
	$('#wrapper').removeClass('overflow');
});
$('.modal > .close').click(function(e) {
	//e.target.parentNode.classList.add('willClose');
	e.target.classList.remove('modal', 'willClose');
	e.target.classList.add('hidden');
	$('#wrapper').removeClass('overflow');
});

document.addEventListener('animationend', function (e) {
	if (e.animationName == "modal-fade-out" && e.target.classList.contains('modal')) {
		e.target.classList.remove('modal', 'willClose');
		e.target.classList.add('hidden');
		$('#wrapper').removeClass('overflow');
	}
});

/*Addable field */
$('.addableField > .add').click(addFiled);
$('.addableField > .remove').click(removeField);
function addFiled(e) {
	var addableField = e.target.parentNode;
	addableField.classList.add('multiple');
	var newField = addableField.cloneNode(true);
	newField.getElementsByTagName('input')[0].value = '';
	addableField.parentNode.appendChild(newField);
	$(newField).children('.add').click(addFiled);
	$(newField).children('.remove').click(removeField);
}
function removeField(e) {
	var section = e.target.parentNode.parentNode;
	section.removeChild(e.target.parentNode);
	var sectionFields = section.getElementsByClassName('addableField');
	if (sectionFields.length <= 1) {
		sectionFields[0].classList.remove('multiple');
	}
}

$('.tabs .nav li').click(function(e) {
	var tabId = $(e.target).attr('data-tab')
	$('.tabs .nav li').removeClass('active');
	$(e.target).addClass('active');
	$(e.target).parent().removeClass('open');
	$('.tabs .nav > .mobileNav').text($(e.target).text().replace(/\d/g, ''));
	$('.tab').removeClass('active');
	$(tabId).addClass('active');
})
$('.tabs .nav > .mobileNav').click(function(e) {
	$(e.target).parent().children('ul').toggleClass('open');
})

/* Radio Toggle */
$('.radioToggle li').click(function(e) {
	$(e.target).parent().children('.active').removeClass('active');
	$(e.target).addClass('active');
	if (e.target.innerHTML === "Web Series") {
		$('#reg-sc-duration, #prog-timeframe').addClass('hidden');
	} else if (e.target.innerHTML === "TV Series") {
		$('#reg-sc-duration, #prog-timeframe').removeClass('hidden');
	}
});

/*Auto resize text area */
//autosize($('textarea'));
//autosize.update($('textarea'));

/* Dashboard */
$('.shortcuts').sortable({
	placeholder: 'placeholder'
});
$('.shortcuts').disableSelection();

$('#dash').sortable({

});
$('#dash').disableSelection();

$('.set').click(function(e) {
	$(e.target).toggleClass('open');
})

$('.pannel .shortcut').draggable({
	connectToSortable: '.shortcuts',
	stop: function( e, ui ) {e.target.removeAttribute("style");}
});
/*$( ".shortcut" ).on( "sortstop", function( event, ui ) {
	e.target.removeAttr('style');
});*/

$('*').not('.pannel, .pannel > .shortcut, .set').click(function() {
	//if (!$(e.target).hasClass('set')) {
		$('.set').removeClass('open');
	//}

});

/* Prompts */
$('#removeDraft').click(function() {
	$('#removeDraftPrompt').toggleClass('modal hidden');
});
$('#removeDraftPrompt .button').click(function() {
	$('#removeDraftPrompt').toggleClass('modal hidden');
});

$('#publishDraft').click(function() {
	$('#publishDraftPrompt').toggleClass('modal hidden');
});
$('#publishDraftPrompt .button').click(function() {
	$('#publishDraftPrompt').toggleClass('modal hidden');
});


$('#cancelChanges').click(function() {
	//handleClosePreview();
	$('#cancelChangesPrompt').toggleClass('modal hidden');
});
$('#cancelChangesPrompt .button.cancel').click(function() {
	$('#cancelChangesPrompt').toggleClass('modal hidden');
});
$('#cancelChangesPrompt .button.ok').click(function() {
	$('#cancelChangesPrompt').toggleClass('modal hidden');
	closeEditScreen();
});


/*Evengt type */
$('#event-type li').click(function(e) {
	if (e.target.innerHTML === "Movie") {
		$('#release-year, #channel-original, #air-times').removeClass('hidden');
	} else {
		$('#release-year, #channel-original, #air-times').addClass('hidden');
	}
});

/* Datapicker */
$('.datapicker').datepicker();
$('.ct .section-files').sortable({
	placeholder: 'file__placeholder',
	cursor: '-webkit-grabbing',
	helper: 'clone',
	opacity: 0.5
});

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

/*Quick Edit File Title and Info */
function editFileTitle(e) {
	if (!$('.al').hasClass('modal')) {
		var fileInfo = e.target;
		var fileInfoText = fileInfo.innerHTML;
		var input = document.createElement('input');
		input.type = 'text';
		input.value = fileInfoText;

		input.addEventListener('blur', function(e) {
			var input = e.target;
			fileInfo = input.parentNode;
			fileInfo.removeChild(input);
			fileInfo.classList.remove('edit');
			fileInfo.innerHTML = input.value;
		});
		input.addEventListener('keypress', function(e) {
			if (e.keyCode == 13 || e.which == 13) {
				var input = e.target;
			fileInfo = input.parentNode;
			fileInfo.removeChild(input);
			fileInfo.classList.remove('edit');
			fileInfo.innerHTML = input.value;
			}
		});

		fileInfo.innerHTML = '';
		fileInfo.appendChild(input);
		fileInfo.classList.add('edit');
		input.focus();
	}
}
function editFileCaption(e) {
	if (!$('.al').hasClass('modal')) {
		var fileInfo = e.target;
		var fileInfoText = fileInfo.innerHTML;
		var input = document.createElement('textarea');
		//input.type = 'text'
		input.value = fileInfoText;

		input.addEventListener('blur', function(e) {
			var input = e.target;
			fileInfo = input.parentNode;
			fileInfo.removeChild(input);
			fileInfo.classList.remove('edit');
			fileInfo.innerHTML = input.value;
		});
		input.addEventListener('keypress', function(e) {
			if (e.keyCode == 13 || e.which == 13) {
				var input = e.target;
			fileInfo = input.parentNode;
			fileInfo.removeChild(input);
			fileInfo.classList.remove('edit');
			fileInfo.innerHTML = input.value;
			}

		});

		fileInfo.innerHTML = '';
		fileInfo.appendChild(input);
		fileInfo.classList.add('edit');
		input.focus();
	}
}

/* File Delete */
function deleteFile(e) {
    $(e.target).parents('.file').addClass('sbr');
    $('.ct .file.selected').addClass('sbr');
    $('#deleteFiles').toggleClass('modal hidden');
}


$('.file-title').click(editFileTitle);
$('.file-caption').click(editFileCaption);

$('.file .close, .file__delete').click(deleteFile);

$('.file-controls, .file__controls').click(toggleFileSelect);
$('.file-controls .checkmark, .file__checkmark').click(toggleFileSelect);

$('.al .file-img, .al .file-title').click(function (e) {
	if ($('.al').hasClass('modal')) {
		e.target.parentNode.classList.toggle('selected');
	}
});

function editFile(e) {
	e.stopPropagation();
	var filesToBeEdit = $('.ct .files .file.selected');
	if (e) {
		if ($(e.target).parents('.file')) {filesToBeEdit = filesToBeEdit.add($(e.target).parents('.file'));}
	}
	if (filesToBeEdit.length > 1) {
		openMultiEdit(filesToBeEdit);
	} else if (filesToBeEdit.length === 1){
		openSingleEdit(filesToBeEdit.first());
	}
}
function bulkEdit(e) {
	var filesToBeEdit = $('.ct .files .file.selected');
	openBulkEdit(filesToBeEdit);
}
function multiEdit(e) {
	var filesToBeEdit = $('.ct .files .file').filter('.selected');
	console.log(filesToBeEdit);
	openMultiEdit(filesToBeEdit);
}
function openSingleEdit(file) {
	$('.pr').removeClass('hidden bulk video')
			.addClass('modal');

	if (file.hasClass('video')) {
		$('.pr').addClass('video');
	}

	var srcString = file.children('.file-img').css('background-image'), src;
	if (srcString) {
		if (srcString.indexOf('img/') > 0) {src = srcString.slice(srcString.indexOf('img/'), -1);}
		else if (srcString.indexOf('url(') >= 0) {src = srcString.slice(4, -1);}
		else {src = srcString;}

		$('.pr .img > .img-wrapper > img').attr('src', src);
		$('.pr .purpose-img').css("background-image", srcString);

	} else {
		var bgColor = file.children('.file__img').css('background-color');
		console.log(bgColor);
		$('.pr .img > .img-wrapper > img')
			.css('width', '1200px')
			.css('height', '980px')
			.css('background-color', bgColor);
		$('.pr .purpose-img').css("background-color", bgColor);
	}

	$('.images').addClass('hidden');

	$('.pr .preview').removeClass('preview_style_multi hidden');
	$('.pr .ip').removeClass('ip_style_multi');

	$('#saveChanges').text('Save');
	$('#ip__title').addClass('hidden');

	$('#wrapper').addClass('overflow');
}
function openBulkEdit(files) {
	var imgContainer = $('.pr .images__container');
	imgContainer.empty();
	files.each(function(i, el) {
		var img = $(el).children('.file-img').css('background-image');
		image = $('<div></div>')
				.addClass('image image_style_bulk')
				.css('background-image', img)
				.css('pointer-events', 'none')
				.css('cursor', 'default');
		imgContainer.append(image);
	});

	$('.pr').removeClass('hidden video')
			.addClass('modal');
	$('.pr .preview').addClass('hidden');

	$('.pr .images').addClass('images_style_bulk')
					.removeClass('images_style_multi hidden');

	$('#saveChanges').text('Save All');
	$('#ip__title').text('Bulk Image Metadata').removeClass('hidden');
	$('#imageTittleField').addClass('hidden');
	$('.pr .ip').removeClass('ip_style_multi');
	$('#wrapper').addClass('overflow');
}
function openMultiEdit(files) {
	console.log(files);
	var imgContainer = $('.pr .images__container');
	imgContainer.empty();
	files.each(function(i, el) {
		//var img = $(el).children('.file-img').css('background-image'),
		var	bgColor = $(el).children('.file__img').css('background-color');
		var	image = $('<div></div>').addClass('image image_style_multi').click(switchImage);

		/*if (img) {
			image.css('background-image', img);
		} else {*/
		image.css('background-color', bgColor);
		//}
		imgContainer.append(image);
	});

	var firstImage = $('.images__container .image').first();

	firstImage.addClass('image_active');

	/*var srcString = firstImage.css('background-image'), src;
	if (srcString) {
		if (srcString.indexOf('img/') > 0) {src = srcString.slice(srcString.indexOf('img/'), -1);}
		else if (srcString.indexOf('url(') >= 0) {src = srcString.slice(4, -1);}
		else {src = srcString;}

		$('.pr .img > .img-wrapper > img').attr('src', src);
		$('.pr .purpose-img').css("background-image", srcString);

	} else {*/
		var bgColor = firstImage.css('background-color');
		//console.log(firstImage, bgColor);
		$('.pr .img > .img-wrapper > img')
			.css('width', '900px')
			.css('height', '800px')
			.css('background-color', bgColor)
			.attr('src', '');
		$('.pr .purpose-img').css('background-color', bgColor).css('background-image', 'none');
	//}


	$('.pr .preview').removeClass('hidden').addClass('preview_style_multi');
	$('.pr .ip').addClass('ip_style_multi');

	/*$('.pr .img > .img-wrapper > img').attr('src', src);
	$('.pr .purpose-img').css("background-image", srcString);*/

	$('.pr .images').addClass('images_style_multi')
					.removeClass('images_style_bulk hidden');


	$('#images__wrapper').scrollLeft(0);

	if ($('.pr > .preview').hasClass('rect')) {
		adjustRect($('.purposes-container .purpose-img').first());
	}

	$('.images__scroll-left').click(function(e) {
		$('#images__wrapper').animate( { scrollLeft: '-=460' }, 800);
	});
	$('.images__scroll-right').click(function(e) {
		$('#images__wrapper').animate( { scrollLeft: '+=460' }, 800);
	});

	$('.pr').removeClass('hidden video')
			.addClass('modal');
	$('#saveChanges').text('Save All');
	$('#ip__title').addClass('hidden');
	$('#imageTittleField').removeClass('hidden');
	$('#wrapper').addClass('overflow');

	var imagesWrapperWidth = $('.images__wrapper').width();
		imagesWidth = $('.images__container .image').length * 120;
		console.log(imagesWrapperWidth, imagesWidth);
	if (imagesWrapperWidth > imagesWidth) {
		$('.images__scroll-left, .images__scroll-right').css('visibility', 'hidden');
	} else {
		$('.images__container').css('width', imagesWidth.toString() + 'px');
		$('.images__scroll-left, .images__scroll-right').css('visibility', 'visible');
	}
}

function switchImage(e) {
	$('.image').removeClass('image_active');
	$(e.target).addClass('image_active');

	var bgColor = $(e.target).css('background-color');
	/*var srcString = $(e.target).css('background-image'), src;
	if (srcString.indexOf('img/') > 0) {src = srcString.slice(srcString.indexOf('img/'), -1);}
	else if (srcString.indexOf('url(') >= 0) {src = srcString.slice(4, -1);}
	else {src = srcString;}*/

	$('.pr .img > .img-wrapper > img').css('background-color', bgColor);
	$('.pr .purpose-img').css('background-color', bgColor);
	$('.pr .ip').addClass('ip_style_multi');
	adjustRect($('.purposes-container .purpose-img').first());
	$('#purposeWrapper').animate( { scrollLeft: '0' }, 800);
}

$('.file-controls .button, .file__controls .button').click(editFile);
$('#bulkEdit').click(bulkEdit);
$('#multiEdit').click(multiEdit);

$('#saveChanges').click(function() {
	emptyFields = checkFields();
	console.log(emptyFields);
	if (emptyFields) {
		closeEditScreen();
	}
});
/*$('#saveChangesPrompt .button').click(function() {
	$('#saveChangesPrompt').toggleClass('modal hidden');
	closeEditScreen();
});*/


function handleFiles(files) {
	var filesOutput = [];
	if (files && files.length >0) {
		for (var i=0; i< files.length; i++) {
			filesOutput.push(files[i]);
		}
		var uploadedFiles = filesOutput.map(function(f) {
			return fileToObject(f).then(function(res) {
				galleryObjects.push(res);
			});

			/*return fileToMarkup(f).then(function(res) {
				res.addClass('selected');
				if ($('#justUploaded .section-files').length > 0) {
					$('#justUploaded .section-files').prepend(res);
				} else if ($('.section-files').length > 0) {
					$('.section-files').first().prepend(res);
				}
			});*/
		});
		Promise.all(uploadedFiles).then(updateGallery);
		/*
		if (uploadedFiles.length === 1) {Promise.all(uploadedFiles).then(updateGallery);}
		else {
			//Promise.all(uploadedFiles).then(multiEdit);
		}*/
	}
}

//COnvert uploaded files to elements
function fileToMarkup(file) {
	return readFile(file).then(function(result) {
		var fileNode = $('<div></div>').addClass('file'),

			fileImg = $('<div></div>').addClass('file-img').css('background-image', 'url(' + result.src + ')'),

			fileControls = $('<div></div>').addClass('file-controls').click(toggleFileSelect),
			checkmark = $('<div></div>').addClass('checkmark').click(toggleFileSelect),
			close = $('<div></div>').addClass('close').click(deleteFile),
			edit = $('<button>Edit</button>').addClass('button whiteOutline').click(editFile),

			fileTitle = $('<div></div>').addClass('file__title'),
			fileTypeIcon = $('<i class="fa fa-camera"></i>').css('margin-right', '2px'),
			fileTitleInput = $('<input type="text" />').val(result.name),

			/*<div class="file__title">
				<i class="fa fa-camera"></i>
				<input type="text" value="Blindspot S03 Promo" />
			</div>*/
			fileCaption = $('<div></div>').addClass('file-caption').text(result.name).click(editFileCaption),
			fileInfo = $('<div></div>').addClass('file-info').text(result.info),

			filePurpose = $('<div></div>').addClass('file-purpose'),
			filePurposeSelect = $('<div></div>').addClass('select').click(openSelect),
			selectSpan = $('<span>Select use</span>'),
			selectUl = $('<ul></ul>'),
			selectLi1 = $('<li>Cover</li>').click(setSelect),
			selectLi2 = $('<li>Primary</li>').click(setSelect),
			selectLi3 = $('<li>Secondary</li>').click(setSelect);

		fileTitle.append(fileTypeIcon, fileTitleInput);
		selectUl.append(selectLi1, selectLi2, selectLi3);
		filePurposeSelect.append(selectSpan, selectUl);

		filePurpose.append(filePurposeSelect);
		fileControls.append(checkmark, close, edit);
		fileImg.append(fileControls);

		fileNode.append(fileImg, fileTitle, fileCaption, fileInfo, filePurpose);

		return fileNode;
	});
}

//Convert uploaded file to object
function fileToObject(file) {
	return readFile(file).then(function(result) {
		return {
	        url: result.src,
	        focalPoint: {
	            left: 0.5,
	            top: 0.5
	        },
	        color: fileImgColors[Math.floor(Math.random()*fileImgColors.length)],
	        title: result.name,
	        caption: result.name,
	        description: '',
	        highResolution: false,
	        categories: '',
	        tags: '',
	        altText: '',
	        credit: '',
	        copyright: '',
	        reference: {
	            series: '',
	            season: '',
	            episode: ''
	        },
			justUploaded: true
	    };
	});
}



function appendFile(file) {

}

function readFile(file) {
	return new Promise(
		function(res, rej) {
			var reader = new FileReader();
			reader.onload = function(e) {
				res({src: e.target.result,
					name: file.name,
					info: file.type + ', ' + Math.round(file.size/1024).toString() + ' Kb'});
			},
			reader.onerror = function() {
				rej(this);
			},
			reader.readAsDataURL(file)
		}
	);
}
/*
function appenFile(fileSrc) {
	$('#justUploaded .section-files').append(createFile(fileSrc));
}
function createFile(fileSrc) {
	console.log(fileSrc);
	var file = $('<div></div>').addClass('file'),
		//fileImg = document.createElement('div');
		///fileImg.classList.add('file-img');
		//fileImg.style.backgroundImage = fileSrc.src,
		//img = document.createElement('img'),
		//img.src = fileSrc.src
		fileImg = $('<div></div>').addClass('file-img').css('background-image', 'url(' + fileSrc.src + ')'),
		fileTitle = $('<div></div>').addClass('file-title').text(fileSrc.name),
		fileInfo = $('<div></div>').addClass('file-info');

	console.log(fileImg);
	file.append(fileImg, fileTitle, fileInfo);
	console.log(file, $('#justUploaded .section-files'));
	$('#justUploaded .section-files').append(file);
	console.log(file, $('#justUploaded .section-files'));

}*/


function adjustRect(el) {
	var imgWidth = $('#previewImg').width(),
		imgHeight = $('#previewImg').height(),
		imgOffset = $('#previewImg').offset(),
		imgRatio = imgWidth/imgHeight,

		elH = el.outerHeight(),
		elW = el.outerWidth(),
		elO = el.offset(),
		elRatio = elW/elH,
		elBackgroundPosition = el.css('background-position').split(' ');

	console.log(elH, elW, elBackgroundPosition);

	rHeight = imgRatio > elRatio ? imgHeight : imgWidth/elRatio;
	rWidth = imgRatio > elRatio ? imgHeight * elRatio : imgWidth;
	rOffset = {
		left: 0,
		top: 0
	}

	if (elBackgroundPosition.length === 2) {
		if (elBackgroundPosition[0].indexOf('%')) {
			var bgLeftPersent = elBackgroundPosition[0].slice(0,-1)
				bgLeftPixel = Math.round(imgWidth * bgLeftPersent/100) - rWidth/2;

			console.log(elBackgroundPosition[0], bgLeftPersent, bgLeftPixel, imgWidth, (bgLeftPixel + rWidth));

			if ((bgLeftPixel) < 0) {bgLeftPixel = 0;}
			if ((bgLeftPixel + rWidth) > imgWidth) {bgLeftPixel = imgWidth - rWidth;}

			console.log(bgLeftPixel, imgWidth, (bgLeftPixel + rWidth/2));

			rOffset.left = imgRatio > elRatio ? bgLeftPixel : 0;
		}
		if (elBackgroundPosition[1].indexOf('%')) {
			var bgTopPersent = elBackgroundPosition[1].slice(0,-1)
				bgTopPixel = Math.round(imgHeight*bgTopPersent/100) - rHeight/2;

			if ((bgTopPixel) < 0) {bgTopPixel = 0;}
			if ((bgTopPixel + rHeight) > imgHeight) {bgTopPixel = imgHeight - rHeight;}

			rOffset.top = imgRatio > elRatio ? 0 : bgTopPixel;
		}
	}

	$('.focalRect').removeAttr('style');

	$('.focalRect').css('width', rWidth.toString() + 'px')
							   .css('height', rHeight.toString() + 'px')
							   .css('left', rOffset.left.toString() + 'px')
							   .css('top', rOffset.top.toString() + 'px')
							   .draggable({
							   		axis: imgRatio > elRatio ? 'x' : 'y',
							   		start: function(e, ui) {
								    	el.css('transition', 'none');
								    },
							   		stop: function(e, ui) {
							   			el.css('transition', '0.3s ease-out');
								        adjustPurpose($(e.target), el);
								    }
							   	});

	$('.purposes-container .purpose').removeClass('active');
	el.parent().addClass('active');


}
function adjustPurpose(focalItem, purposeImg) {

		var img = $('#previewImg'),
		iWidth = img.width(),
		iHeight = img.height(),
		iOffset = img.offset(),

		pWidth = focalItem.outerWidth(),
		pHeight = focalItem.outerHeight(),
		pOffset = focalItem.offset(),

		fTop = Math.round((pOffset.top - iOffset.top + pHeight/2)*100 / iHeight);
		fLeft = Math.round((pOffset.left - iOffset.left + pWidth/2) * 100 / iWidth);

	//console.log(fTop, fLeft);
	if (purposeImg) {
		purposeImg.css('background-position', fLeft.toString() + '% ' + fTop.toString() + '%');
	}
	else {
		$('.purposes-container .purpose .purpose-img').css('background-position', fLeft.toString() + '% ' + fTop.toString() + '%');
	}

}

$('#focalRectToggle').click(function(e) {
	if ($(e.target).hasClass('active')) {
		$('.pr > .preview').removeClass('focal line rect');
		$(e.target).removeClass('active');
	} else {
		$('.pr > .preview').addClass('focal line rect');
		$('.pr > .preview').removeClass('point');
		$('#focalPointToggle').removeClass('active');
		$(e.target).addClass('active');


		//$('.focalRect').resizable({handles: "all", containment: "#previewImg"});
		adjustRect($('.purposes-container .purpose-img').first());
		$('.focalRect').draggable({ containment: "#previewImg", scroll: false });

		$('.purposes-container .purpose-img').unbind().click(function(e) {
			adjustRect($(e.target));
		})
		//$('.img-wrapper').css('max-width', '90%');
		setPurposePagination();
	}
});

var originalDivStyle, originalImgStyle, imageRatio;

/*Bulk Delete - which used to be bulkRemove */
$('#bulkDelete').click(function() {
	//if ($('#al')) {
		$('#deleteFiles').toggleClass('modal hidden');
		$('.ct .file.selected').addClass('sbr');
	
});
/* Click on Add Styles */
$('#addStyles').click(function(e) {
	$('#as').removeClass('hidden');
	$('#as').addClass('modal'); //as
	$('#wrapper').addClass('overflow');
	$('.effect').detach();
	$('#viewAll').addClass('hidden');
	updateFilters();
});
/* Close Add Styles */
$('.as > .close, .as > .controls, .as > .controls .button').click(function() {
	$('.as').addClass('willClose');
	$('.ct .selected').removeClass('selected');
	$('#selectAll').addClass('empty').removeClass('all');
});


function transformDiv(el, filters) {
	var div = document.getElementById(el.attr('id')),
		img = div.getElementsByTagName('img')[0],
		im = $(img);


	console.log(img, i, imgWidth, imgHeight);

	


	if (!originalDivStyle) {
		originalDivStyle = div.style;
	} else {
		div.style = originalDivStyle;
	}
	if (!originalImgStyle) {
		originalImgStyle = img.style;
	} else {
		img.style = originalImgStyle;
	}
	el.removeAttr('style');
	im.removeAttr('style');
	
	var imgWidth = img.clientWidth,//getBoundingClientRect.width;
		imgHeight = img.clientHeight;//getBoundingClientRect.height;
		//imageRatio = imgWidth/imgHeight;

	//console.log(el.attr('style'), originalStyle);
	for (var i=0; i< filters.length; i++) {
		var filter = filters[i];

		switch(filter.name) {
			case 'desaturate':
				im.css('-webkit-filter', 'grayscale(' + filter.value.saturation/100 + ')');
				break;

			case 'scale':
				im.css('width', filter.value.width);
				im.css('height', filter.value.height);
				if (!filter.value.ratio) {
					el.css('background-size', '100% 100%');
				}				
				break;

			case 'crop':
				var w = el.width(),
					h = el.height(),
					size = w.toString() + 'px ' + h.toString()+ 'px';
				el.css('width', filter.value.width);
				el.css('height', filter.value.height);
				el.css('background-position', 'center');
				el.css('background-size', size);
				im.css('max-height', 'none');
				im.css('max-width', 'none');
				im.css('height', imgHeight);
				im.css('width', imgWidth);
				break;

			case 'rotate': {
				el.css('transform', 'rotate(' + filter.value.angle + 'deg)');
				if (filter.value.random && !filter.value.angle) {
					el.css('transform', 'rotate(' + (Math.random()*10 - 5) + 'deg)');
				}
				break;
			}
				

		}
	}
}
function disableFilter(e) {
	$(e.target).parent().parent().toggleClass('disabled');
	console.log($('.effect .switch:checked').length, $('.effect .switch').length);
	if ($('.effect .switch:checked').length === 0) {
		$('#viewAllToggle').prop('checked', false);
	}
	if ($('.effect .switch:checked').length === $('.effect .switch').length) {
		$('#viewAllToggle').prop('checked', true);
	}
	updateFilters();
}

function updateFilters(e) {

	var filters = [];
	//$('.filter').each()
	$.each($('.effect').not('.hidden, .disabled'), function(i, el) {
		var filter = {};
		filter.name = el.getElementsByClassName('title')[0].innerHTML.toLowerCase();

		filter.value = {};
		var inputs = el.getElementsByClassName('values')[0].getElementsByTagName('input');
		for (var i = 0; i<inputs.length; i++) {
			var input = inputs[i];
			var inputName = input.id.split('-')[1];
			filter.value[inputName] = parseFloat(input.value.split(' ')[0]);
			console.log(filter);
		}

		filters.push(filter);
		console.log(el, $(el).children('.title'), filter, filters);
	});
	transformDiv($('#img'), filters);

	/*if (e.target) {
		var type = e.target.id.split('-')[1];

		switch(type) {
			case 'width':
				console.log(e.target.value);
				e.target.value = e.target.value.toString() + ' px';
				console.log(e.target.value);
				break;
		}
	}*/
}
//$('.filter input').change(updateFilters);
function handleStartEditing(e) {
	console.log(e.target);
	if (e.target.type === 'text') {
		e.target.value = e.target.value.split(' ')[0];
		e.target.type = 'number';
	}
}
function handleEndEditing(e) {
	var type = e.target.id.split('-')[1];
	console.log(e.target.type, e.target.value, type);
	e.target.type='text';
	console.log(e.target.type, e.target.value, type);
	if (e.target.value) {
		switch (type) {
			case 'width':
				e.target.value = e.target.value + ' px';
				break;

			case 'height':
				e.target.value = e.target.value + ' px';
				break;

			case 'saturation':
				e.target.value = e.target.value + ' %';
				break;

			case 'angle':
				e.target.value = e.target.value + ' °';
				break;
		}
	}	
}
function handleEditing(e) {
	var ratio = e.target.parentNode.getElementsByClassName('ratio')[0],
		targetType = e.target.id.split('-')[1],
		targetId = e.target.id.split('-'),
		otherField, id;

	if (ratio.checked && imageRatio) {

		if (targetType === 'width') {
			id = targetId[0] + '-height-' + targetId[2];
			otherField = document.getElementById(id);
			otherField.value = Math.round(e.target.value / imageRatio).toString() + ' px';
		}
		else if (targetType === 'height') {
			id = targetId[0] + '-width-' + targetId[2];
			otherField = document.getElementById(id);
			otherField.value = Math.round(e.target.value * imageRatio).toString() + ' px';
		}
	}
	updateFilters(e);
}
function handleRatioToggle(e) {
	var image = document.getElementById('img').getElementsByTagName('img')[0];
		imageRatio = image.offsetWidth/image.offsetHeight;
}


/* when you select an effect, it's going to be replaced with another set of input fields */
$('#addEffect').click(function(e) {
	$(e.target).parent().addClass('open');
});
$('#select_new_effect li').click(function(e) {
	var select = $(e.target).parent().parent(),
		item = $(e.target),
		spanString = select.children('span').text();

	if (!imageRatio) {
		var image = document.getElementById('img').getElementsByTagName('img')[0];
		imageRatio = image.offsetWidth/image.offsetHeight;
	}

	select.removeClass('open');
	$('#viewAll').removeClass('hidden');

	var title = $('<div></div>').addClass('title').text(item.text()).click(collapsePannel),
		toggle = $('<input type="checkbox" checked/>').addClass('switch').change(disableFilter),
		close = $('<div></div>').addClass('close').click(removeEffect),
		header = $('<div></div>').addClass('header').append(toggle, title, close).click(collapsePannel),
		values = $('<div></div>').addClass('values')
		filter = $('<div></div>').addClass('effect open').append(header, values);

		fCount = $('.effect').length + 1;

		switch(item.text().toLowerCase()) {

			case 'desaturate': {
				var saturation = $('<input type="number"/>')
							.attr('id', item.text().toLowerCase() + '-saturation-' + fCount)
							.attr('placeholder', 'Desaturation, %')
							.css('width', 'calc(60% - 25px)')
							.css('margin-right', '10px')
							.on('input', updateFilters)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing);

				values.append(saturation);
				break;
			}

			case 'resize': {
				var width = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-width-' + fCount)
							.attr('placeholder', 'Width')
							.css('width', 'calc(50% - 30px)')
							.css('margin-right', '23px')
							.on('input', handleEditing)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					height = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-height-' + fCount)
							.attr('placeholder', 'Height')
							.css('width', 'calc(50% - 30px)')
							.on('input', handleEditing)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					ratio = $('<input type="checkbox" tabindex="-1"/>')
							.attr('id', item.text().toLowerCase() + '-ratio-' + fCount)
							.addClass('ratio')
							.change(handleRatioToggle);

				values.append(width, ratio, height);
				break;
			}				

			case 'crop': {
				var width = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-width-' + fCount)
							.attr('placeholder', 'Width')
							.css('width', 'calc(50% - 30px)')
							.css('margin-right', '23px')
							.on('input', handleEditing)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					height = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-height-' + fCount)
							.attr('placeholder', 'Height')
							.css('width', 'calc(50% - 30px)')
							.on('input', handleEditing)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					ratio = $('<input type="checkbox" tabindex="-1"/>')
							.attr('id', item.text().toLowerCase() + '-ratio-' + fCount)
							.addClass('ratio')
							.change(handleRatioToggle);

				values.append(width, ratio, height);
				break;
			}
			case 'scale': {
				var width = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-width-' + fCount)
							.attr('placeholder', 'Width')
							.css('width', 'calc(50% - 30px)')
							.css('margin-right', '23px')
							.on('input', handleEditing)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					height = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-height-' + fCount)
							.attr('placeholder', 'Height')
							.css('width', 'calc(50% - 30px)')
							.on('input', handleEditing)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					ratio = $('<input type="checkbox" tabindex="-1"/>')
							.attr('id', item.text().toLowerCase() + '-ratio-' + fCount)
							.addClass('ratio')
							.change(handleRatioToggle);

				values.append(width, ratio, height);
				break;
			}

			case 'rotate': {
				var angle = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-angle-' + fCount)
							.attr('placeholder', 'Angle, deg')
							.css('width', 'calc(50% - 25px)')
							.css('margin-right', '10px')
							.on('input', updateFilters)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing),

					random = $('<input type="checkbox"/>')
							.attr('id', item.text().toLowerCase() + '-random-' + fCount)
							.change(updateFilters);

				values.append(angle);
				break;
			}
		}

		$('#effect_list').append(filter);
});
$('#effect_list').sortable();

$('*').not('.select_effect li, .select_effect, .select_effect .button').click(function(e) {
	if ($('.select_effect').hasClass('open')) {
		$('.select_effect').removeClass('open');
	}	
});

/* Remove Effect */
function removeEffect(e) {
	$(e.target).parent().parent().remove();
	updateFilters();
}

/* effect all button controls all the buttons */
$('#viewAllToggle').change(function(e) {
	$('.effect .header .switch').prop('checked', e.target.checked);
	if (e.target.checked) {$('.effect').removeClass('disabled');}
	else {$('.effect').addClass('disabled');}
	updateFilters();
});

$('.purpose .close').click(function(e) {

	if ($('.ct .purpose.selected').length > 0) {
		$('#deleteFiles').toggleClass('modal hidden');
		$('.ct .purpose.selected').addClass('sbr');
	} else {
		$('#deleteFiles').toggleClass('modal hidden');
		e.target.parentNode.parentNode.parentNode.classList.add('sbr');
	}
});
$('.purpose-controls').click(function(e) {
	e.target.parentNode.parentNode.classList.toggle('selected');
	if ($('.ct .purpose.selected').length === $('.ct .purpose').length) {
		$('#selectAll').toggleClass('all empty');
	} else if ($('.ct .purpose.selected').length > 0 && $('.ct .purpose.selected').length !== $('.ct .purpose')) {
		$('#selectAll').removeClass('all empty');
	} else if ($('.ct .purpose.selected').length === 0) {
		$('#selectAll').addClass('empty');
	}
});

/* Effect pane */
function collapsePannel(e) {
	if ($(e.target).hasClass('title')) {
		$(e.target).parent().parent().toggleClass('open');
	} else {
		$(e.target).parent().toggleClass('open');
	}
}

function closeEditScreen() {
    $('.pr').removeClass('modal').addClass('hidden');
	$('.pr .preview').removeClass('focal line full rect point');
	$('.focalPoint').removeAttr('style');
	$('.focalRect').removeAttr('style');
	$('#focalPointToggle').removeClass('active');
	$('#focalRectToggle').removeClass('active');
	$('.purposes-container .purpose .purpose-img').removeAttr('style');
	$('.ct .file').find('button').css('display', '');
	//deselectAll();
	$('#wrapper').removeClass('overflow');
}

/*var jArray= <?php echo json_encode(array(
    'label' => 'New style',
    'effects' => array(
      1 => array(
        'name' => 'image_crop',
        'data' => array(
          'width' => 300,
          'height' => 400,
          'anchor' => 'left-top',
        ),
        'weight' => 1,
      ),
      2 => array(
        'name' => 'image_desaturate',
        'data' => array(),
        'weight' => 2,
      ),
      3 => array(
        'name' => 'image_resize',
        'data' => array(
          'width' => 200,
          'height' => 200,
        ),
        'weight' => 3,
      ),
      4 => array(
        'name' => 'image_scale',
        'data' => array(
          'width' => 180,
          'height' => 180,
          'upscale' => 0,
        ),
        'weight' => 4,
      ),
      5 => array(
        'name' => 'image_scale_and_crop',
        'data' => array(
          'width' => 150,
          'height' => 100,
        ),
        'weight' => 5,
      ),
    ),
  )); ?>

  console.log(jArray);*/
$('#purposeToggle').click(function(e) {
	if ($(e.target).children('span').text() === ' View all') {
		showAllPreviews();
	} else {
		collapseAllPreviews();
	}
});

$('#showPreview').click(showAllPreviews);

function showAllPreviews() {
    $('.preview.focal').addClass('full').removeClass('line');
    $('#purposeToggle').children('span').text(' Collapse');
    $('#purposeToggle').children('.fa').addClass('fa-arrow-down').removeClass('fa-arrow-up');
    $('.purposes .purpose-img').unbind('click').click(handlePurposeClick);
    scrollPosition = $('#purposeWrapper').scrollLeft();

}

function collapseAllPreviews() {
    $('.preview.focal').addClass('line').removeClass('full');
    $('#purposeToggle').children('span').text(' View all');
    $('#purposeToggle').children('.fa').addClass('fa-arrow-up').removeClass('fa-arrow-down');
    $('.purposes .purpose-img').unbind('click').click(function(e) {
        adjustRect($(e.target));
    });
}

/* Click on Purpose */
function handlePurposeClick(e) {
	console.log(scrollPosition);
	var purpose = $(e.target).parent(),
		purposeWrapper = $('#purposeWrapper');

	var index = purpose.parent().children('.purpose').index(purpose),
		scrollOffset = index * 140;

	var scrollDelta = scrollOffset - scrollPosition,
		sds = scrollDelta > 0 ? '+=' + scrollDelta : '-=' + Math.abs(scrollDelta);

		console.log(sds);

	$('.preview.focal').toggleClass('line full');
	$('#purposeWrapper').scrollLeft(scrollPosition);
	$('#purposeToggle').children('.fa').toggleClass('fa-arrow-up fa-arrow-down');
	$('#purposeToggle').children('span').text(' View all');
	$('#purposeWrapper').animate( { scrollLeft: scrollOffset }, 600);
    $('.purposes-container .purpose').removeClass('active');
    purpose.addClass('active');
    $('.purposes .purpose-img').unbind().click(function(e) {
        adjustRect($(e.target));
    })
}

function checkField(field) {
    if ($(field).val() === '') {
        return false;}
    return true;
}
function markFieldAsRequired(field) {
    $(field).addClass('emptyField');
    if ($(field).parent().children('.errMsg').length === 0) {
        var msg = $('<div></div>').addClass('errMsg').text("This field couldn't be empty");
        $(field).parent().append(msg);
    }
}
function markFieldAsNormal(field) {
    $(field).removeClass('emptyField');
    $(field).parent().children('.errMsg').remove();
}

function checkFields() {
    var fields = $('label.requiered').parent().children('input');
    var result = true;
    var firstIndex = -1;
    fields.each(function(index, el) {
        console.log(el);
        if (checkField(el)) {
            markFieldAsNormal(el);
        } else {
            markFieldAsRequired(el);
            result = false;
            if (firstIndex < 0) {
                firstIndex = index;
                el.focus();
            }
        }
    });

    return result;
}

$('label.requiered').parent().children('input').on('blur', function(e) {
    if (checkField(e.target)) {
        markFieldAsNormal(e.target);
    } else {
        markFieldAsRequired(e.target);
    }
});


function toggleFileSelect(e) {
	$(e.target).parents('.file').toggleClass('selected');
	normalizeSelecteion();
}
function normalizeSelecteion() {
	if ($('.ct .file.selected').length === $('.ct .file').length) {
		$('#selectAll').removeClass('empty').addClass('all');
	} else if ($('.ct .file.selected').length > 0) {
		$('#selectAll').removeClass('empty all');
	} else if ($('.ct .file.selected').length === 0) {
		$('#selectAll').removeClass('all').addClass('empty');
	}

	if ($('.ct .files .file.selected').length === 0) {
		$('.ct .file').find('.button').css('display', '');
		$('.tabs .tab.active .controls #bulkEdit, .tabs .tab.active .controls #multiEdit, .tabs .tab.active .controls #bulkRemove')
		  	.css('opacity', 0.40)
			.css('pointer-events', 'none');
	} else if ($('.ct .files .file.selected').length === 1) {
		$('.ct .file').find('.button').css('display', 'none');
		$('.ct .file.selected').first().find('button').css('display', '');
		$('.tabs .tab.active .controls #bulkEdit, .tabs .tab.active .controls #multiEdit')
		  	.css('opacity', 0.40)
			.css('pointer-events', 'none');
			$('.tabs .tab.active .controls #bulkRemove')
			  	.css('opacity', '')
				.css('pointer-events', '');
	} else if ($('.ct .files .file.selected').length > 1) {
		$('.ct .file').find('.button').css('display', 'none');
		$('.tabs .tab.active .controls #bulkEdit, .tabs .tab.active .controls #multiEdit')
		  	.css('opacity', '')
			.css('pointer-events', '');
	}
}
function selectAll() {
	$('.ct .file').addClass('selected');
	$('#selectAll').addClass('all').removeClass('empty');
}

function deselectAll() {
	$('.ct .file.selected').removeClass('selected');
	$('#selectAll').addClass('empty').removeClass('all');
}

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

var showList = [
    'Alcatraz',
    'Alcatraz S01',
    'Alcatraz S01 E01',
    'Alcatraz S01 E02',
    'Alcatraz S01 E03',
    'Alcatraz S01 E04',
    'Alcatraz S01 E05',
    'Alcatraz S01 E06',
    'Alcatraz S01 E07',
    'Alcatraz S01 E08',
    'Alcatraz S01 E09',
    'Alcatraz S01 E10',
    'Alcatraz S01 E11',
    'Alcatraz S01 E12',
    'Alcatraz S01 E13',
    'Alcatraz S01 E14',
    'Alcatraz S01 E15',
    'Alcatraz S01 E16',
    'Alcatraz S01 E17',
    'Alcatraz S01 E18',
    'Alcatraz S01 E19',
    'Alcatraz S01 E20',

    'Blindspot',
    'Blindspot S01',
    'Blindspot S01 E01',
    'Blindspot S01 E02',
    'Blindspot S01 E03',
    'Blindspot S01 E04',
    'Blindspot S01 E05',
    'Blindspot S01 E06',
    'Blindspot S01 E07',
    'Blindspot S01 E08',
    'Blindspot S01 E09',
    'Blindspot S01 E10',
    'Blindspot S01 E11',
    'Blindspot S01 E12',
    'Blindspot S02',
    'Blindspot S02 E01',
    'Blindspot S02 E02',
    'Blindspot S02 E03',
    'Blindspot S02 E04',
    'Blindspot S02 E05',
    'Blindspot S02 E06',
    'Blindspot S02 E07',
    'Blindspot S02 E08',
    'Blindspot S02 E09',
    'Blindspot S02 E10',
    'Blindspot S02 E11',
    'Blindspot S02 E12',
]

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

var assetLibraryObjects = [
    {
        url: 'img/Haven_gallery_518FunFacts_01.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#B0DEDA',
        title: 'Haven_gallery_518FunFacts_01.jpg',
        caption: 'Writer, Brian Millikin, a man about Haven, takes us behind the scenes of this episode and gives us a few teases about the Season that we can\'t wait to see play out! This is the first episode of Haven not filmed in or around Chester, Nova Scotia. Beginning here, the show and its stages relocated to Halifax.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Brian Millikin',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518FunFacts_02.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#FDBD00',
        title: 'Haven_gallery_518FunFacts_02.jpg',
        caption: 'Charlotte lays out her plan for the first time in this episode: to build a new Barn, one that will cure Troubles without killing Troubled people in the process. Her plan, and what parts it requires, will continue to play a more and more important role as the season goes along.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518FunFacts_03.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#ED412D',
        title: 'Haven_gallery_518FunFacts_03.jpg',
        caption: 'Lost time plays an even more important role in this episode than ever before— as it’s revealed that it’s a weapon the great evil from The Void has been using against us, all season long. Which goes back to the cave under the lighthouse in beginning of the Season 5 premiere.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Lost time',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518FunFacts_04.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#32A4B7',
        title: 'Haven_gallery_518FunFacts_04.jpg',
        caption: 'The “aether core” that Charlotte and Audrey make presented an important design choice. The writers wanted it to look organic but also designed— like the technology of an advanced culture from a different dimension, capable of doing things that we might perceive as magic but which is just science to them. The various depictions of Kryptonian science in various Superman stories was one inspiration.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte and Audrey',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518FunFacts_05.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#D3ECEC',
        title: 'Haven_gallery_518FunFacts_05.jpg',
        caption: 'This is the first episode in Season 5 in which we’ve lost one of our heroes. It was important to happen as we head into the home stretch of the show and as the stakes in Haven have never been more dire. As a result, it won’t be the last loss we\'ll suffer this season…',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Wild Card',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518FunFacts_06.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#2A7C91',
        title: 'Haven_gallery_518FunFacts_06.jpg',
        caption: 'The challenge in Charlotte\'s final confrontation was that the show couldn’t reveal her attacker’s appearance to the audience, so the darkness was necessitated.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },

    {
        url: 'img/Haven_gallery_518Recap_01.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#967840',
        title: 'Haven_gallery_518Recap_01.jpg',
        caption: 'Warning: If you don\'t want to know what happened in this episode, don\'t read this photo recap! Dave just had another vision and this time, he\'s being proactive about it. He and Vince dash out of the house to save the latest victims of Croatoan, a.k.a the No Marks Killer.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518Recap_02.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#566F78',
        title: 'Haven_gallery_518Recap_02.jpg',
        caption: 'Meanwhile, Dwight and Nathan go downtown to investigate what they think is a drunken man causing a disturbance but it turns out that the guy is cursed. There is a roman numeral on his wrist and, as they watch, invisible horses trample him. Later, Nathan and Dwight find another man who appears to have been struck by lightening – but there had been no recent storm in town – and dropped from a skyscraper. Skyscrapers in Haven? Absurd. And the guy also has a mysterious Roman numeral tattoo on his wrist. Nathan and Dwight find a list of names in the guy\'s pocket that leads them to a local fortune teller, Lainey.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518Recap_03.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#2E1D07',
        title: 'Haven_gallery_518Recap_03.jpg',
        caption: 'By following the clues from Dave\'s vision, he and Vince find the scene of the No Mark Killer\'s most recent crime. They also find a survivor. Unfortunately, she can\'t remember anything. Her memory has been wiped, which gets them to thinking about who may be next on Croatoan\'s list.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518Recap_04.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#00445F',
        title: 'Haven_gallery_518Recap_04.jpg',
        caption: 'On their way to meet with Lainey, Nathan breaks his tire iron while trying to fix a flat tire. Tough break. And then Dwight gets a shooting pain in his side with a gnarly bruise to match, even tougher break. And then both guys notice that they now have Roman numeral tattoos on their wrists. The number X for Nathan and XII for Dwight.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518Recap_05.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#2F3837',
        title: 'Haven_gallery_518Recap_05.jpg',
        caption: 'In the mineshaft, Charlotte and Audrey have taken on the task of collecting all of the aether to create an aether core. This is the first step they need to create a new Barn where Trouble people can step inside and then be "cured" of their Troubles when they step out. Sounds easy enough but they\'re having trouble corralling all the aether into a giant ball. Unsurprisingly, the swirling black goo isn\'t willfully cooperating.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518Recap_06.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#63624C',
        title: 'Haven_gallery_518Recap_06.jpg',
        caption: 'As if the aether wasn\'t enough of a problem to tackle, Charlotte feels herself getting weaker by the minute and then Audrey starts to lose her eyesight. They look at their wrists and notice that the Roman number problem has now affected them too, the numbers II for Audrey and VIII for Charlotte.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518Recap_07.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#4A504E',
        title: 'Haven_gallery_518Recap_07.jpg',
        caption: 'In North Carolina, Duke and Seth sit with a local man who claims to be able to remove the "black tar" from Duke\'s soul. After an elaborate performance, Duke realizes that the guy is a fake. The rattled guy who doesn\'t want any trouble from Duke tells them that Walter Farady will have the real answers to Duke\'s questions. When they go looking for Walter, they find him … and his headstone that has a familiar marking on it, the symbol for The Guard. What gives? Just as Duke is about to give up he gets a visit from Walter\'s ghost who promises to give him answers to all of the questions …via the next episode of course. Cliffhanger!',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518Recap_08.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#DD9F00',
        title: 'Haven_gallery_518Recap_08.jpg',
        caption: 'After some prodding, Dwight and Nathan find that Lainey got a visit from Croatoan and "lost time". She doesn\'t remembering drawing cards for any of them. Nathan has her draw new cards and a hesitant Lainey does. Dwight is given a bondage fate and is later shackled by chains to a gate, Charlotte will be reunited with her true love (hmm…) and Audrey is aligned with the moon. Not perfect fates, but it\'s enough to get everyone out of the pickles their currently in.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518Recap_09.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#8FC99B',
        title: 'Haven_gallery_518Recap_09.jpg',
        caption: 'With their strength regained, Audrey and Charlotte are able to create the aether core they need. Charlotte instructs Audrey to go and hide it some place safe. In the interim, Charlotte kisses Dwight goodbye and gives him the ring she once used to slip into The Void. Later, with her moon alignment causing Audrey to disappear and Dwight still shackled, Lainey pulls another card for the entire group, a judgment card, which she reads to mean that as along as their intentions are pure they can all overcome any obstacles. This is great news for everyone except...',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518Recap_10.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#BFC9A2',
        title: 'Haven_gallery_518Recap_10.jpg',
        caption: 'Charlotte. Croatoan pays her a visit in her apartment to tell her that he\'s pissed that she\'s "one of them now" and that she chose Audrey over Mara. Croatoan wastes no time in killing Charlotte and she clings to life for just enough time to be found by Audrey so she can give her the most shocking news of the season: Croatoan is Audrey\'s father and he\'s got "plans" for her!',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    }
];

var fileImgColors = [
    '#4DD0E1',
    '#80DEEA',
    '#FFD54F',
    '#FFE082',
    '#FF7043',
    '#FF7043',
    '#80CBC4',
    '#D3ECEC',
    '#55AECA',
    '#FFC600'
];

var galleryObjects = [
    {
        url: 'img/Haven_gallery_518FunFacts_01.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#B0DEDA',
        title: 'Haven_gallery_518FunFacts_01.jpg',
        caption: 'Writer, Brian Millikin, a man about Haven, takes us behind the scenes of this episode and gives us a few teases about the Season that we can\'t wait to see play out! This is the first episode of Haven not filmed in or around Chester, Nova Scotia. Beginning here, the show and its stages relocated to Halifax.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Brian Millikin',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518FunFacts_02.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#FDBD00',
        title: 'Haven_gallery_518FunFacts_02.jpg',
        caption: 'Charlotte lays out her plan for the first time in this episode: to build a new Barn, one that will cure Troubles without killing Troubled people in the process. Her plan, and what parts it requires, will continue to play a more and more important role as the season goes along.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518FunFacts_03.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#ED412D',
        title: 'Haven_gallery_518FunFacts_03.jpg',
        caption: 'Lost time plays an even more important role in this episode than ever before— as it’s revealed that it’s a weapon the great evil from The Void has been using against us, all season long. Which goes back to the cave under the lighthouse in beginning of the Season 5 premiere.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Lost time',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518FunFacts_04.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#32A4B7',
        title: 'Haven_gallery_518FunFacts_04.jpg',
        caption: 'The “aether core” that Charlotte and Audrey make presented an important design choice. The writers wanted it to look organic but also designed— like the technology of an advanced culture from a different dimension, capable of doing things that we might perceive as magic but which is just science to them. The various depictions of Kryptonian science in various Superman stories was one inspiration.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte and Audrey',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518FunFacts_05.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#D3ECEC',
        title: 'Haven_gallery_518FunFacts_05.jpg',
        caption: 'This is the first episode in Season 5 in which we’ve lost one of our heroes. It was important to happen as we head into the home stretch of the show and as the stakes in Haven have never been more dire. As a result, it won’t be the last loss we\'ll suffer this season…',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Wild Card',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    },
    {
        url: 'img/Haven_gallery_518FunFacts_06.jpg',
        focalPoint: {
            left: 0.5,
            top: 0.5
        },
        color: '#2A7C91',
        title: 'Haven_gallery_518FunFacts_06.jpg',
        caption: 'The challenge in Charlotte\'s final confrontation was that the show couldn’t reveal her attacker’s appearance to the audience, so the darkness was necessitated.',
        description: '',
        highResolution: true,
        categories: '',
        tags: '',
        altText: 'Charlotte',
        credit: '',
        copyright: '',
        reference: {
            series: 'The Haven',
            season: 5,
            episode: 18
        }
    }
];

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
