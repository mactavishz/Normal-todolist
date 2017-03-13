/**
 * Created by maczhanchao on 2017/3/11.
 */
let todoDisplayArea = document.querySelector(".todo-display");
let todoCountText = document.querySelector(".todo-count em");
let todoItems = document.getElementsByClassName("todo-item");
let itemPluralText = document.querySelector(".todo-footer .plural");
let undoneCounts = 0;
const storageKey = "local-todo-list";
const todoStatus = {
    completed: "completed",
    undone: "undone"
};
let todoStorage = {
    fetchAll: function () {
        let todos = JSON.parse(localStorage.getItem(storageKey) || "[]");
        todos.forEach(function (item, index) {
            item.id = index;
        });
        todoStorage.todoCounts = todos.length;
        return todos;
    },
    update: function (todos) {
        localStorage.setItem(storageKey, JSON.stringify(todos));
        todoStorage.todoCounts = todos.length;
    },
    remove: function (todos, id) {
        todos.splice(id, 1);
    },
    removeAll: function () {
        localStorage.removeItem(storageKey);
    },
};

function Todo(id, status, text) {
    this.id = id;
    this.status = status;
    this.text = text;
}

let todoTempStorage = todoStorage.fetchAll();

function createTodoItem(todo) {
    let todoItem = document.createElement("div");
    let checkBox = document.createElement("input");
    let label = document.createElement("label");
    let destroyBtn = document.createElement("button");

    todoItem.className = "todo-item";
    todoItem.setAttribute("data-visibility", todo.status);
    checkBox.className = "todo-checkbox";
    checkBox.type = "checkbox";
    if (todo.status == todoStatus.completed) {
        todoItem.style.borderRightColor = "#25AE88";
        checkBox.checked = true;
    }
    label.innerHTML = todo.text;
    destroyBtn.className = "destroy";
    destroyBtn.innerHTML = "Delete";

    checkBox.addEventListener("click", function (event) {
        if (this.checked) {
            todoItem.style.borderRightColor = "#25AE88";
            todo.status = todoStatus.completed;
            todoStorage.update(todoTempStorage);
            todoItem.setAttribute("data-visibility", todo.status);
            if (location.hash.replace(/#\/?/, "") == todoStatus.completed) {
                todoItem.style.display = "block";
            } else if (location.hash.replace(/#\/?/, "") == todoStatus.undone) {
                todoItem.style.display = "none";
            }
            undoneCounts--;
            todoCountText.innerHTML = undoneCounts;
            itemPluralText.innerHTML = undoneCounts > 1 ? "s" : "";
        } else {
            todoItem.style.borderRightColor = "#1E90FF";
            todo.status = todoStatus.undone;
            todoStorage.update(todoTempStorage);
            todoItem.setAttribute("data-visibility", todo.status);
            if (location.hash.replace(/#\/?/, "") == todoStatus.completed) {
                todoItem.style.display = "none";
            } else if (location.hash.replace(/#\/?/, "") == todoStatus.undone) {
                todoItem.style.display = "block";
            }
            undoneCounts++;
            todoCountText.innerHTML = undoneCounts;
            itemPluralText.innerHTML = undoneCounts > 1 ? "s" : "";
        }
    }, false);

    destroyBtn.addEventListener("mouseover", function (event) {
        event.stopPropagation();
        destroyBtn.style.color = "#95200d";
    }, false);

    destroyBtn.addEventListener("mouseout", function (event) {
        destroyBtn.style.color = "#000000";
    }, false);

    destroyBtn.addEventListener("click", function () {
        undoneCounts = 0;
        todoStorage.remove(todoTempStorage, todo.id);
        todoTempStorage.forEach(function (item, index) {
            item.id = index;
            if (item.status == todoStatus.undone) {
                undoneCounts++;
            }
        });
        todoCountText.innerHTML = undoneCounts;
        itemPluralText.innerHTML = undoneCounts > 1 ? "s" : "";
        todoStorage.update(todoTempStorage);
        todoDisplayArea.removeChild(todoItem);
    }, false);

    todoItem.addEventListener("mouseover", function (event) {
        destroyBtn.style.color = "#000000";
    }, false);

    todoItem.addEventListener("mouseout", function () {
        event.stopPropagation();
        destroyBtn.style.color = "#FFFFFF";
    }, false);

    switch (location.hash.replace(/#\/?/, "")) {
        case "all":
            todoItem.style.display = "block";
            break;
        case "completed":
            if (todo.status != todoStatus.completed) {
                todoItem.style.display = "none";
            }
            break;
        case "undone":
            if (todo.status != todoStatus.undone) {
                todoItem.style.display = "none";
            }
            break;
        default:
            break;
    }

    todoItem.appendChild(checkBox);
    todoItem.appendChild(label);
    todoItem.appendChild(destroyBtn);
    todoItem.style.opacity = 0;
    todoDisplayArea.appendChild(todoItem);
    setTimeout(function () {
        todoItem.style.opacity = 1;
    }, 0);

}

window.addEventListener("load", function () {
    let inputBox = document.querySelector("#new-todo");
    let clearInputBtn = document.querySelector(".todo-input .clear-input");
    let todoFilterBtn = document.querySelectorAll(".todo-filter li a");
    let clearCompletedBtn = document.querySelector(".clear-completed");

    clearInputBtn.addEventListener("click", function (event) {
        inputBox.value = "";
        inputBox.focus();
        clearInputBtn.style.opacity = 0;
    }, false);

    inputBox.addEventListener("input", function (event) {
        clearInputBtn.style.opacity = 1;
    }, false);

    inputBox.addEventListener("blur", function (event) {
        clearInputBtn.style.opacity = 0;
    }, false);

    inputBox.addEventListener("keypress", function (event) {
        if (event.keyCode == 13) {
            let todo = new Todo(todoTempStorage.length, todoStatus.undone, this.value);
            todoTempStorage.push(todo);
            todoStorage.update(todoTempStorage);
            undoneCounts++;
            todoCountText.innerHTML = undoneCounts;
            itemPluralText.innerHTML = undoneCounts > 1 ? "s" : "";
            createTodoItem(todo);
            clearInputBtn.style.opacity = 0;
            inputBox.value = "";
        }
    }, false);

    todoFilterBtn.forEach(function (item) {
        switch (item.getAttribute("href").replace(/#\/?/, "")) {
            case "all":
                item.addEventListener("click", function (event) {
                    item.className = "selected";
                    todoFilterBtn[1].className = "";
                    todoFilterBtn[2].className = "";
                    for (let i = 0; i < todoItems.length; i++) {
                        todoItems[i].style.display = "block";
                    }
                }, false);
                break;
            case "completed":
                item.addEventListener("click", function (event) {
                    item.className = "selected";
                    todoFilterBtn[0].className = "";
                    todoFilterBtn[2].className = "";
                    for (let i = 0; i < todoItems.length; i++) {
                        if (todoItems[i].getAttribute("data-visibility") != todoStatus.completed) {
                            todoItems[i].style.display = "none";
                        } else {
                            todoItems[i].style.display = "block";
                        }
                    }
                }, false);
                break;
            case "undone":
                item.addEventListener("click", function (event) {
                    item.className = "selected";
                    todoFilterBtn[0].className = "";
                    todoFilterBtn[1].className = "";
                    for (let i = 0; i < todoItems.length; i++) {
                        if (todoItems[i].getAttribute("data-visibility") != todoStatus.undone) {
                            todoItems[i].style.display = "none";
                        } else {
                            todoItems[i].style.display = "block";
                        }
                    }
                }, false);
                break;
            default:
                break;
        }
    });

    clearCompletedBtn.addEventListener("click", function () {
        todoStorage.removeAll();
        todoTempStorage = todoStorage.fetchAll();
        undoneCounts = 0;
        todoCountText.innerHTML = undoneCounts;
        itemPluralText.innerHTML = undoneCounts > 1 ? "s" : "";
        todoDisplayArea.innerHTML = "";
    }, false);

    for (let i = 0; i < todoTempStorage.length; i++) {
        createTodoItem(todoTempStorage[i]);
        if (todoTempStorage[i].status == todoStatus.undone) {
            undoneCounts++;
        }
    }
    todoCountText.innerHTML = undoneCounts;
    itemPluralText.innerHTML = undoneCounts > 1 ? "s" : "";
});