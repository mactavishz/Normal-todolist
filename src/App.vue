<template>
	<div class="todo">
		<div class="todo-title">
			<h1>Todo List</h1>
		</div>
		<div class="todo-input">
			<label for="new-todo"></label>
			<input type="text"
			       id="new-todo"
			       maxLength="30"
			       @input=""
			       v-model="newTodoText"
			       @keyup.enter="createTodoItem">
			<transition name="fade">
				<button class="clear-input"
				        @click="newTodoText=''"
				        v-show="newTodoText.length"></button>
			</transition>
		</div>
		<div class="todo-display">
			<transition-group tag="div" name="fade">
				<div class="todo-item"
				     v-for="todo in filterTodos"
				     :key="todo.id"
				     :class="{ 'item-completed': todo.completed }">
					<input type="checkbox"
					       class="todo-checkbox"
					       :checked="todo.completed"
					       @click="todo.completed = !todo.completed">
					<label>{{todo.text}}</label>
					<button class="destroy"
					        @click="removeTodo(todo)">Delete
					</button>
				</div>
			</transition-group>
		</div>
		<footer class="todo-footer clearfix">
			<span class="todo-count">
				<em> {{remaining}} </em>{{ remaining > 1 ? "items" : "item" }} left
			</span>
			<ul class="todo-filter">
				<li><a href="#/all"
				       :class="{ selected: visibility == 'all' }"
				       @click=" visibility = 'all' ">All</a></li>
				<li><a href="#/completed"
				       :class="{ selected: visibility == 'completed' }"
				       @click=" visibility = 'completed' ">Completed</a></li>
				<li><a href="#/undone"
				       :class="{ selected: visibility == 'undone' }"
				       @click=" visibility = 'undone' ">Undone</a></li>
			</ul>
			<button class="clear-completed"
					@click="clearCompleted()">Clear completed</button>
		</footer>
	</div>
</template>
<script>
    import { todoStorage } from "./js/todoStorage"
    import { todoFilters } from "./js/todoFilters"
    export default{
        data(){
            return {
                newTodoText: "",
                todos: todoStorage.fetchAll(),
                visibility: "all",
            }
        },
	    watch:{
          todos:{
              handler(todos) {
	              todoStorage.save(todos)
              },
	          deep:true
          },
	    },
        methods: {
            createTodoItem: function (event) {
                if (!this.newTodoText.trim()) {
                    return
                } else {
                    this.todos.push({
                        id: todoStorage.uid++,
                        text: this.newTodoText,
                        completed: false
                    })
                }
                event.target.blur()
                this.newTodoText = ""
            },
            removeTodo: function (todo) {
                this.todos.splice(this.todos.indexOf(todo), 1)
            },
            clearCompleted:function () {
	            this.todos = todoFilters.undone(this.todos)
            }
        },
        computed: {
            filterTodos: function () {
                return todoFilters[this.visibility](this.todos)
            },
            remaining: function () {
                return todoFilters.undone(this.todos).length
            }
        },
	    mounted(){
            window.addEventListener("hashchange",() => {
                let hash = window.location.hash.replace(/#\/?/, '')
                if (todoFilters[hash]) {
                    this.visibility = hash
                } else {
                    window.location.hash = ''
                    this.visibility = 'all'
                }
            })
	    }
    }
</script>
<style>
	@import url(./css/style.css);
	
	.item-completed{
		border-right: #25AE88 5px solid;
	}
	.fade-enter, .fade-leave-active {
		opacity: 0;
	}
	
	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s ease
	}
</style>