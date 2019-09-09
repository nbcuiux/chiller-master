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
	deselectAll();
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
	deselectAll();
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
})

/* Delete ConfirmationPrompt */
$('#deleteConf').click(function () {
	$('#deleteFiles').toggleClass('modal hidden');

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
$('.pr, .pr > .close, .pr > .controls').click(function() {
	$('.pr').addClass('willClose');
	deselectAll();
});
$('.al > .close, .al > .controls, .al .button').click(function() {
	$('.al').addClass('willClose');
	deselectAll();
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
	e.target.classList.add('willClose');
});
$('.modal > .close').click(function(e) {
	e.target.parentNode.classList.add('willClose');
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
autosize($('textarea'));
autosize.update($('textarea'));

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
$('#saveChanges').click(function() {
	emptyFields = checkFields();
	console.log(emptyFields);
	if (emptyFields) {
		$('#saveChangesPrompt').toggleClass('modal hidden');
	}
});
$('#saveChangesPrompt .button').click(function() {
	$('#saveChangesPrompt').toggleClass('modal hidden');
	closeEditScreen();
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
})

/* Datapicker */
$('.datapicker').datepicker();
$('.ct .section-files').sortable({
	placeholder: 'file__placeholder',
	cursor: '-webkit-grabbing',
	helper: 'clone',
	opacity: 0.5
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
		fileInfo.classList.add('edit')
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
		fileInfo.classList.add('edit')
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

$('.file .close').click(deleteFile);

$('.file-controls').click(toggleFileSelect);
$('.file-controls .checkmark').click(toggleFileSelect);

$('.al .file-img, .al .file-title').click(function (e) {
	if ($('.al').hasClass('modal')) {
		e.target.parentNode.classList.toggle('selected');
	}
});

function editFile(e) {
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
	var filesToBeEdit = $('.ct .files .file.selected');
	openMultiEdit(filesToBeEdit);
}
function openSingleEdit(file) {
	$('.pr').removeClass('hidden bulk video')
			.addClass('modal');

	if (file.hasClass('video')) {
		$('.pr').addClass('video');
	}

	var srcString = file.children('.file-img').css('background-image'), src;
	if (srcString.indexOf('img/') > 0) {src = srcString.slice(srcString.indexOf('img/'), -2);}
	else if (srcString.indexOf('url(') >= 0) {src = srcString.slice(4, -2);}
	else {src = srcString;}
	src.replace(/'"/g, '');

	$('.pr .img > .img-wrapper > img').attr('src', src);
	$('.pr .purpose-img').css("background-image", srcString);

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
	var imgContainer = $('.pr .images__container');
	imgContainer.empty();
	files.each(function(i, el) {
		var img = $(el).children('.file-img').css('background-image');
		image = $('<div></div>').addClass('image image_style_multi').css('background-image', img).click(switchImage);
		imgContainer.append(image);
	});

	var firstImage = $('.images__container .image').first();

	firstImage.addClass('image_active');
	var srcString = firstImage.css('background-image'), src;
	if (srcString.indexOf('img/') > 0) {src = srcString.slice(srcString.indexOf('img/'), -2);}
	else if (srcString.indexOf('url(') >= 0) {src = srcString.slice(4, -2);}
	else {src = srcString;}
	src.replace(/'"/g, '');


	$('.pr .preview').removeClass('hidden').addClass('preview_style_multi');
	$('.pr .ip').addClass('ip_style_multi');

	$('.pr .img > .img-wrapper > img').attr('src', src);
	$('.pr .purpose-img').css("background-image", srcString);

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

	var srcString = $(e.target).css('background-image'), src;
	if (srcString.indexOf('img/') > 0) {src = srcString.slice(srcString.indexOf('img/'), -2);}
	else if (srcString.indexOf('url(') >= 0) {src = srcString.slice(4, -2);}
	else {src = srcString;}

	src.replace(/'"/g, '');

	$('.pr .img > .img-wrapper > img').attr('src', src);
	$('.pr .purpose-img').css("background-image", srcString);
	$('.pr .ip').addClass('ip_style_multi');
	adjustRect($('.purposes-container .purpose-img').first());
	$('#purposeWrapper').animate( { scrollLeft: '0' }, 800);
}

$('.file-controls .button').click(editFile);
$('#bulkEdit').click(bulkEdit);
$('#multiEdit').click(multiEdit);


function handleFiles(files) {
	var filesOutput = [];
	if (files && files.length >0) {
		for (var i=0; i< files.length; i++) {
			filesOutput.push(files[i]);
		}
		var uploadedFiles = filesOutput.map(function(f) {
			return fileToMarkup(f).then(function(res) {
				res.addClass('selected');
				if ($('#justUploaded .section-files').length > 0) {
					$('#justUploaded .section-files').prepend(res);
				} else if ($('.section-files').length > 0) {
					$('.section-files').first().prepend(res);
				}
			});
		});
		if (uploadedFiles.length === 1) {Promise.all(uploadedFiles).then(editFile);}
		else {
			Promise.all(uploadedFiles).then(multiEdit);
		}

	}
}
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
			fileTitleInput = $('<input type="text" />').val(result.name);

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
			}
			reader.onerror = function() {
				rej(this);
			}
			reader.readAsDataURL(file);
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
	if ($('.ct .file.selected').length === $('.ct .file').length) {
		$('#selectAll').removeClass('empty').addClass('all');
	} else if ($('.ct .file.selected').length > 0) {
		$('#selectAll').removeClass('empty all');
	} else if ($('.ct .file.selected').length === 0) {
		$('#selectAll').removeClass('all').addClass('empty');
	}

	if ($('.ct .file.selected').length === 0) {
		$('.ct .file').find('button').css('display', '');
		$('.tabs .tab.active .controls #bulkEdit, .tabs .tab.active .controls #multiEdit, .tabs .tab.active .controls #bulkRemove')
		  	.css('opacity', 0.40)
			.css('pointer-events', 'none');
	} else if ($('.ct .file.selected').length === 1) {
		$('.ct .file').find('button').css('display', 'none');
		$('.ct .file.selected').first().find('button').css('display', '');
		$('.tabs .tab.active .controls #bulkEdit, .tabs .tab.active .controls #multiEdit')
		  	.css('opacity', 0.40)
			.css('pointer-events', 'none');
			$('.tabs .tab.active .controls #bulkRemove')
			  	.css('opacity', '')
				.css('pointer-events', '');
	} else if ($('.ct .file.selected').length > 1) {
		$('.ct .file').find('button').css('display', 'none');
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
