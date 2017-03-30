window.Attacks['wait'] = function (mob,target,field)
{
	mob.endTurn();
	console.log(mob.name+" turn ended");
	return true;
}
