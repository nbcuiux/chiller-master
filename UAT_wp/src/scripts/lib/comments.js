


import $ from "jquery"


/* A google script has been created to update the spreadhseet 
 * See http://railsrescue.com/blog/2015-05-28-step-by-step-setup-to-send-form-data-to-google-sheets/
 *
 * The google script lives at 
 * https://script.google.com/macros/d/MP7dt40rswL6FrgWPSd9ArGu23GjQNATY/edit?uiv=2&mid=ACjPJvFT3ecZV5xIq0ymJ6GqrVUaiIYEnBWA1ycMGj_22yPoQtxmYskX0irW9eIem811XfpztqG3-jbsXiaxmyR5C7QzsrN-fcNbiaQGzaOVzRPO-TJ2AQHgxTYtvL8QbHe4IvFAqOwHFA
 *
 */

const EXEC_URL = "https://script.google.com/macros/s/AKfycby9llWurQ9tBtePNdQs1veyaL9U8smPOAb3Mst_hxSMlgMYfY8P/exec";
class CommentForm {

	constructor(el) {
		this.el = el;
		this.$el = $(el);

		this.$el.find("[data-submit-comment-button]").on("click", (e) => {
			this.postToSpreadSheet();
			e.preventDefault();
		});


		this.$el.find("[data-more-feedback]").on("click", (e) => {
			this.reset();
			e.preventDefault();
		});
	}

	postToSpreadSheet() {

		var data = {};
		data["Reported Date"] 		= new Date().toLocaleString();
		data["Reported by"]    		= this.$el.find("[name='name']").val();
		data["Network Comments"]    = this.$el.find("[name='comments']").val();
		data["Issue Type"]     		= this.$el.find("[name='issue-type']").val();
		data.Page              		= this.$el.find("[name='page']").val();
		data.Browser           		= this.$el.find("[name='browser']").val();
		data.Platform          		= this.$el.find("[name='platform']").val();

		// Validation
		if (data["Reported by"] === "" ||
			data.Comments       === "" ||
			data["Issue Type"]  === undefined) {

			this.showError();
			return;
		}

		this.showLoading();

	    $.ajax({
		    url: EXEC_URL,
		    type: "post",
		    crossDomain: true,
		    data: data
	    }).done((response, textStatus, jqXHR) => {
	    	this.hideLoading();
	    	this.showSuccess();
	    	console.log("done");
	    	console.log(response);
	        console.log(textStatus);
	        console.log(jqXHR);
	    });


	}

	showError() {
		this.$el.addClass("form--submit-error")
	}

	reset() {
		this.$el.removeClass("form--submit-success");
		this.$el.find("[name='comments']").val("");
	}

	showSuccess() {
		this.$el.addClass("form--submit-success");
		this.$el.removeClass("form--submit-error");
	}

	showLoading() {
		this.$el.addClass("form--loading");
	}

	hideLoading() {
		this.$el.removeClass("form--loading");
	}
}




function setupCommentForm() {
	$("[data-feedback-form]").each(function() {
		var form = new CommentForm(this);
	});
}



export default setupCommentForm







