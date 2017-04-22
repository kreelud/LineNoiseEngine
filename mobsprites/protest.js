//preloads
(function ()
{
	var blinkArray = ['blink','open'];
	var directArray = [1,2,3,4,6,7,8,9];  //1-9 except 5
	var frameArray = ['flinch','kneebound','stand','touch1','touch2','walk1','walk2'];
	for (var c1=0,len1=blinkArray.length;c1<len1;c1++)
	{
		var thisBlink = blinkArray[c1];
		for (var c2=0,len2=directArray.length;c2<len2;c2++)
		{
			var thisDirect = directArray[c2].toString();
			for (var c3=0,len3=frameArray.length;c3<len3;c3++)
			{
				thisFrame = frameArray[c3];
				MobSpritePreloadStack.push
				({
					'label':'protest_'+thisBlink+'_'+thisDirect+'_'+thisFrame,
					'src':'assets/protest/'+thisBlink+'/'+thisDirect+'/'+thisFrame+'.png'
				});
			}
		}
	}
}());//putting this in a function to avoid taking up global var names

MobSprites.Protest = function (mob)
{
	var blinking = 'open';
	var time = Date.now();
	var xOffset = -72;
	var yOffset = -115;
	
	var blinkCyclePoint = (time - mob.aniOffset) % 10000;
	if (blinkCyclePoint < 1000)
	{
		blinking = 'blink';
	}
	var animationComplete = false;
	var img = imageCache['protest_'+blinking+'_'+mob.facing+'_stand'];
	if (mob.currentMove=='walk')
	{
		var walkCycleCompletion = (time - mob.currentMoveTime) / 700;
		if (walkCycleCompletion >= 1)
		{
			animationComplete = true;
		}
		else
		{
			var walkCyclePoint = Math.round((time - mob.aniOffset) / 500) % 2; //which frame for to play
			var previous = mob.lastTile;
			var currentX = (mob.x-previous[0]) * walkCycleCompletion + previous[0];
			var currentY = (mob.y- previous[1])* walkCycleCompletion + previous[1];
			var img = imageCache['protest_'+blinking+'_'+mob.facing+'_walk'+(walkCyclePoint+1)];
			return[{'x':currentX,'y':currentY,'xOffset':xOffset,'yOffset':yOffset,'img':img,'ac':animationComplete}];
		}
	}
	else if (mob.currentMove=='punch')
	{
		
	}
	
	if (mob.currentMove!='')animationComplete = true;
	return[{'x':mob.x,'y':mob.y,'xOffset':xOffset,'yOffset':yOffset,'img':img,'ac':animationComplete}];
}
