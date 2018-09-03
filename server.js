const express = require('express')
const app = express()

app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
})

// particlesJS.load('particles-js', 'public/particles.json', function() {
//   console.log('callback - particles.js config loaded');
// });

app.listen(3000, function(){
  console.log('Example app listening on port 3000!')
})
