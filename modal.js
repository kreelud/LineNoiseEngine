function Modal ()
{

	this.html = document.createElement('div');
	this.html.style.position = 'absolute';
	this.html.style.backgroundColor = 'rgba(0,0,0,0.5)';
	this.html.style.width = '100%';
	this.html.style.height = '100%';
	this.html.onclick = this.close.bind(this);
	this.html.onmousemove = function (evt)
	{
		evt.stopPropagation();
	}
	this.html.style.zIndex = 4000;

	this.contentWindow = document.createElement('div');
	this.contentWindow.style.backgroundColor = 'white';
	this.contentWindow.style.width = '50%';
	this.contentWindow.style.height = '70%';
	this.contentWindow.style.margin = '5% auto';
	this.contentWindow.onclick = function (evt){evt.stopPropagation();};
	this.html.appendChild(this.contentWindow);
	
}
Modal.prototype.onClose = function ()
{
	
};
Modal.prototype.close = function (evt)
{
	this.onClose();
	this.html.style.visibility='hidden';
	if (evt!=null)evt.stopPropagation();
};
Modal.prototype.show = function ()
{
	this.html.style.visibility='visible';
};
