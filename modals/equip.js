//a modal to show equip abilities
function EquipModal ()
{
	Modal.call(this);
}
EquipModal.prototype = Object.create(Modal.prototype);

EquipModal.prototype.loadEquip = function (mob)
{
	var skillTable = document.createElement("table");
	var equip = ['wait','end_turn'];
	equip = equip.concat(mob.getEquipment());
	for (var c1=0,len=equip.length;c1<len;c1++)
	{
		var thisEquip = equip[c1];

		var newRow = document.createElement('tr');
		var newRowImageHolder = document.createElement('th');
		var newRowNameHolder = document.createElement('th');
		var icon = document.createElement('img');
		
		skillTable.appendChild(newRow);
		newRow.appendChild(newRowImageHolder);
		newRow.appendChild(newRowNameHolder);
		newRowImageHolder.appendChild(icon);
		
		newRowNameHolder.innerHTML = thisEquip;
	}
};
