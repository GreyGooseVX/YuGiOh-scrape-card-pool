const cardScraper = require('./scrapeCards/cardScraper.js')
const bannedListScraper = require('./scrapeBannedList/bannedListScraper.js')

//console log how long it takes to run the code in minutes and seconds
const start = new Date().getTime()
main()
	.then(() => {
		const end = new Date().getTime()
		const minutes = Math.floor((end - start) / 60000)
		const seconds = Math.floor((end - start) / 1000) % 60
		console.log(`it took ${minutes} minutes and ${seconds} seconds to run the code`)
	})
	.catch((err) => {
		console.log(err)
	})

async function main() {
	await cardScraper.scrape()
	await bannedListScraper.scrape()
}
