window.Attacks['wait'] = function (mob,target,field)
{
	mob.endTurn();
	characterSheet.cout(mob.name+" turn complete.");
	return true;
}
