window.Attacks['untie'] = function (actor,target,field)
{
	//check distance
	if (Math.round(Math.sqrt(Math.pow(target[0]-mob.x,2)+Math.pow(target[1]-mob.y,2)))!=1)return false;
	
	var targetMob = field.mobAt(target);
	targetMob.bindingPoints = Math.max(0,targetMov.bindingPoints-30);
	return true;
}

