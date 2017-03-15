MobSprites.TestSprite = function (mob)
{
	var img = document.createElement('canvas');
	img.width = 60;
	img.height = 45;
	img.getContext('2d').drawImage(imageCache['basic'],0,45,60,45,0,0,60,45);
	var animationComplete = false;
	if (mob.currentMove!='')animationComplete = true;
	return[{'x':mob.x,'y':mob.y,'img':img,'ac':animationComplete}];
}
