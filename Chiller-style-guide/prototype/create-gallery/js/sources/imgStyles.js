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
