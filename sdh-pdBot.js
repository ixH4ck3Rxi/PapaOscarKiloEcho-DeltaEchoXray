const Discord=require('discord.js');
const bot=new Discord.Client();
const config={
	ownerID: "237597448032354304",
	serverID: "433736422932086786",
	cmdPrefix: "!",
	adminRoleName: "Dev",
	modRoleName: "Moderist",
	donorRoleNames: ["Diamondist","Sugar Daddy","Platinumist","Supporter"],
	activeExemptRoles: ["Systemist","Dev","Moderist"],
	inactiveMonthLimit: 1,
	inactiveWeekLimit: 1,
	token: "NDM2NjQ5ODg4MTEwMDg0MDk2.Dbqlbg.4zbEY2FqgBLx2v4BmM7aE5oEtwg",
    images: {
        warning: "https://raw.githubusercontent.com/JennerPalacios/PokeHelp-Bot/master/img/User-Warned.png",
        muted: "https://raw.githubusercontent.com/JennerPalacios/PokeHelp-Bot/master/img/Poke-muted.png",
        kicked: "https://raw.githubusercontent.com/JennerPalacios/PokeHelp-Bot/master/img/Poke-kicked.png",
        banned: "https://raw.githubusercontent.com/JennerPalacios/PokeHelp-Bot/master/img/Poke-banned.png"
    }
};
const pokemon=require('./data/pokemon.json');
const moves=require('./data/moves.json');
const fs=require('fs');
const pokeTypes=require('./data/sdh-types.json');

const request=require("request");

//
// POKEMON IMAGE URL, IE: https://raw.githubusercontent.com/JennerPalacios/Poke-IMGs/master/
//
const pokeIMG="https://raw.githubusercontent.com/JennerPalacios/Poke-IMGs/master/shuffle/";

//
// COMMON VARIABLES, ARRAYS, AND OBJECTS
// [embedMSG,skip,msg1,msg2,command,args,args2,guild,member,channel,mentioned,channeled,fetchOutput]=["","","","","","","","","","","","",""];
var embedMSG="", skip="", msg1="", msg2="", command="", args="", args2="",
	guild="", member="", channel="", mentioned="", channeled="", fetchOutput="", maxData=387;

