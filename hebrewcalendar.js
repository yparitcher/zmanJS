'use strict'
/*
Copyright (c) 2018 Y Paritcher
---------------------------------------------------------------------------------
Based on code from Calendrical Calculations 
by Nachum Dershowitz and Edward M. Reingold, 
Software---Practice & Experience, vol. 20, no. 9 (September, 1990), pp. 899--928.

and code from Astronomical Algorithms by Jean Meeus

and code from ICU licensed under the Unicode license
	COPYRIGHT AND PERMISSION NOTICE (ICU 58 and later)

	Copyright © 1991-2018 Unicode, Inc. All rights reserved.
	Distributed under the Terms of Use in http://www.unicode.org/copyright.html.

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of the Unicode data files and any associated documentation
	(the "Data Files") or Unicode software and any associated documentation
	(the "Software") to deal in the Data Files or Software
	without restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, and/or sell copies of
	the Data Files or Software, and to permit persons to whom the Data Files
	or Software are furnished to do so, provided that either
	(a) this copyright and permission notice appear with all copies
	of the Data Files or Software, or
	(b) this copyright and permission notice appear in associated
	Documentation.

	THE DATA FILES AND SOFTWARE ARE PROVIDED "AS IS", WITHOUT WARRANTY OF
	ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
	WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT OF THIRD PARTY RIGHTS.
	IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS
	NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL
	DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
	DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
	TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THE DATA FILES OR SOFTWARE.

	Except as contained in this notice, the name of a copyright holder
	shall not be used in advertising or otherwise to promote the sale,
	use or other dealings in these Data Files or Software without prior
	written authorization of the copyright holder.
---------------------------------------------------------------------------------
*/
const parshah = { NOPARSHAH: 0, BERESHIT: 1, NOACH: 2, LECH_LECHA: 3, VAYEIRA: 4, CHAYEI_SARAH: 5, TOLEDOT: 6, VAYETZE: 7, VAYISHLACH: 8, VAYESHEV: 9, MIKETZ: 10, VAYIGASH: 11, VAYECHI: 12, SHEMOT: 13, VAEIRA: 14, BO: 15, BESHALACH: 16, YITRO: 17, MISHPATIM: 18, TERUMAH: 19, TETZAVEH: 20, KI_TISA: 21, VAYAKHEL: 22, PEKUDEI: 23, VAYIKRA: 24, TZAV: 25, SHEMINI: 26, TAZRIA: 27, METZORA: 28, ACHAREI_MOT: 29, KEDOSHIM: 30, EMOR: 31, BEHAR: 32, BECHUKOTAI: 33, BAMIDBAR: 34, NASO: 35, BEHAALOTECHA: 36, SHLACH: 37, KORACH: 38, CHUKAT: 39, BALAK: 40, PINCHAS: 41, MATOT: 42, MASEI: 43, DEVARIM: 44, VAETCHANAN: 45, EIKEV: 46, REEH: 47, SHOFTIM: 48, KI_TEITZEI: 49, KI_TAVO: 50, NITZAVIM: 51, VAYELECH: 52, HAAZINU: 53, VZOT_HABERACHAH: 54, VAYAKHEL_PEKUDEI: 55, TAZRIA_METZORA: 56, ACHAREI_MOT_KEDOSHIM: 57, BEHAR_BECHUKOTAI: 58, CHUKAT_BALAK: 59, MATOT_MASEI: 60, NITZAVIM_VAYELECH: 61};

