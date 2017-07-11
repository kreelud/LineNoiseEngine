function ButtonSet (buttons,configuration={})
{
	this.buttons = [];
	
	for (var c1=0,len=buttons.length;c1<len;c1++)
	{
		var newButton = document.createElement('button');
		newButton.className = 'bleep_button';
		newButton.innerHTML = buttons[c1].tex;
		newButton.value = buttons[c1].val;
		newButton.pushed = false;
		newButton.active = true;
		this.buttons.push(newButton);
		
		if (configuration.onclick)
		{
			newButton.onclick = configuration.onclick;
		}
		else if (configuration.maxRadio)
		{
			this.maxRadio = configuration.maxRadio;
			newButton.onclick = function (evt)
			{
				if (!evt.target.active)return;
				evt.target.pushed = !evt.target.pushed;
				this.checkMaxRadio.bind(this)();
			}.bind(this);
		}
	}
};
ButtonSet.prototype.checkMaxRadio = function ()
{
	var counter = 0;
	for (var c1=0,len=this.buttons.length;c1<len;c1++)
	{
		if (this.buttons[c1].pushed)counter++;
	}
	var atMax = counter >= this.maxRadio;
	for (var c1=0,len=this.buttons.length;c1<len;c1++)
	{
		var thisButton = this.buttons[c1];
		if (thisButton.pushed)thisButton.className = 'bleep_button_selected';
		else if (atMax)
		{
			thisButton.active = false;
			thisButton.className = 'bleep_button_disabled';
		}
		else
		{
			thisButton.active = true;
			thisButton.className = 'bleep_button';
		}
	}
};
ButtonSet.prototype.getPushed = function ()
{
	var output = [];
	for (var c1=0,len=this.buttons.length;c1<len;c1++)
	{
		if (this.buttons[c1].pushed)output.push(this.buttons[c1].value);
	}
	return output;
};
