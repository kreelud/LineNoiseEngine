window.Attacks['walk'] = function (mob,target,field)
{
	//facing will be adjusted prior to this point
	//check if tile is clear
	if (field.tileImpassable(target[0],target[1]))return false;
	//check the distance
	if (Math.round(Math.sqrt(Math.pow(target[0]-mob.x,2)+Math.pow(target[1]-mob.y,2)))!=1)return false;
	if (mob.remainingMoves<1)return false;
	//make the move
	mob.currentMove = 'walk';
	mob.currentMoveTime = Date.now();
	mob.x = target[0];
	mob.y = target[1];
	mob.remainingMoves--;
	field.refreshVision();
	return true;
}
