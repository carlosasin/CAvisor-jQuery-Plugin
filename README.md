CAvisor-jQuery-Plugin
=====================

CAvisor is small javascript library used to overlay images on top of the current page. It's a snap to setup and works on all modern browsers.

### Author
Carlos Asín
### Demo page 
	https://googledrive.com/host/0BwzDh0DsxCXlS3g5TF9kS1BDWHM/cavisor-demo/

## How to install:

- Load js libreray after jQuery
- Load css
- Add at the end of body 
	<script type="text/javascript">
		$().cavisor();
	</script>

## How to use:

### Basic use:
- Name the images as:
	- thumbnail -> imagename_small.extension
	- big image -> imagename_big.extension
- Add class visor to thumbnail images

### Settings:
- number -> show top counter and current number
- title -> show image title
- arrows -> show movement controls
- controls -> show bottom controls
- width -> default image width

### Clases (individual image options):
- same-image -> use same image to overlay
- single-image -> hide movement controls and overlay it alone
- no-number -> hide counter and current number
- no-title -> hide image title
- no-controls -> hide bottom controls

### Specify image size (if big image not proportional to small image):
- id="width_xxx-height_xxx"

## Additional info:

- Compatible with Lazyload

## To-Do:

- Adjust title size if bigger than visor