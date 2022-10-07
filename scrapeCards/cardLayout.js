//workaround for being unable to pass a class to the browser
function getEmptyCard() {
	return {
		password: "",
		title: "",
		cardType: "",
		spellTrapProperty: "",
		attribute: "",
		monsterType: "",
		releaseDate: "",
		atk: "",
		def: "",
		level: "",
		rank: "",
		link: "",
		isEffectMonster: "",
		isFusionMonster: "",
		isTunerMonster: "",
		isSynchroMonster: "",
		isXYZMonster: "",
		isLinkMonster: "",
		isFlipMonster: "",
		isGeminiMonster: "",
		isSpiritMonster: "",
		isUnionMonster: "",
		isToonMonster: "",
		isRitualMonster: "",
		URL: "",
		cardText: "",
	}
}

module.exports = {
	getEmptyCard,
}
