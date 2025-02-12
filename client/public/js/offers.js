(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
		if ($(this).scrollTop() > 300) {
			$(".sticky-top").addClass("shadow-sm bg-white");
		} else {
			$(".sticky-top").removeClass("shadow-sm bg-white");
		}
	});
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    $('.modal-trigger').click((e) => {
        let contentEl = $(e.currentTarget.attributes['data-content'].value);
        $('#modal-body').html(contentEl.html());
    });
})(jQuery);

