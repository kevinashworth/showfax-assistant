function customEventListeners() {
	//custom event listeners to monitor Storage changes
	Storage.prototype._setItem = Storage.prototype.setItem
	Storage.prototype.setItem = function (key, value) {
		let event = new CustomEvent('itemInserted', {
			detail: {
				type: 'itemInserted',
				key: key,
				value: value
			}
		})
		document.dispatchEvent(event)
		this._setItem(key, value)
	}

	Storage.prototype._removeItem = Storage.prototype.removeItem
	Storage.prototype.removeItem = function (key, value) {
		let event = new CustomEvent('itemExtracted', {
			detail: {
				type: 'itemExtracted',
				key: key,
				value: value
			}
		})
		document.dispatchEvent(event)
		this._removeItem(key, value)
	}

	Storage.prototype._clear = Storage.prototype.clear
	Storage.prototype.clear = function (key, value) {
		let event = new CustomEvent('itemsEmpty', {
			detail: {
				type: 'itemsEmpty',
				key: key,
				value: value
			}
		})
		document.dispatchEvent(event)
		this._clear(key, value)
	}

	//custom event for used to listen to sorting option changes
	resorting = new Event('resorting')
}

function handleStorageEvent() { //function to handle changes in sessionStorage
	let eventArray = ['itemExtracted', 'itemInserted', 'itemsEmpty']
	switch (eventArray.indexOf(event.type)) {
		case 0:
		case 1:
			if (event.detail.key === 'searchType') updateHiddenInput(event.detail.value)
			document.getElementById("searchInputAreaDiv").classList.remove("invisible")
			break
		case 2:
			updateHiddenInput(event.detail.value)
			break
	}	
}

// Storage object with methods
let thisStorage = {
	appStorage: window.sessionStorage,
	getThisStorage: function (keyName) {
		if (typeof (keyName) !== 'string' && keyName.length <= 0) {
			return false
		}
		keyname = keyName.toLowerCase()
		return thisStorage.appStorage.getItem(keyName)
	},

	removeThisStorage: function (keyName) {
		if (typeof (keyName) !== 'string' && keyName.length <= 0) {
			return false
		}
		keyname = keyName.toLowerCase()
		thisStorage.appStorage.removeItem(keyName)
	},

	setThisStorage: function (keyName, valueString) { //use with cation when setting 'searchType'
		if ((typeof (keyName) !== 'string' && keyName.length <= 0) || (typeof (valueString) !== 'string' && valueString.length <= 0) || typeof (valueString) === 'undefined') {
			return false
		}
		keyname = keyName.toLowerCase()
		valueString = valueString.toLowerCase()
		thisStorage.appStorage.setItem(keyName, valueString)

		return thisStorage.getThisStorage(keyName)
	},

	clearAllThisStorage: function () {
		thisStorage.appStorage.clear()
		console.log("your sessionStorage is cleared")
	}
}