window.Attacks['raygun'] = function (mob,field)
{
	//first, figure out what mobs might be in line
	//second, figure out which one's closest
	//third, figure out if the shot is blocked
	if (mob.attackedThisTurn)return false;
	var squaresInSight = [];
	switch (mob.facing)
	{
		case 's':
		var thisY = mob.y+1;
		while (thisY < field.grid[0].length)
		{
			if (field.grid[mob.x][thisY] != 0)break;
			squaresInSight.push([mob.x,thisY]);
			thisY++;
		}
		break;
		case 'e':
		var thisX = mob.x+1;
		while (thisX < field.grid.length)
		{
			if (field.grid[thisX][mob.y] != 0)break;
			squaresInSight.push([thisX,mob.y]);
			thisX++;
		}
		break;
		case 'n':
		var thisY = mob.y-1;
		while (thisY > 0)
		{
			if (field.grid[mob.x][thisY] != 0)break;
			squaresInSight.push([mob.x,thisY]);
			thisY--;
		}
		break;
		case 'w':
		var thisX = mob.x-1;
		while (thisX < field.grid.length)
		{
			if (field.grid[thisX][mob.y] != 0)break;
			squaresInSight.push([thisX,mob.y]);
			thisX--;
		}
		break;
		default:
		console.log("Error: weird facing");
		return false;
		break;
	}
	
	//check if space is blocked by mob
	var targetMob = null;
	var mobs = field.getMobs();
	for (var c1=0;c1<squaresInSight.length;c1++)
	{
		var thisSquare = squaresInSight[c1];
		for (var c2=0;c2<mobs.length;c2++)
		{
			var thisMob = mobs[c2];
			if (thisMob.x == thisSquare[0] && thisMob.y == thisSquare[1])
			{
				targetMob = thisMob;
				break;
			}
		}
	}
	if (targetMob != null)
	{
		//
	}
	mob.attackedThisTurn = true;
	return true;
}