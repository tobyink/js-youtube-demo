$.fn.showVideos = function ( data ) {
	
	// Tabbed structure
	var wrapper     = $( this[0] );
	var toggler     = $( '<div class="col-12 d-lg-none pb-2"><button class="btn dropdown-toggle bg-secondary text-white" type="button">Menu</span></button></div>' );
	var desktopMenu = $( '<div class="col-lg-3"><div class="d-none d-lg-block nav nav-pills" role="tablist" aria-orientation="vertical" /></div>' );
	var tabs        = $( '<div class="col-12 col-lg-9 rounded bg-light bg-gradient tab-content"></div>' );
	
	wrapper.addClass( 'row navbar-expand-lg' );
	wrapper.append( toggler )
	wrapper.append( desktopMenu );
	wrapper.append( tabs );
	
	// Make toggle button work for menu on mobiles
	toggler.find( 'button' ).click( function ( e ) {
		e.preventDefault();
		if ( desktopMenu.find( '.nav' ).hasClass( 'd-none' ) ) {
			desktopMenu.find( '.nav' ).removeClass( 'd-none' );
			desktopMenu.find( '.nav' ).hide();
		}
		desktopMenu.find( '.nav' ).slideToggle();
	} );
	
	// For each section
	for ( var i in data.sections ) {
		var section = data.sections[i];
		
		// Create menu item for the section to add to tab group
		var menuItem = $( '<a class="nav-link w-100" data-bs-toggle="pill" role="tab"></a>' );
		menuItem.attr( 'id', section.id + '-tab' );
		menuItem.attr( 'href', '#' + section.id );
		menuItem.attr( 'aria-controls', section.id );
		menuItem.append( section.title );
		if ( i == 0 ) {
			menuItem.addClass( 'active' );
			menuItem.attr( 'aria-selected', 'true' );
		}
		else {
			menuItem.attr( 'aria-selected', 'false' );
		}
		
		// Create the content
		var content = $( '<div class="tab-pane fade p-3" role="tabpanel"></div>' );
		content.attr( 'id', section.id );
		content.attr( 'aria-labelledby', section.id + '-tab' );
		if ( i == 0 ) {
			content.addClass( 'show active' );
		}
		
		// Heading and introduction
		content.append( '<h2>' + section.title + '</h2>' );
		content.append( '<p class="lede">' + section.description + '</p>' );
		
		// Carousel of videos
		var carousel = $( '<div class="carousel" data-bs-ride="carousel" data-bs-interval="false">' );
		carousel.attr( 'id', section.id + '-carousel' );
		carousel.showVideoCarousel( section.videos );
		content.append( carousel );
		
		// Add the menu item and content to the tab set
		desktopMenu.find( '.nav' ).append( menuItem );
		tabs.append( content );
	}
};


$.fn.showVideoCarousel = function ( videos ) {
	
	// Extract the video ID from a YouTube URL
	const youtubeID = function ( url ) {
		const regexp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regexp);
		return (match && match[2].length === 11) ? match[2] : null;
	};
	
	// URL to embed a YouTube video
	const youtubeEmbed = function ( url ) {
		const embedUrl = '//www.youtube.com/embed/' + youtubeID( url ) + '?enablejsapi=1&version=3&playerapiid=ytplayer';
		return '<div class="video mb-3"><iframe src="' + embedUrl + '" frameborder=0 allowfullscreen=true allowscriptaccess=always></iframe></div>';
	};
	
	// Carousel structure
	var carousel   = $( this[0] );
	var indicators = $( '<div class="carousel-indicators"></div>' );
	var slides     = $( '<div class="carousel-inner"></div>' );
	
	carousel.append( indicators );
	carousel.append( slides );
	
	// For each video
	for ( var i in videos ) {
		var video = videos[i];
		
		// Create an indicator button for the botton
		var indicator = $( '<button type="button"></button>' );
		indicator.attr( 'data-bs-target', '#' + carousel.attr('id') );
		indicator.attr( 'data-bs-slide-to', i );
		indicator.attr( 'title', video.title );
		if ( i == 0 ) {
			indicator.addClass( 'active' );
			indicator.attr( 'aria-current', 'true' );
		}
		else {
			indicator.attr( 'aria-current', 'false' );
		}
		
		// When indicator gets clicked, automatically pause any videos
		// in this carousel.
		// https://stackoverflow.com/questions/15164942/stop-embedded-youtube-iframe
		indicator.click( function ( e ) {
			carousel.find( 'iframe' ).each( function () {
				this.contentWindow.postMessage( '{"event":"command","func":"pauseVideo","args":""}', '*' );
			} );
		} );
		
		// The embedded video, heading, and description.
		var slide = $( '<div class="carousel-item px-3 pt-3 pb-5 bg-dark bg-gradient"></div>' );
		slide.append( youtubeEmbed( video.url ) );
		slide.append( '<h3 class="text-white">' + video.title + '</h3>' );
		slide.append( '<p class="text-white">' + video.description + '</p>' );
		if ( i == 0 ) {
			slide.addClass( 'active' );
		}
		
		// Add the indicator and content to the carousel
		indicators.append( indicator );
		slides.append( slide );
	}
};
