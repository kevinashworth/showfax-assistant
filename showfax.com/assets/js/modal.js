function internalModalCtrl(show, tagID) { //internal use only
	tagID = tagID || 'modal-div'
	let myModal = document.getElementById(tagID)
	isOpen = (!!myModal.style.display && myModal.style.display === 'block')
	currentStyle = myModal.style.display

	myModal.style.display = (!!show && !isOpen) ?
		"block" : (!show && !!isOpen) ?
			'none' : currentStyle
}

function showMyModal(tagID) {//open modal
	return internalModalCtrl(true, tagID)
}

function hideMyModal() {//close modal
	return internalModalCtrl()
}