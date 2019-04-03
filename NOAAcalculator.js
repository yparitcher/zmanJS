/*
Copyright (c) 2018 Y Paritcher
*/
/************
Implementation of sunrise and sunset methods to calculate astronomical times based on the NOAA algorithm.
This calculator is based on equations from http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html and
https://github.com/KosherJava/zmanim/blob/master/src/net/sourceforge/zmanim/util/NOAACalculator.java
************/

(function () {
'use strict'

zmanJS.refraction = 34 / 60.0;
zmanJS.solarradius = 16 / 60.0;
zmanJS.earthradius = 6356.9;

zmanJS.radToDeg = function (angleRad)
{
	return (180.0 * angleRad / Math.PI);
}

zmanJS.degToRad = function (angleDeg)
{
	return (Math.PI * angleDeg / 180.0);
}

zmanJS.calcTimeJulianCent = function (jd)
{
	let jcent = (jd - 2451545.0)/36525.0;
	return jcent;
}

zmanJS.calcJDFromJulianCent = function (jcent)
{
	let JD = jcent * 36525.0 + 2451545.0;
	return JD;
}

zmanJS.calcGeomMeanLongSun = function (jcent)
{
	let gmls = 280.46646 + jcent * (36000.76983 + 0.0003032 * jcent);
	while(gmls > 360.0)
	{
		gmls -= 360.0;
	}
	while(gmls < 0.0)
	{
		gmls += 360.0;
	}
	return gmls;
}

zmanJS.calcGeomMeanAnomalySun = function (jcent)
{
	let gmas = 357.52911 + jcent * (35999.05029 - 0.0001537 * jcent);
	return gmas;
}

zmanJS.calcEccentricityEarthOrbit = function (jcent)
{
	let eeo = 0.016708634 - jcent * (0.000042037 + 0.0000001267 * jcent);
	return eeo;
}

zmanJS.calcSunEqOfCenter = function (jcent)
{
	let m = zmanJS.calcGeomMeanAnomalySun(jcent);

	let mrad = zmanJS.degToRad(m);
	let sinm = Math.sin(mrad);
	let sin2m = Math.sin(mrad+mrad);
	let sin3m = Math.sin(mrad+mrad+mrad);

	let seoc = sinm * (1.914602 - jcent * (0.004817 + 0.000014 * jcent)) + sin2m * (0.019993 - 0.000101 * jcent) + sin3m * 0.000289;
	return seoc;
}

zmanJS.calcSunTrueLong = function (jcent)
{
	let gmls = zmanJS.calcGeomMeanLongSun(jcent);
	let seoc = zmanJS.calcSunEqOfCenter(jcent);

	let stl = gmls + seoc;
	return stl;
}

zmanJS.calcSunApparentLong = function (jcent)
{
	let stl = zmanJS.calcSunTrueLong(jcent);

	let omega = 125.04 - 1934.136 * jcent;
	let sal = stl - 0.00569 - 0.00478 * Math.sin(zmanJS.degToRad(omega));
	return sal;
}

zmanJS.calcMeanObliquityOfEcliptic = function (jcent)
{
	let seconds = 21.448 - jcent*(46.8150 + jcent*(0.00059 - jcent*(0.001813)));
	let mooe = 23.0 + (26.0 + (seconds/60.0))/60.0;
	return mooe;
}

zmanJS.calcObliquityCorrection = function (jcent)
{
	let mooe = zmanJS.calcMeanObliquityOfEcliptic(jcent);

	let omega = 125.04 - 1934.136 * jcent;
	let oc = mooe + 0.00256 * Math.cos(zmanJS.degToRad(omega));
	return oc;
}

zmanJS.calcSunDeclination = function (jcent)
{
	let oc = zmanJS.calcObliquityCorrection(jcent);
	let sal = zmanJS.calcSunApparentLong(jcent);

	let sint = Math.sin(zmanJS.degToRad(oc)) * Math.sin(zmanJS.degToRad(sal));
	let sd = zmanJS.radToDeg(Math.asin(sint));
	return sd;
}

zmanJS.calcEquationOfTime = function (jcent)
{
	let oc = zmanJS.calcObliquityCorrection(jcent);
	let gmls = zmanJS.calcGeomMeanLongSun(jcent);
	let eeo = zmanJS.calcEccentricityEarthOrbit(jcent);
	let gmas = zmanJS.calcGeomMeanAnomalySun(jcent);

	let y = Math.tan(zmanJS.degToRad(oc)/2.0);
	y *= y;

	let sin2gmls = Math.sin(2.0 * zmanJS.degToRad(gmls));
	let singmas   = Math.sin(zmanJS.degToRad(gmas));
	let cos2gmls = Math.cos(2.0 * zmanJS.degToRad(gmls));
	let sin4gmls = Math.sin(4.0 * zmanJS.degToRad(gmls));
	let sin2gmas  = Math.sin(2.0 * zmanJS.degToRad(gmas));

	let Etime = y * sin2gmls - 2.0 * eeo * singmas + 4.0 * eeo * y * singmas * cos2gmls
			- 0.5 * y * y * sin4gmls - 1.25 * eeo * eeo * sin2gmas;

	return zmanJS.radToDeg(Etime)*4.0;
}

zmanJS.calcHourAngleSunrise = function (lat, solarDec, zenith)
{
	let latRad = zmanJS.degToRad(lat);
	let sdRad  = zmanJS.degToRad(solarDec);

	let HA = (Math.acos(Math.cos(zmanJS.degToRad(zenith))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad)));

	return HA;
}

zmanJS.calcHourAngleSunset = function (lat, solarDec, zenith)
{
	let latRad = zmanJS.degToRad(lat);
	let sdRad  = zmanJS.degToRad(solarDec);

	let HA = (Math.acos(Math.cos(zmanJS.degToRad(zenith))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad)));

	return -HA;
}

