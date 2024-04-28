let todoItems = []

function saveTodoData() {
  localStorage.setItem("todoData", JSON.stringify(todoItems))
}

function loadTodoData() {
  const todoData = localStorage.getItem("todoData")

  if (todoData) {
    todoItems = JSON.parse(todoData)
  }
}

function addTodoItem(content, editable = true) {
  const todoItem = {
    id: Date.now(),
    editable: editable,
    content: content,
    completed: false,
  }

  todoItems.push(todoItem)
  saveTodoData()
  render()
}

function removeTodoItem(id) {
  todoItems = todoItems.filter((todoItem) => todoItem.id !== id)
  saveTodoData()
  render()
}

function toggleTodoItem(id) {
  const todoItem = todoItems.find((todoItem) => todoItem.id === id)
  todoItem.completed = !todoItem.completed
  saveTodoData()
  render()
}

function editTodoItem(id, content) {
  const todoItem = todoItems.find((todoItem) => todoItem.id === id)

  if (todoItem.editable) {
    todoItem.content = content
    saveTodoData()
    render()
  }
}

function render() {
  const todoWelcomeView = document.querySelector("#todo-welcome-view")
  const todoListView = document.querySelector("#todo-list-view")
  const todoList = document.querySelector("#todo-list")
  const todoCompleted = document.querySelector("#todo-completed")
  todoList.innerHTML = ""
  todoCompleted.innerHTML = ""

  if (todoItems.length === 0) {
    todoWelcomeView.style.display = "block"
    todoListView.style.display = "none"
  } else {
    todoWelcomeView.style.display = "none"
    todoListView.style.display = "block"
  }

  for (const todo of todoItems) {
    const todoItem = document.createElement("li")
    const todoToggle = document.createElement("input")
    const todoContent = document.createElement("label")
    const todoEditIcon = document.createElement("img")
    const todoEdit = document.createElement("button")
    const todoRemoveIcon = document.createElement("img")
    const todoRemove = document.createElement("button")

    todoToggle.id = `toggle-${todo.id}`
    todoToggle.type = "checkbox"
    todoToggle.checked = todo.completed
    todoToggle.onclick = () => toggleTodoItem(todo.id)

    todoContent.id = `label-${todo.id}`
    todoContent.innerText = todo.content
    todoContent.htmlFor = `toggle-${todo.id}`
    todoContent.setAttribute("class", todo.completed ? "completed" : "")

    todoEditIcon.src = "pen.svg"

    todoEdit.id = `edit-${todo.id}`
    todoEdit.type = "button"
    todoEdit.disabled = !todo.editable
    todoEdit.appendChild(todoEditIcon)
    todoEdit.onclick = () => {
      todoEdit.removeChild(todoEditIcon)
      todoEdit.setAttribute("class", "editing")
      todoEdit.onclick = () => {
        todoEdit.removeAttribute("class")
        todoEdit.appendChild(todoEditIcon)
        editTodoItem(todo.id, todoEditInput.value)
      }

      const todoEditInput = document.createElement("input")
      todoEditInput.id = `edit-input-${todo.id}`
      todoEditInput.type = "text"
      todoEditInput.value = todo.content
      
      todoContent.replaceWith(todoEditInput)
    }

    todoRemoveIcon.src = "trash-can.svg"

    todoRemove.id = `remove-${todo.id}`
    todoRemove.type = "button"
    todoRemove.classList.add("delete")
    todoRemove.appendChild(todoRemoveIcon)
    todoRemove.onclick = () => removeTodoItem(todo.id)

    todoItem.id = `todo-${todo.id}`
    todoItem.appendChild(todoToggle)
    todoItem.appendChild(todoContent)
    todoItem.appendChild(todoEdit)
    todoItem.appendChild(todoRemove)

    if (todo.completed) {
      todoCompleted.appendChild(todoItem)
    } else {
      todoList.appendChild(todoItem)
    }
  }
}

const todoForm = document.querySelector("#todo-form")
todoForm.addEventListener("submit", event => {
  event.preventDefault()

  const todoInput = document.querySelector("#todo-input")
  const todoContent = todoInput.value.trim()
  const todoEditable = document.querySelector("#todo-editable")

  if (todoContent !== "") {
    addTodoItem(todoContent, todoEditable.checked)
    todoInput.value = ""
    todoInput.focus()
  }
})

document.addEventListener("DOMContentLoaded", () => {
  loadTodoData()
  render()
})