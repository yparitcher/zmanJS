'use strict'
/*
Copyright (c) 2018 Y Paritcher
*/

function getLocalMeanTimeOffset(now, here)
{
	return Math.trunc(here.longitude * 4 * 60 - now.offset);
}

function getAntimeridianAdjustment(now, here)
{
	let localHoursOffset = getLocalMeanTimeOffset(now, here) / 3600;
	/*if the offset is 20 hours or more in the future (never expected anywhere other
	 * than a location using a timezone across the anti meridian to the east such as Samoa) */
	if (localHoursOffset >= 20)
	{
		/* roll the date forward a day */
		return 1;
	}
	/* if the offset is 20 hours or more in the past (no current location is known
	 * that crosses the antimeridian to the west, but better safe than sorry) */
	else if (localHoursOffset <= -20)
	{
		/* roll the date back a day */
		return -1;
	}
	/*99.999% of the world will have no adjustment */
	return 0;
}

function getDateFromTime(current, time, here, isSunrise)
{
	let result = new hdate();
	if (isNaN(time)) {
		return result;
	}
	let adjustment = getAntimeridianAdjustment(current, here);
	let calculatedTime = time;
	result.year = current.year;
	result.EY = current.EY;
	result.offset = current.offset;
	result.month = current.month;
	result.day = current.day;
	if (adjustment){result.hdateaddday(adjustment);}

	let hours = Math.trunc(calculatedTime);
	calculatedTime -= hours;
	let minutes = Math.trunc(calculatedTime *= 60);
	calculatedTime -= minutes;
	let seconds = Math.trunc(calculatedTime *= 60);
	calculatedTime -= seconds;
	let miliseconds = Math.trunc(calculatedTime * 1000);
	let localTimeHours = Math.trunc(here.longitude / 15);
	if (isSunrise && localTimeHours + hours > 18) {
		result.hdateaddday(-1);
	} else if (!isSunrise && localTimeHours + hours < 6) {
		result.hdateaddday(+1);
	}

	result.hour = hours;
	result.min = minutes;
	result.sec = seconds;
	result.msec = miliseconds;
	result.hdateaddsecond(current.offset);
	return result;
}

function calcsunrise(date, here, zenith, adjustForElevation)
{
	let sunrise = getUTCSunrise(date.hdatejulian(), here, zenith, adjustForElevation);
	return getDateFromTime(date, sunrise, here, 1);
}

function calcsunset(date, here, zenith, adjustForElevation)
{
	let sunset = getUTCSunset(date.hdatejulian(), here, zenith, adjustForElevation);
	return getDateFromTime(date, sunset, here, 0);
}

function calcshaahzmanis(startday, endday)
{
	let start = HebrewCalendarElapsedDays(startday.year)+(startday.dayofyear-1);
	let end = HebrewCalendarElapsedDays(endday.year)+(endday.dayofyear-1);
	let diff = end - start;
	diff = (diff * 24) + (endday.hour - startday.hour);
	diff = (diff * 60) + (endday.min - startday.min);
	diff = (diff * 60) + (endday.sec - startday.sec);
	diff = (diff * 1000) + (endday.msec - startday.msec);
	if (startday.year == 0 || endday.year == 0) return 0;
	return Math.trunc(diff / 12);
}

function calctimeoffset(time, offset)
{
	let result = new hdate();
	if (time.year == 0 || offset == 0) return result;
	Object.assign(result, time);
	result.hdateaddmsecond(offset);
	return result;
}

function getalos(date, here)
{
	return calcsunrise(date, here, 106.1, 0);
}

function getalosbaalhatanya(date, here)
{
	return calcsunrise(date, here, 106.9, 0);
}

function getalos26degrees(date, here)
{
	return calcsunrise(date, here, 116.0, 0);
}

function getalos19p8degrees(date, here)
{
	return calcsunrise(date, here, 109.8, 0);
}

function getalos18degrees(date, here)
{
	return calcsunrise(date, here, 108, 0);
}

function getalos120(date, here)
{
	return calctimeoffset(getsunrise(date, here), -7200000);
}

function getalos120zmanis(date, here)
{
	let shaahzmanis = getshaahzmanisgra(date, here);
	if (shaahzmanis == 0) return new hdate();
	return calctimeoffset(getsunrise(date, here), Math.trunc(shaahzmanis * -2));
}

function getalos96(date, here)
{
	return calctimeoffset(getsunrise(date, here), -5760000);
}

