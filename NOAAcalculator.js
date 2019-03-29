'use strict'

/*
Copyright (c) 2018 Y Paritcher
*/
/************
Implementation of sunrise and sunset methods to calculate astronomical times based on the NOAA algorithm.
This calculator is based on equations from http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html and
https://github.com/KosherJava/zmanim/blob/master/src/net/sourceforge/zmanim/util/NOAACalculator.java
************/
const refraction = 34 / 60.0;
const solarradius = 16 / 60.0;
const earthradius = 6356.9;

function radToDeg(angleRad)
{
	return (180.0 * angleRad / Math.PI);
}

function degToRad(angleDeg)
{
	return (Math.PI * angleDeg / 180.0);
}

function calcTimeJulianCent(jd)
{
	let jcent = (jd - 2451545.0)/36525.0;
	return jcent;
}

function calcJDFromJulianCent(jcent)
{
	let JD = jcent * 36525.0 + 2451545.0;
	return JD;
}

function calcGeomMeanLongSun(jcent)
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

function calcGeomMeanAnomalySun(jcent)
{
	let gmas = 357.52911 + jcent * (35999.05029 - 0.0001537 * jcent);
	return gmas;
}

function calcEccentricityEarthOrbit(jcent)
{
	let eeo = 0.016708634 - jcent * (0.000042037 + 0.0000001267 * jcent);
	return eeo;
}

function calcSunEqOfCenter(jcent)
{
	let m = calcGeomMeanAnomalySun(jcent);

	let mrad = degToRad(m);
	let sinm = Math.sin(mrad);
	let sin2m = Math.sin(mrad+mrad);
	let sin3m = Math.sin(mrad+mrad+mrad);

	let seoc = sinm * (1.914602 - jcent * (0.004817 + 0.000014 * jcent)) + sin2m * (0.019993 - 0.000101 * jcent) + sin3m * 0.000289;
	return seoc;
}

function calcSunTrueLong(jcent)
{
	let gmls = calcGeomMeanLongSun(jcent);
	let seoc = calcSunEqOfCenter(jcent);

	let stl = gmls + seoc;
	return stl;
}

function calcSunApparentLong(jcent)
{
	let stl = calcSunTrueLong(jcent);

	let omega = 125.04 - 1934.136 * jcent;
	let sal = stl - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
	return sal;
}

function calcMeanObliquityOfEcliptic(jcent)
{
	let seconds = 21.448 - jcent*(46.8150 + jcent*(0.00059 - jcent*(0.001813)));
	let mooe = 23.0 + (26.0 + (seconds/60.0))/60.0;
	return mooe;
}

function calcObliquityCorrection(jcent)
{
	let mooe = calcMeanObliquityOfEcliptic(jcent);

	let omega = 125.04 - 1934.136 * jcent;
	let oc = mooe + 0.00256 * Math.cos(degToRad(omega));
	return oc;
}

function calcSunDeclination(jcent)
{
	let oc = calcObliquityCorrection(jcent);
	let sal = calcSunApparentLong(jcent);

	let sint = Math.sin(degToRad(oc)) * Math.sin(degToRad(sal));
	let sd = radToDeg(Math.asin(sint));
	return sd;
}

function calcEquationOfTime(jcent)
{
	let oc = calcObliquityCorrection(jcent);
	let gmls = calcGeomMeanLongSun(jcent);
	let eeo = calcEccentricityEarthOrbit(jcent);
	let gmas = calcGeomMeanAnomalySun(jcent);

	let y = Math.tan(degToRad(oc)/2.0);
	y *= y;

	let sin2gmls = Math.sin(2.0 * degToRad(gmls));
	let singmas   = Math.sin(degToRad(gmas));
	let cos2gmls = Math.cos(2.0 * degToRad(gmls));
	let sin4gmls = Math.sin(4.0 * degToRad(gmls));
	let sin2gmas  = Math.sin(2.0 * degToRad(gmas));

	let Etime = y * sin2gmls - 2.0 * eeo * singmas + 4.0 * eeo * y * singmas * cos2gmls
			- 0.5 * y * y * sin4gmls - 1.25 * eeo * eeo * sin2gmas;

	return radToDeg(Etime)*4.0;
}

