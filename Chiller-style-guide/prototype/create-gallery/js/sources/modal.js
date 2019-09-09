function closeEditScreen() {
    $('.pr').removeClass('modal').addClass('hidden');
	$('.pr .preview').removeClass('focal line full rect point');
	$('.focalPoint').removeAttr('style');
	$('.focalRect').removeAttr('style');
	$('#focalPointToggle').removeClass('active');
	$('#focalRectToggle').removeClass('active');
	$('.purposes-container .purpose .purpose-img').removeAttr('style');
	$('.ct .file').find('button').css('display', '');
	deselectAll();
	$('#wrapper').removeClass('overflow');
}

function showModalPrompt(title, text, confirmText, confirmAction, cancelText, cancelAction) {
    var modal = $('<div></div>').addClass(op, modal);
}
