window.Attacks['punch'] = function (actor,target,field)
{
	//check distance
	if (Math.round(Math.sqrt(Math.pow(target[0]-mob.x,2)+Math.pow(target[1]-mob.y,2)))!=1)return false;
	//reduce morale
	return true;
}

