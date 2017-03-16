window.Attacks['wait'] = function (mob,target,field)
{
	mob.remainingMoves = 0;
	mob.attackedThisTurn = true;
	return true;
}