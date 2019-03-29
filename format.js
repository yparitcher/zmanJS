'use strict'
/*
Copyright (c) 2018 Y Paritcher
*/

function formatnum(num) {
/*
 * Based on https://github.com/Scimonster/js-gematriya
 * Copyright (c) 2014 Eyal Schachter
 * Licensed MIT.
 */
	let letters = {
		0: "",
		1: "א",
		2: "ב",
		3: "ג",
		4: "ד",
		5: "ה",
		6: "ו",
		7: "ז",
		8: "ח",
		9: "ט",
		10: "י",
		20: "כ",
		30: "ל",
		40: "מ",
		50: "נ",
		60: "ס",
		70: "ע",
		80: "פ",
		90: "צ",
		100: "ק",
		200: "ר",
		300: "ש",
		400: "ת",
		500: "תק",
		600: "תר",
		700: "תש",
		800: "תת",
		900: "תתק",
		1000: "תתר"
	};

	num = num.toString().split('').reverse();
	num = num.slice(0, 3);
	num = num.map(function g(n,i){
		if (parseInt(n, 10) * Math.pow(10, i) > 1000) {
			return g(n, i-3);
		}
		return letters[parseInt(n, 10) * Math.pow(10, i)];
	});

	num = num.reverse().join('').replace(/יה/g,'טו').replace(/יו/g,'טז').split('');

/*		if (num.length === 1) {
			num.push('׳');
		} else */
		if (num.length > 1) {
			num.splice(-1, 0, '״');
		}

	return num.join('');
}

function formattime(date)
{
	let str= "";
	let hour = date.hour%12;
	if(!hour){hour = 12;}
	let minutes = ("0" + date.min).slice(-2);
	str += hour + ":" + minutes;
	return str;
}

function formatwday(date, shabbos)
{
	const hwday =[ "שבת", "ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שביעי"];
	if (shabbos && (date.wday == 7)) {return hwday[0];}
	return hwday[date.wday];
}

function formatmonth(date)
{
	const hmonth = [ "אדר א׳", "ניסן", "אייר", "סיון", "תמוז", "אב", "אלול", "תשרי", "חשון", "כסלו", "טבת", "שבט", "אדר", "אדר ב׳"];
	if (date.leap)
	{
		if (date.month == 12){ return hmonth[0];}
		if (date.month == 13){ return hmonth[date.month];}
	}
	if (date.month > 0 && date.month < 13){ return hmonth[date.month];}
	return "";
}

function meridian(date)
{
	return (date.hour < 11) ? "AM" : "PM";
}
function parshahformat(current)
{
	const parshahchar = ["", "בראשית", "נח", "לך לך", "וירא", "חיי שרה", "תולדות", "ויצא", "וישלח", "וישב", "מקץ", "ויגש", "ויחי", "שמות", "וארא", "בא", "בשלח", "יתרו", "משפטים", "תרומה", "תצוה", "כי תשא", "ויקהל", "פקודי", "ויקרא", "צו", "שמיני", "תזריע", "מצורע", "אחרי מות", "קדושים", "אמור", "בהר", "בחוקותי", "במדבר", "נשא", "בהעלותך", "שלח", "קרח", "חקת", "בלק", "פנחס", "מטות", "מסעי", "דברים", "ואתחנן", "עקב", "ראה", "שופטים", "כי תצא", "כי תבוא", "נצבים", "וילך", "האזינו", "וזאת הברכה", "ויקהל - פקודי", "תזריע - מצורע", "אחרי מות - קדושים", "בהר - בחוקותי", "חקת - בלק", "מטות - מסעי", "נצבים - וילך"];
	return parshahchar[current];
}

