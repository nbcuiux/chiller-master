
function toggleFileSelect(e) {
	e.stopPropagation();
	e.preventDefault();
	var file = $(e.target).parents('.file'),
		filesSection = file.parent(),
		files = filesSection.children('.file');
		selectedFiles = filesSection.children('.file.selected');



	//Check if user hold Shift Key
	if (e.shiftKey) {
		if (file.hasClass('selected')) {
			file.removeClass('selected');
		}
		else {
			if (selectedFiles) {
				var fileIndex = file.index(),
					filesToBeSelect = files.slice(lastSelected, fileIndex + 1);

				if (lastSelected > fileIndex) {
					filesToBeSelect = files.slice(fileIndex, lastSelected);
				}
				filesToBeSelect.addClass('selected');
			}
			else {
				file.toggleClass('selected');
			}
		}
	}
	else {
		file.toggleClass('selected');
	}
	lastSelected = file.index();
	normalizeSelecteion();
}
function normalizeSelecteion() {
	var bulkDeleteButton = $('#bulkRemove'),
		bulkEditButton = $('#bulkEdit'),
		multiEditButton = $('#multiEdit'),

		selectAllButton = $('#selectAll'),
		selectAllLabel = $('#selectAllLabel'),

		deleteButtons = $('.ct .files .file .file__delete'),
		editButtons = $('.ct .files .file .button'),
		arrangements = $('.ct .files .file .file__arragement'),
		arrangementInputs = $('.ct .files .file .file__arragement').find('input'),

		selectedDeleteButton = $('.ct .files .file.selected .file__delete'),
		selectedEditButton = $('.ct .files .file.selected .button'),
		selectedArrangement = $('.ct .files .file.selected .file__arragement'),
		selectedArrangementInput = $('.ct .files .file.selected .file__arragement').find('input'),

		numberOfFiles = $('.ct .files .file').length,
		numberOfSelectedFiles = $('.ct .files .file.selected').length;

	//No selected files
	if (numberOfSelectedFiles === 0) {
		selectAllButton.removeClass('all').addClass('empty');
		selectAllLabel.text('Select all');
		bulkDeleteButton.addClass('disabled');
		bulkEditButton.addClass('disabled');
		multiEditButton.addClass('disabled');

		editButtons.removeClass('hidden');
		deleteButtons.removeClass('hidden');
		arrangements.removeClass('disabled');
		arrangementInputs.prop('disabled', false);
	}
	//Some files are selected
	else if (numberOfSelectedFiles > 0) {
		selectAllButton.removeClass('empty all');
		selectAllLabel.text('Deselect all');
		bulkDeleteButton.removeClass('disabled');
		bulkEditButton.removeClass('disabled');
		multiEditButton.removeClass('disabled');

		editButtons.addClass('hidden');
		deleteButtons.addClass('hidden');
		arrangements.addClass('disabled');
		arrangementInputs.prop('disabled', true);

		//Only one file selected
		if (numberOfSelectedFiles === 1) {
			bulkEditButton.addClass('disabled');
			multiEditButton.addClass('disabled');

			selectedEditButton.removeClass('hidden');
			selectedDeleteButton.removeClass('hidden');
			selectedArrangement.removeClass('disabled');
			selectedArrangementInput.prop('disabled', false);
		}
		//All files are selected
		if (numberOfSelectedFiles === numberOfFiles) {
			selectAllButton.removeClass('empty').addClass('all');
		}
	}
}
function selectAll() {
	$('.ct .file').addClass('selected');
	$('#selectAll').addClass('all').removeClass('empty');
	normalizeSelecteion();
}
function deselectAll() {
	$('.ct .file.selected').removeClass('selected');
	$('#selectAll').addClass('empty').removeClass('all');
	normalizeSelecteion();
}
