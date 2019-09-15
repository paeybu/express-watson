var express = require('express')
var cors = require('cors')
var app = express()
var axios = require('axios')
var btoa = require('btoa')

app.use(cors())

const port = process.env.PORT || 5000

app.listen(port)
// Get token
app.get('/api/token', async (req, res) => {
  try {
    const data = await axios.post(
      `https://iam.cloud.ibm.com/identity/token?apikey=7N-gvDt3YpqS3PTqs-y8oDOKcbvZ7Sf6LK8XyUFIWvVl&grant_type=urn:ibm:params:oauth:grant-type:apikey`,
      null,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        }
      }
    )
    res.send(data.data)
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})
// Synthesize
app.get('/api/synthesize', async (req, res) => {
  try {
    const data = await axios.post(
      `https://gateway-tok.watsonplatform.net/text-to-speech/api/v1/synthesize?accept=audio/ogg?voice=${req.query.voice}`,
      {
        text: req.query.text,
        access_token: req.query.access_token
      },
      {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${req.query.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    res.send(btoa(String.fromCharCode.apply(null, new Uint8Array(data.data))))
  } catch (err) {
    res.send(err)
  }
})
console.log('Server running on port %d', port)
