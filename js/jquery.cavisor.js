/*

CAvisor - jQuery plugin

CAvisor is small javascript library used to overlay images on top of the current page. It's a snap to setup and works on all modern browsers.

///Author: Carlos Asín
///Demo page: 
	https://googledrive.com/host/0BwzDh0DsxCXlS3g5TF9kS1BDWHM/cavisor-demo/

///How to install:

- Load js libreray after jQuery
- Load css
- Add at the end of body 
	<script type="text/javascript">
		$().cavisor();
	</script>

////How to use:

Basic use:
- Name the images as:
	- thumbnail -> imagename_small.extension
	- big image -> imagename_big.extension
- Add class visor to thumbnail images

Settings:
- number -> show top counter and current number
- title -> show image title
- arrows -> show movement controls
- controls -> show bottom controls
- width -> default image width

Clases (individual image options):
- same-image -> use same image to overlay
- single-image -> hide movement controls and overlay it alone
- no-number -> hide counter and current number
- no-title -> hide image title
- no-controls -> hide bottom controls

Specify image size (if big image not proportional to small image):
- id="width_xxx-height_xxx"

////Additional info:

- Compatible with Lazyload

////To-Do:

- Adjust title size if bigger than visor

*/

(function( $ ) {

	$.fn.cavisor = function (options) {

		// Default settings
    var settings = 
    	$.extend({
				number: true, 		//Show top counter
				title: true, 			//Show slide title
				arrows: true, 		//Show movement arrows
				controls: true, 	//Show additional bottom controls
				width: 900 				//Default slide width
    	}, options );

		// Resizable images counter
		var num_resizable_images = 0;

		// Static images counter
		var num_single_images = 0;

	  return $('img.visor').each(function() {

	  	//Set visor parameters on images
			if (!$(this).hasClass('single-image')) {
				$(this)
					.attr('id',
						'visor_'+num_resizable_images+
						(($(this).attr('id') != undefined)? '-'+$(this).attr('id') : '')); 

				num_resizable_images++;
			} else 
					if ($(this).attr('id') == undefined) {
						$(this).attr('id', 'single_visor_'+num_single_images);
						num_single_images++;
					}

			//Bind Cavisor to click event
			$(this).click(function() {

				function visor_image(path, width, height, controls, number, element) {

					function close_visor() {
						$('body').css('overflow','visible'); 	//Restore Scroll
						$('#visor').remove(); 								//Remove Visor
						$(document).unbind("keyup"); 					//Unbind keyboard events
					}

					function animate_visor() {

						var border_bottom = ((!show_controls)? 10 : 30);

						$('#visor_border').
							animate({
								'margin-top':
									(($(window).height()-height-30-border_bottom-2)/2),
								'height': (height+30+border_bottom+2),
								'width': (width+2)}
								, '', '', 
								function() { 

									//Adjust and show top controls
									$('#visor_controls_top').css({
				 						'margin-top':
				 						(($(window).height()-height-30-border_bottom-2)/2),
				 						'margin-left': 
	 									(($(window).width()-width-20-2)/2)+10})
				 							.show();

				 					//Adjust position close bottom
				 					$('#visor_close')
										.css({'margin-left': width+2-15});

									//Adjust and show bottom controls
									if (show_controls)
										$('#visor_controls_bottom').css({
					 						'margin-top':
					 						(($(window).height()-height-30-border_bottom)/2)+height+30,
					 						'margin-left': 
	 										(($(window).width()-width-20-2)/2)+10})
					 							.show();
								});

						//Insert image on visor
				 		$('#visor_content').height(height).width(width).
				 			html(
				 				'<img '+
				 					'src="'+path+'" width="'+width+'" '+
				 					'height="'+height+'" class="visor_image" />')
				 				.fadeIn(1500);

				 		//Show movement controls		
				 		if (show_arrows) $('#visor_next, #visor_prev').show();
					}

					function proportion_visor() {

						if (height > $(window).height()-100) {
							var height_tmp = $(window).height()-100;
							var width_tmp = (height_tmp*width)/height;
						}
						
						if (width > $(window).width()-100 && 
							width_tmp > $(window).width()-100) {
							var width_tmp = $(window).width()-100;
							var height_tmp = (height*width_tmp)/width;
						}

						if (width_tmp != null) width = width_tmp;
						if (height_tmp != null) height = height_tmp;
					}

					function update_visor() {

						var border_bottom = ((!show_controls)? 10 : 30);

						$('#visor_border').
							animate({
								'margin-top':
									(($(window).height()-height-30-border_bottom-2)/2),
								'margin-left':
							   	(($(window).width()-width-20-2)/2),
								'height': (height+30+border_bottom+2),
								'width': (width+2)}, 100);

						//Actual number and counter
						if (show_number) {
							if($('#visor_number').length)
								$('#visor_number')
									.html((number+1)+' / '+(num_resizable_images));
							else
								$('<span id="visor_number">'+(number+1)+' / '+
									(num_resizable_images)+'</span>').insertAfter('#visor_close');
						} else $('#visor_number').remove();

						//Title
						if (element.attr('title') != undefined && show_title)
							if ($('#visor_title').length)
								$('#visor_title').html(element.attr('title')).width(width);
							else 
								$('#visor_controls_top')
									.append('<p id="visor_title">'+element.attr("title")+'</p>');
						else $('#visor_title').empty();

						//Adjust and show bottom controls
						if (show_controls) {
							if ($('#visor_goto').length) 
								$('#visor_goto').attr('href', '#'+element.attr("id"));
							else 
								$('#visor')
									.append(
										'<div id="visor_controls_bottom">'+
											'<a id="visor_goto" href="#'+element.attr("id")+'">'+
												'Go to image in the document'+
											'</a>'+
										'</div>');
							$('#visor_controls_bottom').css({
		 						'margin-top':
		 						(($(window).height()-height-30-border_bottom)/2)+height+30,
		 						'margin-left': 
		 						(($(window).width()-width-20-2)/2)+10})
		 							.show();
						} else $('#visor_controls_bottom').remove();

						//Adjust and show top controls
						$('#visor_controls_top').css({
	 						'margin-top':
	 						(($(window).height()-height-30-border_bottom-2)/2),
	 						'margin-left': 
	 						(($(window).width()-width-20-2)/2)+10})
	 							.show();

	 					//Adjust position close bottom
	 					$('#visor_close')
							.css({'margin-left': width+2-15});

						if (show_arrows) {

							if (number >= 1) { 
								
								//Update or append left arrow
								if (!$('#visor_prev').length) {

									$('#visor_border')
										.prepend(
											'<div id="visor_prev" class="visor_'+(number-1)+'">'+
												'<span></span>'+
											'</div>');
									
									$('#visor_prev').click(function() { 
										if ($('#'+$(this).attr('class')).length > 0)
											$('#'+$(this).attr('class')).trigger('click');
										else
											$('img[id^='+$(this).attr('class')+'-]').trigger('click'); 
										return false;
									});
								}
								$('#visor_prev').css({'margin-top':(((height+2)/2)-23.5+30)}); 
								$('#visor_prev').attr('class', 'visor_'+(number-1)); 
							}
							else {
								$('#visor_prev').remove();
								$('#visor_prev').unbind('click');
							}

							//Update or append right arrow
							if (number < num_resizable_images-1) { 
							
								if (!$('#visor_next').length) {

									$('#visor_content')
										.before(
											'<div id="visor_next" class="visor_'+(number+1)+'">'+
												'<span></span>'+
											'</div>');
									
									$('#visor_next').click(function() { 
										if ($('#'+$(this).attr('class')).length > 0)
											$('#'+$(this).attr('class')).trigger('click');
										else
											$('img[id^="'+$(this).attr('class')+'-"]').trigger('click'); 
										return false;
									});
								}
								$('#visor_next')
									.css({'margin-left':(width-28),
												'margin-top':(((height+2)/2)-23.5+30)}); 
								$('#visor_next').attr('class', 'visor_'+(number+1)); 
							}
							else {
								$('#visor_next').remove();
								$('#visor_next').unbind('click');
							}
						}
						else $('#visor_prev, #visor_next').remove();

						//Update image
				 		$('#visor_content').height(height).width(width).
				 			html('<img src="'+path+'" width="'+width+'" height="'+height+'" />')
				 				.fadeIn(1500);	
					}

					function draw_visor() {

						$('#visor').remove(); 					//Remove previous visor if exist
						$('div.video object').remove(); //Fix remove youtube videos

						//Append body basic visor
						$('body').css('overflow', 'hidden').
							append(

								//Visor shadow
								'<div id="visor">'+

									//Top controls
									'<div id="visor_controls_top">'+
										'<span id="visor_close">&#10005;</span>'+ //Close button

										//Actual number and counter
										((show_number)? 
											'<span id="visor_number">'+(number+1)+' / '+
											(num_resizable_images)+'</span>' : '')+

										//Title
										((show_title && element.attr("title") != undefined)? 
											'<p id="visor_title">'+element.attr("title")+'</p>':'')+

									'</div>'+

									//Real visor
									'<div id="visor_border">'+

										((show_arrows)?

											//Go to previous control
											((number >= 1)? 
												'<div id="visor_prev" class="visor_'+(number-1)+'">'+
												'</div>' : '')+

											//Go to next control
											((number < num_resizable_images-1)? 
												'<div id="visor_next" class="visor_'+(number+1)+'">'+
												'</div>' : '') : '')+

										//Image container
										'<div id="visor_content"></div>'+

									'</div>'+

									//Bottom controls
									((show_controls)? 
										'<div id="visor_controls_bottom">'+
											'<a id="visor_goto" href="#'+element.attr("id")+'">'+
												'Go to image in the document'+
											'</a>'+
										'</div>' : '')+

								'</div>');

						//Adjust Visor shadow height to document height
						$('#visor').height($(document).height());

						//Adjust top position arrows
						$('#visor_prev, #visor_next')
							.css('margin-top',(((height+2)/2)-23.5+30));

						//Adjust left position arrows
						$('#visor_next').css('margin-left',width-28);

						//Content and arrows hide while loading effect
						$('#visor_content, #visor_prev, #visor_next').hide();

						//Adjust width controls
						$("#visor_controls_top, #visor_controls_bottom")
							.width(width+2).hide();

						//Adjust top left visor border 
						$('#visor_border').width(width+20)
							.css(
								{'margin-top':
									(($(window).height()-$('#visor_border').height())/2), 
							   'margin-left':
							   	(($(window).width()-width-20-2)/2)});	

						/////// Handle controls

						//Handle click Arrows
						$('#visor_prev, #visor_next').click(function() {
							if ($('#'+$(this).attr('class')).length > 0)
								$('#'+$(this).attr('class')).trigger('click');
							else
								$('img[id^="'+$(this).attr('class')+'-"]').trigger('click'); 
							return false;
						});

						$(document).keyup(function(e) {

							switch (e.keyCode) {
								case 37: //Left -> visor_prev
									if ($('#'+$('#visor_prev').attr('class')).length > 0)
										$('#'+$('#visor_prev').attr('class')).trigger('click');
									else
										$('img[id^="'+$('#visor_prev').attr('class')+'-"]')
											.trigger('click'); 
									break;
								case 39: //Right -> visor_next
									if ($('#'+$('#visor_next').attr('class')).length > 0)
										$('#'+$('#visor_next').attr('class')).trigger('click');
									else
										$('img[id^="'+$('#visor_next').attr('class')+'-"]')
											.trigger('click'); 
									break;
							}
						});

						animate_visor();
					}

					if ($(window).height() > 250 && $(window).width() > 250) {

						proportion_visor(); //if image bigger then window, 
																//calculate proportion
						if (!$('#visor').length) draw_visor();
						else update_visor();

					 	/// Handle close visor events

					 	//Close Button
						$('#visor_close').click(function() { close_visor(); return false });

						//Go to button
						$('#visor_goto').click(function() { close_visor(); });

						//Press "esc" key
						$(document).keyup(function(e) { 
							if (e.keyCode == 27 || e.keyCode == 18 || 
								  e.keyCode == 69 || e.keyCode == 16 || e.keyCode == 81) 
								close_visor(); 
						});
					}
					else 
						console.log('CAVISOR ERROR: resolution less than 250x250px');
				}

				//Compatibility fix Lazy Load
				var element_src = 
					($(this).attr('data-original') != undefined)? 
						$(this).attr('data-original') : $(this).attr('src');

				///Handle custom options

				//Get specific size parameters
				var element_width = 
					parseInt(($(this).attr('width') != undefined)? 
						$(this).attr('width') : $(this).width());
				var element_height = 
					parseInt(($(this).attr('height') != undefined)? 
						$(this).attr('height') : $(this).height());

				var show_controls = 
					(!$(this).hasClass('no-controls'))? settings.controls : false;

				var show_title = 
					(!$(this).hasClass('no-title'))? settings.title : false;

				var show_number =
					(!$(this).hasClass('no-number') && 
					 !$(this).hasClass('single-image'))? settings.number : false;

				var show_arrows =
					 (!$(this).hasClass('single-image'))? settings.arrows : false;

				//Get image parameters
				var parameters = 
					($(this).attr('id') != undefined)? 
						$(this).attr('id').split('-') : '';

				if (parameters.length > 1) {

					var width = parseInt(parameters[1].match(/[\d]+$/));
					var height = 
						(parameters.length > 2)? parseInt(parameters[2].match(/[\d]+$/)) :
						((element_height*width)/element_width);
				}
				else {

					var width = settings.width;
					var height = Math.round((element_height*width)/element_width);
				}

				//Get image number
				var number = 
					(!$(this).hasClass('single-image'))? 
						parseInt(parameters[0].match(/[\d]+$/)) : 0;

				var path = ($(this).hasClass('same-image'))? element_src : 
					element_src.substr(0, element_src.length-9)+'big.'+
						element_src.split('.').pop();

					visor_image(path, width, height, true, number,$(this));

				return false;
			});
		});
	}
}( jQuery ));
