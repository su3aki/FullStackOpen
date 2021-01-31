require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')
const cors = require('cors')

app.use(express.static('build'))

//PostされたデータをExpressがJSONで処理する
app.use(express.json())

//corsを使ってフロントサイドのservices/note.jsにデータを運ぶ
app.use(cors())



app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)

  response.json(note)
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

//app.getでバックエンドサーバーのルートを設定

app.get('/', (request, response) => {
  response.send('<h1>こんにちわあああ</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

//ルーティングエラーの記述

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


//サーバーのポート設定

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
