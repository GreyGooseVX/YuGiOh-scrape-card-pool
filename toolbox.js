//#### puppeteer functions ####
const puppeteer = require('puppeteer')

//requestsToBlock options are ['image', 'stylesheet', 'font', 'script']
function blockRequests(tab, requestsToBlock) {
	tab.setRequestInterception(true)
	tab.on('request', (request) => {
		if (requestsToBlock.indexOf(request.resourceType()) !== -1) {
			request.abort()
		} else {
			request.continue()
		}
	})
}

//#### fs functions ####
const fs = require('fs')

function deleteFileSync(path) {
	if (fs.existsSync(path)) {
		fs.unlinkSync(path)
	}
}

function objectToJsonLog(object, path) {
	fs.appendFileSync(path, JSON.stringify(object) + ',\n')
}
function objectToCsvHeaders(object, path) {
	//write `key` for the first key
	fs.appendFileSync(path, Object.keys(object)[0])
	//write `|key` for the rest of the keys
	for (let key of Object.keys(object).slice(1)) {
		fs.appendFileSync(path, `|${key}`)
	}
	fs.appendFileSync(path, '\n')
}
function objectToCsvData(object, path) {
	//write `value` for the first value
	fs.appendFileSync(path, Object.values(object)[0])
	//write `|value` for the rest of the values
	for (let value of Object.values(object).slice(1)) {
		fs.appendFileSync(path, `|${value}`)
	}
	fs.appendFileSync(path, '\n')
}
function arrayToCsvRow(array, path) {
	//write `element` for the first value
	fs.appendFileSync(path, array[0])
	//write `|element` for the rest of the values
	for (let element of array.slice(1)) {
		fs.appendFileSync(path, `|${element}`)
	}
	fs.appendFileSync(path, '\n')
}

function csvToArrayOfObjects(seperator, path) {
	let importFile = fs.readFileSync(path, 'utf8')
	let rows = importFile.split('\n')
	let headers = rows[0].split(seperator)
	let arrayOfObjects = []
	for (let i = 1; i < rows.length; i++) {
		let valuesInCurrentRow = rows[i].split(seperator)
		if (valuesInCurrentRow.length <= 1) {
			console.log(`Row ${i} of ${path} is empty`)
			continue
		}
		if (headers.length != valuesInCurrentRow.length) {
			throw `Error: Row ${i} has ${valuesInCurrentRow.length} columns,
			but the header has ${headers.length} columns`
		}
		let object = {}
		for (let j = 0; j < headers.length; j++) {
			object[headers[j]] = valuesInCurrentRow[j]
		}
		arrayOfObjects.push(object)
	}
	return arrayOfObjects
}

module.exports = {
	blockRequests,
	objectToJsonLog,
	objectToCsvHeaders,
	objectToCsvData,
	csvToArrayOfObjects,
	arrayToCsvRow,
	deleteFileSync,
}
