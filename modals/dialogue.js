//a modal to show dialogue
function DialogueModal ()
{
	Modal.call(this);
	this.playerBox = document.createElement('div');
	this.npcBox = document.createElement('div');
	this.npcPortrait = document.createElement('img');
	this.playerPortrait = document.createElement('img');
	
	this.contentWindow.appendChild(this.playerBox);
	this.contentWindow.appendChild(this.npcBox);
	this.contentWindow.appendChild(this.playerPortrait);
	this.contentWindow.appendChild(this.npcPortrait);
}
DialogueModal.prototype = Object.create(Modal.prototype);
DialogueModal.prototype.showConvo = function (convoK)
{
	if (!convoK)return;
	var convo = TextBank.conversations[convoK].init;
	this.npcBox.innerHTML = convo.convo;
	this.playerBox.innerHTML = '';
	for (var c1=0,len=convo.resp.length;c1<len;c1++)
	{
		var thisResp = convo.resp[c1];
		var newDiv = document.createElement('div');
		newDiv.innerHTML = thisResp.txt;
		newDiv.resp = thisResp;
		newDiv.onmouseover = function (evt)
		{
			var target = evt.target;
			var nodes = this.playerBox.childNodes;
			for (var c1=0,len=nodes.length;c1<len;c1++)
			{
				nodes[c1].style.backgroundColor = 'black';
			}
			target.style.backgroundColor = 'yellow';
		}.bind(this);
		newDiv.onmouseclick = function (evt)
		{
			var target = evt.target;
			if (target.resp.proc != null)target.resp.proc();
			this.showConvo(target.resp.convoKey);
		}.bind(this);
		this.playerBox.appendChild(newDiv);
	}
}
