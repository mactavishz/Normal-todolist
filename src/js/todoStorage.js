/**
 * Created by maczhanchao on 2017/3/26.
 */
// todo local-storage operate object
const storageKey = "local-todo-list"
export let todoStorage = {
    fetchAll: function () {
        var todos = JSON.parse(localStorage.getItem(storageKey) || "[]")
        todos.forEach(function (todo, index) {
            todo.id = index
        });
        todoStorage.uid = todos.length
        return todos
    },
    save: function (todos) {
        localStorage.setItem(storageKey, JSON.stringify(todos))
    }
}