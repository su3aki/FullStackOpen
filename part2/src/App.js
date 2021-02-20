import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import NoteForm from './components/NoteForm'
import LoginForm from './components/LoginForm'
import noteService from './services/notes'
import loginService from './services/login'
import Togglable from './components/Togglable'
import Footer from './components/Footer'
import './index.css'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

//ここでJsonサーバーからデータを受け取る
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])


  //投稿をjason DBに記録
  const addNote = (noteObject) => {
    //ここで新しいノートオブジェクトを設定
    noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
    })
  }

//重要パラメータの変更ボタンの動作
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
  })
  .catch(error => {
    setErrorMessage(
        `Note '${note.content}' was already removed from server`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  })
}
//ログイン機構
const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username, password,
    })
    window.localStorage.setItem(
      'loggedNoteappUser', JSON.stringify(user)
    )
    noteService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
  } catch (exception) {
    setErrorMessage('Wrong credentials')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
  console.log('logging in with', username, password)
}

//エラーメッセージ
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error">
        {message}
      </div>
    )
  }
  //ログインフォーム
  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
        />
    </Togglable>
  )
  //ノートフォーム
  const noteForm = () => (
    <Togglable buttonLabel='new note'>
      <NoteForm createNote={addNote} />
    </Togglable>
  )
  //重要項目だけ表示するか選択
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  //条件付きレンダリングの一貫　
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {/* 条件分岐：ユーザーデータを持っていなければログインフォームを呼ぶ */}
      {user === null ?
      loginForm() :
      <div>
        <p>{user.name} ログインしました</p>
        {noteForm()}
      </div>
      }
      <h2>Notes</h2>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? '神' : '全部' }
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) =>
          <Note
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <Footer />
    </div>
  )
}

export default App