zmanJS.calcSolNoonUTC = function (jcent, longitude)
{
	let tnoon = zmanJS.calcTimeJulianCent(zmanJS.calcJDFromJulianCent(jcent) + longitude/360.0);
	let eqTime = zmanJS.calcEquationOfTime(tnoon);
	let solNoonUTC = 720 + (longitude * 4) - eqTime;

	let newt = zmanJS.calcTimeJulianCent(zmanJS.calcJDFromJulianCent(jcent) -0.5 + solNoonUTC/1440.0);

	eqTime = zmanJS.calcEquationOfTime(newt);
	solNoonUTC = 720 + (longitude * 4) - eqTime;

	return solNoonUTC;
}

zmanJS.calcSunriseUTC = function (JD, latitude, longitude, zenith)
{
	let jcent = zmanJS.calcTimeJulianCent(JD);

	let noonmin = zmanJS.calcSolNoonUTC(jcent, longitude);
	let tnoon = zmanJS.calcTimeJulianCent (JD+noonmin/1440.0);

	let eqTime = zmanJS.calcEquationOfTime(tnoon);
	let solarDec = zmanJS.calcSunDeclination(tnoon);
	let hourAngle = zmanJS.calcHourAngleSunrise(latitude, solarDec, zenith);

	let delta = longitude - zmanJS.radToDeg(hourAngle);
	let timeDiff = 4 * delta;
	let timeUTC = 720 + timeDiff - eqTime;

	let newt = zmanJS.calcTimeJulianCent(zmanJS.calcJDFromJulianCent(jcent) + timeUTC/1440.0);
	eqTime = zmanJS.calcEquationOfTime(newt);
	solarDec = zmanJS.calcSunDeclination(newt);
	hourAngle = zmanJS.calcHourAngleSunrise(latitude, solarDec, zenith);
	delta = longitude - zmanJS.radToDeg(hourAngle);
	timeDiff = 4 * delta;
	timeUTC = 720 + timeDiff - eqTime;

	return timeUTC;
}

zmanJS.calcSunsetUTC = function (JD, latitude, longitude, zenith)
{
	let jcent = zmanJS.calcTimeJulianCent(JD);

	let noonmin = zmanJS.calcSolNoonUTC(jcent, longitude);
	let tnoon = zmanJS.calcTimeJulianCent (JD+noonmin/1440.0);

	let eqTime = zmanJS.calcEquationOfTime(tnoon);
	let solarDec = zmanJS.calcSunDeclination(tnoon);
	let hourAngle = zmanJS.calcHourAngleSunset(latitude, solarDec, zenith);

	let delta = longitude - zmanJS.radToDeg(hourAngle);
	let timeDiff = 4 * delta;
	let timeUTC = 720 + timeDiff - eqTime;

	let newt = zmanJS.calcTimeJulianCent(zmanJS.calcJDFromJulianCent(jcent) + timeUTC/1440.0);
	eqTime = zmanJS.calcEquationOfTime(newt);
	solarDec = zmanJS.calcSunDeclination(newt);
	hourAngle = zmanJS.calcHourAngleSunset(latitude, solarDec, zenith);

	delta = longitude - zmanJS.radToDeg(hourAngle);
	timeDiff = 4 * delta;
	timeUTC = 720 + timeDiff - eqTime;

	return timeUTC;
}

zmanJS.getElevationAdjustment = function (elevation)
{
	let elevationAdjustment = zmanJS.radToDeg(Math.acos(zmanJS.earthradius / (zmanJS.earthradius + (elevation / 1000))));
	return elevationAdjustment;
}

zmanJS.adjustZenith = function (zenith, elevation)
{
	let adjustedZenith = zenith;
	if (zenith == 90.0)
	{
		adjustedZenith = zenith + (zmanJS.solarradius + zmanJS.refraction + zmanJS.getElevationAdjustment(elevation));
	}
	return adjustedZenith;
}

zmanJS.getUTCSunrise = function (JD, here, zenith, adjustForElevation)
{
	let elevation = adjustForElevation ? here.elevation : 0;
	let adjustedZenith = zmanJS.adjustZenith(zenith, elevation);

	let sunrise = zmanJS.calcSunriseUTC(JD, here.latitude, -here.longitude, adjustedZenith);
	sunrise = sunrise / 60;

	while (sunrise < 0.0)
	{
		sunrise += 24.0;
	}
	while (sunrise >= 24.0)
	{
		sunrise -= 24.0;
	}
	return sunrise;
}

zmanJS.getUTCSunset = function (JD, here, zenith, adjustForElevation)
{
	let elevation = adjustForElevation ? here.elevation : 0;
	let adjustedZenith = zmanJS.adjustZenith(zenith, elevation);

	let sunset = zmanJS.calcSunsetUTC(JD, here.latitude, -here.longitude, adjustedZenith);
	sunset = sunset / 60;

	while (sunset < 0.0)
	{
		sunset += 24.0;
	}
	while (sunset >= 24.0)
	{
		sunset -= 24.0;
	}
	return sunset;
}

}());
