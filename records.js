/*
 * records.js
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

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('records.db');

db.serialize(function() {
	db.run("CREATE TABLE IF NOT EXISTS dns (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, ipaddress TEXT, ttl INTEGER, enabled INTEGER)");
});

function deleteRecord(res, id) {
	var stmt = db.prepare("DELETE FROM dns WHERE id=?");
	stmt.run({1: id});
	stmt.finalize();
	
	var result = {success: true};
	res.setHeader('Content-Type', 'text/json');
	res.send(result);
};

function updateRecord(res, data) {
	var stmt = db.prepare("UPDATE dns SET name=?, ipaddress=?, ttl=?, enabled=? WHERE id=?");
	stmt.run({1: data.name, 2: data.ipaddress, 3: data.ttl, 4: data.enabled, 5: data.id});
	stmt.finalize();
	
	var result = {success: true};
	res.setHeader('Content-Type', 'text/json');
	res.send(result);
};

function insertRecord(res, data) {
	var stmt = db.prepare("INSERT INTO dns (name, ipaddress, ttl, enabled) VALUES (?, ?, ?, ?)");
	stmt.run({1: data.name, 2: data.ipaddress, 3: data.ttl, 4: data.enabled});
	stmt.finalize();
	
	var result = {success: true};
	res.setHeader('Content-Type', 'text/json');
	res.send(result);
};

function getRecord(res, id) {
	db.all("SELECT * FROM dns WHERE id=? LIMIT 1", id, function(err, rows) {
		var record = rows[0];
		res.setHeader('Content-Type', 'text/json');
		res.send(record);
	});
};

function getRecords(res) {
	db.all("SELECT * FROM dns", function(err, rows) {
		var records = {records: rows};
		//console.log(rows);
		res.setHeader('Content-Type', 'text/json');
		res.send(records);
	});
};

exports.deleteRecord = deleteRecord;
exports.updateRecord = updateRecord;
exports.insertRecord = insertRecord;
exports.getRecord = getRecord;
exports.getRecords = getRecords;