function calcHourAngleSunrise(lat, solarDec, zenith)
{
	let latRad = degToRad(lat);
	let sdRad  = degToRad(solarDec);

	let HA = (Math.acos(Math.cos(degToRad(zenith))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad)));

	return HA;
}

function calcHourAngleSunset(lat, solarDec, zenith)
{
	let latRad = degToRad(lat);
	let sdRad  = degToRad(solarDec);

	let HA = (Math.acos(Math.cos(degToRad(zenith))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad)));

	return -HA;
}

function calcSolNoonUTC(jcent, longitude)
{
	let tnoon = calcTimeJulianCent(calcJDFromJulianCent(jcent) + longitude/360.0);
	let eqTime = calcEquationOfTime(tnoon);
	let solNoonUTC = 720 + (longitude * 4) - eqTime;

	let newt = calcTimeJulianCent(calcJDFromJulianCent(jcent) -0.5 + solNoonUTC/1440.0);

	eqTime = calcEquationOfTime(newt);
	solNoonUTC = 720 + (longitude * 4) - eqTime;

	return solNoonUTC;
}

function calcSunriseUTC(JD, latitude, longitude, zenith)
{
	let jcent = calcTimeJulianCent(JD);

	let noonmin = calcSolNoonUTC(jcent, longitude);
	let tnoon = calcTimeJulianCent (JD+noonmin/1440.0);

	let eqTime = calcEquationOfTime(tnoon);
	let solarDec = calcSunDeclination(tnoon);
	let hourAngle = calcHourAngleSunrise(latitude, solarDec, zenith);

	let delta = longitude - radToDeg(hourAngle);
	let timeDiff = 4 * delta;
	let timeUTC = 720 + timeDiff - eqTime;

	let newt = calcTimeJulianCent(calcJDFromJulianCent(jcent) + timeUTC/1440.0);
	eqTime = calcEquationOfTime(newt);
	solarDec = calcSunDeclination(newt);
	hourAngle = calcHourAngleSunrise(latitude, solarDec, zenith);
	delta = longitude - radToDeg(hourAngle);
	timeDiff = 4 * delta;
	timeUTC = 720 + timeDiff - eqTime;

	return timeUTC;
}

function calcSunsetUTC(JD, latitude, longitude, zenith)
{
	let jcent = calcTimeJulianCent(JD);

	let noonmin = calcSolNoonUTC(jcent, longitude);
	let tnoon = calcTimeJulianCent (JD+noonmin/1440.0);

	let eqTime = calcEquationOfTime(tnoon);
	let solarDec = calcSunDeclination(tnoon);
	let hourAngle = calcHourAngleSunset(latitude, solarDec, zenith);

	let delta = longitude - radToDeg(hourAngle);
	let timeDiff = 4 * delta;
	let timeUTC = 720 + timeDiff - eqTime;

	let newt = calcTimeJulianCent(calcJDFromJulianCent(jcent) + timeUTC/1440.0);
	eqTime = calcEquationOfTime(newt);
	solarDec = calcSunDeclination(newt);
	hourAngle = calcHourAngleSunset(latitude, solarDec, zenith);

	delta = longitude - radToDeg(hourAngle);
	timeDiff = 4 * delta;
	timeUTC = 720 + timeDiff - eqTime;

	return timeUTC;
}

function getElevationAdjustment(elevation)
{
	let elevationAdjustment = radToDeg(Math.acos(earthradius / (earthradius + (elevation / 1000))));
	return elevationAdjustment;
}

function adjustZenith(zenith, elevation)
{
	let adjustedZenith = zenith;
	if (zenith == 90.0)
	{
		adjustedZenith = zenith + (solarradius + refraction + getElevationAdjustment(elevation));
	}
	return adjustedZenith;
}

function getUTCSunrise(JD, here, zenith, adjustForElevation)
{
	let elevation = adjustForElevation ? here.elevation : 0;
	let adjustedZenith = adjustZenith(zenith, elevation);

	let sunrise = calcSunriseUTC(JD, here.latitude, -here.longitude, adjustedZenith);
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

function getUTCSunset(JD, here, zenith, adjustForElevation)
{
	let elevation = adjustForElevation ? here.elevation : 0;
	let adjustedZenith = adjustZenith(zenith, elevation);

	let sunset = calcSunsetUTC(JD, here.latitude, -here.longitude, adjustedZenith);
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
