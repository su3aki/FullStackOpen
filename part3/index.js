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

//ID生成
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

//MongoDBに記録

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: '記述内容が存在しません' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
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

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

//ルーティングエラーの記述

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'このURLに関連するデータが紐付けされていません' })
}
app.use(unknownEndpoint)


//サーバーのポート設定

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
