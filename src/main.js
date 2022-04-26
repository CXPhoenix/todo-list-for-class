import "./index.css";

const todoDatas = [
  {
    content_id: "1",
    content: "測試內容",
    timestamp: "2022/04/26 16:20",
    state: "#todo",
  },
];

const todoForm = document.querySelector("#to-do-form");
const searchInput = document.querySelector("#search-input-area");
const showCompleteCheckBox = document.querySelector("#show-complete");
const showCompleteText = document.querySelector("#show-complete-text");
const todoList = document.querySelector("#to-do-list");

document.addEventListener("DOMContentLoaded", function () {
  if (window.localStorage.getItem("todoDatas")) {
    todoDatas.splice(0, todoDatas.length);
    todoDatas.push(...getDatasFromLocalStorage());
  }
  renderTodoItems();
});

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  addTodoData(e.target["input-area"].value);
  renderTodoItems();
  e.target["input-area"].value = "";
});

todoForm["input-area"].addEventListener("input", (e) => {
  const placeholder = document.querySelector("#input-area-placeholder");
  if (e.target.value !== "") {
    placeholder.classList.add(
      "-translate-y-7",
      "-translate-x-2",
      "text-base",
      "text-sky-500"
    );
    placeholder.classList.remove("text-2xl");
  } else {
    placeholder.classList.remove(
      "-translate-y-7",
      "-translate-x-2",
      "text-base",
      "text-sky-500"
    );
    placeholder.classList.add("text-2xl");
  }
});

searchInput.addEventListener("input", function (e) {
  if (e.target.value === "") {
    renderTodoItems();
  } else {
    const result = todoDatas.filter((data) =>
      data.content.includes(e.target.value)
    );
    renderTodoItems(result);
  }
});

showCompleteCheckBox.addEventListener("change", function (e) {
  if (e.target.checked) {
    showCompleteText.innerText = "顯示已完成項目";
    const result = todoDatas.filter((data) => data.state === "#todo");
    renderTodoItems(result);
  } else {
    showCompleteText.innerText = "隱藏已完成項目";
    renderTodoItems();
  }
});

/**
 *
 * @param {Object[]} datas default is todoDatas
 */
function renderTodoItems(datas = todoDatas) {
  todoList.innerHTML = "";
  datas.forEach((data) => renderTodoItem(data));
  saveDatasToLocalStorage();
}

/**
 *
 * @param {Object} todo_content_object { content_id, content, timestamp }
 */
function renderTodoItem({ content_id, content, timestamp, state }) {
  const templateItem = document.querySelector("#todo-item-template").content;
  const item = templateItem.cloneNode(true);
  item.firstElementChild.id += `-${content_id}`;
  item.querySelector("#item-demo-check").id = `item-check-${content_id}`;
  if (state === "#complete") {
    item.querySelector(`#item-check-${content_id}`).checked = true;
  }
  item
    .querySelector("#complete-btn")
    .setAttribute("for", `item-check-${content_id}`);
  item.querySelector("#item-content").innerText = content;
  item.querySelector("#item-timestamp").innerText = timestamp;
  if (state === "#complete") {
    item.querySelector("#complete-btn").innerText = "取消完成";
  }
  item.querySelector("#complete-btn").addEventListener("click", (e) => {
    const itemIndex = todoDatas.findIndex(
      (data) => data.content_id === content_id
    );
    if (e.target.innerText === "完成") {
      todoDatas[itemIndex].state = "#complete";
      e.target.innerText = "取消完成";
    } else if (e.target.innerText === "取消完成") {
      todoDatas[itemIndex].state = "#todo";
      e.target.innerText = "完成";
    }
    saveDatasToLocalStorage();
  });
  item.querySelector("#delete-btn").addEventListener("click", () => {
    removeTodoData(content_id);
    renderTodoItems();
  });
  todoList.appendChild(item);
}

/**
 *
 * @param {String} content
 */
function addTodoData(content) {
  todoDatas.push({
    content_id: `${new Date().getTime()}`,
    content,
    timestamp: timeFormat(new Date()),
    state: "#todo",
  });
}

/**
 *
 * @param {String} content_id
 */
function removeTodoData(content_id) {
  const itemIndex = todoDatas.findIndex(
    (data) => data.content_id === content_id
  );
  todoDatas.splice(itemIndex, 1);
}

/**
 *
 * @param {String} timestamp
 * @returns {String} format string of time
 */
function timeFormat(timestamp) {
  const time = new Date(timestamp);
  const YYYY = time.getFullYear();
  const MM =
    time.getMonth() + 1 > 9 ? time.getMonth() + 1 : `0${time.getMonth() + 1}`;
  const DD = time.getDate() > 9 ? time.getDate() : `0${time.getDate()}`;
  const hh = time.getHours() > 9 ? time.getHours() : `0${time.getHours()}`;
  const mm =
    time.getMinutes() > 9 ? time.getMinutes() : `0${time.getMinutes()}`;
  return `${YYYY}/${MM}/${DD} ${hh}:${mm}`;
}

function saveDatasToLocalStorage() {
  window.localStorage.setItem("todoDatas", JSON.stringify(todoDatas));
}

function getDatasFromLocalStorage() {
  return JSON.parse(window.localStorage.getItem("todoDatas"));
}