var pokeNames=[
	"bulbasaur","ivysaur","venusaur","charmander","charmeleon","charizard","squirtle","wartortle","blastoise","caterpie","metapod","butterfree","weedle",
	"kakuna","beedrill","pidgey","pidgeotto","pidgeot","rattata","raticate","spearow","fearow","ekans","arbok","pikachu","raichu","sandshrew","sandslash",
	"nidoran-f","nidorina","nidoqueen","nidoran-m","nidorino","nidoking","clefairy","clefable","vulpix","ninetales","jigglypuff","wigglytuff","zubat",
	"golbat","oddish","gloom","vileplume","paras","parasect","venonat","venomoth","diglett","dugtrio","meowth","persian","psyduck","golduck","mankey",
	"primeape","growlithe","arcanine","poliwag","poliwhirl","poliwrath","abra","kadabra","alakazam","machop","machoke","machamp","bellsprout","weepinbell",
	"victreebel","tentacool","tentacruel","geodude","graveler","golem","ponyta","rapidash","slowpoke","slowbro","magnemite","magneton","farfetchd","doduo",
	"dodrio","seel","dewgong","grimer","muk","shellder","cloyster","gastly","haunter","gengar","onix","drowzee","hypno","krabby","kingler","voltorb",
	"electrode","exeggcute","exeggutor","cubone","marowak","hitmonlee","hitmonchan","lickitung","koffing","weezing","rhyhorn","rhydon","chansey","tangela",
	"kangaskhan","horsea","seadra","goldeen","seaking","staryu","starmie","mr-mime","scyther","jynx","electabuzz","magmar","pinsir","tauros","magikarp",
	"gyarados","lapras","ditto","eevee","vaporeon","jolteon","flareon","porygon","omanyte","omastar","kabuto","kabutops","aerodactyl","snorlax","articuno",
	"zapdos","moltres","dratini","dragonair","dragonite","mewtwo","mew","chikorita","bayleef","meganium","cyndaquil","quilava","typhlosion","totodile",
	"croconaw","feraligatr","sentret","furret","hoothoot","noctowl","ledyba","ledian","spinarak","ariados","crobat","chinchou","lanturn","pichu","cleffa",
	"igglybuff","togepi","togetic","natu","xatu","mareep","flaaffy","ampharos","bellossom","marill","azumarill","sudowoodo","politoed","hoppip","skiploom",
	"jumpluff","aipom","sunkern","sunflora","yanma","wooper","quagsire","espeon","umbreon","murkrow","slowking","misdreavus","unown","wobbuffet","girafarig",
	"pineco","forretress","dunsparce","gligar","steelix","snubbull","granbull","qwilfish","scizor","shuckle","heracross","sneasel","teddiursa","ursaring",
	"slugma","magcargo","swinub","piloswine","corsola","remoraid","octillery","delibird","mantine","skarmory","houndour","houndoom","kingdra","phanpy",
	"donphan","porygon2","stantler","smeargle","tyrogue","hitmontop","smoochum","elekid","magby","miltank","blissey","raikou","entei","suicune","larvitar",
	"pupitar","tyranitar","lugia","ho-oh","celebi","treecko","grovyle","sceptile","torchic","combusken","blaziken","mudkip","marshtomp","swampert",
	"poochyena","mightyena","zigzagoon","linoone","wurmple","silcoon","beautifly","cascoon","dustox","lotad","lombre","ludicolo","seedot","nuzleaf",
	"shiftry","taillow","swellow","wingull","pelipper","ralts","kirlia","gardevoir","surskit","masquerain","shroomish","breloom","slakoth","vigoroth",
	"slaking","nincada","ninjask","shedinja","whismur","loudred","exploud","makuhita","hariyama","azurill","nosepass","skitty","delcatty","sableye",
	"mawile","aron","lairon","aggron","meditite","medicham","electrike","manectric","plusle","minun","volbeat","illumise","roselia","gulpin","swalot",
	"carvanha","sharpedo","wailmer","wailord","numel","camerupt","torkoal","spoink","grumpig","spinda","trapinch","vibrava","flygon","cacnea","cacturne",
	"swablu","altaria","zangoose","seviper","lunatone","solrock","barboach","whiscash","corphish","crawdaunt","baltoy","claydol","lileep","cradily",
	"anorith","armaldo","feebas","milotic","castform","kecleon","shuppet","banette","duskull","dusclops","tropius","chimecho","absol","wynaut","snorunt",
	"glalie","spheal","sealeo","walrein","clamperl","huntail","gorebyss","relicanth","luvdisc","bagon","shelgon","salamence","beldum","metang","metagross",
	"regirock","regice","registeel","latias","latios","kyogre","groudon","rayquaza","jirachi","deoxys","turtwig","grotle","torterra","chimchar","monferno",
	"infernape","piplup","prinplup","empoleon","starly","staravia","staraptor","bidoof","bibarel","kricketot","kricketune","shinx","luxio","luxray","budew",
	"roserade","cranidos","rampardos","shieldon","bastiodon","burmy","mothim","combee","vespiquen","pachirisu","buizel","floatzel","cherubi","cherrim",
	"shellos","gastrodon","ambipom","drifloon","drifblim","buneary","lopunny","mismagius","honchkrow","glameow","purugly","chingling","stunky","skuntank",
	"bronzor","bronzong","bonsly","mime jr","happiny","chatot","spiritomb","gible","gabite","garchomp","munchlax","riolu","lucario","hippopotas",
	"hippowdon","skorupi","drapion","croagunk","toxicroak","carnivine","finneon","lumineon","mantyke","snover","abomasnow","weavile","magnezone",
	"lickilicky","rhyperior","tangrowth","electivire","magmortar","togekiss","yanmega","leafeon","glaceon","gliscor","mamoswine","porygon-z","gallade",
	"probopass","dusknoir","froslass","rotom","uxie","mesprit","azelf","dialga","palkia","heatran","regigigas","cresselia","phione","manaphy","darkrai",
	"arceus","victini","snivy","servine","serperior","tepig","pignite","emboar","oshawott","dewott","samurott","patrat","watchog","lillipup","herdier",
	"stoutland","purrloin","liepard","pansage","simisage","pansear","simisear","panpour","simipour","munna","musharna","pidove","tranquill","unfezant",
	"blitzle","zebstrika","roggenrola","boldore","gigalith","woobat","swoobat","drilbur","excadrill","audino","timburr","gurdurr","conkeldurr","tympole",
	"palpitoad","seismitoad","throh","sawk","sewaddle","swadloon","leavanny","venipede","whirlipede","scolipede","cottonee","whimsicott","petilil",
	"lilligant","basculin","sandile","krokorok","krookodile","darumaka","darmanitan","maractus","dwebble","crustle","scraggy","scrafty","sigilyph","yamask",
	"cohagrigus","tirtouga","carracosta","archen","archeops","trubbish","garbodor","zorua","zoroark","minccino","cinccino","gothita","gothorita",
	"gothitelle","solosis","duosion","reuniclus","ducklett","swanna","vanillite","vanillish","vanilluxe","deerling","sawsbuck","emolga","karrablast",
	"escavalier","foongus","amoonguss","frillish","jellicent","alomomola","joltik","galvantula","ferroseed","ferrothorn","klink","klang","klinklang",
	"tynamo","eelektrik","eelektross","elgyem","beheeyem","litwick","lampent","chandelure","axew","fraxure","haxorus","cubchoo","beartic","cryogonal",
	"shelmet","accelgor","stunfisk","mienfoo","mienshao","druddigon","golett","golurk","pawniard","bisharp","bouffalant","rufflet","braviary","vullaby",
	"mandibuzz","heatmor","durant","deino","zweilous","hydreigon","larvesta","volcarona","cobalion","terrakion","virizion","reshiram","zekrom","kyurem",
	"keldeo","genesect","chespin","quilladin","chesnaught","fennekin","braixen","delphox","froakie","frogadier","greninja","bunnelby","diggersby",
	"fletchling","fletchinder","talonflame","scatterbug","spewpa","vivillon","litleo","pyroar","flabébé","floette","florges","skiddo","gogoat","pancham",
	"pangoro","furfrou","espurr","meowstic","honedge","doublade","spritzee","aromatisse","swirlix","slurpuff","inkay","malamar","binacle","barbaracle",
	"skrelp","dragalge","clauncher","clawitzer","helioptile","heliolisk","tyrunt","tyrantrum","amaura","aurorus","sylveon","hawlucha","dedenne","carbink",
	"goomy","sliggoo","goodra","klefki","phantump","trevenant","pumpkaboo","gourgeist","bergmite","avalugg","noibat","noivern","xerneas","yveltal",
	"zygarde","diancie","volcanion","rowlet","dartrix","decidueye","litten","torracat","incineroar","popplio","brionne","primarina","pikipek","trumbeak",
	"toucannon","yungoos","gumshoos","grubbin","charjabug","vikavolt","crabrawler","crabominable","oricorio","cutiefly","ribombee","rockruff","lycanroc",
	"wishiwashi","mareanie","toxapex","mudbray","mudsdale","dewpider","araquanid","fomantis","lurantis","morelull","shiinotic","salandit","salazzle",
	"stufful","bewear","bounsweet","steenee","tsareena","comfey","oranguru","passimian","wimpod","golisopod","sandygast","palossand","pyukumuku","silvally",
	"minior core","komala","turtonator","togedemaru","mimikyu","bruxish","drampa","dhelmise","jangmo-o","hakamo-o","kommo-o","tapu koko","tapu lele",
	"tapu bulu","tapu fini","cosmog","cosmoem","solgaleo","lunala","nihilego","buzzwole","pheromosa","xurkitree","celesteela","kartana","guzzlord",
	"necrozma","magearna","marshadow"
];

