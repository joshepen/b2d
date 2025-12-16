import { getBookmarks } from "./bookmarks.js";
import { downloadBookmarks } from "./download.js";

const listElement = document.getElementById("bookmark-list");
const bookmarks = await getBookmarks();
let filteredBookmarks = bookmarks;

const selectAllElement = document.getElementById("check-all");
const allCheckbox = document.getElementById("all-checkbox");
allCheckbox.checked = true;

selectAllElement.onclick = changeSelectAll;
document.getElementById("download").onclick = async () => {
	downloadBookmarks(filteredBookmarks);
};

displayList();

function displayList() {
	listElement.innerHTML = "";
	bookmarks.forEach((bookmark) => {
		const bookmarkElement = document.createElement("li");
		bookmarkElement.id = bookmark.id;

		const nameElement = document.createElement("label");
		nameElement.textContent = bookmark.title;
		nameElement.classList.add("list-label");

		const checkBox = document.createElement("input");
		checkBox.type = "checkbox";
		checkBox.style = "pointer-events: none;";
		checkBox.checked = true;

		bookmarkElement.addEventListener("click", () => {
			checkBox.checked = !checkBox.checked;
			refreshFilteredList();
			updateSelectAll();
		});

		bookmarkElement.appendChild(checkBox);
		bookmarkElement.appendChild(nameElement);
		listElement.appendChild(bookmarkElement);
	});
}

function refreshFilteredList() {
	const checkedElements = Array.from(listElement.children).filter(
		(child) => child.firstChild.checked,
	);
	const checkedIds = checkedElements.map((element) => element.id);
	filteredBookmarks = bookmarks.filter((bookmark) =>
		checkedIds.includes(bookmark.id),
	);
}

function changeSelectAll() {
	allCheckbox.checked = !allCheckbox.checked;
	Array.from(listElement.children).forEach((child) => {
		child.firstChild.checked = allCheckbox.checked;
	});
}

function updateSelectAll() {
	allCheckbox.checked =
		Array.from(listElement.children).filter((child) => child.firstChild.checked)
			.length > 0;
}
