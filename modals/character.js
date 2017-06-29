//a modal to save, load, set options
function CharacterModal ()
{
	Modal.call(this);
	//show stats and skills
	var stats = ['str','agi','int','cha'];
	for (var c1=0,len=stats.length; c1 <len;c1++)
	{
		var thisStat = stats[c1];
		var statRow = document.createElement('div');
		
	}
}
CharacterModal.prototype = Object.create(Modal.prototype);
