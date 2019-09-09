
import $ from "jquery"
import DelayChain from "./delayChain"



function setupReadLinks() {

	var readItems = [];
	var els = $("[data-details-link]");
	var currSubpage = null;

	var save = function () {
		localStorage.setItem('readItems', JSON.stringify(readItems));
	}

	var load = function () {
		// Load up the read items set flags accordingly
		let items = JSON.parse(localStorage.getItem('readItems'));
		items.forEach((item, index) => {
			let el = $("[data-details-link='" + item + "']");
			el.addClass("details-link--read");
			readItems.push(item);
		});
	}


	var openSubpage = function(subpageId) {

		var dc = new DelayChain();

		// Load the page
		var subpage = $("[data-subpage-id='" + subpageId + "']");



		dc.delay(1).then(function() {
			subpage.addClass("subpage--show-add");
			return dc.delay(10);
		}).then(function () {
			subpage.addClass("subpage--show");
			return dc.delay(500);
		}).then(function () {
			subpage.removeClass("subpage--show-add");
			return dc.delay(1);
		});

		currSubpage = subpageId;

	}


	var closeSubpage = function(subpageId) {

		var dc = new DelayChain();
		
		// Load the page
		var subpage = $("[data-subpage-id='" + currSubpage + "']");

		console.log("closing sub page", subpage);

		dc.delay(1).then(function() {
			subpage.addClass("subpage--remove-add");
			subpage.removeClass("subpage--show");
			return dc.delay(10);
		}).then(function () {
			subpage.addClass("subpage--remove");
			return dc.delay(500);
		}).then(function () {
			subpage.removeClass("subpage--remove-add");
			subpage.removeClass("subpage--remove");
			return dc.delay(1);
		});

	}

	
	els.on("click", function (e) {

		var linkId = $(this).attr("data-details-link");
		$(this).addClass("details-link--read");
		e.preventDefault();

		openSubpage(linkId);

		// Save the read items
		if (readItems.indexOf(linkId) === -1) {
			readItems.push(linkId);
			save();
		}
	});

	load();

	return {
		closeSubpage: closeSubpage
	}
}

var subpageNav = setupReadLinks();




function setupSteps(wrapperEl) {

	var dc = new DelayChain();
	var curr = 0;
	var upTo = 0;
	var stepWrapper = $(wrapperEl).find(".step-wrapper");
	var stepEls     = $(wrapperEl).find(".step-container");
	var imgListWrapper = $("<div class='step-img-list__wrapper'></div>").prependTo(wrapperEl);
	var imgList     = $("<div class='step-img-list'></div>").prependTo(imgListWrapper);
	var resultImg   = $("<div class='step-img-result'></div>").prependTo(imgListWrapper);

	$(wrapperEl).find(".result-link-img").appendTo(resultImg);

	stepEls.each(function () {
		var $this = $(this);
		var $img     = $this.find("img");
		imgList.append($img);
		$img.wrap("<div class='step-img-wrapper'></div>");
		$img.show();
	})

	var goTo = function(index) {
		var $el = stepEls.eq(index);
		$el.prev().addClass("step--finished").removeClass("step--current");
		$el.addClass("step--current");
		
		/*
		var img = imgList.find(">*").eq(index);
		img.show();
		img.addClass("step-img--enter-add");
		imgList.css({
			left: (-100 * index) + "%"
		})
		*/

		var img = imgList.find(">*").eq(index);
		img.show();
		imgList.find(">*").removeClass("step-img-current");
		img.addClass("step-img-current");


		curr = index;

		if (upTo < index) {
			upTo = index;
		}
	}

	var openResultLink = function() {
		$(wrapperEl).addClass("show-result-link");
	}

	var closeResultLink = function() {
		$(wrapperEl).removeClass("show-result-link");
	}

	stepEls.first().addClass("step--current");
	stepEls.not(":last").on("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		closeResultLink();

		console.log("Just clicked button");
		console.log("index", index);
		console.log("up to", upTo);

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

		// The last step
		/*
		else if (index === stepEls.length - 1) {
			openResultLink();
		}
		*/
	});

	$(wrapperEl).find(".result-link").on("click", function(e) {
		openResultLink();
		e.stopPropagation();
		e.preventDefault();
	});


	$(wrapperEl).find(".js-next-button").on("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		if (upTo >= stepEls.length - 1) {
			subpageNav.closeSubpage();
		}
	});

	goTo(0);
}


$(".details-wrapper").each(function () {
	setupSteps(this);
})







setupSteps();











