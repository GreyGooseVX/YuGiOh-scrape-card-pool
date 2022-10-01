async function createCard(tempTab, pageType, card) {
	return await tempTab.evaluate(
		(pageType, card) => {
			switch (pageType) {
				case 'effect-card':
				case 'normal-card':
				case 'fusion-card':
				case 'ritual-card':
				case 'synchro-card':
					readForAnyCard()
					readForAnyMonster()
					card.level = document.querySelector('[title = "Level"]')?.parentElement.nextElementSibling.innerText.trim()
					card.def = document.querySelector('[title = "ATK"]')?.parentElement.nextElementSibling.children[1].innerText
					break
				case 'xyz-card':
					readForAnyCard()
					readForAnyMonster()
					card.rank = document.querySelector('[title = "Rank"]')?.parentElement.nextElementSibling.innerText
					card.def = document.querySelector('[title = "ATK"]')?.parentElement.nextElementSibling.children[1].innerText
					break
				case 'link-card':
					readForAnyCard()
					readForAnyMonster()
					card.link = document.querySelector('[title = "ATK"]')?.parentElement.nextElementSibling.children[1].innerText
					break
				case 'spell':
				case 'trap':
					readForAnyCard()
					readForAnySpellTrap()
					break
				default:
					return
					break
			}
			function readForAnyCard() {
				card.title = document.querySelector('div.heading > div')?.innerText
				card.cardText = document.querySelector('.lore')?.innerText
				//remove \n from cardText
				card.cardText = card.cardText.replace(/\n/g, '')
				card.password = document.querySelector('[title = "Password"]')?.parentElement.nextElementSibling.innerText
				card.URL = document.URL
				card.releaseDate = getOldestReleaseDate()
				function getOldestReleaseDate() {
					let releaseDates = []
					releaseDates.push(document.querySelector('#cts--EN > tbody > tr:nth-child(2) > td:nth-child(1)')?.innerText)
					releaseDates.push(document.querySelector('#cts--NA > tbody > tr:nth-child(2) > td:nth-child(1)')?.innerText)
					releaseDates.push(document.querySelector('#cts--EU > tbody > tr:nth-child(2) > td:nth-child(1)')?.innerText)
					releaseDates.push(document.querySelector('#cts--OC > tbody > tr:nth-child(2) > td:nth-child(1)')?.innerText)
					//sort releaseDates array, oldest to newest
					console.log(releaseDates)
					releaseDates.sort((a, b) => {
						return new Date(a) - new Date(b)
					})
					console.log(releaseDates)
					return releaseDates[0]
				}
			}
			function readForAnySpellTrap() {
				card.cardType = document
					.querySelector('[title = "Card type"]')
					?.parentElement.nextElementSibling.innerText.trim()
				card.spellTrapProperty =
					document.querySelector('[title = "Property"]')?.parentElement.nextElementSibling.innerText
			}
			function readForAnyMonster() {
				card.cardType = 'Monster'
				card.attribute = document
					.querySelector('[title = "Attribute"]')
					?.parentElement.nextElementSibling.innerText.trim()
				card.monsterType = document.querySelector(
					'.infocolumn .innertable [title = "Type"]'
				)?.parentElement.nextElementSibling.children[0].innerText
				card.atk = document.querySelector('[title = "ATK"]')?.parentElement.nextElementSibling.children[0].innerText
				card.isEffectMonster = checkEffectType('Effect')
				card.isFusionMonster = checkEffectType('Fusion')
				card.isTunerMonster = checkEffectType('Tuner')
				card.isSynchroMonster = checkEffectType('Synchro')
				card.isXYZMonster = checkEffectType('XYZ')
				card.isLinkMonster = checkEffectType('Link')
				card.isFlipMonster = checkEffectType('Flip')
				card.isGeminiMonster = checkEffectType('Gemini')
				card.isSpiritMonster = checkEffectType('Spirit')
				card.isUnionMonster = checkEffectType('Union')
				card.isToonMonster = checkEffectType('Toon')
				card.isRitualMonster = checkEffectType('Ritual')
			}
			function checkEffectType(effectType) {
				let bool = document
					.querySelector('.infocolumn .innertable [title = "Type"]')
					?.parentElement.nextElementSibling.innerText.includes(effectType)
				return bool
			}
			//trim whitespace from all card properties
			Object.keys(card).forEach((key) => {
				if (card[key] == null) {
					card[key] = ''
				} else {
					try {
						card[key] = card[key].trim()
					} catch (error) {}
				}
			})
			return card
		},
		pageType,
		card
	)
}
async function getPageType(tempTab) {
	return await tempTab.evaluate(() => {
		if (document.querySelector('.effect-card') !== null) {
			return 'effect-card'
		} else if (document.querySelector('.normal-card') !== null) {
			return 'normal-card'
		} else if (document.querySelector('.fusion-card') !== null) {
			return 'fusion-card'
		} else if (document.querySelector('.ritual-card') !== null) {
			return 'ritual-card'
		} else if (document.querySelector('.synchro-card') !== null) {
			return 'synchro-card'
		} else if (document.querySelector('.xyz-card') !== null) {
			return 'xyz-card'
		} else if (document.querySelector('.link-card') !== null) {
			return 'link-card'
		} else if (document.querySelector('.spell-card') !== null) {
			return 'spell'
		} else if (document.querySelector('.trap-card') !== null) {
			return 'trap'
		}
	})
}
module.exports = {
	createCard,
	getPageType,
}