var pokeCPMultiplier=[
	0.094,0.135137432,0.16639787,0.192650919,0.21573247,0.236572661,0.25572005,0.273530381,
	0.29024988,0.306057377,0.3210876,0.335445036,0.34921268,0.362457751,0.37523559,0.387592406,
	0.39956728,0.411193551,0.42250001,0.432926419,0.44310755,0.4530599578,0.46279839,0.472336083,
	0.48168495,0.4908558,0.49985844,0.508701765,0.51739395,0.525942511,0.53435433,0.542635767,
	0.55079269,0.558830576,0.56675452,0.574569153,0.58227891,0.589887917,0.59740001,0.604818814,
	0.61215729,0.619399365,0.62656713,0.633644533,0.64065295,0.647576426,0.65443563,0.661214806,
	0.667934,0.674577537,0.68116492,0.687680648,0.69414365,0.700538673,0.70688421,0.713164996,
	0.71939909,0.725571552,0.7317,0.734741009,0.73776948,0.740785574,0.74378943,0.746781211,
	0.74976104,0.752729087,0.75568551,0.758630378,0.76156384,0.764486065,0.76739717,0.770297266,
	0.7731865,0.776064962,0.77893275,0.781790055,0.78463697,0.787473578,0.79030001
];
	
	
	
	

bot.on('ready', () => {
	console.info(timeStamp(2)+"-- DISCORD HELPBOT: "+bot.user.username+", POKEDEX MODULE IS READY --");
});


//////////////////////////
//						//
//		FUNCTIONS		//
//						//
//////////////////////////

function PrecisionRound(number, precision){
    let factor=Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

function ParseRange(query){
	try{
		if(query.includes("-")){
			return query.split("-")
		}
		if(isNaN(query) || query>15){
			return [15,15]
		}
		return [query,query]
	}
	catch(err){
		return [query,query]
	}
}



//
//	TIME STAMP FUNCTION
//
function timeStamp(type){
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	if(!type || type===1){
		return "`"+mo+"/"+da+"/"+yr.toString().slice(2)+"` **@** `"+hr+":"+min+"` "
	}
	if(type===2){
		return "["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] "
	}
	if(type===3){
		return "`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`"
	}
}



//
// FUNCTION: CALCULATE CP
//
function CalculateCP(pokemon, level, attack, defense, stamina){
    let CP=0;
    let remainder=level % 1;
    level=Math.floor(level);
    if(remainder===0 || remainder===0.5){
        let cpIndex=((level * 2) - 2) + (remainder * 2);
        let CPMultiplier=pokeCPMultiplier[cpIndex];
        let attackMultiplier=parseInt(pokemon.attack) + parseInt(attack);
        let defenseMultiplier=Math.pow(parseInt(pokemon.defense) + parseInt(defense),.5);
        let staminaMultiplier=Math.pow(parseInt(pokemon.stamina) + parseInt(stamina),.5);
        CPMultiplier=Math.pow(CPMultiplier,2);
        CP=(attackMultiplier * defenseMultiplier * staminaMultiplier * CPMultiplier) / 10;
        CP=Math.floor(CP);
        if(CP<10){CP=10}
    }
    return CP;
}

