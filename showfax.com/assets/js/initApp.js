/*The functionality of this app revolves around the browser's sessionStorage and the variables kept in them.
For details on these variables see feature TR-447*/

// to run before the DOM is fully loaded:
document.addEventListener('readystatechange', event => {
	if (event.target.readyState === 'interactive') {
		initPage()
	}
	else if (event.target.readyState === 'complete') {
		initDOM()
	}
})

function initDOM() {
	// ***Start the meat and potatos of the JS***
	// event listeners attached to Storage events
	document.addEventListener('itemInserted', handleStorageEvent, false)
	document.addEventListener('itemExtracted', handleStorageEvent, false)
	document.addEventListener('itemsEmpty', handleStorageEvent, false)

	// launch needed functions by looping through array
	let methodArray = ['setPlaceHolder', 'hilightButtonSelected', 'hideSearchArea', 'swapSearchArea', 'changeSearchType', 'toggelHomeScreen', 'navigateBackPage']
	methodArray.forEach((mthd, idx) => {
		window[mthd]()
	})

	document.querySelector('div.logo-logo a').addEventListener('click', goHome, false)

	document.querySelectorAll('input.search-button-button').forEach(btn => {
		// Listen for the main seach button click
		btn.addEventListener('click', submitSearchForm)
	})

	document.querySelectorAll('[name^=sort-search_]').forEach(node => {
		// attached custom event listener to changes on the sorting selects
		node.addEventListener('resorting', event => sortingOptionsProcessing())
	})

	// START of repopulating last search query into the main search form
	if (thisStorage.getThisStorage('fetchString')) {
		var searchQuery = thisStorage.getThisStorage('fetchString')
	}

	let urlParams = new URLSearchParams(window.location.search)
	if (urlParams.has('search') && urlParams.get('search') || searchQuery) {
		//If querySearch is defined it indicates someone is trying to perform a search
		//from a location other the index.cfm page. Therefore use this data to repopulate
		//the main search form.

		if (thisStorage.getThisStorage('querySearch')) {
			searchQuery = thisStorage.getThisStorage('querySearch')
		}

		searchParams = new URLSearchParams(searchQuery)
		let searchType = searchParams.get('searchmethod')

		let formObj = document.querySelector('[name=fullsearchform]')
		formObj.regionValue.value = searchParams.has('l') ? searchParams.get('l') : ""
		formObj.categoryValue.value = searchParams.has('t') ? searchParams.get('t') : ""
		formObj.quickCodeValue.value = searchParams.has('c') ? searchParams.get('c') :
			searchParams.has('z') ? searchParams.get('z') : ""

		if (thisStorage.getThisStorage('querySearch') || (thisStorage.getThisStorage('moveBack') &&  thisStorage.getThisStorage('pageName') === 'index')) {
			document.querySelector(`button[name=searchMethodButtons_${searchType}]`).click()
			//preform search
			formObj.quickCodeButton.click()
			//distroy search query and flag
			thisStorage.removeThisStorage("querySearch")
		}
		thisStorage.removeThisStorage("moveBack")
	}
	// END of repopulating last search query into the main search form

	buildCustomDropdown()
}

function initPage() { //first function run on page load.
	customEventListeners()
	hideSearchArea()
}
