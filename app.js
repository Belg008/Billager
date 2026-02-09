const SUPABASE_URL = 'https://cgdissrzxzywdldhhlhp.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZGlzc3J6eHp5d2RsZGhobGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTIxNzIsImV4cCI6MjA4NjIyODE3Mn0.p9E4m8CPv1jzqItXCTJyxJcx3bQYHm7IZZC0EP9vsg4'
const TABLE_NAME = 'todos'

async function getTodos() {
    try {
        const { data, error } = await supabase.from(TABLE_NAME).select('*').order('created_at', { ascending: false })
        if (error) throw error
        displayTodos(data)
    } catch (error) {
        console.error('Feil:', error)
        showStatus('Feil ved lasting: ' + error.message, 'error')
    }
}

async function addTodo() {
    const input = document.getElementById('todoInput')
    const todoText = input.value.trim()
    if (!todoText) {
        showStatus('Skriv inn en oppgave!', 'error')
        return
    }
    try {
        const { data, error } = await supabase.from(TABLE_NAME).insert([{ title: todoText, completed: false }]).select()
        if (error) throw error
        input.value = ''
        await getTodos()
        showStatus('Todo lagt til!', 'success')
    } catch (error) {
        console.error('Feil:', error)
        showStatus('Feil: ' + error.message, 'error')
    }
}

async function toggleTodo(id, currentStatus) {
    try {
        const { data, error } = await supabase.from(TABLE_NAME).update({ completed: !currentStatus }).eq('id', id).select()
        if (error) throw error
        await getTodos()
        showStatus('Todo oppdatert!', 'success')
    } catch (error) {
        console.error('Feil:', error)
        showStatus('Feil: ' + error.message, 'error')
    }
}

async function deleteTodo(id) {
    if (!confirm('Er du sikker på at du vil slette denne oppgaven?')) return
    try {
        const { data, error } = await supabase.from(TABLE_NAME).delete().eq('id', id)
        if (error) throw error
        await getTodos()
        showStatus('Todo slettet!', 'success')
    } catch (error) {
        console.error('Feil:', error)
        showStatus('Feil: ' + error.message, 'error')
    }
}

function displayTodos(todos) {
    const todoList = document.getElementById('todoList')
    if (!todos || todos.length === 0) {
        todoList.innerHTML = '<div class="empty-state"><p>🎉 Ingen oppgaver!</p><small>Legg til en oppgave for å komme i gang</small></div>'
        return
    }
    todoList.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <input type="checkbox" ${todo.completed ? 'checked' : ''} data-action="toggle" data-id="${todo.id}" data-completed="${todo.completed}">
            <span>${todo.title}</span>
            <button data-action="delete" data-id="${todo.id}">Slett</button>
        </div>
    `).join('')
    
    document.querySelectorAll('[data-action="toggle"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id)
            const completed = e.target.dataset.completed === 'true'
            toggleTodo(id, completed)
        })
    })
    
    document.querySelectorAll('[data-action="delete"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id)
            deleteTodo(id)
        })
    })
}

function showStatus(message, type) {
    const status = document.getElementById('status')
    status.textContent = message
    status.className = `status ${type} show`
    setTimeout(() => status.classList.remove('show'), 3000)
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('App startet!')
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    
    const addButton = document.getElementById('addButton')
    if (addButton) addButton.addEventListener('click', addTodo)
    
    const todoInput = document.getElementById('todoInput')
    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo()
        })
    }
    
    getTodos()
})
