const puppeteer = require('puppeteer')
const readCardPage = require('./readCardPage')
const trackProgress = require('./trackProgress')
const cardLayout = require('./cardLayout')
const toolbox = require('../toolbox')

async function scrape() {
	const browser = await puppeteer.launch({
		headless: true,
		slowMo: 00,
	})
	const tab = await browser.newPage()
	const defaultNavigationTimeout = 2 * 60 * 1000 // 2 minutes
	tab.setDefaultNavigationTimeout(defaultNavigationTimeout)
	toolbox.blockRequests(tab, ['image', 'stylesheet', 'font', 'script'])
	await tab.goto('https://yugipedia.com/wiki/Category:TCG_cards')
	toolbox.deleteFileSync('output/cards.csv')
	toolbox.deleteFileSync('logs/cardsLog.json')
	toolbox.objectToCsvHeaders(cardLayout.getEmptyCard(), 'output/cards.csv')
	await navigateWebsite(tab, browser, defaultNavigationTimeout)
	await browser.close()
}

async function navigateWebsite(tab, browser, defaultNavigationTimeout) {
	const totalCardCount = await trackProgress.getTotalCardCount(tab)
	let currentCardCount = 0
	//loop through all pages
	while (true) {
		// loop through all the links
		await tab.waitForSelector('.mw-category ul li a')
		const cardLinks = await tab.$$eval('.mw-category ul li a', (els) => els.map((el) => el.href))
		for (let i = 0; i < cardLinks.length; i++) {
			const tempTab = await browser.newPage()
			tempTab.setDefaultNavigationTimeout(defaultNavigationTimeout)
			toolbox.blockRequests(tempTab, ['image', 'stylesheet', 'font', 'script'])
			await tempTab.goto(cardLinks[i])
			await tempTab.waitForSelector('div.heading > div')
			let pageType = await readCardPage.getPageType(tempTab)
			let card = await readCardPage.createCard(tempTab, pageType, cardLayout.getEmptyCard())
			trackProgress.logCurrentProgress(totalCardCount, ++currentCardCount)
			if (card === undefined) {
				//this avoids problems with e.g. tokens
				await tempTab.close()
				continue
			}
			toolbox.objectToJsonLog(card, 'logs/cardsLog.json')
			toolbox.objectToCsvData(card, 'output/cards.csv')
			await tempTab.close()
		}
		let nextPageURL = await getNextPageURL(tab)
		if (nextPageURL === 'last page') break
		await tab.goto(nextPageURL)
	}
}

async function getNextPageURL(tab) {
	await tab.waitForSelector('#mw-pages a')
	return await tab.evaluate(() => {
		const allLinks = document.querySelectorAll('#mw-pages a')
		for (let i = 0; i < allLinks.length; i++) {
			if (allLinks[i].innerText === 'next page') {
				return allLinks[i].href
			}
		}
		return 'last page'
	})
}

module.exports = {
	scrape,
}

// how to require toolbox.js, if it is not in the same directory as this file:
// const toolbox = require('./toolbox.js')
// Error: Cannot find module './toolbox.js'
// const toolbox = require('../toolbox.js')
