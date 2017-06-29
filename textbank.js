var TextBank = {};
TextBank.conversations = {};
TextBank.dynamic = {};

//default to be overridden later
TextBank.errors = {};
TextBank.errors.token_not_found = '<Error: Token "$token%" not found.>';

function getText (key,customSubs)
{
	var keyParts = key.split('.');
	var bank = TextBank;
	for (var c1=0,len=keyParts.length;c1<len;c1++)
	{
		bank = bank[keyParts[c1]];
		if (bank ===null)return getText('errors.token_not_found',{'$token%':key})
	}
	var output = bank;
	var subs = output.match(/\$\w+\%/g);
	//if (subs==null)subs=[];
	for (var c1=0,len=subs.length;c1<len;c1++)
	{
		if (customSubs.hasOwnProperty(subs[c1]))output = output.replace(subs[c1],customSubs[subs[c1]]);
		else if (TextBank.dynamic.hasOwnProperty(subs[c1]))output = output.replace(subs[c1],TextBank.dynamic[subs[c1]]());
	}
	return output;
}
