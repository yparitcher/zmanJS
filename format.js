/*
Copyright (c) 2018 Y Paritcher
*/

(function () {
'use strict'

zmanJS.formatnum = function (num) {
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

zmanJS.formattime = function (date)
{
	let str= "";
	let hour = date.hour%12;
	if(!hour){hour = 12;}
	let minutes = ("0" + date.min).slice(-2);
	str += hour + ":" + minutes;
	return str;
}

zmanJS.formatwday = function (date, shabbos)
{
	const hwday =[ "שבת", "ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שביעי"];
	if (shabbos && (date.wday == 7)) {return hwday[0];}
	return hwday[date.wday];
}

zmanJS.formatmonth = function (date)
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

zmanJS.meridian = function (date)
{
	return (date.hour < 11) ? "AM" : "PM";
}

zmanJS.parshahformat = function (current)
{
	const parshahchar = ["", "בראשית", "נח", "לך לך", "וירא", "חיי שרה", "תולדות", "ויצא", "וישלח", "וישב", "מקץ", "ויגש", "ויחי", "שמות", "וארא", "בא", "בשלח", "יתרו", "משפטים", "תרומה", "תצוה", "כי תשא", "ויקהל", "פקודי", "ויקרא", "צו", "שמיני", "תזריע", "מצורע", "אחרי מות", "קדושים", "אמור", "בהר", "בחוקותי", "במדבר", "נשא", "בהעלותך", "שלח", "קרח", "חקת", "בלק", "פנחס", "מטות", "מסעי", "דברים", "ואתחנן", "עקב", "ראה", "שופטים", "כי תצא", "כי תבוא", "נצבים", "וילך", "האזינו", "וזאת הברכה", "ויקהל - פקודי", "תזריע - מצורע", "אחרי מות - קדושים", "בהר - בחוקותי", "חקת - בלק", "מטות - מסעי", "נצבים - וילך"];
	return parshahchar[current];
}

zmanJS.yomtovformat = function (current)
{
	switch(current)
	{
		case zmanJS.yomtov.CHOL:
			break;
		case zmanJS.yomtov.PESACH_DAY1:
		case zmanJS.yomtov.PESACH_DAY2:
			return "פסח";
		case zmanJS.yomtov.SHVEI_SHEL_PESACH:
			return "שביעי של פסח";
		case zmanJS.yomtov.ACHRON_SHEL_PESACH:
			return "אחרון של פסח";
		case zmanJS.yomtov.SHAVOUS_DAY1:
		case zmanJS.yomtov.SHAVOUS_DAY2:
			return "שבועות";
		case zmanJS.yomtov.ROSH_HASHANAH_DAY1:
		case zmanJS.yomtov.ROSH_HASHANAH_DAY2:
			return "ראש השנה";
		case zmanJS.yomtov.YOM_KIPPUR:
			return "יום כיפור";
		case zmanJS.yomtov.SUKKOS_DAY1:
		case zmanJS.yomtov.SUKKOS_DAY2:
			return "סוכות";
		case zmanJS.yomtov.SHMEINI_ATZERES:
			return "שמיני עצרת";
		case zmanJS.yomtov.SIMCHAS_TORAH:
			return "שמחת תורה";
		case zmanJS.yomtov.CHOL_HAMOED_PESACH_DAY1:
		case zmanJS.yomtov.CHOL_HAMOED_PESACH_DAY2:
		case zmanJS.yomtov.CHOL_HAMOED_PESACH_DAY3:
		case zmanJS.yomtov.CHOL_HAMOED_PESACH_DAY4:
		case zmanJS.yomtov.CHOL_HAMOED_PESACH_DAY5:
			return "חול המועד פסח";
		case zmanJS.yomtov.CHOL_HAMOED_SUKKOS_DAY1:
		case zmanJS.yomtov.CHOL_HAMOED_SUKKOS_DAY2:
		case zmanJS.yomtov.CHOL_HAMOED_SUKKOS_DAY3:
		case zmanJS.yomtov.CHOL_HAMOED_SUKKOS_DAY4:
		case zmanJS.yomtov.CHOL_HAMOED_SUKKOS_DAY5:
			return "חול המועד סוכות";
		case zmanJS.yomtov.HOSHANA_RABBAH:
			return "הושענא רבה";
		case zmanJS.yomtov.PESACH_SHEINI:
			return "פסח שני";
		case zmanJS.yomtov.LAG_BAOMER:
			return "ל״ג בעומר";
		case zmanJS.yomtov.TU_BAV:
			return "ט״ו באב";
		case zmanJS.yomtov.CHANUKAH_DAY1:
		case zmanJS.yomtov.CHANUKAH_DAY2:
		case zmanJS.yomtov.CHANUKAH_DAY3:
		case zmanJS.yomtov.CHANUKAH_DAY4:
		case zmanJS.yomtov.CHANUKAH_DAY5:
		case zmanJS.yomtov.CHANUKAH_DAY6:
		case zmanJS.yomtov.CHANUKAH_DAY7:
		case zmanJS.yomtov.CHANUKAH_DAY8:
			return "חנוכה";
		case zmanJS.yomtov.TU_BISHVAT:
			return "ט״ו בשבט";
		case zmanJS.yomtov.PURIM_KATAN:
			return "פורים קטן";
		case zmanJS.yomtov.SHUSHAN_PURIM_KATAN:
			return "שושן פורים קטן";
		case zmanJS.yomtov.PURIM:
			return "פורים";
		case zmanJS.yomtov.SHUSHAN_PURIM:
			return "שושן פורים";
		case zmanJS.yomtov.SHIVA_ASAR_BTAAMUZ:
			return "שבעה עשר בתמוז";
		case zmanJS.yomtov.TISHA_BAV:
			return "ט׳ באב";
		case zmanJS.yomtov.TZOM_GEDALIA:
			return "צום גדליה";
		case zmanJS.yomtov.ASARAH_BTEVES:
			return "עשרה בטבת";
		case zmanJS.yomtov.TAANIS_ESTER:
			return "תענית אסתר";
		case zmanJS.yomtov.EREV_PESACH:
			return "ערב פסח";
		case zmanJS.yomtov.EREV_SHAVOUS:
			return "ערב שבועות";
		case zmanJS.yomtov.EREV_ROSH_HASHANAH:
			return "ערב ראש השנה";
		case zmanJS.yomtov.EREV_YOM_KIPPUR:
			return "ערב יום כיפור";
		case zmanJS.yomtov.EREV_SUKKOS:
			return "ערב סוכות";
		case zmanJS.yomtov.SHKALIM:
			return "שקלים";
		case zmanJS.yomtov.ZACHOR:
			return "זכור";
		case zmanJS.yomtov.PARAH:
			return "פרה";
		case zmanJS.yomtov.HACHODESH:
			return "החודש";
		case zmanJS.yomtov.ROSH_CHODESH:
			return "ראש חודש";
		case zmanJS.yomtov.MACHAR_CHODESH:
			return "מחר חודש";
		case zmanJS.yomtov.SHABBOS_MEVORCHIM:
			return "שבת מברכים";
	}
	return "";
}

}());
