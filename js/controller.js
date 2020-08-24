window.addEventListener("load", init);

let itemFormFields = null;

function init() {
	itemFormFields = {
		id: document.getElementById('id'),
		name: document.getElementById('name'),
		price: document.getElementById('price'),
		description: document.getElementById('desc'),
		color: document.getElementById('color'),
		url: document.getElementById('url'),
	};

	clearAll();
	loadId();
	showTotal();
	bindEvents();
	setUpdateRecordEnabled(false);

}

function clearAll() {
	/* this function clears the contents of the form except the ID (since ID is auto generated)*/
	['name', 'price', 'description', 'url']
		.map(inputId => itemFormFields[inputId])
		.forEach(input => input.value = '');

	itemFormFields.color.value = '#000000';
	document.getElementById('exrate').innerText = '';
	itemOperations.items.forEach(item => item.isMarked = false);
}

let auto = autoGen();

function loadId() {
	/* this function automatically sets the value of ID */
	document.querySelector('#id').innerText = auto.next().value;
}

function showTotal() {
	/* this function populates the values of #total, #mark and #unmark ids of the form */
	const totalItems = itemOperations.items.length;
	const totalItemsMarked = itemOperations.countTotalMarked();
	document.getElementById('total').innerText = totalItems.toString();
	document.getElementById('mark').innerText = totalItemsMarked.toString();
	document.getElementById('unmark').innerText = (totalItems - totalItemsMarked).toString();
}

function bindEvents() {
	document.querySelector('#remove').addEventListener('click', deleteRecords);
	document.querySelector('#add').addEventListener('click', addRecord);
	document.querySelector('#update').addEventListener('click', updateRecord);
	document.querySelector('#exchange').addEventListener('change', getExchangerate);
	itemFormFields.price.addEventListener('change', getExchangerate);
}

function deleteRecords() {
	/* this function deletes the selected record from itemOperations and prints the table using the function printTable*/
	itemOperations.remove();
	printTable(itemOperations.items);
}

function addRecord() {
	/* this function adds a new record in itemOperations and then calls printRecord(). showTotal(), loadId() and clearAll()*/
	const item = new Item(
		itemFormFields.id.innerText,
		itemFormFields.name.value,
		itemFormFields.price.value,
		itemFormFields.description.value,
		itemFormFields.color.value,
		itemFormFields.url.value,
		false
	);
	itemOperations.add(item);
	printRecord(item);
	showTotal();
	clearAll();
	loadId();
}

const setAddRecordEnabled = shouldEnable => {
	const addRecordButton = document.getElementById('add');
	addRecordButton.toggleAttribute('disabled', !shouldEnable);
};

const setDeleteRecordEnabled = shouldEnable => {
	const deleteRecordsButton = document.getElementById('remove');
	deleteRecordsButton.toggleAttribute('disabled', !shouldEnable);
};

const setUpdateRecordEnabled = shouldEnable => {
	const updateRecordButton = document.getElementById('update');
	updateRecordButton.toggleAttribute('disabled', !shouldEnable);
};

function edit() {
	/*this function fills (calls fillFields()) the form with the values of the item to edit after searching it in items */
	const itemId = this.getAttribute('data-itemid');
	const item = itemOperations.search(itemId);
	fillFields(item);
	setAddRecordEnabled(false);
	setDeleteRecordEnabled(false);
	setUpdateRecordEnabled(true);
}

function fillFields(itemObject) {
	/*this function fills the form with the details of itemObject*/
	itemFormFields.id.innerText = itemObject.id;
	itemFormFields.name.value = itemObject.name;
	itemFormFields.price.value = itemObject.price;
	itemFormFields.description.value = itemObject.desc;
	itemFormFields.color.value = itemObject.color;
	itemFormFields.url.value = itemObject.url;
	getExchangerate();
}

function createIcon(className, fn, id) {
	/* this function creates icons for edit and trash for each record in the table*/
	// <i class="fas fa-trash"></i>
	// <i class="fas fa-edit"></i>
	var iTag = document.createElement("i");
	iTag.className = className;
	iTag.addEventListener('click', fn);
	iTag.setAttribute("data-itemid", id);

	return iTag;
}

function updateRecord() {
	/*this function updates the record that is edited and then prints the table using printTable()*/
	const item = itemOperations.search(itemFormFields.id.innerText);
	// update the items fields
	item.name = itemFormFields.name.value;
	item.price = itemFormFields.price.value;
	item.desc = itemFormFields.description.value;
	item.color = itemFormFields.color.value;
	item.url = itemFormFields.url.value;
	getExchangerate();
	// clear the form fields
	clearAll();
	loadId();
	// update interface
	setAddRecordEnabled(true);
	setDeleteRecordEnabled(true);
	setUpdateRecordEnabled(false);
	printTable(itemOperations.items);
}

function trash() {
	/*this function toggles the color of the row when its trash button is selected and updates the marked and unmarked fields */
	let id = this.getAttribute('data-itemid');
	itemOperations.markUnMark(id);
	showTotal();
	let tr = this.parentNode.parentNode;
	tr.classList.toggle('alert-danger');
	console.log("I am Trash ", this.getAttribute('data-itemid'))
}

function printTable(items) {
	/* this function calls printRecord for each item of items and then calls the showTotal function*/
	document.getElementById('items').innerHTML = '';
	items.forEach(item => {
		itemOperations.markUnMark(item);
		printRecord(item);
	});
	showTotal();
}

function printRecord(item) {
	var tbody = document.querySelector('#items');
	var tr = tbody.insertRow();
	var index = 0;
	for (let key in item) {
		if (key == 'isMarked') {
			continue;
		}
		let cell = tr.insertCell(index);
		cell.innerText = item[key];
		index++;
	}
	var lastTD = tr.insertCell(index);
	lastTD.appendChild(createIcon('fas fa-trash mr-2', trash, item.id));
	lastTD.appendChild(createIcon('fas fa-edit', edit, item.id));
}

function getExchangerate() {
	/* this function makes an AJAX call to http://apilayer.net/api/live to fetch and display the exchange rate for the currency selected*/
	fetch('http://api.currencylayer.com/live?access_key=8194f0d76cf76918ac03194e5ecb1740&source=USD')
		.then(response => response.json())
		.then(response => {
			const exchangeSelector = document.getElementById('exchange');
			const selectedCurrencyCode = exchangeSelector.options[exchangeSelector.selectedIndex].value;
			const exchangeRate = response.quotes[`USD${selectedCurrencyCode}`];
			const priceInUSD = itemFormFields.price.value;
			const priceInSelectedCurrency = (exchangeRate * priceInUSD).toFixed(2);
			const currencySymbol = selectedCurrencyCode === 'EUR' || selectedCurrencyCode === 'GBP' ? '€' : '$';
			document.getElementById('exrate').innerText = `${currencySymbol}${priceInSelectedCurrency} ${selectedCurrencyCode}`;
		});
}