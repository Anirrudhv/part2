const express = require('express')
const app = express()
const simplechain = require('./Blockchain')
const bodyParser = require('body-parser')
const Block = require('./Block')

const chain = new simplechain();


app.listen(8000, () => console.log('API listening on port 8000'))
app.use(bodyParser.json())
app.get('/', (req, res) => res.status(404).json({
  "status": 404,
  "message": "Accepted endpoints"
}))

app.get('/block/:height', async (req, res) => {
  try {

    const response = await chain.getBlock(req.params.height)
    res.send(response)
  } catch (error) {
    res.status(404).json({
      "status": 404,
      "message": "Block not found"
    })
  }
})


app.post('/block', async (req, res) => {
  console.log(req.body)
  if (req.body.body === '' || req.body.body === undefined)
   {
    res.status(400).json({
      "status": 400,
      message: "Test block"
    })
  }

  await chain.addBlock(new Block(req.body.body))
  const height = await chain.getBlockHeight()
  const response = await chain.getBlock(height)

  res.status(201).send(response)
})
