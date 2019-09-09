
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
