const itemOperations = {
	items: [],
	add(itemObject) {
		/* adds an item into the array items*/
		// TODO: check itemObject is formed correctly
		this.items.push(itemObject);
	},
	remove() {
		/* removes the item which has the "isMarked" field set to true*/
	},
	search(id) {
		/* searches the item with a given argument id */
	},
	markUnMark(id) {
		/* toggle the isMarked field of the item with the given argument id*/

	},
	countTotalMarked() {
		/* counts the total number of marked items */

	},

}