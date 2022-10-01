const toolbox = require('../toolbox')

DB = toolbox.csvToArrayOfObjects('|', 'output/joinedTables/almostFinal.csv')
toolbox.deleteFileSync('output/finalDB.csv')
toolbox.objectToCsvHeaders(DB[0], 'output/finalDB.csv')

DB.forEach((cardObj) => {
	cardObj = fillPasswordPreErrata(cardObj)
	cardObj = fillBannedLists(cardObj)
	toolbox.objectToCsvData(cardObj, 'output/finalDB.csv')
})

function fillPasswordPreErrata(cardObj) {
	if (cardObj.passwordPreErrata == '') {
		cardObj.passwordPreErrata = cardObj.password
	}
	return cardObj
}

function fillBannedLists(cardObj) {
	let months = {
		January: '01-01',
		February: '02-01',
		March: '03-01',
		April: '04-01',
		May: '05-01',
		June: '06-01',
		July: '07-01',
		August: '08-01',
		September: '09-01',
		October: '10-01',
		November: '11-01',
		December: '12-01',
	}
	for (let [key, value] of Object.entries(cardObj)) {
		//if the key includes '20' I will assume it is a banned list date
		if (key.includes('20')) {
			//convert 'August2014' to '2014-08-01' by using the months object
			let bannedListDate = key.slice(-4) + '-' + months[key.slice(0, -4)]
			if (cardObj.releaseDate <= bannedListDate) {
				//if there already is a value for cardObj[key], don't overwrite it
				if (cardObj[key] == '') {
					cardObj[key] = 3
				}
			}
		}
	}
	return cardObj
}
