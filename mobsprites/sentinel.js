MobSprites.Sentinel = function (mob)
{
	var img = document.createElement('canvas');
	img.width = 60;
	img.height = 45;
	img.getContext('2d').drawImage(imageCache['basic'],0,45,60,45,0,0,60,45);
	var animationComplete = false;
	if (mob.currentMove!='')
	{
		if (mob.currentMove=='alert')
		{
			if (Date.now() - mob.currentMoveTime > 5000)
			{
				animationComplete = true;
				console.log(mob.knownMobs);
			}
		}
		else animationComplete = true;
	}
	var output = [{'x':mob.x,'y':mob.y,'img':img,'ac':animationComplete}];
	
	//temporary, for vision test
	/*
	var tiles = mob.field.getVisibleTiles(mob);
	for (var c1=0,len=tiles.length;c1<len;c1++)
	{
		output.push({'x':tiles[c1][0],'y':tiles[c1][1],'img':img,'ac':animationComplete});
	}*/
	
	return output;
}
