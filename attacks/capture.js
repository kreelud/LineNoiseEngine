window.Attacks['capture'] = function (actor,target,field)
{
	
	if (target.bindingPoints > 0)
	{
		target.bindingPoints += 20;
	}
	else
	{
		//find out if actor is known to target
		var sneakBonus = 1.5;
		if (target.knownMobs[actor.name])sneakBonus = 1;
		//find relative position
		var circle = Math.PI * 2;
		var circleSection = Math.PI / 3; //60 degrees
		var angle = (Math.atan2(target.y-actor.y,target.x - actor.x) + circle) % circle;
		var angleDiff = Math.abs(angle - target.facingAngle());
	
		var positionAdvantage = Math.floor(angleDiff / circleSection);
	
		switch (positionAdvantage)
		{
			case 0:
			target.capturePoints += 4 * sneakBonus;
			break;
			case 1:
			target.capturePoints += 6 * sneakBonus;
			break;
			default:
			target.capturePoints += 8 * sneakBonus;
			break;
		}
		if (target.capturePoints >= 12)
		{
			target.bindingPoints += 20;
			target.currentMove = 'captured';
			target.currentMoveTime = Date.now();
		}
	}
	actor.endTurn();
	return true;
}

