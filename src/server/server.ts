import app from './app'

const port = process.env.PORT || 3100
const host = process.env.HOST || 'localhost'

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`)
})
