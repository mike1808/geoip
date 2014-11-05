#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
var iso3166 = require('iso-3166-2');
var geoip = require('geoip-lite');
var colors = require('colors');

program
  .version('0.0.1')
  .usage('[options] <ip addresses... >')
  .option('-C, --country', 'Show country')
  .option('-c, --city', 'Show city')
  .option('-r, --region', 'Show region')
  .option('-R, --range', 'Show range')
  .option('-k, --coordinates', 'Show coordinates')
  .option('-s, --short', 'Show county region and city')

  .parse(process.argv);


program.args.forEach(function(ip) {
	var geo = geoip.lookup(ip);
	print(ip, geo, program);
});

function print(ip, geo, program) {
	if (geo.region) {
		var normalized = iso3166.subdivision(geo.country, geo.region);
		geo.country = normalized.countryName;
		geo.region = normalized.name;
	} else {
		geo.country = iso3166.country(geo.country).name;
	}

	console.log(ip.bold.yellow);

	if (!geo) {
		console.log('\t' + 'No data found for this IP');
		return;
	}

	var all = !program.short && !(program.country || program.city || program.region || program.range || program.coordinates);
	if (all || program.range) {
		console.log('\t' + 'Range'.green + ': %s - %s', geoip.pretty(geo.range[0]), geoip.pretty(geo.range[1]));
	}

	if (all || program.country || program.short) {
		console.log('\t' + 'Country'.green + ': %s', geo.country);
	}

	if (geo.region && (all || program.region || program.short)) {
		console.log('\t' + 'Region'.green + ': %s', geo.region);
	}

	if (geo.city && (all || program.city || program.short)) {
		console.log('\t' + 'City'.green + ': %s', geo.city);
	}

	if (geo.ll && (all || program.coordinates)) {
		console.log('\t' + 'Coordinates'.green + ': %s:%s', geo.ll[0], geo.ll[1]);
	}
}

/*
var geo = geoip.lookup(req.ip) || geoip.lookup('115.84.64.0');
iso3166.country(geo.country).name,*/