
import $ from "jquery"

class ItemFilter {



	constructor (inputEl) {

		this.inputEl = inputEl;
		this.tiles = $("[data-details-link]");
		this.tileEls = [];
		this.isWaiting

		var self = this;

		$("[data-details-link]").each(function () {
			var slug = $(this).attr("data-details-link");
			self.tileEls.push({
				slug: slug,
				el: $(this).closest(".section-tile")
			});
		})

		$(this.inputEl).on("keyup", (e)=>{
			var value = this.inputEl.value;
			this.handleChange(value);
		});
	}

	handleChange(value) {

		this.currentTerm = value;

		$(".search-input").addClass("search--searching");

		if (value === "" || value === undefined) {
			$(".section-tile--hidden").removeClass("section-tile--hidden");
			$(".search-input").removeClass("search--searching");
			return;
		}

		$.get(window.SITE_URL + "/?s=" + value, (response, extStatus, jqXHR) => {
			
			response = JSON.parse(response);

			// Throw out the response if it's not the last thing we searched for
			if (response.term !== this.currentTerm) {
				return;
			}

			$(".search-input").removeClass("search--searching");

			var result = response.data;
			var slugsToShow = result.map((item)=>{ return item.post_name });

			this.tileEls.forEach((item, index)=>{
				if (slugsToShow.indexOf(item.slug) === -1) {
					$(item.el).addClass("section-tile--hidden");
				}
				else {
					$(item.el).removeClass("section-tile--hidden");
				}
			});
		});
	}
}

export default ItemFilter