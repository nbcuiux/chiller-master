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
