window.Attacks['wait'] = function (mob,field)
{
	mob.remainingMoves = 0;
	mob.attackedThisTurn = true;
	return true;
}