const parshahlist = [
[parshah.NOPARSHAH, parshah.VAYELECH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL_PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.NOPARSHAH, parshah.SHEMINI, parshah.TAZRIA_METZORA, parshah.ACHAREI_MOT_KEDOSHIM, parshah.EMOR, parshah.BEHAR_BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM_VAYELECH],
[parshah.NOPARSHAH, parshah.VAYELECH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL_PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.NOPARSHAH, parshah.SHEMINI, parshah.TAZRIA_METZORA, parshah.ACHAREI_MOT_KEDOSHIM, parshah.EMOR, parshah.BEHAR_BECHUKOTAI, parshah.BAMIDBAR, parshah.NOPARSHAH, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT_BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM_VAYELECH],
[parshah.NOPARSHAH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL_PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.SHEMINI, parshah.TAZRIA_METZORA, parshah.ACHAREI_MOT_KEDOSHIM, parshah.EMOR, parshah.BEHAR_BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM],
[parshah.NOPARSHAH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL, parshah.PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.NOPARSHAH, parshah.SHEMINI, parshah.TAZRIA_METZORA, parshah.ACHAREI_MOT_KEDOSHIM, parshah.EMOR, parshah.BEHAR_BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM],
[parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL_PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.NOPARSHAH, parshah.SHEMINI, parshah.TAZRIA_METZORA, parshah.ACHAREI_MOT_KEDOSHIM, parshah.EMOR, parshah.BEHAR_BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM],
[parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL_PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.NOPARSHAH, parshah.SHEMINI, parshah.TAZRIA_METZORA, parshah.ACHAREI_MOT_KEDOSHIM, parshah.EMOR, parshah.BEHAR_BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM_VAYELECH],
[parshah.NOPARSHAH, parshah.VAYELECH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL, parshah.PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.SHEMINI, parshah.TAZRIA, parshah.METZORA, parshah.NOPARSHAH, parshah.ACHAREI_MOT, parshah.KEDOSHIM, parshah.EMOR, parshah.BEHAR, parshah.BECHUKOTAI, parshah.BAMIDBAR, parshah.NOPARSHAH, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT_BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM_VAYELECH],
[parshah.NOPARSHAH, parshah.VAYELECH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL, parshah.PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.SHEMINI, parshah.TAZRIA, parshah.METZORA, parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.ACHAREI_MOT, parshah.KEDOSHIM, parshah.EMOR, parshah.BEHAR, parshah.BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM],
[parshah.NOPARSHAH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL, parshah.PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.SHEMINI, parshah.TAZRIA, parshah.METZORA, parshah.ACHAREI_MOT, parshah.NOPARSHAH, parshah.KEDOSHIM, parshah.EMOR, parshah.BEHAR, parshah.BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT, parshah.MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM],
[parshah.NOPARSHAH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL, parshah.PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.SHEMINI, parshah.TAZRIA, parshah.METZORA, parshah.ACHAREI_MOT, parshah.NOPARSHAH, parshah.KEDOSHIM, parshah.EMOR, parshah.BEHAR, parshah.BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT, parshah.MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM_VAYELECH],
[parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL, parshah.PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.SHEMINI, parshah.TAZRIA, parshah.METZORA, parshah.NOPARSHAH, parshah.ACHAREI_MOT, parshah.KEDOSHIM, parshah.EMOR, parshah.BEHAR, parshah.BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM_VAYELECH],
[parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL, parshah.PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.SHEMINI, parshah.TAZRIA, parshah.METZORA, parshah.NOPARSHAH, parshah.ACHAREI_MOT, parshah.KEDOSHIM, parshah.EMOR, parshah.BEHAR, parshah.BECHUKOTAI, parshah.BAMIDBAR, parshah.NOPARSHAH, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT_BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM_VAYELECH],
[parshah.NOPARSHAH, parshah.VAYELECH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL_PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.NOPARSHAH, parshah.SHEMINI, parshah.TAZRIA_METZORA, parshah.ACHAREI_MOT_KEDOSHIM, parshah.EMOR, parshah.BEHAR_BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM_VAYELECH],
[parshah.NOPARSHAH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL_PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.NOPARSHAH, parshah.SHEMINI, parshah.TAZRIA_METZORA, parshah.ACHAREI_MOT_KEDOSHIM, parshah.EMOR, parshah.BEHAR, parshah.BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM],
[parshah.NOPARSHAH, parshah.VAYELECH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL, parshah.PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.SHEMINI, parshah.TAZRIA, parshah.METZORA, parshah.NOPARSHAH, parshah.ACHAREI_MOT, parshah.KEDOSHIM, parshah.EMOR, parshah.BEHAR, parshah.BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM_VAYELECH],
[parshah.NOPARSHAH, parshah.VAYELECH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL, parshah.PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.SHEMINI, parshah.TAZRIA, parshah.METZORA, parshah.NOPARSHAH, parshah.ACHAREI_MOT, parshah.KEDOSHIM, parshah.EMOR, parshah.BEHAR, parshah.BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT, parshah.MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM],
[parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.HAAZINU, parshah.NOPARSHAH, parshah.NOPARSHAH, parshah.BERESHIT, parshah.NOACH, parshah.LECH_LECHA, parshah.VAYEIRA, parshah.CHAYEI_SARAH, parshah.TOLEDOT, parshah.VAYETZE, parshah.VAYISHLACH, parshah.VAYESHEV, parshah.MIKETZ, parshah.VAYIGASH, parshah.VAYECHI, parshah.SHEMOT, parshah.VAEIRA, parshah.BO, parshah.BESHALACH, parshah.YITRO, parshah.MISHPATIM, parshah.TERUMAH, parshah.TETZAVEH, parshah.KI_TISA, parshah.VAYAKHEL, parshah.PEKUDEI, parshah.VAYIKRA, parshah.TZAV, parshah.SHEMINI, parshah.TAZRIA, parshah.METZORA, parshah.NOPARSHAH, parshah.ACHAREI_MOT, parshah.KEDOSHIM, parshah.EMOR, parshah.BEHAR, parshah.BECHUKOTAI, parshah.BAMIDBAR, parshah.NASO, parshah.BEHAALOTECHA, parshah.SHLACH, parshah.KORACH, parshah.CHUKAT, parshah.BALAK, parshah.PINCHAS, parshah.MATOT_MASEI, parshah.DEVARIM, parshah.VAETCHANAN, parshah.EIKEV, parshah.REEH, parshah.SHOFTIM, parshah.KI_TEITZEI, parshah.KI_TAVO, parshah.NITZAVIM_VAYELECH]];

