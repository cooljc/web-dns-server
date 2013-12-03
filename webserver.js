/*
 * webserver.js
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

var express = require('express');
var app = express();
var records_db = null;

app.use(express.static(__dirname + '/www'));

//app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());

app.post('/ajax/update', function(req, res) {
	var enabled = 0;
	if (req.body.renabled == 'on')
		enabled = 1;
	var data = {name: req.body.rname, 
				ipaddress: req.body.rip, 
				ttl: req.body.rttl, 
				enabled: enabled, 
				id: req.body.record_id};
	records_db.updateRecord(res, data);
});

app.post('/ajax/insert', function(req, res) {
	var enabled = 0;
	if (req.body.renabled == 'on')
		enabled = 1;
	var data = {name: req.body.rname, 
				ipaddress: req.body.rip, 
				ttl: req.body.rttl, 
				enabled: enabled};
	records_db.insertRecord(res, data);
});

app.post('/ajax/delete', function(req, res) {
	records_db.deleteRecord(res, req.body.record_id);
});

app.get('/ajax/records', function(req, res) {
	records_db.getRecords(res);
});

app.get('/ajax/record', function(req, res) {
	records_db.getRecord(res, req.query.id);
});

app.get('/ajax/recordEnable', function(req, res) {
	records_db.enableRecord(res, {enabled: req.query.enabled, id: req.query.id});
});

function start(db) {
	records_db = db;
	app.listen(3000);
};

exports.start = start;
