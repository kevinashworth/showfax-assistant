function setPlaceHolder() {//change placeholder wording in main search text input
	let quickCodeInputPlaceholder = ""

	if (thisStorage.getThisStorage('searchType') === 'code') {
		quickCodeInputPlaceholder = "Enter Sides Code"
	} else if (thisStorage.getThisStorage('searchType') === 'quick') {
		quickCodeInputPlaceholder = "Search for projects, Casting Directors, or roles"
	} else {
		return false
	}

	document.querySelector("input[name=quickCodeValue]").placeholder = quickCodeInputPlaceholder
}

function hilightButtonSelected(searchType) {
	//change the css class of the chosen search type button and set storage variable
	clearButtonsSelected()
	searchType = searchType || thisStorage.getThisStorage('searchType')
	if (typeof (searchType) === 'string') {
		let selectorStr = "button[name=searchMethodButtons_" + searchType + "]"
		document.querySelector(selectorStr).classList.add("is-selected")
	}
}

function clearButtonsSelected() {//remove CSS class from last button selected
	document.querySelectorAll("button[name^=searchMethodButton]").forEach(btn => {
		btn.classList.remove("is-selected")
	})
}

function changeSearchType() { //change the search type on click
	document.querySelectorAll("button[name^=searchMethodButton]").forEach(btn => {
		btn.addEventListener('click', event => {
			let searchType = event.target.name.split("_")[1]
			thisStorage.setThisStorage("searchType", searchType) //must be called first for sessionStorage to updated
			hilightButtonSelected(searchType)
			setPlaceHolder()
			swapSearchArea()
		})
	})
}

function removeActiveClass(event) {//removes all active class from dropdown divs
	document.querySelectorAll('.div-selector.active').forEach(divSelector => {
		if (event.target.closest(".div-selector") !== divSelector) {
			if (event.target.hidden !== true) {
				divSelector.classList.remove('active')
			}
		}
	})
	return true
}

function dropdownTextStyling(thisLi) {//styles text of dropdown divs
	divSelector = thisLi.parentElement.previousSibling

	if (thisLi.classList.contains('unselected')) {
		divSelector.classList.remove('selection-selected')
	} else {
		divSelector.classList.add('selection-selected')
	}
}

function showMainLoadingSpinner() {//show main spinner when waiting for results to load
	document.getElementById('results_loading').classList.remove('hidden')
	openResultsContainer()
}

function hideMainLoadingSpinner() {//hide main spinner when results have load
	document.getElementById('results_loading').classList.add('hidden')
}

function showMoreResultsSpinner() {//show small spinner for more results loading call when waiting for results to load
	document.querySelectorAll('.results-loading-spinner')
		.forEach(el => el.classList.remove('hidden'))
}

function hideMoreResultsSpinner() {//hide small spinner for more results loading call when results have load
	document.querySelectorAll('.results-loading-spinner')
		.forEach(el => el.classList.add('hidden'))
}

function goBackProjects() {//used to return from roles page to search results
	let transmitStr = thisStorage.getThisStorage("fetchString")
	thisStorage.setThisStorage('querySearch', transmitStr)
	return document.location = "index.cfm?search=1"
}

function goHome(event) { //return to the default home screen. 
	//basically resets this app.
	event.preventDefault
	thisStorage.clearAllThisStorage()
	return document.location = "index.cfm"
}

function navigateBackPage() { //sets flags so app will perform a search 
	// if user navigates back to index.cfm
	document.getElementsByTagName('body')[0]
		.addEventListener('mouseover', function () {
			window.innerDocClick = true
		})

	document.getElementsByTagName('body')[0]
		.addEventListener('mouseleave', function () {
			window.innerDocClick = false
		})

	window.addEventListener("beforeunload", function () {
		let onPage = window.innerDocClick || {}
		let page = thisStorage.getThisStorage('pageName') || {}

		if (!onPage) {
			if (page.length && page !== 'index') {
				thisStorage.setThisStorage('moveBack', 'moveback')
			}
		}
	})
}
