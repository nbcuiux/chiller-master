function loadFile(file) {
	var fileData = file.fileData;
	//set image and focal point
	$('.pr .img > .img-wrapper > img').attr('src', fileData.url);
	$('.pr .purpose-img').css("background-image", 'url(' + fileData.url + ')');
	adjustFocalPoint(fileData.focalPoint);
	adjustFocalRect(fileData.focalPoint);

	//set Title
	adjustTitle(fileData.title);
	adjustCaption(fileData.caption);
	adjustDescription(fileData.description);
	adjustResolution(fileData.highResolution);
	adjustAltText(fileData.altText);
}

//Function to set Title to the title field or, save title if title argument empty
function adjustTitle(title) {
	$('#title').val(title);
}
//Function to set Title to the title field or, save title if title argument empty
function saveTitle() {
	editedFileData.fileData.title = $('#title').val();
	dataChanged = true;
}
//Function to set Caption to the caption field or, save caption if caption argument empty
function adjustCaption(caption) {
	$('#caption').val(caption);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveCaption() {
	editedFileData.fileData.caption = $('#caption').val();
	dataChanged = true;
}
function adjustDescription(description) {
	$('#description').val(description);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveDescription() {
	editedFileData.fileData.description = $('#description').val();
	dataChanged = true;
}
function adjustResolution(resolution) {
	$('#resolution').prop('checked', resolution);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveResolution() {
	editedFileData.fileData.highResolution = $('#resolution').prop('checked');
	dataChanged = true;
}
function adjustAltText(altText) {
	$('#altText').val(altText);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveAltText() {
	editedFileData.fileData.altText = $('#altText').val();
	dataChanged = true;
}
function adjustAltText(altText) {
	$('#altText').val(altText);
}
//Function to set Description to the caption field or, save caption if caption argument empty
function saveAltText() {
	editedFileData.fileData.altText = $('#altText').val();
	dataChanged = true;
}
//Function to set FocalPoint coordinates or, save focal pint if focalpoint argument empty
function adjustFocalPoint(focalPoint) {
	var fp = $('#focalPoint');
	var img = $('#previewImg');
	if (focalPoint) {
		var left = focalPoint.left * img.width() - fp.width()/2,
			top = focalPoint.top * img.height() - fp.height()/2;

		left = left === 0 ? '50%' : left;
		top = top === 0 ? '50%' : top;
		fp.css('left', left).css('top', top);

	} else {
		editedFileData.fileData.focalPoint = {
			left: ((fp.position().left + fp.width()/2)/img.width()),
			top: ((fp.position().top + fp.height()/2)/img.height())
		};
	}
	fp.css('position', 'absolute');
}

//Function to set FocalRect coordinates or, save focal pint if focalpoint argument empty
function adjustFocalRect(focalPoint) {
	var fr = $('#focalRect');
	var img = $('previewImg');
	if (focalPoint) {
		var left = focalPoint.left * img.width() - fr.width()/2,
			top = focalPoint.top * img.height() - fr.height()/2;

		left = left < 0 ? 0 : left > img.width() ? img.width() - fr.width()/2 : left;
		top = top < 0 ? 0 : top > img.height() ? img.height() - fr.height()/2 : top;

		fr.css('left', left)
			.css('top', top);
	} else {
		editedFileData.fileData.focalPoint = {
			left: ((fp.position().left + fp.width()/2)/img.width()),
			top: ((fp.position().top + fp.height()/2)/img.height())
		};
	}
}


function showFiles(files) {
	dataChanged = false;
	//Show initial edit screen for single image.
	$('.pr').removeClass('hidden video bulk')
			.addClass('modal');
	$('#wrapper').addClass('overflow');

	//Remove all multiple images style attributes
	$('.pr .preview').removeClass('preview_style_multi hidden');
	$('.pr .ip').removeClass('ip_style_multi');
	$('#saveChanges').text('Save');
	//$('#ip__title').addClass('hidden');
	$('.pr .images').addClass('hidden');

	if (files.length > 1) {
		var imgContainer = $('.pr .images__container');
		imgContainer.empty();

		//Add images previes to the container
		files.forEach(function(f) {
			//console.log(f, i)
			var	image = $('<div></div>').addClass('image image_style_multi').click(switchImage),
				fileIndex = $('<div></div>').addClass('hidden file__id').text(f.fileData.id);
			image.css('background-image', 'url(' + f.fileData.url + ')').append(fileIndex);
			//}
			imgContainer.append(image);
		});

		//Add active state to the preview of the first image
		var firstImage = $('.images__container .image').first();
		firstImage.addClass('image_active');

		$('.pr .images').addClass('images_style_multi').removeClass('hidden');

		$('.pr .preview').removeClass('hidden').addClass('preview_style_multi');
		$('.pr .ip').addClass('ip_style_multi');

		//Adjust image previews container
		$('#images__wrapper').scrollLeft(0);
		var imagesWrapperWidth = $('.images__wrapper').width();
			imagesWidth = $('.images__container .image').length * 120;
			console.log(imagesWrapperWidth, imagesWidth);
		if (imagesWrapperWidth > imagesWidth) {
			$('.images__scroll-left, .images__scroll-right').css('visibility', 'hidden');
		} else {
			$('.images__container').css('width', imagesWidth.toString() + 'px');
			$('.images__scroll-left, .images__scroll-right').css('visibility', 'visible');
		}
		//Add actions to scroll buttons
		$('.images__scroll-left').click(function(e) {
			$('#images__wrapper').animate( { scrollLeft: '-=460' }, 800);
		});
		$('.images__scroll-right').click(function(e) {
			$('#images__wrapper').animate( { scrollLeft: '+=460' }, 800);
		});
	}
	hideLoader();

}

function editFiles(files) {
	editedFilesData = []; //Clear files data that possibly could be here

	//Obtain files data for files that should be edited
	files.each(function(i, el) {
		var file = galleryObjects.filter(function(f) {
            return f.fileData.id === $(el).find('.file__id').text();
        })[0];
		editedFilesData.push(file);
	});

	if (editedFilesData.length > 0) {
		editedFileData = editedFilesData[0];
		loadFile(editedFileData);
		showFiles(editedFilesData);
	}
}

function fileById(files, id) {
	filesFiltered = files.filter(function(f) {
		return f.fileData.id === id;
	});
	return filesFiltered[0];
}
function saveFile(files, file) {
	files.forEach(function(f) {
		if (f.fileData.id === file.fileData.id) {
			f = file;
		}
	});
}

function switchImage(e) {
	var newFileId = $(e.target).find('.file__id').text(),
		newFile = fileById(editedFilesData, newFileId);

	saveFile(editedFilesData, editedFileData);

	editedFileData = newFile;
	loadFile(editedFileData);

	$('.image').removeClass('image_active');
	$(e.target).addClass('image_active');

	adjustRect($('.purposes-container .purpose-img').first());
	$('#purposeWrapper').animate( { scrollLeft: '0' }, 800);
}


//Function for handle Edit Button clicks
function handleFiledEditButtonClick(e) {
	e.stopPropagation();
	var file = $(e.target).parents('.file');
	editFiles(file);
}
function handleMultiEditButtonClick(e) {
	var files = $('.ct .files .file.selected');
	editFiles(files);
}


/*$('#saveChangesPrompt .button').click(function() {
	$('#saveChangesPrompt').toggleClass('modal hidden');
	closeEditScreen();
});*/
