// ==========================================
// SUPABASE KONFIGURASJON
// ==========================================
const SUPABASE_URL = 'https://cgdissrzxzywdldhhlhp.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZGlzc3J6eHp5d2RsZGhobGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTIxNzIsImV4cCI6MjA4NjIyODE3Mn0.p9E4m8CPv1jzqItXCTJyxJcx3bQYHm7IZZC0EP9vsg4'

// Opprett Supabase klient (vil bli initialisert etter DOM er lastet)
let supabase

// ==========================================
// TABELLNAVN - Endre dette til din tabell
// ==========================================
const TABLE_NAME = 'todos'  // Navn på tabellen du lager i Supabase

// ==========================================
// CRUD FUNKSJONER
// ==========================================

// Hent alle todos fra Supabase (READ)
function getTodos() {
    return supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
            if (error) throw error
            displayTodos(data)
            showStatus('Todos lastet inn!', 'success')
        })
        .catch(error => {
            console.error('Feil ved henting av todos:', error)
            showStatus('Feil ved lasting av todos: ' + error.message, 'error')
        })
}

// Legg til ny todo i Supabase (CREATE)
function addTodo() {
    const input = document.getElementById('todoInput')
    const todoText = input.value.trim()

    if (!todoText) {
        showStatus('Skriv inn en oppgave!', 'error')
        return
    }

    supabase
        .from(TABLE_NAME)
        .insert([
            {
                title: todoText,
                completed: false
            }
        ])
        .select()
        .then(({ data, error }) => {
            if (error) throw error
            input.value = ''
            return getTodos()
        })
        .then(() => {
            showStatus('Todo lagt til!', 'success')
        })
        .catch(error => {
            console.error('Feil ved legging til av todo:', error)
            showStatus('Feil ved legging til: ' + error.message, 'error')
        })
}

// Oppdater todo status i Supabase (UPDATE)
function toggleTodo(id, currentStatus) {
    supabase
        .from(TABLE_NAME)
        .update({ completed: !currentStatus })
        .eq('id', id)
        .select()
        .then(({ data, error }) => {
            if (error) throw error
            return getTodos()
        })
        .then(() => {
            showStatus('Todo oppdatert!', 'success')
        })
        .catch(error => {
            console.error('Feil ved oppdatering av todo:', error)
            showStatus('Feil ved oppdatering: ' + error.message, 'error')
        })
}

// Slett todo fra Supabase (DELETE)
function deleteTodo(id) {
    if (!confirm('Er du sikker på at du vil slette denne oppgaven?')) {
        return
    }

    supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id)
        .then(({ data, error }) => {
            if (error) throw error
            return getTodos()
        })
        .then(() => {
            showStatus('Todo slettet!', 'success')
        })
        .catch(error => {
            console.error('Feil ved sletting av todo:', error)
            showStatus('Feil ved sletting: ' + error.message, 'error')
        })
}

// ==========================================
// UI FUNKSJONER
// ==========================================

// Vis todos i UI
function displayTodos(todos) {
    const todoList = document.getElementById('todoList')

    if (!todos || todos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <p>🎉 Ingen oppgaver!</p>
                <small>Legg til en oppgave for å komme i gang</small>
            </div>
        `
        return
    }

    todoList.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <input
                type="checkbox"
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id}, ${todo.completed})"
            >
            <span>${todo.title}</span>
            <button onclick="deleteTodo(${todo.id})">Slett</button>
        </div>
    `).join('')
}

// Vis status melding
function showStatus(message, type) {
    const status = document.getElementById('status')
    status.textContent = message
    status.className = `status ${type} show`

    setTimeout(() => {
        status.classList.remove('show')
    }, 3000)
}

// ==========================================
// GJØR FUNKSJONER TILGJENGELIGE GLOBALT
// ==========================================
window.addTodo = addTodo
window.toggleTodo = toggleTodo
window.deleteTodo = deleteTodo
window.getTodos = getTodos

// ==========================================
// INITIALISERING
// ==========================================

// Last inn todos når siden lastes
window.addEventListener('DOMContentLoaded', () => {
    console.log('App startet!')
    console.log('Supabase URL:', SUPABASE_URL)
    console.log('Tabellnavn:', TABLE_NAME)

    // Initialiser Supabase klient
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

    // Sjekk om Supabase er konfigurert
    if (SUPABASE_URL === 'DIN_SUPABASE_URL_HER' || SUPABASE_KEY === 'DIN_SUPABASE_ANON_KEY_HER') {
        showStatus('⚠️ Vennligst konfigurer Supabase URL og KEY i app.js', 'error')
        document.getElementById('todoList').innerHTML = `
            <div class="empty-state">
                <p>⚙️ Supabase ikke konfigurert</p>
                <small>Åpne app.js og legg inn dine Supabase credentials</small>
            </div>
        `
    } else {
        getTodos()
    }
})
