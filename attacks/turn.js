window.Attacks['turn'] = function (mob,field)
{
	switch (mob.facing)
	{
		case 's':
		mob.facing = 'w';
		break;
		case 'e':
		mob.facing='s';
		break;
		case 'n':
		mob.facing = 'e'
		break;
		case 'w':
		mob.facing = 'n';
		break;
		default:
		console.log("Error: weird facing");
		return false;
		break;
	}
	return true;
};
window.Attacks['turnN'] = function (mob,field)
{
	mob.facing = 'n';
	return true;
};
window.Attacks['turnS'] = function (mob,field)
{
	mob.facing = 's';
	return true;
};
window.Attacks['turnE'] = function (mob,field)
{
	mob.facing = 'e';
	return true;
};
window.Attacks['turnW'] = function (mob,field)
{
	mob.facing = 'w';
	return true;
};
