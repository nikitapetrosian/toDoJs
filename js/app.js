(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const script_form = document.querySelector("#form");
    const taskInput = document.querySelector("#taskInput");
    const tasksList = document.querySelector("#tasksList");
    document.querySelector("#emptyList");
    const odd = document.querySelector("#odd");
    const notOdd = document.querySelector("#notOdd");
    const firstEl = document.querySelector("#firstEl");
    const lastEl = document.querySelector("#lastEl");
    const spoller = document.querySelector("[data-spoller]");
    let tasks = [];
    if (localStorage.getItem("tasks")) {
        tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks.forEach((task => renderTask(task)));
    }
    checkEmptyList();
    script_form.addEventListener("submit", addTask);
    tasksList.addEventListener("click", deleteTask);
    tasksList.addEventListener("click", doneTask);
    notOdd.addEventListener("click", highlightNotOdd);
    odd.addEventListener("click", highlightOdd);
    firstEl.addEventListener("click", delFirstEl);
    lastEl.addEventListener("click", delLastEl);
    spoller.addEventListener("click", script_spollers);
    function addTask(event) {
        event.preventDefault();
        const taskText = taskInput.value;
        const newTask = {
            id: Date.now(),
            text: taskText,
            done: false
        };
        tasks.push(newTask);
        saveToLocalStorage();
        renderTask(newTask);
        taskInput.value = "";
        taskInput.focus();
        checkEmptyList();
    }
    function deleteTask(event) {
        if (event.target.dataset.action !== "delete") return;
        const parentNode = event.target.closest(".list-group-item");
        const id = Number(parentNode.id);
        tasks = tasks.filter((task => task.id !== id));
        saveToLocalStorage();
        parentNode.remove();
        checkEmptyList();
    }
    function doneTask(event) {
        if (event.target.dataset.action !== "done") return;
        const parentNode = event.target.closest(".list-group-item");
        const taskHTML = parentNode.outerHTML;
        tasksList.insertAdjacentHTML("beforeend", taskHTML);
        const lastEl = tasksList.lastElementChild;
        parentNode.remove();
        console.log(parentNode);
        const id = Number(lastEl.id);
        const task = tasks.find((task => task.id === id));
        task.done = !task.done;
        const index = tasks.findIndex((task => task.id === id));
        tasks.push(tasks[index]);
        tasks.splice(index, 1);
        saveToLocalStorage();
        const taskTitle = lastEl.querySelector(".task-title");
        taskTitle.classList.toggle("task-title--done");
    }
    function checkEmptyList() {
        if (tasks.length === 0) {
            const emptyListHTML = `<li id="emptyList" class="list-group-item list-group-item_empty-list">\n\t\t\t\t\t<img src="./img/list.png" alt="Empty" width="48" class="mt-3">\n\t\t\t\t\t<div class="empty-list__title">Список дел пуст</div>\n\t\t\t\t</li>`;
            tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
        }
        if (tasks.length > 0) {
            const emptyListEl = document.querySelector("#emptyList");
            emptyListEl ? emptyListEl.remove() : null;
        }
    }
    function saveToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    function renderTask(task) {
        const cssClass = task.done ? "task-title task-title--done" : "task-title";
        const taskHTML = `<li id="${task.id}" class="list-group-item">\n\t\t\t\t\t<span class="${cssClass}">${task.text}</span>\n\t\t\t\t\t<div class="task-item__buttons">\n\t\t\t\t\t\t<button type="button" data-action="done" class="btn-action">\n\t\t\t\t\t\t\t<img src="./img/tick.svg" alt="Done" width="18" height="18">\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button type="button" data-action="delete" class="btn-action">\n\t\t\t\t\t\t\t<img src="./img/cross.svg" alt="Done" width="18" height="18">\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</li>`;
        tasksList.insertAdjacentHTML("beforeend", taskHTML);
    }
    function highlightNotOdd() {
        const notOddEl = document.querySelectorAll(".list-group-item");
        notOddEl.forEach((function(el, i) {
            console.log(el);
            if (i % 2 == 0) el.classList.toggle("odd");
        }));
    }
    function highlightOdd() {
        const oddEl = document.querySelectorAll(".list-group-item");
        oddEl.forEach((function(el, i) {
            console.log(el);
            if (i % 2 != 0) el.classList.toggle("not-odd");
        }));
    }
    function delFirstEl() {
        if (tasksList.children.length < 1 || tasksList.classList.contains("list-group-item_empty-list")) return;
        tasksList.firstElementChild.remove();
        tasks.splice(0, 1);
        saveToLocalStorage();
        checkEmptyList();
    }
    function delLastEl() {
        if (tasksList.children.length < 1 || tasksList.classList.contains("list-group-item_empty-list")) return;
        tasksList.lastElementChild.remove();
        tasks.splice(length - 1, 1);
        saveToLocalStorage();
        checkEmptyList();
    }
    function script_spollers() {
        const cardBody = document.querySelector(".card-body_add");
        const cardArrow = document.querySelector(".arrow-img");
        cardBody.classList.toggle("active");
        cardArrow.classList.toggle("active");
    }
    window["FLS"] = true;
    isWebp();
})();