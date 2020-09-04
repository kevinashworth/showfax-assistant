//builds the DOM object containing search results and adds
//to correct section of search area.
function buildDocumentFragment(responseData) {
	let pageFrag = document.createDocumentFragment()

	responseData.sides.forEach((side, idx) => {
		side.type = responseData.type
		let rowFromSideData = buildTableRow(side)
		pageFrag.appendChild(rowFromSideData)
	})

	let resultAreaBodyType = responseData.type == 'code' ? 'quick' : responseData.type
	let docPage = document.getElementById(`results_tablebody_${resultAreaBodyType}`)
	docPage.appendChild(pageFrag)
	document.querySelectorAll('[data-row]')
		.forEach(node =>
			node.addEventListener('click', (event) => {
				if (thisStorage.getThisStorage('searchType') !== 'region') isLoggedIn(event)
			}))
}

//builds each row of the DOM object from the search results

function buildTableRow(sideData) {
	let newRow = document.createElement('a')
	let hiddenNames = []

	let type = sideData.type
	if (type == 'region') {
		regv = document.querySelector('select[name=regionValue]').value
		catv = document.querySelector('select[name=categoryValue]').value
		let thisHREF = `/roles.cfm?pro=${sideData.id}&l=${regv}&t=${catv}`
		newRow.setAttribute('href', thisHREF)
		hiddenNames = ['id']
	} else if (type === 'quick' || type === 'code') {
		hiddenNames = ['hasfiles', 'tc', 'role_pages', 'did', 'bid', 'aid','l']
	}
	valStr = hiddenNames.map(name => `${name}=${sideData[name]}`).toString()
	newRow.setAttribute('data-row', valStr)
	newRow.classList.add('table-div-table-row')
	newRow.classList.add('not-a-tag')
	newRow.appendChild(buildTableCells(sideData))

	return newRow
}

//builds each cell of each row of the DOM object from the search results
function buildTableCells(sideData) {
	let sideKeysObj = {}
	let chkForDate = (dataName, newCell) => {
		let data = ""
		if (dataName.search('date') > -1) {
			data = dateFormat(sideData)
			if (!!sideData.isRed) {
				newCell.classList.add('red-date')
			}
		} else {
			data = sideData[dataName]
		}
		return data
	}

	switch (sideData.type) {
		case 'region':
			sideKeysObj = {
				order: ['start_date', 'label', 'description', 'directors'],
				visiable: { 'directors': 'c', 'label': 'b', 'start_date': 'a', 'description': 'b' },
				hidden: ['indefinite', 'id', 'tsrevision', 'revision'],
				cells: 3
			}
			break
		case 'code':
		case 'quick':
			sideKeysObj = {
				order: ['project_name', 'episode_1', 'entry_date', 'casting_directors', 'role_name', 'project_type'],
				visiable: { 'project_name': 'a', 'episode_1': 'b', 'entry_date': 'c', 'casting_directors': 'd', 'role_name': 'e', 'project_type': 'f' },
				hidden: ['hasfiles', 'tc', 'role_pages', 'did', 'bid', 'aid'],
				cells: 6
			}
			break
		default:
			return false
	}

	let allCells = document.createDocumentFragment()

	let idx = 0
	for (let i = 0; i < sideKeysObj.cells;) {

		let dataName = sideKeysObj.order[idx]
		let currentDataLetter = sideKeysObj.visiable[dataName]
		let newCell = allCells.querySelector(`[data-cell=${currentDataLetter}]`)

		if (newCell == null) {
			newCell = document.createElement('div')
			newCell.className = 'table-div-table-cell'
			newCell.setAttribute('data-cell', currentDataLetter)
			newCell.innerText = (chkForDate(dataName, newCell).length === 0 && dataName === 'episode_1') ? 'N/A' : chkForDate(dataName, newCell)
			if (newCell.classList.contains('red-date')) {
				let revisionText = document.createTextNode(' (revision) ')
				newCell.appendChild(revisionText)
			}
			i++
		}

		else if (i > 0) {
			let moreText = document.createTextNode(', ' + chkForDate(dataName, newCell))
			if (moreText.length > 2) newCell.appendChild(moreText)
		}

		allCells.appendChild(newCell)
		idx++
	}
	return allCells
}