function getalos96zmanis(date, here)
{
	let shaahzmanis = getshaahzmanisgra(date, here);
	if (shaahzmanis == 0) return new hdate();
	return calctimeoffset(getsunrise(date, here), Math.trunc(shaahzmanis * -1.6));
}

function getalos90(date, here)
{
	return calctimeoffset(getsunrise(date, here), -5400000);
}

function getalos90zmanis(date, here)
{
	let shaahzmanis = getshaahzmanisgra(date, here);
	if (shaahzmanis == 0) return new hdate();
	return calctimeoffset(getsunrise(date, here), Math.trunc(shaahzmanis * -1.5));
}

function getalos72(date, here)
{
	return calctimeoffset(getsunrise(date, here), -4320000);
}

function getalos72zmanis(date, here)
{
	let shaahzmanis = getshaahzmanisgra(date, here);
	if (shaahzmanis == 0) return new hdate();
	return calctimeoffset(getsunrise(date, here), Math.trunc(shaahzmanis * -1.2));
}

function getalos60(date, here)
{
	return calctimeoffset(getsunrise(date, here), -3600000);
}

function getmisheyakir11p5degrees(date, here)
{
	return calcsunrise(date, here, 101.5, 0);
}

function getmisheyakir11degrees(date, here)
{
	return calcsunrise(date, here, 101.0, 0);
}

function getmisheyakir10p2degrees(date, here)
{
	return calcsunrise(date, here, 100.2, 0);
}

function getsunrise(date, here)
{
	return calcsunrise(date, here, 90.0, 0);
}

function getsunrisebaalhatanya(date, here)
{
	return calcsunrise(date, here, 91.583, 0);
}

function getelevationsunrise(date, here)
{
	return calcsunrise(date, here, 90.0, 1);
}

function calcshma(startday, endday)
{
	let shaahzmanis = calcshaahzmanis(startday, endday);
	return calctimeoffset(startday, shaahzmanis * 3);
}

function getshmabaalhatanya(date, here)
{
	return calcshma(getsunrisebaalhatanya(date, here), getsunsetbaalhatanya(date, here));
}

function getshmagra(date, here)
{
	return calcshma(getsunrise(date, here), getsunset(date, here));
}

function getshmamga(date, here)
{
	return calcshma(getalos72(date, here), gettzais72(date, here));
}

function calctefila(startday, endday)
{
	let shaahzmanis = calcshaahzmanis(startday, endday);
	return calctimeoffset(startday, shaahzmanis * 4);
}

function gettefilabaalhatanya(date, here)
{
	return calctefila(getsunrisebaalhatanya(date, here), getsunsetbaalhatanya(date, here));
}

function gettefilagra(date, here)
{
	return calctefila(getsunrise(date, here), getsunset(date, here));
}

function gettefilamga(date, here)
{
	return calctefila(getalos72(date, here), gettzais72(date, here));
}

function getachilaschometzbaalhatanya(date, here)
{
	return calctefila(getsunrisebaalhatanya(date, here), getsunsetbaalhatanya(date, here));
}

function getachilaschometzgra(date, here)
{
	return calctefila(getsunrise(date, here), getsunset(date, here));
}

function getachilaschometzmga(date, here)
{
	return calctefila(getalos72(date, here), gettzais72(date, here));
}

function calcbiurchometz(startday, endday)
{
	let shaahzmanis = calcshaahzmanis(startday, endday);
	return calctimeoffset(startday, shaahzmanis * 5);
}

function getbiurchometzbaalhatanya(date, here)
{
	return calcbiurchometz(getsunrisebaalhatanya(date, here), getsunsetbaalhatanya(date, here));
}

function getbiurchometzgra(date, here)
{
	return calcbiurchometz(getsunrise(date, here), getsunset(date, here));
}

function getbiurchometzmga(date, here)
{
	return calcbiurchometz(getalos72(date, here), gettzais72(date, here));
}

function calcchatzos(startday, endday)
{
	let shaahzmanis = calcshaahzmanis(startday, endday);
	return calctimeoffset(startday, shaahzmanis * 6);
}

function getchatzosbaalhatanya(date, here)
{
	return calcchatzos(getsunrisebaalhatanya(date, here), getsunsetbaalhatanya(date, here));
}

function getchatzosgra(date, here)
{
	return calcchatzos(getsunrise(date, here), getsunset(date, here));
}

function calcminchagedola(startday, endday)
{
	let shaahzmanis = calcshaahzmanis(startday, endday);
	return calctimeoffset(startday, Math.trunc(shaahzmanis * 6.5));
}