//
// FUNCTION: GET POKEMON ID
//
function getPokemonID(query){
	let [queryResult,pokemonID,errorMessage,n,startWord,meantThis,moreResults]=[{},"","","","","",""];
	
	// CHECK IF NUMBER
	if(Number.isInteger(parseInt(query))){
		pokemonID=query;
		// IF POKEMON ID: 0 OR HIGHER THAN 251 CANCEL
		if(pokemonID<1 || pokemonID>maxData) {
			errorMessage="⛔ **[**`ERROR`**]**: I only have info from 1 to "+maxData+".";
		}
	}
		
	// CHECK IF NAME EXIST
	if(!pokemonID){
		for (n=0;n<pokeNames.length;n++){
			if(pokeNames[n]===query){
				n++; pokemonID=n; n=pokeNames.length;
			}
		}
	}
		
	// SUGGEST A NAME
	if(!pokemonID){
		if(query.length>=4){
			startWord=query.slice(0,4);
			for (n=0;n<pokeNames.length;n++){
				if(pokeNames[n].startsWith(startWord)){
					meantThis += "`"+pokeNames[n] +"`, ";
				}
			}
		}
		if(query.length>=3){
			if(!meantThis){
				startWord=query.slice(0,3);
				for (n=0;n<pokeNames.length;n++){
					if(pokeNames[n].startsWith(startWord)){
						meantThis += "`"+pokeNames[n] +"`, ";
					}
				}
			}
		}
		if(query.length>=2){
			if(!meantThis){
				startWord=query.slice(0,2);
				for (n=0;n<pokeNames.length;n++){
					if(pokeNames[n].startsWith(startWord)){
						meantThis += "`"+pokeNames[n] +"`, ";
					}
				}
			}
		}
		if(query.length>=1){
			if(!meantThis){
				startWord=query.slice(0,1);
				for (n=0;n<pokeNames.length;n++){
					if(pokeNames[n].startsWith(startWord)){
						meantThis += "`"+pokeNames[n] +"`, ";
					}
				}
			}
		}
		if(!meantThis) { moreResults=", try again!"; }
		else { moreResults="... 🤔 did you mean:\n"+meantThis.slice(0,-2) }
		errorMessage="⛔ I couldn't find such Pokemon"+moreResults+"."; 
	}
	
	// BUILD COLLECITON
	queryResult={
		id: pokemonID,
		error: errorMessage
	};
	
	// SEND COLLECTION
	return queryResult
}


//
// FUNCTION: GET POKEMON DATA
//
function getPokemon(query){
	let [queryResult,pokeType,moveType1,moveType2,moveSet,pokeMoveSets,moveNumber,errorMessage,moveCount]=[{},"","","","","","","",1];
	
	if(!pokemon[query].top_moves){
		query++;
		return {error: "⛔ **[**`ERROR`**]**: No moves found for `"+pokemon[query].name+"`"}
	}
	if(!pokemon[query].type){
		return {error: "⛔ **[**`ERROR`**]**: No type found"}
	}
	for(n=0;n<pokemon[query].top_moves.length;n++){
		moveSet=pokemon[query].top_moves[n].split("/");
		for(moveNumber=1;moveNumber<291;moveNumber++){
			if(moves[moveNumber]){
				if(moves[moveNumber].name){
					if(moves[moveNumber].name===moveSet[0]){
						if(moves[moveNumber].type){
							moveType1=moves[moveNumber].type.toLowerCase()
						}
					}
				}
			}
		}
		for(moveNumber=1;moveNumber<291;moveNumber++){
			if(moves[moveNumber]){
				if(moves[moveNumber].name){
					if(moves[moveNumber].name===moveSet[1]){
						if(moves[moveNumber].type){
							moveType2=moves[moveNumber].type.toLowerCase()
						}
					}
				}
			}
		}
		// console.info("["+moveType1+"],["+moveType2+"]");
		if(!moveType1){ pokeMoveSets="\n⚠ No `DATA` available yet..." }
		else{ pokeMoveSets+="\n"+pokeTypes[moveType1].emoji+moveSet[0]+", "+pokeTypes[moveType2].emoji+moveSet[1] }
		moveCount++
	}
	
	pokeType=pokeTypes[pokemon[query].type[0].toLowerCase()].emoji+"`"+pokemon[query].type[0]+" `";
	if(pokemon[query].type[1]){pokeType+=", "+pokeTypes[pokemon[query].type[1].toLowerCase()].emoji+"`"+pokemon[query].type[1]+"`" }
	
	if(!pokemon[query].evolution){ pokemon[query].evolution="N/A" }
	
	queryResult={
		id: query,
		name: pokemon[query].name,
		max_cp: pokemon[query].max_cp,
		color: parseInt(pokeTypes[pokemon[query].type[0].toLowerCase()].color),
		attack: pokemon[query].attack,
		defense: pokemon[query].defense,
		stamina: pokemon[query].stamina,
		type: pokeType,
		moves: pokeMoveSets,
		evolution: pokemon[query].evolution,
		error: errorMessage
	};
	
	return queryResult
}
//
//
//


