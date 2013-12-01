/*
 * dnsserver.js
 * 
 * Copyright 2013 Jon Cross <joncross.cooljc@gmail.com>
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 
 */

var dns = require('native-dns');
var util = require('util');

var server = dns.createServer();
var record_db = null;

var onRelay = function (domain, response) {
	var question = dns.Question({
		name: domain,
		type: 'A',
	});

	var req = dns.Request({
		question: question,
		server: { address: '8.8.8.8', port: 53, type: 'udp' },
		timeout: 1000,
	});
	req.on('message', function (err, answer) {
		var entries = [];
		answer.answer.forEach(function (a) {
			response.answer.push(dns.A(a));
		});
		response.send();
	});
	req.send();
};

var onRequest = function (request, response) {
	var domain = request.question[0].name;
	record_db.lookupRecords(response, dns, domain, onRelay);
};

server.on('request', onRequest);

server.on('error', function (err, buff, req, res) {
  console.log(err.stack);
});

function start(db) {
	record_db = db;
	console.log('Listening on '+53);
	server.serve(53);
};

exports.start = start;