function dateFormat(sideData) {//formats date data into visually pleasing format
	let dateToUse

	if (typeof sideData.revision !== 'undefined') {
		sideData.isRed = sideData.revision === 1 ? true : false
		dateToUse = sideData.start_date

		if (new Date(sideData.start_date) <= new Date(sideData.tsrevision)) {
			dateToUse = sideData.tsrevision
		}
	}
	let dateData = sideData.entry_date || dateToUse
	let dateObj = dateData.length ? new Date(dateData) : 'Indefinite'

	if (typeof dateObj === 'object') {
		let date, month, yearLastTwo
		date = dateObj.getDate() + ""
		date = date.length === 2 ? date : `0${date}`
		month = (dateObj.getMonth() + 1 + "")
		month = month.length === 2 ? month : `0${month}`

		yearLastTwo = (dateObj.getFullYear() + "").slice(2)
		let dateStr = `${month}/${date}/${yearLastTwo}`
		return dateStr
	}
	return dateObj
}

function buildCustomDropdown() {//build dropdown divs from selector information
	let selectDropDowns = document.querySelectorAll(".select-dropdown")
	selectDropDowns.forEach(dropDown => {
		let selectorFrag = document.createDocumentFragment()
		let newDiv = document.createElement('div')
		let newSpan = document.createElement('span')
		let newUl = document.createElement('ul')
		let newLi = document.createElement('li')
		let newI = document.createElement('i')

		newDiv.className = "div-selector"
		newDiv.setAttribute("data-required","")
		newSpan.className = "span-selector"
		newUl.className = "ul-selector"
		newLi.className = "option-selector"
		newI.className = "fa fa-chevron-down"

		// Convert HTMLCollection to array for browser backward compatibility
		let htmlCollection = dropDown.children
		let arr = [];
		for(let i = htmlCollection.length; i--; arr.unshift(htmlCollection[i]));
		let childrens = arr
		
		;[...childrens].forEach(child => {
			if (child.value !== '0') {
				let currentLi = newLi.cloneNode()
				currentLi.innerText = child.innerText
				currentLi.setAttribute('rel', child.value)
				newUl.appendChild(currentLi)
			}
		})

		newSpan.innerText = dropDown.selectedIndex > -1 ? dropDown.options[dropDown.selectedIndex].text : dropDown.options[0].text
		newDiv.appendChild(newSpan)
		if (dropDown.selectedIndex > 0) newDiv.classList.add('selection-selected')
		selectorFrag.appendChild(newDiv)
		selectorFrag.appendChild(newUl)
		selectorFrag.appendChild(newI)

		dropDown.parentNode.insertBefore(selectorFrag, dropDown.nextSibling)

		dropDown.nextSibling.nextSibling.childNodes
			.forEach(li => {
				li.addEventListener('click', event => {
					let thisLi = event.target
					dropDown.value = thisLi.attributes.rel.value
					let divSelectorSpan = thisLi.parentNode.previousSibling.children[0]
					divSelectorSpan.innerText = thisLi.innerText
					dropdownTextStyling(thisLi)
					if (thisLi.parentElement.previousSibling.classList.contains('active')) {
						dropDown.dispatchEvent(resorting)
					}
				})
			})
	})

	document.querySelectorAll('.div-selector').forEach(divSelector => {
		divSelector.addEventListener('click', event => {
			removeActiveClass(event)
			event.target.closest('.div-selector').classList.add('active')
		})
	})

	document.addEventListener('click', event => {
		removeActiveClass(event)
	})
}
