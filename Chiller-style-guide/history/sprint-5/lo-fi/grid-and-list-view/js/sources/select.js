
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