const yomtov = { CHOL: 0, PESACH_DAY1: 1, PESACH_DAY2: 2, SHVEI_SHEL_PESACH: 3, ACHRON_SHEL_PESACH: 4, SHAVOUS_DAY1: 5, SHAVOUS_DAY2: 6, ROSH_HASHANAH_DAY1: 7, ROSH_HASHANAH_DAY2: 8, YOM_KIPPUR: 9, SUKKOS_DAY1: 10, SUKKOS_DAY2: 11, SHMEINI_ATZERES: 12, SIMCHAS_TORAH: 13, CHOL_HAMOED_PESACH_DAY1: 14, CHOL_HAMOED_PESACH_DAY2: 15, CHOL_HAMOED_PESACH_DAY3: 16, CHOL_HAMOED_PESACH_DAY4: 17, CHOL_HAMOED_PESACH_DAY5: 18, CHOL_HAMOED_SUKKOS_DAY1: 19, CHOL_HAMOED_SUKKOS_DAY2: 20, CHOL_HAMOED_SUKKOS_DAY3: 21, CHOL_HAMOED_SUKKOS_DAY4: 22, CHOL_HAMOED_SUKKOS_DAY5: 23, HOSHANA_RABBAH: 24, PESACH_SHEINI: 25, LAG_BAOMER: 26, TU_BAV: 27, CHANUKAH_DAY1: 28, CHANUKAH_DAY2: 29, CHANUKAH_DAY3: 30, CHANUKAH_DAY4: 31, CHANUKAH_DAY5: 32, CHANUKAH_DAY6: 33, CHANUKAH_DAY7: 34, CHANUKAH_DAY8: 35, TU_BISHVAT: 36, PURIM_KATAN: 37, SHUSHAN_PURIM_KATAN: 38, PURIM: 39, SHUSHAN_PURIM: 40, SHIVA_ASAR_BTAAMUZ: 41, TISHA_BAV: 42, TZOM_GEDALIA: 43, ASARAH_BTEVES: 44, TAANIS_ESTER: 45, EREV_PESACH: 46, EREV_SHAVOUS: 47, EREV_ROSH_HASHANAH: 48, EREV_YOM_KIPPUR: 49, EREV_SUKKOS: 50, SHKALIM: 51, ZACHOR: 52, PARAH: 53, HACHODESH: 54, ROSH_CHODESH: 55, MACHAR_CHODESH: 56, SHABBOS_MEVORCHIM: 57};

function locations(latitude, longitude, elevation) {
	this.latitude = latitude;
	this.longitude = longitude;
	this.elevation = elevation;
};

