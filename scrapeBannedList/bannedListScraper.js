const puppeteer = require('puppeteer')
const toolbox = require('../toolbox')
const fs = require('fs')

async function scrape() {
	const browser = await puppeteer.launch({
		headless: true,
		slowMo: 00,
	})
	const defaultNavigationTimeout = 2 * 60 * 1000 // 2 minutes
	const tab = await browser.newPage()
	tab.setDefaultNavigationTimeout(defaultNavigationTimeout)
	toolbox.blockRequests(tab, ['image', 'stylesheet', 'font', 'script'])
	const bannedListURLs = [
		'https://yugipedia.com/wiki/Historic_TCG_Limitations_Chart/2002%E2%80%932010',
		'https://yugipedia.com/wiki/Historic_TCG_Limitations_Chart/2011%E2%80%932020',
		'https://yugipedia.com/wiki/Historic_TCG_Limitations_Chart/2021%E2%80%93',
	]

	for (let i = 0; i < bannedListURLs.length; i++) {
		await tab.goto(bannedListURLs[i])
		await tab.waitForSelector('table.wikitable.floatable-header')

		toolbox.deleteFileSync('output/bannedLists/list' + i + '.csv')
		const tableHeaders = await readTableHeaders(tab)
		toolbox.arrayToCsvRow(tableHeaders, 'output/bannedLists/list' + i + '.csv')

		const tableData = await readTableData(tab)
		//loop through tableData and write each row to csv
		for (let j = 0; j < tableData.length; j++) {
			toolbox.arrayToCsvRow(tableData[j], 'output/bannedLists/list' + i + '.csv')
		}
	}
	await browser.close()
}
async function readTableHeaders(tab) {
	let tableHeaders = await tab.evaluate(() => {
		let tableHeaders = document.querySelectorAll('table.wikitable.floatable-header tr:nth-child(2) th a')
		// cut' (TCG)',' Lists' and ' ' from tableHeader.title and then return it
		tableHeaders = Array.from(tableHeaders).map((tableHeader) => {
			return tableHeader.title.replace(' (TCG)', '').replace(' Lists', '').replace(' ', '')
		})
		return tableHeaders
	})
	tableHeaders.unshift('title') //because all the headers are in the 2nd row except for 'card title' (1st row)
	return tableHeaders
}
async function readTableData(tab) {
	let tableData = await tab.evaluate(() => {
		let tableRows = document.querySelectorAll('table.wikitable.floatable-header tr')
		let tableData = []
		//loop through each row in the table, skip the first 2 rows (headers)
		for (let i = 2; i < tableRows.length; i++) {
			let array = []
			array.push(tableRows[i].querySelector('th a').innerText)
			//loop through each cell in the row
			let tableCells = tableRows[i].querySelectorAll('td')
			for (let j = 0; j < tableCells.length; j++) {
				if (tableCells[j].innerText == '') {
					array.push('') //'0' or '-1' could also be used here to display unreleased cards
				} else {
					array.push(tableCells[j].innerText)
				}
			}
			tableData.push(array)
		}
		return tableData
	})
	return tableData
}

module.exports = {
	scrape,
}
