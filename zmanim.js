/*
Copyright (c) 2018 Y Paritcher
*/

(function () {
'use strict'

zmanJS.getLocalMeanTimeOffset = function (now, here)
{
	return Math.trunc(here.longitude * 4 * 60 - now.offset);
}

zmanJS.getAntimeridianAdjustment = function (now, here)
{
	let localHoursOffset = zmanJS.getLocalMeanTimeOffset(now, here) / 3600;
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

zmanJS.getDateFromTime = function (current, time, here, isSunrise)
{
	let result = new zmanJS.hdate();
	if (isNaN(time)) {
		return result;
	}
	let adjustment = zmanJS.getAntimeridianAdjustment(current, here);
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

zmanJS.calcsunrise = function (date, here, zenith, adjustForElevation)
{
	let sunrise = zmanJS.getUTCSunrise(date.hdatejulian(), here, zenith, adjustForElevation);
	return zmanJS.getDateFromTime(date, sunrise, here, 1);
}

zmanJS.calcsunset = function (date, here, zenith, adjustForElevation)
{
	let sunset = zmanJS.getUTCSunset(date.hdatejulian(), here, zenith, adjustForElevation);
	return zmanJS.getDateFromTime(date, sunset, here, 0);
}

zmanJS.calcshaahzmanis = function (startday, endday)
{
	let start = zmanJS.HebrewCalendarElapsedDays(startday.year)+(startday.dayofyear-1);
	let end = zmanJS.HebrewCalendarElapsedDays(endday.year)+(endday.dayofyear-1);
	let diff = end - start;
	diff = (diff * 24) + (endday.hour - startday.hour);
	diff = (diff * 60) + (endday.min - startday.min);
	diff = (diff * 60) + (endday.sec - startday.sec);
	diff = (diff * 1000) + (endday.msec - startday.msec);
	if (startday.year == 0 || endday.year == 0) return 0;
	return Math.trunc(diff / 12);
}

zmanJS.calctimeoffset = function (time, offset)
{
	let result = new zmanJS.hdate();
	if (time.year == 0 || offset == 0) return result;
	Object.assign(result, time);
	result.hdateaddmsecond(offset);
	return result;
}

zmanJS.getalos = function (date, here)
{
	return zmanJS.calcsunrise(date, here, 106.1, 0);
}

zmanJS.getalosbaalhatanya = function (date, here)
{
	return zmanJS.calcsunrise(date, here, 106.9, 0);
}

zmanJS.getalos26degrees = function (date, here)
{
	return zmanJS.calcsunrise(date, here, 116.0, 0);
}

zmanJS.getalos19p8degrees = function (date, here)
{
	return zmanJS.calcsunrise(date, here, 109.8, 0);
}

zmanJS.getalos18degrees = function (date, here)
{
	return zmanJS.calcsunrise(date, here, 108, 0);
}

zmanJS.getalos120 = function (date, here)
{
	return zmanJS.calctimeoffset(zmanJS.getsunrise(date, here), -7200000);
}

zmanJS.getalos120zmanis = function (date, here)
{
	let shaahzmanis = zmanJS.getshaahzmanisgra(date, here);
	if (shaahzmanis == 0) return new zmanJS.hdate();
	return zmanJS.calctimeoffset(zmanJS.getsunrise(date, here), Math.trunc(shaahzmanis * -2));
}

zmanJS.getalos96 = function (date, here)
{
	return zmanJS.calctimeoffset(zmanJS.getsunrise(date, here), -5760000);
}

zmanJS.getalos96zmanis = function (date, here)
{
	let shaahzmanis = zmanJS.getshaahzmanisgra(date, here);
	if (shaahzmanis == 0) return new zmanJS.hdate();
	return zmanJS.calctimeoffset(zmanJS.getsunrise(date, here), Math.trunc(shaahzmanis * -1.6));
}

zmanJS.getalos90 = function (date, here)
{
	return zmanJS.calctimeoffset(zmanJS.getsunrise(date, here), -5400000);
}

zmanJS.getalos90zmanis = function (date, here)
{
	let shaahzmanis = zmanJS.getshaahzmanisgra(date, here);
	if (shaahzmanis == 0) return new zmanJS.hdate();
	return zmanJS.calctimeoffset(zmanJS.getsunrise(date, here), Math.trunc(shaahzmanis * -1.5));
}

zmanJS.getalos72 = function (date, here)
{
	return zmanJS.calctimeoffset(zmanJS.getsunrise(date, here), -4320000);
}

zmanJS.getalos72zmanis = function (date, here)
{
	let shaahzmanis = zmanJS.getshaahzmanisgra(date, here);
	if (shaahzmanis == 0) return new zmanJS.hdate();
	return zmanJS.calctimeoffset(zmanJS.getsunrise(date, here), Math.trunc(shaahzmanis * -1.2));
}

zmanJS.getalos60 = function (date, here)
{
	return zmanJS.calctimeoffset(zmanJS.getsunrise(date, here), -3600000);
}

zmanJS.getmisheyakir11p5degrees = function (date, here)
{
	return zmanJS.calcsunrise(date, here, 101.5, 0);
}

zmanJS.getmisheyakir11degrees = function (date, here)
{
	return zmanJS.calcsunrise(date, here, 101.0, 0);
}

zmanJS.getmisheyakir10p2degrees = function (date, here)
{
	return zmanJS.calcsunrise(date, here, 100.2, 0);
}

zmanJS.getsunrise = function (date, here)
{
	return zmanJS.calcsunrise(date, here, 90.0, 0);
}

zmanJS.getsunrisebaalhatanya = function (date, here)
{
	return zmanJS.calcsunrise(date, here, 91.583, 0);
}

zmanJS.getelevationsunrise = function (date, here)
{
	return zmanJS.calcsunrise(date, here, 90.0, 1);
}

zmanJS.calcshma = function (startday, endday)
{
	let shaahzmanis = zmanJS.calcshaahzmanis(startday, endday);
	return zmanJS.calctimeoffset(startday, shaahzmanis * 3);
}

zmanJS.getshmabaalhatanya = function (date, here)
{
	return zmanJS.calcshma(zmanJS.getsunrisebaalhatanya(date, here), zmanJS.getsunsetbaalhatanya(date, here));
}

zmanJS.getshmagra = function (date, here)
{
	return zmanJS.calcshma(zmanJS.getsunrise(date, here), zmanJS.getsunset(date, here));
}

zmanJS.getshmamga = function (date, here)
{
	return zmanJS.calcshma(zmanJS.getalos72(date, here), zmanJS.gettzais72(date, here));
}

zmanJS.calctefila = function (startday, endday)
{
	let shaahzmanis = zmanJS.calcshaahzmanis(startday, endday);
	return zmanJS.calctimeoffset(startday, shaahzmanis * 4);
}

zmanJS.gettefilabaalhatanya = function (date, here)
{
	return zmanJS.calctefila(zmanJS.getsunrisebaalhatanya(date, here), zmanJS.getsunsetbaalhatanya(date, here));
}

zmanJS.gettefilagra = function (date, here)
{
	return zmanJS.calctefila(zmanJS.getsunrise(date, here), zmanJS.getsunset(date, here));
}

zmanJS.gettefilamga = function (date, here)
{
	return zmanJS.calctefila(zmanJS.getalos72(date, here), zmanJS.gettzais72(date, here));
}

zmanJS.getachilaschometzbaalhatanya = function (date, here)
{
	return zmanJS.calctefila(zmanJS.getsunrisebaalhatanya(date, here), zmanJS.getsunsetbaalhatanya(date, here));
}

zmanJS.getachilaschometzgra = function (date, here)
{
	return zmanJS.calctefila(zmanJS.getsunrise(date, here), zmanJS.getsunset(date, here));
}

zmanJS.getachilaschometzmga = function (date, here)
{
	return zmanJS.calctefila(zmanJS.getalos72(date, here), zmanJS.gettzais72(date, here));
}

zmanJS.calcbiurchometz = function (startday, endday)
{
	let shaahzmanis = zmanJS.calcshaahzmanis(startday, endday);
	return zmanJS.calctimeoffset(startday, shaahzmanis * 5);
}

zmanJS.getbiurchometzbaalhatanya = function (date, here)
{
	return zmanJS.calcbiurchometz(zmanJS.getsunrisebaalhatanya(date, here), zmanJS.getsunsetbaalhatanya(date, here));
}

zmanJS.getbiurchometzgra = function (date, here)
{
	return zmanJS.calcbiurchometz(zmanJS.getsunrise(date, here), zmanJS.getsunset(date, here));
}

zmanJS.getbiurchometzmga = function (date, here)
{
	return zmanJS.calcbiurchometz(zmanJS.getalos72(date, here), zmanJS.gettzais72(date, here));
}

zmanJS.calcchatzos = function (startday, endday)
{
	let shaahzmanis = zmanJS.calcshaahzmanis(startday, endday);
	return zmanJS.calctimeoffset(startday, shaahzmanis * 6);
}

zmanJS.getchatzosbaalhatanya = function (date, here)
{
	return zmanJS.calcchatzos(zmanJS.getsunrisebaalhatanya(date, here), zmanJS.getsunsetbaalhatanya(date, here));
}

zmanJS.getchatzosgra = function (date, here)
{
	return zmanJS.calcchatzos(zmanJS.getsunrise(date, here), zmanJS.getsunset(date, here));
}

zmanJS.calcminchagedola = function (startday, endday)
{
	let shaahzmanis = zmanJS.calcshaahzmanis(startday, endday);
	return zmanJS.calctimeoffset(startday, Math.trunc(shaahzmanis * 6.5));
}

zmanJS.getminchagedolabaalhatanya = function (date, here)
{
	return zmanJS.calcminchagedola(zmanJS.getsunrisebaalhatanya(date, here), zmanJS.getsunsetbaalhatanya(date, here));
}

zmanJS.getminchagedolagra = function (date, here)
{
	return zmanJS.calcminchagedola(zmanJS.getsunrise(date, here), zmanJS.getsunset(date, here));
}

zmanJS.getminchagedolamga = function (date, here)
{
	return zmanJS.calcminchagedola(zmanJS.getalos72(date, here), zmanJS.gettzais72(date, here));
}

zmanJS.calcminchagedola30min = function (startday, endday)
{
	let shaahzmanis = zmanJS.calcshaahzmanis(startday, endday);
	return zmanJS.calctimeoffset(startday, (shaahzmanis * 6) + 1800000);
}

zmanJS.calcminchagedolagreater30min = function (startday, endday)
{
	return ((zmanJS.calcshaahzmanis(startday, endday)*0.5) >= 1800000) ? zmanJS.calcminchagedola(startday, endday) : zmanJS.calcminchagedola30min(startday, endday);
}

zmanJS.getminchagedolabaalhatanyag30m = function (date, here)
{
	return zmanJS.calcminchagedolagreater30min(zmanJS.getsunrisebaalhatanya(date, here), zmanJS.getsunsetbaalhatanya(date, here));
}

zmanJS.getminchagedolagrag30m = function (date, here)
{
	return zmanJS.calcminchagedolagreater30min(zmanJS.getsunrise(date, here), zmanJS.getsunset(date, here));
}

zmanJS.getminchagedolamgag30m = function (date, here)
{
	return zmanJS.calcminchagedolagreater30min(zmanJS.getalos72(date, here), zmanJS.gettzais72(date, here));
}

zmanJS.calcminchaketana = function (startday, endday)
{
	let shaahzmanis = zmanJS.calcshaahzmanis(startday, endday);
	return zmanJS.calctimeoffset(startday, Math.trunc(shaahzmanis * 9.5));
}

zmanJS.getminchaketanabaalhatanya = function (date, here)
{
	return zmanJS.calcminchaketana(zmanJS.getsunrisebaalhatanya(date, here), zmanJS.getsunsetbaalhatanya(date, here));
}

zmanJS.getminchaketanagra = function (date, here)
{
	return zmanJS.calcminchaketana(zmanJS.getsunrise(date, here), zmanJS.getsunset(date, here));
}

zmanJS.getminchaketanamga = function (date, here)
{
	return zmanJS.calcminchaketana(zmanJS.getalos72(date, here), zmanJS.gettzais72(date, here));
}

zmanJS.calcplag = function (startday, endday)
{
	let shaahzmanis = zmanJS.calcshaahzmanis(startday, endday);
	return zmanJS.calctimeoffset(startday, Math.trunc(shaahzmanis * 10.75));
}

zmanJS.getplagbaalhatanya = function (date, here)
{
	return zmanJS.calcplag(zmanJS.getsunrisebaalhatanya(date, here), zmanJS.getsunsetbaalhatanya(date, here));
}

zmanJS.getplaggra = function (date, here)
{
	return zmanJS.calcplag(zmanJS.getsunrise(date, here), zmanJS.getsunset(date, here));
}

zmanJS.getplagmga = function (date, here)
{
	return zmanJS.calcplag(zmanJS.getalos72(date, here), zmanJS.gettzais72(date, here));
}

zmanJS.getcandlelighting = function (date, here)
{
	return zmanJS.calctimeoffset(zmanJS.calcsunset(date, here, 90.0, 0), -1080000);
}

zmanJS.getsunset = function (date, here)
{
	return zmanJS.calcsunset(date, here, 90.0, 0);
}

zmanJS.getsunsetbaalhatanya = function (date, here)
{
	return zmanJS.calcsunset(date, here, 91.583, 0);
}

zmanJS.getelevationsunset = function (date, here)
{
	return zmanJS.calcsunset(date, here, 90.0, 1);
}

zmanJS.gettzaisbaalhatanya = function (date, here)
{
	return zmanJS.calcsunset(date, here, 96, 1);
}

zmanJS.gettzais8p5 = function (date, here)
{
	return zmanJS.calcsunset(date, here, 98.5, 1);
}

zmanJS.gettzais72 = function (date, here)
{
	return zmanJS.calctimeoffset(zmanJS.getsunset(date, here), 4320000);
}

zmanJS.calcmoladoffset = function (date, offsetsec)
{
	let result = zmanJS.getmolad(date.year, date.month);
	let tz = (-result.offset) + date.offset;
	let adjustment = Math.trunc((result.sec * 10)/3) + tz + offsetsec;
	result.sec = 0;
	result.hdateaddsecond(adjustment);
	result.EY = date.EY;
	result.offset = date.offset;
	return result;
}

zmanJS.getmolad7days = function (date)
{
	return zmanJS.calcmoladoffset(date, 604800);
}

zmanJS.getmoladhalfmonth = function (date)
{
	return zmanJS.calcmoladoffset(date, 1275722);
}

zmanJS.getmolad15days = function (date)
{
	return zmanJS.calcmoladoffset(date, 1296000);
}

zmanJS.getshaahzmanisbaalhatanya = function (date, here)
{
	return zmanJS.calcshaahzmanis(zmanJS.getsunrisebaalhatanya(date, here), zmanJS.getsunsetbaalhatanya(date, here));
}

zmanJS.getshaahzmanisgra = function (date, here)
{
	return zmanJS.calcshaahzmanis(zmanJS.getsunrise(date, here), zmanJS.getsunset(date, here));
}

zmanJS.getshaahzmanismga = function (date, here)
{
	return zmanJS.calcshaahzmanis(zmanJS.getalos72(date, here), zmanJS.gettzais72(date, here));
}

}());