function hdate(year=1, month=7, day=1, hour=0, minute=0, sec=0, msec=0, offset=0, EY=0) {
	this.year = 1;
	this.month = 7;
	this.day = 1;
	this.hour = 0;
	this.min = 0;
	this.sec = 0;
	this.msec = 0;
	this.wday = 0;
	this.dayofyear = 0;
	this.offset = 0;
	this.leap = 0;
	this.EY = 0;

	this.setoffset = function (offset) {
		this.offset = offset
		return this;
	}

	this.setEY = function (EY) {
		this.EY = EY;
		return this;
	}

	this.convertDate = function (date){
		let julianDay = gregorianjulian(date);
		let d = Math.trunc(julianDay - 347996);
		let m = ((d * 25920) / 765433);
		let year = Math.trunc((19. * m) / 235.);
		let month;
		let dayCount;
		
		while (d >= HebrewCalendarElapsedDays(year + 1))
		{
	  		year++;
	  	}
		let ys  = HebrewCalendarElapsedDays(year);
		let dayOfYear = (d - ys)+1;
		let nissanStart = nissanCount(year);
		if (dayOfYear <= nissanStart) {
		  month = 7;  //  Start at Tishri
		  dayCount = 0;
		} else {
		  month = 1;  //  Start at Nisan
		  dayCount = nissanStart;
	  	}
		while (dayOfYear > (dayCount + LastDayOfHebrewMonth(month, year)))
		{
		  dayCount += LastDayOfHebrewMonth(month, year);
		  month++;
	  	}
		let day = dayOfYear - dayCount;
		this.year = year;
		this.month = month;
		this.day = day;
		this.wday = (HebrewCalendarElapsedDays(year)+dayOfYear)%7;
		this.dayofyear = dayOfYear;
		this.leap = HebrewLeapYear(year);
		this.hour = date.getHours();
		this.min = date.getMinutes();
		this.sec = date.getSeconds();
		return this;
	}

	this.hdatejulian = function () {
		let diff = 347996.5;
		let yearstart = HebrewCalendarElapsedDays(this.year);
		return (this.dayofyear-1) + yearstart + diff;
	}

	this.hdateunix = function () {
		let result = (HebrewCalendarElapsedDays(this.year)+(this.dayofyear-1))-2092591;
		result = ((((((result*24)+this.hour)*60)+this.min)*60)+this.sec);
		result -= this.offset;
		return result;
	}

	this.hdatesetdoy = function() {
		if (this.day == 30 && LastDayOfHebrewMonth(this.month, this.year) == 29){this.day = 29;}
		let monthcount;
		if (this.month < 7)
		{
			monthcount = 1;
			this.dayofyear = nissanCount(this.year);
		} else {
			monthcount = 7;
			this.dayofyear = 0;
		}
		while (monthcount < this.month)
		{
			this.dayofyear += LastDayOfHebrewMonth(monthcount, this.year);
			monthcount++;
		}
		this.dayofyear += this.day;
		this.wday = (HebrewCalendarElapsedDays(this.year)+this.dayofyear)%7;
		this.leap = HebrewLeapYear(this.year);
		return this;
	}

	this.hdateaddyear = function (years) {
		let leap1 = this.leap;
		this.year += years;
		let leap2 = HebrewLeapYear(this.year);
		if (leap1 != leap2)
		{
			if (leap1 && this.month == 13){this.month = 12;}
			if (!leap1 && this.month == 12){this.month = 13;}
		}
		this.hdatesetdoy();
		return this;
	}

	this.hdateaddmonth = function (months) {
		let last = 0;
		if (this.day == 30) {last = 1;}
		let monthcount = months;
		while (monthcount > 0)
		{
			switch (this.month)
			{
				case 12:
					if (this.leap){this.month++;}
					else{this.month = 1;}
					monthcount--;
					break;
				case 13:
					this.month = 1;
					monthcount--;
					break;
				case 6:
					this.month++;
					this.hdateaddyear(1);
					monthcount--;
					break;
				default:
					this.month++;
					monthcount--;
					break;
			 }
		}
		while (monthcount < 0)
		{
			switch (this.month)
			{
				case 1:
					if (this.leap){this.month = 13;}
					else{this.month = 12;}
					monthcount++;
					break;
				case 7:
					this.month--;
					this.hdateaddyear(-1);
					monthcount++;
					break;
				default:
					this.month--;
					monthcount++;
					break;
			 }
		}
		if (last && LastDayOfHebrewMonth(this.month, this.year) == 30){this.day = 30;}
		this.hdatesetdoy();
		return this;
	}

	this.hdateaddday = function (days) {
		let daycount = days;
		while (daycount > 0)
		{
			switch (this.day)
			{
				case 30:
					this.day = 1;
					this.hdateaddmonth(1);
					daycount--;
					break;
				case 29:
					if (LastDayOfHebrewMonth(this.month, this.year) == 29)
					{
						this.day = 1;
						this.hdateaddmonth(1);
					} else {
						this.day++;
					}
					daycount--;
					break;
				default:
					this.day++;
					daycount--;
					break;
			}
		}
		while (daycount < 0)
		{
			switch (this.day)
			{
				case 1:
					this.hdateaddmonth(-1);
					if (LastDayOfHebrewMonth(this.month, this.year) == 30)
					{
						this.day = 30;
					} else {
						this.day = 29;
					}
					daycount++;
					break;
				default:
					this.day--;
					daycount++;
					break;
			}
		}
		this.hdatesetdoy();
		return this;
	}

	this.hdateaddhour = function (hours) {
		let args = {start: (this.hour + hours), finish: this.hour, carry: 0, divisor: 24};
		divideandcarry(args);
		this.hour = args.finish;
		if (args.carry){this.hdateaddday(args.carry);}
		else {this.hdatesetdoy();}
		return this;
	}

	this.hdateaddminute = function (minutes) {
		let args = {start: (this.min + minutes), finish: this.min, carry: 0, divisor: 60};
		divideandcarry(args);
		this.min = args.finish;
		if (args.carry){this.hdateaddhour(args.carry);}
		else {this.hdatesetdoy();}
		return this;
	}

	this.hdateaddsecond = function (seconds) {
		let args = {start: (this.sec + seconds), finish: this.sec, carry: 0, divisor: 60};
		divideandcarry(args);
		this.sec = args.finish;
		if (args.carry){this.hdateaddminute(args.carry);}
		else {this.hdatesetdoy();}
		return this;
	}

	this.hdateaddmsecond = function (mseconds) {
		let args = {start: (this.msec + mseconds), finish: this.msec, carry: 0, divisor: 1000};
		divideandcarry(args);
		this.msec = args.finish;
		if (args.carry){this.hdateaddsecond(args.carry);}
		else {this.hdatesetdoy();}
		return this;
	}

	this.hdateadd = function (years, months, days, hours, minutes, seconds, mseconds) {
		if (years) {this.hdateaddyear(years);}
		if (months) {this.hdateaddmonth(months);}
		if (days) {this.hdateaddday(days);}
		if (hours) {this.hdateaddhour(hours);}
		if (minutes) {this.hdateaddminute(minutes);}
		if (seconds) {this.hdateaddsecond(seconds);}
		if (mseconds) {this.hdateaddmsecond(mseconds);}
		return this;
	}

	this.getYearType = function () {
		let yearWday = (HebrewCalendarElapsedDays(this.year)+1)%7;
		if (this.leap)
		{
			switch (yearWday)
			{
			case 2:
				if (ShortKislev(this.year))
				{
					if (this.EY) { return 14;}
					return 6;
				}
				if (LongHeshvan(this.year))
				{
					if (this.EY) { return 15;}
					return 7;
				}
				break;
			case 3:
				if (this.EY) { return 15;}
				return 7;
				break;
			case 5:
				if (ShortKislev(this.year)) {return 8;}
				if (LongHeshvan(this.year)) {return 9;}
				break;
			case 0:
				if (ShortKislev(this.year)) {return 10;}
				if (LongHeshvan(this.year))
				{
					if (this.EY) { return 16;}
					return 11;
				}
				break;
			}
		} else {
			switch (yearWday)
			{
			case 2:
				if (ShortKislev(this.year)) {return 0;}
				if (LongHeshvan(this.year))
				{
					if (this.EY) { return 12;}
					return 1;
				}
				break;
			case 3:
				if (this.EY) { return 12;}
				return 1;
				break;
			case 5:
				if (LongHeshvan(this.year)) {return 3;}
				if (!ShortKislev(this.year))
				{
					if (this.EY) { return 13;}
					return 2;
				}
				break;
			case 0:
				if (ShortKislev(this.year)) {return 4;}
				if (LongHeshvan(this.year)) {return 5;}
				break;
			}
		}
		return -1;
	}

	this.getparshah = function () {
		let yearType = this.getYearType();
		let yearWday = HebrewCalendarElapsedDays(this.year)%7;
		let day = yearWday + this.dayofyear;
		if (this.wday) {return parshah.NOPARSHAH;}
		if (yearType >= 0)
		{
			return parshahlist[yearType][day/7];
		}
		return parshah.NOPARSHAH;
	}

	this.getyomtov = function () {
		switch(this.month)
		{
			case 1:
				if(this.day == 14) {return yomtov.EREV_PESACH;}
				if(this.day == 15) {return yomtov.PESACH_DAY1;}
				if(this.day == 16 && this.EY) {return yomtov.CHOL_HAMOED_PESACH_DAY1;}
				if(this.day == 16) {return yomtov.PESACH_DAY2;}
				if(this.day == 17 && this.EY) {return yomtov.CHOL_HAMOED_PESACH_DAY2;}
				if(this.day == 17) {return yomtov.CHOL_HAMOED_PESACH_DAY1;}
				if(this.day == 18 && this.EY) {return yomtov.CHOL_HAMOED_PESACH_DAY3;}
				if(this.day == 18) {return yomtov.CHOL_HAMOED_PESACH_DAY2;}
				if(this.day == 19 && this.EY) {return yomtov.CHOL_HAMOED_PESACH_DAY4;}
				if(this.day == 19) {return yomtov.CHOL_HAMOED_PESACH_DAY3;}
				if(this.day == 20 && this.EY) {return yomtov.CHOL_HAMOED_PESACH_DAY5;}
				if(this.day == 20) {return yomtov.CHOL_HAMOED_PESACH_DAY4;}
				if(this.day == 21) {return yomtov.SHVEI_SHEL_PESACH;}
				if(this.day == 22 && !this.EY) {return yomtov.ACHRON_SHEL_PESACH;}
				break;
			case 2:
				if(this.day == 14) {return yomtov.PESACH_SHEINI;}
				if(this.day == 18) {return yomtov.LAG_BAOMER;}
				break;
			case 3:
				if(this.day == 5) {return yomtov.EREV_SHAVOUS;}
				if(this.day == 6) {return yomtov.SHAVOUS_DAY1;}
				if(this.day == 7 && !this.EY) {return yomtov.SHAVOUS_DAY2;}
				break;
			case 4:
				if(this.day == 17 && this.wday) {return yomtov.SHIVA_ASAR_BTAAMUZ;}
				if(this.day == 18 && this.wday == 1) {return yomtov.SHIVA_ASAR_BTAAMUZ;}
				break;
			case 5:
				if(this.day == 9 && this.wday) {return yomtov.TISHA_BAV;}
				if(this.day == 10 && this.wday == 1) {return yomtov.TISHA_BAV;}
				if(this.day == 15) {return yomtov.TU_BAV;}
				break;
			case 6:
				if(this.day == 29) {return yomtov.EREV_ROSH_HASHANAH;}
				break;
			case 7:
				if(this.day == 1) {return yomtov.ROSH_HASHANAH_DAY1;}
				if(this.day == 2) {return yomtov.ROSH_HASHANAH_DAY2;}
				if(this.day == 3 && this.wday) {return yomtov.TZOM_GEDALIA;}
				if(this.day == 4 && this.wday == 1) {return yomtov.TZOM_GEDALIA;}
				if(this.day == 9) {return yomtov.EREV_YOM_KIPPUR;}
				if(this.day == 10) {return yomtov.YOM_KIPPUR;}
				if(this.day == 14) {return yomtov.EREV_SUKKOS;}
				if(this.day == 15) {return yomtov.SUKKOS_DAY1;}
				if(this.day == 16 && this.EY) {return yomtov.CHOL_HAMOED_SUKKOS_DAY1;}
				if(this.day == 16) {return yomtov.SUKKOS_DAY2;}
				if(this.day == 17 && this.EY) {return yomtov.CHOL_HAMOED_SUKKOS_DAY2;}
				if(this.day == 17) {return yomtov.CHOL_HAMOED_SUKKOS_DAY1;}
				if(this.day == 18 && this.EY) {return yomtov.CHOL_HAMOED_SUKKOS_DAY3;}
				if(this.day == 18) {return yomtov.CHOL_HAMOED_SUKKOS_DAY2;}
				if(this.day == 19 && this.EY) {return yomtov.CHOL_HAMOED_SUKKOS_DAY4;}
				if(this.day == 19) {return yomtov.CHOL_HAMOED_SUKKOS_DAY3;}
				if(this.day == 20 && this.EY) {return yomtov.CHOL_HAMOED_SUKKOS_DAY5;}
				if(this.day == 20) {return yomtov.CHOL_HAMOED_SUKKOS_DAY4;}
				if(this.day == 21) {return yomtov.HOSHANA_RABBAH;}
				if(this.day == 22) {return yomtov.SHMEINI_ATZERES;}
				if(this.day == 23 && !this.EY) {return yomtov.SIMCHAS_TORAH;}
				break;
			case 9:
				if(this.day == 25) {return yomtov.CHANUKAH_DAY1;}
				if(this.day == 26) {return yomtov.CHANUKAH_DAY2;}
				if(this.day == 27) {return yomtov.CHANUKAH_DAY3;}
				if(this.day == 28) {return yomtov.CHANUKAH_DAY4;}
				if(this.day == 29) {return yomtov.CHANUKAH_DAY5;}
				if(this.day == 30) {return yomtov.CHANUKAH_DAY6;}
				break;
			case 10:
				if(this.day == 1)
				{	if(ShortKislev(this.year)) {return yomtov.CHANUKAH_DAY6;}
					else {return yomtov.CHANUKAH_DAY7;}}
				if(this.day == 2)
				{	if(ShortKislev(this.year)) {return yomtov.CHANUKAH_DAY7;}
					else {return yomtov.CHANUKAH_DAY8;}}
				if(this.day == 3 && ShortKislev(this.year)) {return yomtov.CHANUKAH_DAY8;}
				if(this.day == 10) {return yomtov.ASARAH_BTEVES;}
				break;
			case 11:
				if(this.day == 15) {return yomtov.TU_BISHVAT;}
				break;
			case 12:
				if(!this.leap && this.day == 11 && this.wday == 5) {return yomtov.TAANIS_ESTER;}
				if(!this.leap && this.day == 13 && this.wday) {return yomtov.TAANIS_ESTER;}
				if(this.day == 14)
				{	if(this.leap) {return yomtov.PURIM_KATAN;}
					else {return yomtov.PURIM;}}
				if(this.day == 15)
				{	if(this.leap) {return yomtov.SHUSHAN_PURIM_KATAN;}
					else {return yomtov.SHUSHAN_PURIM;}}
				break;
			case 13:
				if(this.day == 11 && this.wday == 5) {return yomtov.TAANIS_ESTER;}
				if(this.day == 13 && this.wday) {return yomtov.TAANIS_ESTER;}
				if(this.day == 14) {return yomtov.PURIM;}
				if(this.day == 15) {return yomtov.SHUSHAN_PURIM;}
				break;
		}
		return yomtov.CHOL;
	}

	this.getspecialshabbos = function () {
		if(!this.wday)
		{
			if((this.month == 11 && !this.leap) || (this.month == 12 && this.leap))
			{
				if(this.day == 25
				|| this.day == 27
				|| this.day == 29)
				{return yomtov.SHKALIM;}
			}
			if((this.month == 12 && !this.leap) || this.month == 13)
			{
				if(this.day == 1) {return yomtov.SHKALIM;}
				if(this.day == 8
				|| this.day == 9
				|| this.day == 11
				|| this.day == 13)
				{return yomtov.ZACHOR;}
				if(this.day == 18
				|| this.day == 20
				|| this.day == 22
				|| this.day == 23)
				{return yomtov.PARAH;}
				if(this.day == 25
				|| this.day == 27
				|| this.day == 29)
				{return yomtov.HACHODESH;}
			}
			if(this.month == 1 && this.day == 1) {return yomtov.HACHODESH;}
		}
		return yomtov.CHOL;
	}

	this.getroshchodesh = function () {
		if (this.day == 30
			|| (this.day == 1 && this.month != 7))
		{return yomtov.ROSH_CHODESH;}
		return yomtov.CHOL;
	}

	this.getmacharchodesh = function () {
		if (this.wday) {return yomtov.CHOL;}
		if (this.day == 30 || this.day == 29) {return yomtov.MACHAR_CHODESH;}
		return yomtov.CHOL;
	}

	this.getshabbosmevorchim = function () {
		if (this.wday) {return yomtov.CHOL;}
		if (this.day >= 23 && this.day <= 29) {return yomtov.SHABBOS_MEVORCHIM;}
		return yomtov.CHOL;
	}

	this.getomer = function () {
		let omer = 0;
		if (this.month == 1 && this.day >= 16) {omer = this.day - 15;}
		if (this.month == 2) {omer = this.day + 15;}
		if (this.month == 3 && this.day <= 5) {omer = this.day + 44;}
		return omer;
	}

	this.istaanis = function () {
		let current = this.getyomtov();
		if (current == yomtov.YOM_KIPPUR
		|| (current >= yomtov.SHIVA_ASAR_BTAAMUZ && current <= yomtov.TAANIS_ESTER))
		{return 1;}
		return 0;
	}

	this.isassurbemelachah = function () {
		let current = this.getyomtov();
		if(!this.wday
		|| (current >= yomtov.PESACH_DAY1 && current <= yomtov.SIMCHAS_TORAH))
		{return 1;}
		return 0;
	}

	this.iscandlelighting = function () {
		let current = this.getyomtov();
		if((current >= yomtov.EREV_PESACH && current <= yomtov.EREV_SUKKOS)
		|| (current == yomtov.CHOL_HAMOED_PESACH_DAY4 && !this.EY)
		|| (current == yomtov.CHOL_HAMOED_PESACH_DAY5 && this.EY)
		|| current == yomtov.HOSHANA_RABBAH)
		{
			if(!this.wday){return 2;}
			return 1;
		}
		if(current == yomtov.PESACH_DAY1
		|| current == yomtov.SHVEI_SHEL_PESACH
		|| current == yomtov.SHAVOUS_DAY1
		|| current == yomtov.ROSH_HASHANAH_DAY1
		|| current == yomtov.SUKKOS_DAY1
		|| current == yomtov.SHMEINI_ATZERES){return 2;}
		if((current == yomtov.ACHRON_SHEL_PESACH
		|| current == yomtov.SHAVOUS_DAY2
		|| current == yomtov.ROSH_HASHANAH_DAY2
		|| current == yomtov.SIMCHAS_TORAH)
		&& this.wday == 6) {return 2;}
		if(this.wday == 6) {return 1;}
		if((this.month == 9 && this.day == 24)
		|| (current >= yomtov.CHANUKAH_DAY1 && current <= yomtov.CHANUKAH_DAY7))
		{
			if(!this.wday){return 2;}
			return 3;
		}
		return 0;
	}

	if (year || month || day || hour || minute || sec || msec || offset || EY){
		let nmonth = 0;
		if (month > 0 && month < 7){ nmonth = month + (HebrewLeapYear(year) ? 6 : 5);}
		else if (month > 6 && month < 14){ nmonth = month - 7;}
		else { nmonth = month;}
		this.hdateadd(year-1, nmonth, day-1, hour, minute, sec, msec);
		this.setoffset(offset);
		this.setEY(EY);
		}

};

