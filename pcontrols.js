window.keypresses = [];
for (var c1=0;c1<256;c1++)window.keypresses[c1]=false;

function mobMove ()
{
	if (activeMob!=null&&!activeMob.attackedThisTurn&&activeMob.remainingMoves>0&&Date.now()>activeMob.ready)
	{
		activeMob.forceMove('walk',"");
	}
}
function mobTurn ()
{
	
}
function pulse ()
{
	//if there's set path, follow it.  If the move key is still pressed, follow it
}
document.addEventListener('keydown', function(event) {
	switch (event.keyCode)
	{
		case 38:
		mobMove();
		break;
		default:
		break;
	}
});
document.addEventListener('keyup', function(event) {
	
});
//uses ActivePlayerCharacter