var curNumber="",maxNumber="",pdChan="451287243227660298";
bot.on('message', message => {
	
	//STOP SCRIPT IF DM/PM
	if(message.channel.type==="dm"){ return }  if(message.guild.id!==config.serverID){ return }
	
	//MAKE SURE ITS A COMMAND
	if(!message.content.startsWith(config.cmdPrefix)) { return }
	
	// RESET VARIABLES
	[embedMSG,skip,msg1,msg2,command,args,args2,guild,member,channel,mentioned,channeled,fetchOutput]=["","","","","","","","","","","","",""];
	
	// GET CHANNEL INFO
	guild=message.guild; channel=message.channel; member=message.member; msg1=message.content; msg2=msg1.toLowerCase();
	if(message.mentions.channels.first()){channeled=message.mentions.channels.first();}
	
	// REMOVE LETTER CASE (MAKE ALL LOWERCASE)
	command=msg2.split(/ +/)[0]; command=command.slice(config.cmdPrefix.length);
	
	// GET ARGUMENTS
	args=msg1.split(/ +/).slice(1); args2=msg2.split(/ +/).slice(1);
	
	
	
	if(command==="pdchan"){
		if(args[0]==="check"){
			return channel.send("ℹ PokeDex channel: <#"+pdChan+">")
		}
		if(member.id==="237260406144499712" || member.id===config.ownerID){
			pdChan=channeled.id;
			return channel.send("✅ PokeDex channel set to: "+channeled)
		}
	}
	
	
	
	if(command==="del"){ 
		if(member.id===config.ownerID){
			if(!args[0]){
				embedMSG={
					"color": 0xFF0000,
					"title": "ℹ Available Syntax and Arguments ℹ",
					"description": "`!del <number_amount>`"
				};
				return channel.send({embed: embedMSG});
			}
			if(args[0]){
				let amt=parseFloat(args[0])+1;
				if(amt>100){
					return message.reply("I can only delete **99** messages at a time");
				}
				channel.bulkDelete(amt).catch(err=>{
					message.reply("I've found some messages older than **14** days, you'll have to delete them manually!");
					return console.info(err.message)
					});
			}
		}
	}
	
	
	if(channel.id===pdChan || channel.id==="448552297501425675"){
	
// ######################### scrape #############################
		if (command==="scrape") {
			if(member.id===config.ownerID || member.id==="223629798516195349" || member.id==="329584924573040645" || member.id==="176926423871782912" 
			|| member.id===config.botID){
				if(!args[0]){
					embedMSG={
						"color": 0xFF0000,
						"title": "ℹ Available Syntax and Arguments ℹ",
						"description": "`!scrape <#>` » check data\n"
							+"`!scrape <#> update` » update local\n"
							+"`!scrape <#> update <#>` » update local with limit"
					};
					return channel.send({embed: embedMSG});
				}
				request(
					{ 
						uri: "https://db.pokemongohub.net/pokemon/"+args[0],
					},
					function(error, response, body) {
						var HTMLdata=body.replace(/<\/?[^>]+(>|$)/g, "");
						PokeStart=HTMLdata.indexOf("next");
						PokeEnds=HTMLdata.indexOf("Min and Max CP Per Level");
						HTMLdata=HTMLdata.slice(PokeStart,PokeEnds);
						HTMLdata=HTMLdata.split("\n"); var dataOut="";
						for (var x=0;x<HTMLdata.length;x++){
							if(HTMLdata[x]!==""){ 
								if(HTMLdata[x]!==" "){
									if(HTMLdata[x]!=="-"){
										dataOut += HTMLdata[x]+"\n";
									}
								}
							}
						}
						dataOut=dataOut.split("\n"); let newData="";
						for (var x=0; x<dataOut.length; x++) {
							newData += "["+x+"] ["+dataOut[x]+"]\n";
						}
						
						//console.info(newData);
						
						if(!dataOut[1]){ return channel.send("⛔ **[**`ERROR`**]**: No data for this Pokémon, yet.. "+member) }
						
						let pTypes=["Water","Steel","Rock","Psychic","Poison","Normal","Ice","Ground","Grass","Ghost","Flying","Fire","Fighting","Fairy","Electric","Dragon","Dark","Bug"];
						
						let pokeCP=dataOut.indexOf("Max CP"); pokeCP++;
						let pokeAtk=dataOut.indexOf("ATK"); pokeAtk++;
						let pokeDef=dataOut.indexOf("DEF"); pokeDef++;
						let pokeSta=dataOut.indexOf("STA"); pokeSta++;
						if(!dataOut[12]){ return channel.send("⛔ **[**`ERROR`**]**: No data for this Pokémon, yet... "+member) }
						let pokeWeather=dataOut[12].replace("and ",""); pokeWeather=pokeWeather.split(" ");
						
						let pokeType=[dataOut[3].replace(/^\w/,txt=>txt.toUpperCase())]; 
							if(pTypes.some(t=>dataOut[4].replace(/^\w/,txt=>txt.toUpperCase())===t)){ pokeType.push(dataOut[4].replace(/^\w/,txt=>txt.toUpperCase())) }
							
						
						let pokeMoves=dataOut.indexOf("Charge Move"); pokeMoves+=4;
						let totalMoves=dataOut[pokeMoves]; pokeMoves++; totalMoves+="/"+dataOut[pokeMoves]; pokeMoves+=3;
						
						if(totalMoves.startsWith(" "+dataOut[1])){totalMoves="N/A"}
						
						if(dataOut[pokeMoves]==="I" || dataOut[pokeMoves]==="II" || dataOut[pokeMoves]==="III"){
							pokeMoves++; totalMoves+=","+dataOut[pokeMoves]; pokeMoves++; totalMoves+="/"+dataOut[pokeMoves]; pokeMoves+=3;
						}
						if(dataOut[pokeMoves]==="I" || dataOut[pokeMoves]==="II" || dataOut[pokeMoves]==="III"){
							pokeMoves++; totalMoves+=","+dataOut[pokeMoves]; pokeMoves++; totalMoves+="/"+dataOut[pokeMoves]; pokeMoves+=3;
						}
						if(dataOut[pokeMoves]==="I" || dataOut[pokeMoves]==="II" || dataOut[pokeMoves]==="III"){
							pokeMoves++; totalMoves+=","+dataOut[pokeMoves]; pokeMoves++; totalMoves+="/"+dataOut[pokeMoves]; pokeMoves+=3;
						}
						totalMoves=totalMoves.split(",");
						
						channel.send('```json\n'
							+'	"'+args[0]+'": {\n'
							+'		"name": "'+dataOut[1]+'",\n'
							+'		"type": [\n			"'+pokeType.join("\",\n			\"")+'"\n		],\n'
							+'		"max_cp": "'+dataOut[pokeCP]+'",\n'
							+'		"attack": "'+dataOut[pokeAtk]+'",\n'
							+'		"defense": "'+dataOut[pokeDef]+'",\n'
							+'		"stamina": "'+dataOut[pokeSta]+'",\n'
							+'		"top_moves": [\n			"'+totalMoves.join("\",\n			\"")+'"\n		]\n'
							+'	}```'
						);
						
						if(args2[1]==="update"){
							maxData=args[0];
							if(member.id===config.ownerID || member.id===config.botID){
								if(args2[2]){
									args2[0]++,curNumber=args2[0],maxNumber=args2[2];
								}
								
								let pokeFile=JSON.parse(fs.readFileSync("./data/pokemon.json", "utf8"));
								
								pokeFile[args[0]]["type"]=pokeType;
								pokeFile[args[0]]["max_cp"]=dataOut[pokeCP];
								pokeFile[args[0]]["attack"]=dataOut[pokeAtk];
								pokeFile[args[0]]["defense"]=dataOut[pokeDef];
								pokeFile[args[0]]["stamina"]=dataOut[pokeSta];
								pokeFile[args[0]]["top_moves"]=totalMoves;
								
								fs.writeFile("./data/pokemon.json",JSON.stringify(pokeFile,null,4),"utf8",function(err){if(err)throw err;});
								
								channel.send("✅ Pokémon successfully **Updated**!")
								.then(()=>{
									if(maxNumber){
										if(curNumber<=maxNumber){
											setTimeout(function(){
												channel.send("!scrape "+curNumber+" update "+maxNumber)
											},2000)
										}
									}
								})
							}
						}
					}
				)
			}

		}
		
		
		
// ######################### COMMANDS #############################
		if (command==="help") {
			if(!args[0]){
				embedMSG={
					"color": 0xFF0000,
					"title": "ℹ Available Syntax and Arguments ℹ",
					"description": "`!pd` » displays **basic** information of a Pokemon\n"
						+"`!cp`* » display **CP** combinations of a Pokemon\n"
						+"`!appraise`* » display **CP**/__iv__ combinations of a Pokemon\n"
						+"* - type `!help <command>` for more info"
				}
			}
			if(args2[0]==="pd"){
				embedMSG={
					"color": 0xFF0000,
					"title": "ℹ Available Syntax and Arguments ℹ",
					"description": "`!pd <#>` or `!pd <name>`\n"
						+"» displays **basic** information of a Pokemon\n"
						+"flags: `l:<#>`/`a:<#>`/`d:<#>`/`s:<#>`\n"
						+"» to display CP at a certain level or iv\n"
						+"`!pd charizard l:32 defense 10 sta: 13`"
				}
			}
			if(args2[0]==="cp"){
				embedMSG={
					"color": 0xFF0000,
					"title": "ℹ Available Syntax and Arguments ℹ",
					"description": "`!cp <#>` or `!cp <name>`\n"
						+"» displays **maximum CP** value - with options:\n"
						+"`!cp <#> l:<#>` or `!cp <name> l:<#>`\n"
						+"» Perfect **CP** at certain **Level**\n"
						+"`!cp <#> <cp#>` or `!cp <name> <cp#>`\n"
						+"» Possible **Lvl** and **IV** combinations\n"
						+" IE: `!cp charizard 1337`"
				}
			}
			if(args2[0]==="appraise"){
				embedMSG={
					"color": 0xFF0000,
					"title": "ℹ Available Syntax and Arguments ℹ",
					"description": "`!appraise <#>` or `!appraise <name>`\n"
						+"» outputs code to `copy`/`paste` into **Pokémon Go** on `Android` devices...\n"
						+"+ flags available:\n+ `l`:level, `a`:attack, `d`:defense, `s`:stamina\n"
						+"» used for saving favorite pokemon after farming nest/lures\n"
						+" IE: `!appraise charizard` » defaults to `PERFECT` 15/15/15\n"
						+" IE: `!appraise charizard l:35 a:15 s:15`\n"
						+" IE: `!appraise charizard l:30 a:15 d:10 s:15`"
				}
			}
			return channel.send({embed: embedMSG});
		}
		
// ######################### PD #############################
		if (command==="pd") {
			// CHECK IF ARGUMENTS GIVEN
			if(!args[0]) { return message.reply("what Pokemon would you like me to check?\nIE: `!pd 7` or `!pd charizard`") }
			
			pokeData=getPokemonID(args2[0]);
			if(pokeData.error){
				return channel.send(pokeData.error+" "+member)
			}
			
			pokeData=getPokemon(pokeData.id);
			if(pokeData.error){
				return channel.send(pokeData.error+" "+member)
			}
			
			if(args[1]){
				let [perfTxt,argPos,level,attack,defense,stamina]=[pokeData.name+"'s ",1,35,15,15,15];
				if(args2[1].startsWith("l")){
					level=args[argPos].slice(2); if(!level || !parseInt(level)){ argPos++; level=args2[argPos] } argPos++;
				}
				if(args2[argPos] && args2[argPos].startsWith("a")){
					attack=args[argPos].slice(2); if(!attack || !parseInt(attack)){ argPos++; attack=args2[argPos] } argPos++;
				}
				if(args2[argPos] && args2[argPos].startsWith("d")){
					defense=args[argPos].slice(2); if(!defense || !parseInt(defense)){ argPos++; defense=args2[argPos] } argPos++;
				}
				if(args2[argPos] && args2[argPos].startsWith("s")){
					stamina=args[argPos].slice(2); if(!stamina || !parseInt(stamina)){ argPos++; stamina=args2[argPos] } argPos++;
				}
				if(attack===15 && defense===15 && stamina===15){ perfTxt="Perfect " }
				
				currentCP=CalculateCP(pokeData,level,attack,defense,stamina);
				pokeData.moves+="\n**"+perfTxt+"CP** at level: **"+level+"** with\n(**"+attack+"**atk/**"+defense+"**def/**"+stamina+"**sta) is: **"+currentCP+"** 👍"
			}
			let embedMSG={
				'color': pokeData.color,
				'thumbnail': {'url': pokeIMG+pokeData.id+'.png'},
				'title': '#'+pokeData.id+' '+pokeData.name+' - MaxCP: '+pokeData.max_cp,
				'url': 'https://db.pokemongohub.net/pokemon/'+pokeData.id,
				'description': '**Type**: '+pokeData.type+'\n'
					+'`'+pokeData.attack+'`atk/`'+pokeData.defense+'`def/`'+pokeData.stamina+'`sta\n'
					+'**Movesets**:'+pokeData.moves
			};
			channel.send({embed: embedMSG});
			channel.send('**Evolution**: '+pokeData.evolution);
		}
		
// ######################### CP #############################
		if (command==="cp") {
			let [possibleIVs,currentLevel,lowerRange,upperRange,currentCP,foundCPPercent,level,attack,defense,stamina]=["","","","","","","","","",""]
			
			// CHECK IF ARGUMENTS GIVEN
			if(!args[0]) {
				return message.reply("what Pokemon would you like me to check?```md\n"
					+"!cp 7\n!cp charizard\n!cp charizard 1337\n» more info, type: !help cp```")
			}
			
			pokeData=getPokemonID(args2[0]);
			if(pokeData.error){
				return channel.send(pokeData.error+" "+member)
			}
			
			pokeData=getPokemon(pokeData.id);
			if(pokeData.error){
				return channel.send(pokeData.error+" "+member)
			}
			
			if(args[1]){
				
				if(args2[1].startsWith("l")){
					level=args[1].slice(2); if(!level || !parseInt(level)){ level=args2[2] }
					currentCP=CalculateCP(pokeData,level,15,15,15);
					possibleIVs="\n**Perfect CP** at level:`"+level+"` is: **"+currentCP+"** 👍"
				}
				else {
					possibleIVs="\n**IV combinations** at `CP`**"+args[1]+"**\n";
					for(level=1;level<=35;level++){
						[currentLevel,lowerRange,upperRange]=[1,-1,0]
						for(attack=0;attack<=15; attack++){
							for(defense=0;defense<=15; defense++){
								for(stamina=0;stamina<=15;stamina++){
									currentCP=CalculateCP(pokeData,level,attack,defense,stamina);
									if(currentCP==args[1]){
										foundCPPercent=(attack+defense+stamina)/45;foundCPPercent*=100;foundCPPercent=PrecisionRound(foundCPPercent,1);
										if(foundCPPercent<lowerRange || lowerRange==-1){ lowerRange=foundCPPercent }
										if(foundCPPercent>upperRange){ upperRange=foundCPPercent }
									}
								}
							}
						}
						if(lowerRange >= 0){
							if(lowerRange===upperRange){
								possibleIVs += "Level **"+level+"**: "+lowerRange+"%\n";
							}
							else{
								possibleIVs += "Level **"+level+"**: "+lowerRange+"% - "+upperRange+"%\n";
							}
						}
					}
					possibleIVs.slice(0,-1);
					if(possibleIVs.length>2000){
						possibleIVs="⛔ **[**`ERROR`**]**: There are too many combinations at that CP value to output";
					}
				}
			}
			
			let embedMSG={
				'color': pokeData.color,
				'thumbnail': {'url': pokeIMG+pokeData.id+'.png'},
				'title': '#'+pokeData.id+' '+pokeData.name+' - MaxCP: '+pokeData.max_cp,
				'url': 'https://db.pokemongohub.net/pokemon/'+pokeData.id,
				'description': '**Type**: '+pokeData.type+'\n'
					+'`'+pokeData.attack+'`atk/`'+pokeData.defense+'`def/`'+pokeData.stamina+'`sta'+possibleIVs
			};
			channel.send({embed: embedMSG});
		}
		
// ######################### APPRAISE #############################
		if (command==="appraise") {
			let [level,attack,defense,stamina,CP,perfTxt,cpValues]=[35,15,15,15,10,"",[]]
			
			// CHECK IF ARGUMENTS GIVEN
			if(!args[0]) {
				return message.reply("what Pokemon would you like me to check?```md\n"
					+"!appraise charizard\n!appraise charizard l:30 a:10 d:10 s:15\n» more info, type: !help appraise```")
			}
			
			pokeData=getPokemonID(args2[0]);
			if(pokeData.error){
				return channel.send(pokeData.error+" "+member)
			}
			
			pokeData=getPokemon(pokeData.id);
			if(pokeData.error){
				return channel.send(pokeData.error+" "+member)
			}
			
			for(i=1; i<args.length; i++){
				let currentArg=args2[i].split(":",2);
				currentArg[0]=currentArg[0];
				switch(currentArg[0]){
					case "l":{
						if(isNaN(currentArg[1])) { return channel.send("⛔ **[**`ERROR`**]**: Level must be a number. "+member) }
						if(currentArg[1]>35){ return channel.send("⛔ **[**`ERROR`**]**: Maximum **Level** of a Pokémon in the **wild** is `35`! "+member) }
						level=currentArg[1];
						break;
					}
					case "level":{
						if(isNaN(currentArg[1])) { return channel.send("⛔ **[**`ERROR`**]**: Level must be a number. "+member) }
						if(currentArg[1]>35){ return channel.send("⛔ **[**`ERROR`**]**: Maximum **Level** of a Pokémon in the **wild** is `35`! "+member) }
						level=currentArg[1];
						break;
					}
					case "a":{
						attack=currentArg[1];
						break;
					}
					case "attack":{
						attack=currentArg[1];
						break;
					}
					case "d":{
						defense=currentArg[1];
						break;
					}
					case "defense":{
						defense=currentArg[1];
						break;
					}
					case "s":{
						stamina=currentArg[1];
						break;
					}
					case "stamina":{
						stamina=currentArg[1];
						break;
					}						
					default:
					return channel.send("I don't recognize your argument: "+args[i]);
					break;
				}
			}
			let attackRange=ParseRange(attack);
			let defenseRange=ParseRange(defense);
			let staminaRange=ParseRange(stamina);
			if(attackRange==="unknown"||defenseRange==="unknown"||staminaRange==="uknown"){
				return c.send("I could not properly read your IV range input");
			}
			//CHECK FOR VALID IV RANGE
			if(attackRange[0]<0 || attackRange[0]>15 || attackRange[1]<0 || attackRange[1]>15 
				|| defenseRange[0]<0 || defenseRange[0]>15 || defenseRange[1]<0 || defenseRange[1]>15 
				|| staminaRange[0]<0 || staminaRange[0]>15 || staminaRange[1]<0 || staminaRange[1]>15 ){
				return c.send("All IV stats must be between 0 and 15");
			}
			let outputString=+pokeData.id+"&";
			for(var l=1; l <= level; l++){
				for(var a=attackRange[0]; a <= attackRange[1]; a++){
					for(var d=defenseRange[0]; d <= defenseRange[1]; d++){
						for(var s=staminaRange[0]; s <= staminaRange[1]; s++){
							let CP=CalculateCP(pokeData, l, a, d, s);
							CP="cp"+CP;
							if(cpValues.indexOf(CP)===-1) {cpValues.push(CP)}
						}
					}
				}
			}
			outputString=outputString+cpValues.join(","); // +
			
			if(attackRange[1]===15 && defenseRange[1]===15 && staminaRange[1]===15){
				perfTxt="`PERFECT` "
			}
			
			if(outputString.length>2000){
				outputString="You have too wide of a range of IV values and I cannot output that string";
			}
			
			channel.send("✅ "+member+", to find your "+perfTxt+"**"+pokeData.name+"** `copy`/`paste` the following into **Pokémon GO** (*android*):");
			return channel.send(outputString)
		}
		
		
		
		if(command==="restart"){
			if(message.author.id===config.ownerID){
				if(args[0]==="pd" || args[0]==="all"){
					channel.send("♻ Restarting **PokeDex** (`pdBot.js`) module... please wait `3` to `5` seconds...").then(()=>{ process.exit(1) }).catch(console.error);
				}
			}
		}
	}
	
});

// log our bot in
bot.login(config.token);

bot.on('disconnected', function () {
	let CurrTime=new Date();
	let mo=CurrTime.getMonth();let da=CurrTime.getDate();let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();let min=CurrTime.getMinutes();let sec=CurrTime.getSeconds();
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let sysTS="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";
	console.info(sysTS+'-- Disconnected --');console.log(console.error);
	process.exit(1);
});