function HebrewLeapYear(year)
{  
  if ((((7 * year) + 1) % 19) < 7)
    return 1;
  else
    return 0;
}

function HebrewCalendarElapsedDays(year)
{
  let MonthsElapsed = Math.trunc((235 * Math.trunc((year - 1) / 19)) + (12 * ((year - 1) % 19)) + (7 * ((year - 1) % 19) + 1) / 19);
  let PartsElapsed = 204 + 793 * (MonthsElapsed % 1080);
  let HoursElapsed = 5 + 12 * MonthsElapsed + 793 * Math.trunc(MonthsElapsed  / 1080) + Math.trunc(PartsElapsed / 1080);
  let ConjunctionDay = 1 + 29 * MonthsElapsed + Math.trunc(HoursElapsed / 24);
  let ConjunctionParts = 1080 * (HoursElapsed % 24) + PartsElapsed % 1080;
  let AlternativeDay;
  let cdw = (ConjunctionDay % 7);
  if ((ConjunctionParts >= 19440)
      || ((cdw == 2)
          && (ConjunctionParts >= 9924)
          && !(HebrewLeapYear(year)))
      || ((cdw == 1)
          && (ConjunctionParts >= 16789)
          && (HebrewLeapYear(year - 1)))){
    AlternativeDay = ConjunctionDay + 1;
  }else{
    AlternativeDay = ConjunctionDay;}
  let adw = (AlternativeDay % 7);
  if (( adw == 0)
      || (adw == 3)
      || (adw == 5)){
    return (1+ AlternativeDay);
  }else{
    return AlternativeDay;}
}

