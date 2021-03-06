const itemOperations = {
	items: [],
	add(itemObject) {
		/* adds an item into the array items*/
		// TODO: check itemObject is formed correctly
		this.items.push(itemObject);
	},
	remove() {
		/* removes the item which has the "isMarked" field set to true*/
		this.items = this.items.filter(item => !item.isMarked);
	},
	search(id) {
		/* searches the item with a given argument id */
		return this.items.find(item => item.id === id);
	},
	markUnMark(id) {
		/* toggle the isMarked field of the item with the given argument id*/
		let item = this.search(id);
		if (item !== undefined) item.toggle();
	},
	countTotalMarked() {
		/* counts the total number of marked items */
		return this.items.filter(item => item.isMarked).length;
	},
}