window.Attacks['alert'] = function (mob,target,field)
{
	
	//make the move
	mob.currentMove = 'alert';
	mob.currentMoveTime = Date.now();

	

	mob.remainingMoves = 0;
	mob.attackedThisTurn = true;
	return true;
}