function DaysInHebrewYear(year)
{
  return ((HebrewCalendarElapsedDays(year + 1)) -
          (HebrewCalendarElapsedDays(year)));
}

function LongHeshvan(year)
{
  if ((DaysInHebrewYear(year) % 10) == 5){
    return 1;
  }else{
    return 0;}
}

function ShortKislev(year)
{
  if ((DaysInHebrewYear(year) % 10) == 3){
    return 1;
  }else{
    return 0;}
}

function LastDayOfHebrewMonth(month, year)
{
  if ((month == 2)
      || (month == 4)
      || (month == 6)
      || ((month == 8) && !(LongHeshvan(year)))
      || ((month == 9) && ShortKislev(year))
      || (month == 10)
      || ((month == 12) && !(HebrewLeapYear(year)))
      || (month == 13)){
    return 29;
  }else{
    return 30;}
}

function nissanCount(year)
{
	let count= 0;
	switch(DaysInHebrewYear(year))
	{
		case 353:
			count = 176;
			break;
		case 354:
			count = 177;
			break;
		case 355:
			count = 178;
			break;
		case 383:
			count = 206;
			break;
		case 384:
			count = 207;
			break;
		case 385:
			count = 208;
			break;
	}
	return count;
}

function gregorianjulian(date)
{
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	if (month <= 2) {
		year -= 1;
		month += 12;
	}
	let A = Math.floor(year/100);
	let B = 2 - A + Math.floor(A/4);

	let JD = Math.floor(365.25*(year + 4716)) + Math.floor(30.6001*(month+1)) + day + B - 1524.5;
	return JD;
}

