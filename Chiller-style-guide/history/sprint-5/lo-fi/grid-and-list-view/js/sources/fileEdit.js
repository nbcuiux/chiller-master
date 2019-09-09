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
