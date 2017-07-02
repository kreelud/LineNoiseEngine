function WarehouseMap ()
{
	
}
WarehouseMap.prototype.enter = function (entryPoint)
{
	//-----
	//position party members
	//-----
	
	//find active
	var partyMembers = Object.keys(characterSheet.party);
	var activeParty = [];
	for (var c1=0,len=partyMembers.length;c1< len; c1++)
	{
		var thisMember = characterSheet.party[partyMembers[c1]];
		if (thisMember.active)
		{
			activeParty.push(thisMember);
		}
	}
	
	//find empty space
	
	
	//-----
	//position enemies
	//-----
	
};
