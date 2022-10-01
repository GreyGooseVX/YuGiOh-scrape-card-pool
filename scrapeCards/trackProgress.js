const puppeteer = require("puppeteer")

// async function getTotalCardCount(browser) {
// 	const tempTab = await browser.newPage()
// 	await tempTab.goto("https://yugipedia.com/wiki/Category:TCG_cards")
// 	await tempTab.waitForSelector("#mw-pages > p")
// 	let textBlock = await tempTab.$eval("#mw-pages > p", (el) => el.innerText)
// 	// remove all commas out of textBlock
// 	textBlock = textBlock.replace(/,/g, "")
// 	// create array of numbers in textBlock
// 	let numbers = textBlock.match(/\d+/g)
// 	await tempTab.close()
// 	return numbers[1]
// }
async function getTotalCardCount(tab) {
	await tab.waitForSelector("#mw-pages > p")
	let textBlock = await tab.$eval("#mw-pages > p", (el) => el.innerText)
	// remove all commas out of textBlock
	textBlock = textBlock.replace(/,/g, "")
	// create array of numbers in textBlock
	let numbers = textBlock.match(/\d+/g)
	return numbers[1]
}
function logCurrentProgress(totalCardCount, currentCardCount) {
	//log it as a percentage with 2 decimal places and also absolute value
	console.log(
		(Math.round((currentCardCount / totalCardCount) * 10000) / 100).toFixed(2) +
			"%" +
			" - " +
			`${currentCardCount}/${totalCardCount}`
	)
}

module.exports = {
	getTotalCardCount,
	logCurrentProgress,
}
