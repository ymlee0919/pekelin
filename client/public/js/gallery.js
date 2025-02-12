(function ($) {
    "use strict";

    document.addEventListener( 'DOMContentLoaded', function() {
        var main = new Splide( '#main-carousel', {
            type: "loop",
			focus: "center",
            speed: 700,
			fixedHeight: "500px",
			autoWidth: true,
            //autoplay: true,
            autoScroll: {
                speed: 1,
              },
          } );
        
          var thumbnails = new Splide( '#thumbnail-carousel', {
            fixedWidth  : 80,
            fixedHeight : 80,
            gap         : 5,
            rewind      : true,
            pagination  : false,
            isNavigation: true
          } );
        
          main.sync( thumbnails );
          main.mount();
          thumbnails.mount();
      } );

    
})(jQuery);

