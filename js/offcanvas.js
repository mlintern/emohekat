/*
 * jQuery Make Square plugin 1.0.0
 *
 * Mark Lintern
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Date: July 21 2014
 */
jQuery.fn.makeSquare = function(settings) {

	var options = jQuery.extend({
		based_on: 'width'
	}, settings);

	$(this).each(function() {
		if (options.based_on == 'height') {
			var height = $(this).height();
			$(this).width(height);
		} else {
			var width = $(this).width();
			$(this).height(width);
		}
	})

};

$(document).ready(function () {

	//Active the Bootstrap Offcanvas Menu Toggle
	$('[data-toggle="offcanvas"]').click(function () {
		$('.row-offcanvas').toggleClass('active')
	});

	//Active Bootstrap Tool Tips
	$('sup').tooltip();

	//Resize Map on Window resize
	$(window).resize(function(){
		$('#map-canvas').makeSquare();
	})

	//Resize Map on Page Load
	$('#map-canvas').makeSquare();
});