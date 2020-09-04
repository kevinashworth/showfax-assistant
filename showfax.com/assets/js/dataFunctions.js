function fetchResultsData(data) { //fetch request set up for reuse as a function
	methodTypes = { //transalte client side var names
		"code": "getSidesByCode",
		"quick": "getSidesBySearch",
		"region": "getSidesByRegion",
	}
	let fetchURL = '/service.cfm?method=' + methodTypes[data.searchMethod]

	return fetch(fetchURL, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: data.dataString,
	})
}

function translateData(data) { //transalte client side search variables
	if (data.searchMethod === undefined || !data.searchMethod.length) {
		return false
	}
	const inputNamesObj = {
		'searchMethod': 'searchMethod',
		'quickCodeValue': {
			'quick': 'c',
			'code': 'z',
			'region': 'notneeded'
		},
		'regionValue': 'l',
		'categoryValue': 't',
		'orderBy': {
			'quick': 's',
			'code': 's',
			'region': 'sortby'
		},
		'direction': {
			'quick': 'd',
			'code': 'd',
			'region': 'sortdirection'
		},
		'page': 'p',
	}
	let oldData = Object.assign({},data)
	let newData = {}
	let searchType = data.searchMethod

	Object.keys(oldData).forEach((key, idx) => {
		let namesObjKey = (typeof (inputNamesObj[key]) !== 'string') ? inputNamesObj[key][searchType] : inputNamesObj[key]
		newData[namesObjKey] = oldData[key]
	})
	return newData
}

function cleanAddOrRebuildFetchStr(newFetchStrObj) {
	// function will clean the fetchString.
	// function will add to the fetchString.
	// to add, function must be passed an object.

	const labelsObj = {
		"searchmethod": ['code', 'quick', 'region'],
		"code": ['z', 's', 'd', 'p', 'searchmethod'],
		"quick": ['c', 's', 'd', 'p', 'searchmethod'],
		"region": ['t', 'l', 'p', 'sortby', 'sortdirection', 'searchmethod']
	}

	let currentFetchStr = thisStorage.getThisStorage("fetchString")

	let urlStrCurr = new URLSearchParams(currentFetchStr)
	if (urlStrCurr.getAll('searchmethod').length > 1) {
		console.log(`The storage string of 'searchmethod' is being polluted with bad data: ${urlStrCurr.getAll('searchmethod')}`)
		urlStrCurr.set('searchmethod', thisStorage.getThisStorage('searchType'))
	}

	let theSearchMethod = urlStrCurr.get('searchmethod')
	if (labelsObj.searchmethod.indexOf(theSearchMethod) === -1) {
		theSearchMethod = thisStorage.getThisStorage("searchType")
	}

	let arrToCheck = labelsObj[theSearchMethod]
	urlStrCurr.forEach((val, key) => {
		if (arrToCheck.indexOf(key) === -1) {
			urlStrCurr.delete(key)
		} else {
			keyArr = urlStrCurr.getAll(key)
			keyVal = keyArr.reverse()[0]
			urlStrCurr.set(key, keyVal)
		}
	})

	if (!!newFetchStrObj && typeof newFetchStrObj === 'object') {
		Object.keys(newFetchStrObj).forEach(key => {
			urlStrCurr.set(key, newFetchStrObj[key])
		})
	}
	newURLString = urlStrCurr.toString()
	thisStorage.setThisStorage('fetchString', newURLString)

	return newURLString
}

function goFetchResultsData(transmitObj) {//gets data from server for the main search
	document.querySelectorAll("[id^=results_tablebody_]")
		.forEach(el => el.innerText = "") //clear previous search results
	thisStorage.removeThisStorage('pageNumber') //clear page number

	//store data string for sorting or lazy loading use
	thisStorage.setThisStorage('fetchString', transmitObj.dataString)
	showMainLoadingSpinner()
	fetchResultsData(transmitObj)
		.then(response => {
			return response.json()
		})
		.then(json => {
			let responseObj = json
			toggelResultsView(responseObj)
		})
		.then(() => openResultsContainer())
		.then(() => checkIfMoreResults())
}

function lazyload() {
	//this function loads if the checkIfMoreResults returns true
	let observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				showMoreResultsSpinner()
				getMoreSearchResults()
				observer.unobserve(entry.target)
			}
		})
	}, { rootMargin: "0px 0px -200px 0px" })

	searchType = thisStorage.getThisStorage('searchType')
	observer.observe(document.querySelector(`#results_tablebody_${searchType} a:last-of-type`))
}

function checkIfMoreResults(page) {
	//this function checks to see if we have X results or less. If there is X 
	//results we assume there are more results to be loaded from the DB and we allow
	//another call the to server when user gets to the bottom of the page
	let num = 100 // this number corrisponds to, and must match, rowsPerPage set on the backend
	currentPage = page || 1
	searchType = thisStorage.getThisStorage('searchType')
	targetDiv = `results_tablebody_${searchType}`
	if (!!document.querySelector(`#${targetDiv} a:last-of-type`) && document.querySelector(`#${targetDiv} a.table-div-table-row:nth-child(${currentPage * num})`) === document.querySelector(`#${targetDiv} a:last-of-type`)) {
		lazyload()
		thisStorage.setThisStorage('pageNumber', `${++currentPage}`)
	}
}

function getMoreSearchResults() {
	//this is run when there are more seach results to be pulled from the server
	let nextPage = thisStorage.getThisStorage('pageNumber')
	if (!nextPage) return false
	let transmitObj = {}
	let newDataStr = cleanAddOrRebuildFetchStr({ 'p': nextPage })
	transmitObj.dataString = newDataStr
	transmitObj.searchMethod = thisStorage.getThisStorage('searchType')

	fetchResultsData(transmitObj)
		.then(response => {
			return response.json()
		})
		.then(json => {
			let responseObj = json
			toggelResultsView(responseObj)
		})
		.then(() => hideMoreResultsSpinner())
		.then(() => checkIfMoreResults(nextPage))
}

function isLoggedIn(event) { //checks to see if user is logged in
	let fetchURL = '/service.cfm?method=getLoginStatus'
	fetch(fetchURL, {
		credentials: 'same-origin',
	})
		.then(response => response.json())
		.then(data => data.status)
		.then(answer => {
			let urlQuery = createURLQuery(event)
			let theURL = '/member_download2.cfm?' + urlQuery
			formFillSigninModal(urlQuery)
			if (!answer) {
				document.getElementById("nextURL").value = theURL
				showMyModal()
			} else {
				window.location.href = theURL
			}
		})
}

function createURLQuery(event) {//builds a URL query string
	let dataStr = event.target.closest('[data-row]').dataset.row
	return urlStrCurr = dataStr.split(',').join('&')
}

function formFillSigninModal(dataStr) {//populates logon form
	let dataArr = dataStr.split(/=|&/u)
	let idxRole = dataArr.indexOf('did')
	let idxLocation = dataArr.indexOf('l')
	let roleID = idxRole > -1 ? dataArr[idxRole + 1] : 0
	let locationNum = idxLocation > -1 ? dataArr[idxLocation + 1] : 1

	let inputs = document.querySelectorAll('#signinModal form input')

	inputs.forEach(input => {
		if (input.name === 'r' || input.name === 'l') {
			let theValue = (input.name === 'r') ? roleID : locationNum
			input.value = theValue
		}
	})
}