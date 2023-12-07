'use strict';
const http = require('http');
var assert = require('assert');
const express= require('express');
const app = express();
const mustache = require('mustache');
const filesystem = require('fs');
const url = require('url');
const port = Number(process.argv[2]);

const hbase = require('hbase')
var hclient = hbase({ host: process.argv[3], port: Number(process.argv[4])})

function counterToNumber(c) {
	return Number(c);
}

function rowToMap(row) {
	var stats = {};
	if (row && Array.isArray(row)) {
		row.forEach(function (item) {
			var key = item['key'];
			var value = counterToNumber(item['$']);
			stats[key] = value;
		});
	}
	return stats;
}


const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

/* Send simulated weather to kafka */
var kafka = require('kafka-node');
var Producer = kafka.Producer;
var KeyedMessage = kafka.KeyedMessage;
var kafkaClient = new kafka.KafkaClient({kafkaHost: process.argv[5]});
var kafkaProducer = new Producer(kafkaClient);

app.post('/submit-arrest-case', (req, res) => {
	console.log(req.body);
	var arrest_key = req.body.arrest_key;
	var arrest_date = req.body.arrest_date;
	var ofns_desc = req.body.ofns_desc;
	var age_group = req.body.age_group;
	var perp_sex = req.body.perp_sex;
	var perp_race = req.body.perp_race;

	var report = {
		arrest_key: arrest_key,
		arrest_date: arrest_date,
		ofns_desc: ofns_desc,
		age_group: age_group,
		perp_sex: perp_sex,
		perp_race: perp_race
	};
	console.log("Here is the report:");
	console.log(report);

	kafkaProducer.send([{ topic: 'mpcs53014_qiuli_final_project', messages: JSON.stringify(report)}], function (err, data) {
		console.log('Start sending messages to Kafka');
		if (err) {
			console.log(err);
			res.status(500).json({ message: 'Error sending message to Kafka.' });
		} else {
			console.log(data);
			res.json({ message: 'Arrest case submitted successfully.' });
		}
	});
});



app.get('/sex_summary_realtime', function (req, res) {
	hclient.table('sex_summary_hbase').scan({limit: 10}, function (err, batchCells) {
		if (err) {
			console.error(err);
			return res.status(500).send('Server Error');
		}

		let batchData = rowToMap(batchCells);

		hclient.table('realtime_arrest_case_hbase').scan({limit: 10}, function (err, realtimeCells) {
			if (err) {
				console.error(err);
				return res.status(500).send('Server Error');
			}

			let arrestSexCounts = {};
			realtimeCells.forEach(cell => {
				if (cell.column === 'details:perp_sex') {
					let sex = cell['$'];
					if (!arrestSexCounts[cell.key]) {
						arrestSexCounts[cell.key] = sex;
					}
				}
			});

			for (let arrestKey in arrestSexCounts) {
				let sex = arrestSexCounts[arrestKey];
				if (batchData[sex]) {
					batchData[sex] += 1;
				} else {
					batchData[sex] = 1;
				}
			}

			res.json(batchData);
		});
	});
});


app.get('/age_summary_realtime', function (req, res) {
	hclient.table('age_group_summary').scan({limit: 10}, function (err, batchCells) {
		if (err) {
			console.error(err);
			return res.status(500).send('Server Error');
		}

		let batchData = rowToMap(batchCells);

		hclient.table('realtime_arrest_case_hbase').scan({limit: 10}, function (err, realtimeCells) {
			if (err) {
				console.error(err);
				return res.status(500).send('Server Error');
			}

			let arrestAgeCounts = {};
			realtimeCells.forEach(cell => {
				if (cell.column === 'details:age_group') {
					let ageGroup = cell['$'];
					if (!arrestAgeCounts[cell.key]) {
						arrestAgeCounts[cell.key] = ageGroup;
					}
				}
			});

			for (let arrestKey in arrestAgeCounts) {
				let ageGroup = arrestAgeCounts[arrestKey];
				if (batchData[ageGroup]) {
					batchData[ageGroup] += 1;
				} else {
					batchData[ageGroup] = 1;
				}
			}

			res.json(batchData);
		});
	});
});

app.get('/race_summary_realtime', function (req, res) {
	hclient.table('race_summary_hbase').scan({limit: 10}, function (err, batchCells) {
		if (err) {
			console.error(err);
			return res.status(500).send('Server Error');
		}

		let batchData = rowToMap(batchCells);

		hclient.table('realtime_arrest_case_hbase').scan({limit: 10}, function (err, realtimeCells) {
			if (err) {
				console.error(err);
				return res.status(500).send('Server Error');
			}

			let arrestRaceCounts = {};
			realtimeCells.forEach(cell => {
				if (cell.column === 'details:perp_race') {
					let race = cell['$'];
					if (!arrestRaceCounts[cell.key]) {
						arrestRaceCounts[cell.key] = race;
					}
				}
			});

			for (let arrestKey in arrestRaceCounts) {
				let race = arrestRaceCounts[arrestKey];
				if (batchData[race]) {
					batchData[race] += 1;
				} else {
					batchData[race] = 1;
				}
			}

			res.json(batchData);
		});
	});
});



app.get('/sex_summary', function (req, res) {
	hclient.table('sex_summary_hbase').scan({limit: 10}, function (err, cells) {
		if (err) {
			console.error(err);
			res.status(500).send('Server Error');
			return;
		}
		console.log(cells);
		const sexSummary = rowToMap(cells);
		res.json(sexSummary);
		console.log(sexSummary);
	});
});

app.get('/age_summary', function (req, res) {
	hclient.table('age_group_summary').scan({limit: 10}, function (err, cells) {
		if (err) {
			console.error(err);
			res.status(500).send('Server Error');
			return;
		}
		console.log(cells);
		const ageSummary = rowToMap(cells);
		res.json(ageSummary);
		console.log(ageSummary);
	});
});

app.get('/race_summary', function (req, res) {
	hclient.table('race_summary_hbase').scan({limit: 10}, function (err, cells) {
		if (err) {
			console.error(err);
			res.status(500).send('Server Error');
			return;
		}
		console.log(cells);
		const raceSummary = rowToMap(cells);
		res.json(raceSummary);
		console.log(raceSummary);
	});
});


app.listen(port);
