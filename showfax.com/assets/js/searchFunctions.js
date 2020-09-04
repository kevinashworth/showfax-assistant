function updateHiddenInput(searchType) {//alter value of hidden field in main form
	let target = document.getElementById("searchMethod")
	searchType ? target.value = searchType : target.removeAttribute('value')
}

function hideSearchArea() { //changes visiability of search input area if search type does not exist (used for home screen)
	let searchType = thisStorage.getThisStorage('searchType')
	let theList = "quick,code,region"
	if (searchType === null || searchType.length === 0 || !theList.includes(searchType)) {
		document.getElementById("searchInputAreaDiv").classList.add("invisible")
		updateHiddenInput()
	} else {
		updateHiddenInput(searchType)
	}
}

function swapSearchArea() { //change between region search and quickCode search view
	let searchType = thisStorage.getThisStorage('searchType')
	let theseDOMNodes = [document.getElementById("quickCodeSearch"), document.getElementById("regionSearch")]
	let arrFn = []

	switch (searchType) {
		case 'code':
		case 'quick':
			arrFn = ["remove", "add"]
			break
		case 'region':
			arrFn = ["add", "remove"]
			break
		default:
			return
			break
	}
	theseDOMNodes.forEach((node, idx) => {
		node.classList[arrFn[idx]]('hidden')
	})
}

function submitSearchForm() {//submits main search form search request
	event.preventDefault()

	let data = {}
	let targetForm = event.target.form.name
	let theForm = document.querySelector('form[name=' + targetForm + ']')

	Object.keys(theForm.elements).forEach(key => {
		if (theForm.elements[key].name.search('Button') === -1) {
			data[theForm.elements[key].name] = theForm.elements[key].value
		}
	})

	setRequiredCssClass()//visual error highlighting
	document.querySelectorAll('[name^=sort-search_]').forEach(node => { node.selectedIndex = 0}) //resent sort by dropdown
	document.querySelectorAll('.sort-selector-selector-div .selection-selected')
		.forEach(node => { node.classList.remove('selection-selected')}) //remove a class on sort by dropdown

	if (!searchFromValidationChk(data)){
		return //stop function is main search is missing needed information
	}

	let transmitObj = translateData(data)
	transmitObj.dataString = (new URLSearchParams(transmitObj)).toString()

	if (thisStorage.getThisStorage('pageName') != 'index') { //check that we are on the index page to perform search
		//if not on the index page, store search params and redirect to index with 
		//flag set to search based on stored params.
		thisStorage.setThisStorage('querySearch', transmitObj.dataString)
		return document.location = "index.cfm?search=1"
	}

	goFetchResultsData(transmitObj) //go and get the data from the server

	//make sure top portion of the results section is visiable 
	if (document.querySelectorAll("#scroll-into-view").length) {
		document.getElementById("scroll-into-view").scrollIntoView({
			behavior: "smooth",
			block: 'center'
		})
	}
}

function searchFromValidationChk(data) {
	//check data and prevent empty searchs
	//returns a boolean

	let returnValue = true
	switch ( data.searchMethod.toLowerCase()) {
		case 'code':
		case 'quick':
			if (typeof(data.quickCodeValue) == 'undefined' || data.quickCodeValue.length == 0) returnValue = false
			break
		case 'region':
			if (typeof(data.categoryValue) == 'undefined' || typeof(data.regionValue) == 'undefined' ) returnValue = false
			if (data.categoryValue.length == 0 || data.regionValue.length == 0 ) returnValue = false
			if (data.categoryValue == 0 || data.regionValue == 0 ) returnValue = false
			break
		default:
			returnValue = false
			break
	}

	return returnValue
}

function setRequiredCssClass() {
	// highlights the error or clears the highlights from the 3 search fields on the search form
	// returns nothing
	let searchType = thisStorage.getThisStorage('searchType')
	let domNodes = document.querySelectorAll("form [data-required]")
	
	domNodes.forEach(el =>{el.classList.remove("required-field")})
	domNodes.forEach(el=>{
		if (searchType === "region"){
			if(el.nodeName === "DIV" && (el.childNodes[0].innerText === "Category*" || el.childNodes[0].innerText === "Region*")) el.classList.add("required-field")
		}else{
			if (el.nodeName === "INPUT" && el.value.length === 0) el.classList.add("required-field")
		}
	})
}

function toggelResultsView(responseObj) {//function run to show or hide different parts of the results section 
	// on the index page.
	const areasArr = ['region', 'quick', 'none', 'error', 'loading']
	let currentArea = ''
	if (responseObj.status === 'error') {
		currentArea = 'error'
	} else {
		if (!responseObj.data.sides.length) {
			currentArea = 'none'
		} else {
			currentArea = thisStorage.getThisStorage('searchType') ? thisStorage.getThisStorage('searchType') : 'error'
			responseObj.data.type = currentArea

			if (currentArea !== 'error') {
				buildDocumentFragment(responseObj.data)

				if (currentArea === 'code') currentArea = 'quick'
			}
		}
	}
	let arrFn = ["remove", "add"]
	areasArr.forEach((node) => {
		let idx = (currentArea === node) ? 0 : 1
		document.getElementById('results_' + node).classList[arrFn[idx]]('hidden')
	})
	return true
}

function sortingOptionsProcessing() {//function that transaltes the sort
	//variables from client side and repulls the data in the sorted order from the server
	let searchType = thisStorage.getThisStorage('searchType')
	let sortObj = event.target[event.target.selectedIndex].dataset
	let [directionVal, orderByVal] = Object.values(sortObj)
	const valueNameTranslationObj = {
		"region": {
			"date": "date",
			"project": "role",
			"casting": "director"
		},
		"quick": {
			"date": "entry_date",
			"project": "project_name",
			"casting": "casting_directors",
			"role": "role_name",
			"category": "project_type",
			"episode": "episode_1"
		}
	}
	const contentTranslationObj = {
		"region": {
			"column": "sortby",
			"direction": "sortdirection",
		},
		"quick": {
			"column": "s",
			"direction": "d",
		}
	}
	let theOrderByType = searchType === 'region' ? searchType : "quick"
	let orderByCfVal = valueNameTranslationObj[theOrderByType][orderByVal]
	let theColumn = contentTranslationObj[theOrderByType]['column']
	let theDirection = contentTranslationObj[theOrderByType]['direction']

	let dataObj = {}
	dataObj.searchMethod = searchType
	let objToAppend = {}
	objToAppend[theDirection] = directionVal
	objToAppend[theColumn] = orderByCfVal
	objToAppend['p'] = '1'
	dataObj.dataString = cleanAddOrRebuildFetchStr(objToAppend)

	goFetchResultsData(dataObj)
}

function openResultsContainer() { //removes CSS class
	document.getElementById('results_container').classList.remove('hidden')
	toggelHomeScreen()
	thisStorage.setThisStorage('resultsContainer', 'open')
}

function toggelHomeScreen() {//hides or shows elements on page load for the home screen
	let containerOpen = thisStorage.getThisStorage('resultsContainer')
	let idxArr = ['add', 'remove']
	
	document.querySelector(".header-container-container")
		.classList.toggle("sticky-header", !!containerOpen)
	if (!containerOpen) {
		document.querySelectorAll("[id^=HomePageView_]").forEach((node) => {
			let idx = node.className.includes('hidden') ? 1 : 0
			node.classList[idxArr[idx]]('hidden')
		})
	}
}
