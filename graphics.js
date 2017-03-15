var imageLibrary = [];
var pendingImages = 0;
var func = function(){};

function loadImage (key,url)
{
	imageLibrary[key]= new Image;
	imageLibrary[key].src = url;
	pendingImages++;
	imageLibrary[key].onload = function ()
	{
		pendingImages--;
		if (pendingImages==0)func();
	}
}
function fullyLoaded (funci)
{
	func = funci;
	if (pendingImages==0)func();
}
