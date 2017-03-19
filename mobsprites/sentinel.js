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
				console.log(Object.keys(mob.knownMobs));
				animationComplete = true;
			}
		}
		else animationComplete = true;
	}
	return[{'x':mob.x,'y':mob.y,'img':img,'ac':animationComplete}];
}