function getminchagedolabaalhatanya(date, here)
{
	return calcminchagedola(getsunrisebaalhatanya(date, here), getsunsetbaalhatanya(date, here));
}

function getminchagedolagra(date, here)
{
	return calcminchagedola(getsunrise(date, here), getsunset(date, here));
}

function getminchagedolamga(date, here)
{
	return calcminchagedola(getalos72(date, here), gettzais72(date, here));
}

function calcminchagedola30min(startday, endday)
{
	let shaahzmanis = calcshaahzmanis(startday, endday);
	return calctimeoffset(startday, (shaahzmanis * 6) + 1800000);
}

function calcminchagedolagreater30min(startday, endday)
{
	return ((calcshaahzmanis(startday, endday)*0.5) >= 1800000) ? calcminchagedola(startday, endday) : calcminchagedola30min(startday, endday);
}

function getminchagedolabaalhatanyag30m(date, here)
{
	return calcminchagedolagreater30min(getsunrisebaalhatanya(date, here), getsunsetbaalhatanya(date, here));
}

function getminchagedolagrag30m(date, here)
{
	return calcminchagedolagreater30min(getsunrise(date, here), getsunset(date, here));
}

function getminchagedolamgag30m(date, here)
{
	return calcminchagedolagreater30min(getalos72(date, here), gettzais72(date, here));
}

function calcminchaketana(startday, endday)
{
	let shaahzmanis = calcshaahzmanis(startday, endday);
	return calctimeoffset(startday, Math.trunc(shaahzmanis * 9.5));
}

function getminchaketanabaalhatanya(date, here)
{
	return calcminchaketana(getsunrisebaalhatanya(date, here), getsunsetbaalhatanya(date, here));
}

function getminchaketanagra(date, here)
{
	return calcminchaketana(getsunrise(date, here), getsunset(date, here));
}

function getminchaketanamga(date, here)
{
	return calcminchaketana(getalos72(date, here), gettzais72(date, here));
}

function calcplag(startday, endday)
{
	let shaahzmanis = calcshaahzmanis(startday, endday);
	return calctimeoffset(startday, Math.trunc(shaahzmanis * 10.75));
}

function getplagbaalhatanya(date, here)
{
	return calcplag(getsunrisebaalhatanya(date, here), getsunsetbaalhatanya(date, here));
}

function getplaggra(date, here)
{
	return calcplag(getsunrise(date, here), getsunset(date, here));
}

function getplagmga(date, here)
{
	return calcplag(getalos72(date, here), gettzais72(date, here));
}

function getcandlelighting(date, here)
{
	return calctimeoffset(calcsunset(date, here, 90.0, 0), -1080000);
}

function getsunset(date, here)
{
	return calcsunset(date, here, 90.0, 0);
}

function getsunsetbaalhatanya(date, here)
{
	return calcsunset(date, here, 91.583, 0);
}

function getelevationsunset(date, here)
{
	return calcsunset(date, here, 90.0, 1);
}

function gettzaisbaalhatanya(date, here)
{
	return calcsunset(date, here, 96, 1);
}

function gettzais8p5(date, here)
{
	return calcsunset(date, here, 98.5, 1);
}

function gettzais72(date, here)
{
	return calctimeoffset(getsunset(date, here), 4320000);
}

function calcmoladoffset(date, offsetsec)
{
	let result = getmolad(date.year, date.month);
	let tz = (-result.offset) + date.offset;
	let adjustment = Math.trunc((result.sec * 10)/3) + tz + offsetsec;
	result.sec = 0;
	result.hdateaddsecond(adjustment);
	result.EY = date.EY;
	result.offset = date.offset;
	return result;
}

function getmolad7days(date)
{
	return calcmoladoffset(date, 604800);
}

function getmoladhalfmonth(date)
{
	return calcmoladoffset(date, 1275722);
}

function getmolad15days(date)
{
	return calcmoladoffset(date, 1296000);
}

function getshaahzmanisbaalhatanya(date, here)
{
	return calcshaahzmanis(getsunrisebaalhatanya(date, here), getsunsetbaalhatanya(date, here));
}

function getshaahzmanisgra(date, here)
{
	return calcshaahzmanis(getsunrise(date, here), getsunset(date, here));
}

function getshaahzmanismga(date, here)
{
	return calcshaahzmanis(getalos72(date, here), gettzais72(date, here));
}
