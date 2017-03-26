/**
 * Created by maczhanchao on 2017/3/26.
 */
export let todoFilters={
    all:function (todos) {
        return todos
    },
    undone:function (todos) {
        return todos.filter(function (todo) {
            return !todo.completed
        })
    },
    completed:function (todos) {
        return todos.filter(function (todo) {
            return todo.completed
        })
    }
}