function yomtovformat(current)
{
	switch(current)
	{
		case yomtov.CHOL:
			break;
		case yomtov.PESACH_DAY1:
		case yomtov.PESACH_DAY2:
			return "פסח";
		case yomtov.SHVEI_SHEL_PESACH:
			return "שביעי של פסח";
		case yomtov.ACHRON_SHEL_PESACH:
			return "אחרון של פסח";
		case yomtov.SHAVOUS_DAY1:
		case yomtov.SHAVOUS_DAY2:
			return "שבועות";
		case yomtov.ROSH_HASHANAH_DAY1:
		case yomtov.ROSH_HASHANAH_DAY2:
			return "ראש השנה";
		case yomtov.YOM_KIPPUR:
			return "יום כיפור";
		case yomtov.SUKKOS_DAY1:
		case yomtov.SUKKOS_DAY2:
			return "סוכות";
		case yomtov.SHMEINI_ATZERES:
			return "שמיני עצרת";
		case yomtov.SIMCHAS_TORAH:
			return "שמחת תורה";
		case yomtov.CHOL_HAMOED_PESACH_DAY1:
		case yomtov.CHOL_HAMOED_PESACH_DAY2:
		case yomtov.CHOL_HAMOED_PESACH_DAY3:
		case yomtov.CHOL_HAMOED_PESACH_DAY4:
		case yomtov.CHOL_HAMOED_PESACH_DAY5:
			return "חול המועד פסח";
		case yomtov.CHOL_HAMOED_SUKKOS_DAY1:
		case yomtov.CHOL_HAMOED_SUKKOS_DAY2:
		case yomtov.CHOL_HAMOED_SUKKOS_DAY3:
		case yomtov.CHOL_HAMOED_SUKKOS_DAY4:
		case yomtov.CHOL_HAMOED_SUKKOS_DAY5:
			return "חול המועד סוכות";
		case yomtov.HOSHANA_RABBAH:
			return "הושענא רבה";
		case yomtov.PESACH_SHEINI:
			return "פסח שני";
		case yomtov.LAG_BAOMER:
			return "ל״ג בעומר";
		case yomtov.TU_BAV:
			return "ט״ו באב";
		case yomtov.CHANUKAH_DAY1:
		case yomtov.CHANUKAH_DAY2:
		case yomtov.CHANUKAH_DAY3:
		case yomtov.CHANUKAH_DAY4:
		case yomtov.CHANUKAH_DAY5:
		case yomtov.CHANUKAH_DAY6:
		case yomtov.CHANUKAH_DAY7:
		case yomtov.CHANUKAH_DAY8:
			return "חנוכה";
		case yomtov.TU_BISHVAT:
			return "ט״ו בשבט";
		case yomtov.PURIM_KATAN:
			return "פורים קטן";
		case yomtov.SHUSHAN_PURIM_KATAN:
			return "שושן פורים קטן";
		case yomtov.PURIM:
			return "פורים";
		case yomtov.SHUSHAN_PURIM:
			return "שושן פורים";
		case yomtov.SHIVA_ASAR_BTAAMUZ:
			return "שבעה עשר בתמוז";
		case yomtov.TISHA_BAV:
			return "ט׳ באב";
		case yomtov.TZOM_GEDALIA:
			return "צום גדליה";
		case yomtov.ASARAH_BTEVES:
			return "עשרה בטבת";
		case yomtov.TAANIS_ESTER:
			return "תענית אסתר";
		case yomtov.EREV_PESACH:
			return "ערב פסח";
		case yomtov.EREV_SHAVOUS:
			return "ערב שבועות";
		case yomtov.EREV_ROSH_HASHANAH:
			return "ערב ראש השנה";
		case yomtov.EREV_YOM_KIPPUR:
			return "ערב יום כיפור";
		case yomtov.EREV_SUKKOS:
			return "ערב סוכות";
		case yomtov.SHKALIM:
			return "שקלים";
		case yomtov.ZACHOR:
			return "זכור";
		case yomtov.PARAH:
			return "פרה";
		case yomtov.HACHODESH:
			return "החודש";
		case yomtov.ROSH_CHODESH:
			return "ראש חודש";
		case yomtov.MACHAR_CHODESH:
			return "מחר חודש";
		case yomtov.SHABBOS_MEVORCHIM:
			return "שבת מברכים";
	}
	return "";
}
