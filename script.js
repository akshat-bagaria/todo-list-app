const addBtn = document.getElementById("addTodoBtn");
const inputTag = document.getElementById("todoInput");
let todoListUl = document.getElementById("todoList");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = [];
let todosString = localStorage.getItem("todos");
if (todosString) {
    todos = JSON.parse(todosString);
}

let currentFilter = "all";

const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
}

const getFilteredTodos = () => {
    if (currentFilter === "active") {
        return todos.filter(todo => !todo.isCompleted);
    }
    if (currentFilter === "completed") {
        return todos.filter(todo => todo.isCompleted);
    }
    return todos; // "all"
}

const populateTodos = () => {
    let string = "";
    for (const todo of getFilteredTodos()) {
        string += `<li class="todo-item ${todo.isCompleted ? "completed" : ""}" data-id="${todo.id}">
            <input type="checkbox" class="todo-checkbox" aria-label="Mark task complete" ${todo.isCompleted ? "checked" : ""}>
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn" aria-label="Delete task">×</button>
        </li>`
    }
    todoListUl.innerHTML = string;
}

addBtn.addEventListener("click", () => {
    let todoText = inputTag.value.trim();
    if (todoText === "") return;
    inputTag.value = "";

    let todo = {
        id: Date.now(),
        title: todoText,
        isCompleted: false
    }
    todos.push(todo);
    saveTodos();
    populateTodos();
})

todoListUl.addEventListener("change", (e) => {
    if (e.target.classList.contains("todo-checkbox")) {
        const li = e.target.closest(".todo-item");
        const id = Number(li.dataset.id);
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        todo.isCompleted = e.target.checked;
        saveTodos();

        // If we're on the "active" or "completed" filter, the toggled item
        // may no longer belong in this view — re-render to drop/add it.
        // If we're on "all", just toggle the class in place so it can animate.
        if (currentFilter === "all") {
            li.classList.toggle("completed", todo.isCompleted);
        } else {
            populateTodos();
        }
    }
})

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        populateTodos();
    })
})
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter(todo => !todo.isCompleted);
    saveTodos();
    populateTodos();
})
populateTodos();