function hdatecompare(date1, date2)
{
	if (date1.year < date2.year){return 1;}
	else if (date1.year > date2.year){return -1;}
	else if (date1.dayofyear < date2.dayofyear){return 1;}
	else if (date1.dayofyear > date2.dayofyear){return -1;}
	else if (date1.hour < date2.hour){return 1;}
	else if (date1.hour > date2.hour){return -1;}
	else if (date1.min < date2.min){return 1;}
	else if (date1.min > date2.min){return -1;}
	else if (date1.sec < date2.sec){return 1;}
	else if (date1.sec > date2.sec){return -1;}
	else if (date1.msec < date2.msec){return 1;}
	else if (date1.msec > date2.msec){return -1;}
	else {return 0;}
}

function divideandcarry(args)
{
	args.finish = args.start%args.divisor;
	args.carry = Math.trunc(args.start/args.divisor);
	if (args.finish < 0)
	{
		args.finish +=args.divisor;
		--args.carry;
	}
}

function getmolad(year, month)
{
	let result = new hdate();
	let MonthsElapsed =	Math.trunc((235 * Math.trunc((year - 1) / 19)) + (12 * ((year - 1) % 19)) + (7 * ((year - 1) % 19) + 1) / 19);
	if(month > 6)
	{
		MonthsElapsed += (month-7);
	} else {
		MonthsElapsed += (month+5);
		if (HebrewLeapYear(year)){MonthsElapsed += 1;}
	}

	let PartsElapsed = 204 + 793 * (MonthsElapsed % 1080);
	let HoursElapsed = 5 + 12 * MonthsElapsed + 793 * Math.trunc(MonthsElapsed  / 1080) + Math.trunc(PartsElapsed / 1080);
	let ConjunctionDay = 29 * MonthsElapsed + Math.trunc((HoursElapsed) / 24);
	let ConjunctionHour =(HoursElapsed % 24);
	let ConjunctionMinute = Math.trunc((PartsElapsed % 1080) / 18);
	let ConjunctionParts = (PartsElapsed % 1080) % 18;
	result.year = 1;
	result.month = 7;
	result.day = 1;
	result.hdateaddday(ConjunctionDay);
	result.hour = ConjunctionHour;
	result.min = ConjunctionMinute;
	result.sec = ConjunctionParts;
	result.offset = 8456;
	result.hdateaddhour(-6);
	return result;
}

