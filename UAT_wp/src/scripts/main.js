
import $ from "jquery"
import DelayChain from "./lib/delayChain"
import ItemFilter from "./lib/itemFilter"
import setupCommentForm from "./lib/comments.js"
import EasyZoomInit from "./vendors/easyzoom.js"
import MagnifyInit from "./vendors/magnify.js"

MagnifyInit($);

function setupReadLinks() {

	var readItems = [];
	var els = $("[data-details-link]");
	var currSubpage = null;
	var dc = new DelayChain();

	var save = function () {
		localStorage.setItem('readItems', JSON.stringify(readItems));
	}

	var load = function () {
		// Load up the read items set flags accordingly
		let items = JSON.parse(localStorage.getItem('readItems'));
		if (items) {
			items.forEach((item, index) => {
				let el = $("[data-details-link='" + item + "']");
				el.addClass("details-link--read");
				readItems.push(item);
			});
		}

	}


	var openSubpage = function(subpageId) {

		// Load the page
		var subpage = $("[data-subpage-id='" + subpageId + "']");

		dc.cancel();

		subpage.removeClass("subpage--remove");

		dc.delay(1, function() {
			subpage.addClass("subpage--show-add");
		}).delay(10, function () {
			subpage.addClass("subpage--show");
		}).delay(500, function () {
			subpage.removeClass("subpage--show-add");
			setupSteps(subpage.find(".details-wrapper"));
		});

		currSubpage = subpageId;

	}


	var closeSubpage = function(subpageId) {

		dc.cancel();
		
		// Load the page
		var subpage = $("[data-subpage-id='" + currSubpage + "']");

		console.log("closing sub page", subpage);

		dc.delay(1, function() {
			subpage.addClass("subpage--remove");
		}).delay(10, function () {
			subpage.removeClass("subpage--show");
		}).delay(500, function () {
			subpage.removeClass("subpage--remove");
		});

	}

	var markAsRead = function(subpageId) {
		
		if (!subpageId) {
			subpageId = currSubpage;
		}

		if (readItems.indexOf(subpageId) === -1) {
			var linkToSubpage = $("[data-details-link='" + subpageId + "']");
			linkToSubpage.addClass("details-link--read");
			readItems.push(subpageId);
			save();
		}
	}

	
	els.on("click", function (e) {
		var linkId = $(this).attr("data-details-link");
		e.preventDefault();
		openSubpage(linkId);
	});


	$("[data-close-subpage]").on("click", function (e) {
		closeSubpage(currSubpage);
	});	

	load();

	return {
		closeSubpage: closeSubpage,
		markAsRead: markAsRead
	}
}

var subpageNav = setupReadLinks();

function setupSteps(wrapperEl) {

	if ($(wrapperEl).data("stepsIsSetup")) {
		return;
	}
	else {
		$(wrapperEl).data("stepsIsSetup", true);
	}


	var dc = new DelayChain();
	var curr = 0;
	var upTo = 0;
	var resultLinkOpen = false;
	
	var stepWrapper = $(wrapperEl).find(".step-wrapper");
	var stepEls     = $(wrapperEl).find(".step-container");
	var imgListWrapper = $(wrapperEl).find(".step-img-list__wrapper");


	var imgList     = $(wrapperEl).find(".step-img-list");
	var resultLink = $(wrapperEl).closest(".subpage").find(".result-link");

	imgList.find(".step-img-wrapper").each(function () {
		var imgElem = $(this);
		var imgSrc     = imgElem.find("img").attr("src");
		var imgMain    = imgElem.find(">img");
		var imgMagnified = imgElem.find(".step-img-magnified");

		console.log(imgElem, imgMagnified);

		//var img = imgElem.find(">img");
		/*
		imgElem.css({
			'background-image': "url('" + imgSrc + "')"
		});
		*/

		var width = imgMagnified.width();
		var height = imgMagnified.height();
		var imgWidth = imgMagnified.find("img").width();
		var imgHeight = imgMagnified.find("img").height();

		console.log(imgMagnified.find("img"));

		console.log("Container width", width);
		console.log("Container height", height);

		console.log("Image width", imgWidth);
		console.log("Image height", imgHeight);		

		imgMain.on("mousemove", function(e) {

			if (imgWidth <= width && imgHeight <= height) {
				return;
			}

			var xRatio = (e.pageX - imgMain.offset().left)/imgMain.width();
			var yRatio = (e.pageY - imgMain.offset().top)/imgMain.height();

			var x = xRatio * (width - imgWidth);
			var y = yRatio * (height - imgHeight);

			console.log("xratio: ", xRatio);
			console.log("yratio: ", yRatio);

			imgMagnified.find("img").css({
				top: y,
				left: x
			})

		});
	})

	var goTo = function(index) {
		var $el = stepEls.eq(index);

		// Expand the step description
		var height = $el.find(".description").height();
		$(".step--current .step-description__wrapper").height(0);
		$el.find(".step-description__wrapper").height(height);

		$el.prev().addClass("step--finished").removeClass("step--current");
		$el.addClass("step--current");

		var img = imgList.find(">*").eq(index);
		imgList.find(">*").removeClass("step-img-current");
		img.addClass("step-img-current");

		curr = index;

		if (upTo < index) {
			upTo = index;
		}
	}

	var toggleResultLink = function () {
		if (resultLinkOpen) {
			closeResultLink();
		}
		else {
			openResultLink();
		}
	}

	var openResultLink = function() {
		resultLink.find("span").text("Hide Resulting Page");
		var img = imgList.find(">*").last();
		imgList.find(">*").removeClass("step-img-current");
		img.addClass("step-img-current");
		resultLinkOpen=true;
	}

	var closeResultLink = function() {
		resultLink.find("span").text("View Resulting Page");
		var img = imgList.find(">*").eq(curr);
		imgList.find(">*").removeClass("step-img-current");
		img.addClass("step-img-current");
		resultLinkOpen=false;
	}

	stepEls.first().addClass("step--current");
	stepEls.not(":last").on("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		closeResultLink();

		var index = $(this).index();
		
		// We've already seen this step
		if (index < upTo) {
			goTo(index);
		}

		// New step
		else if (index === upTo) {
			goTo(index+1);
			if (index === stepEls.length - 2) {
				openResultLink();
			}
		}

	});

	resultLink.on("click", function(e) {
		toggleResultLink();
		e.stopPropagation();
		e.preventDefault();
	});


	$(wrapperEl).find(".js-next-button").on("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		if (upTo >= stepEls.length - 1) {
			subpageNav.closeSubpage();
			setTimeout(function() {
				subpageNav.markAsRead();
			}, 700)
		}
	});

	goTo(0);
}

function setupDynamicFields() {
	$("[data-dynamic-height]").on("keyup", function () {
	  this.style.height = "0px";
	  this.style.height = (15+this.scrollHeight)+"px";
	});
}


setupCommentForm();
setupDynamicFields();
EasyZoomInit($);

new ItemFilter(document.getElementById("search-input"));










