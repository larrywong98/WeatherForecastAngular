const express = require('express');
const cors = require('cors'); 
const fetch=require('node-fetch')
const app = express();
app.use(cors());
var latitude;
var longtitude;
const axios = require('axios');
// const twitter=require('twit');
// const apiclient=new twitter({
//   consumer_key:''
// })

app.get('/', (req, res) => {
  latitude=req.query.latitude;
  longtitude=req.query.longtitude;
  const url = 'https://api.tomorrow.io/v4/timelines?units=metric&timesteps=1d&timezone=America/Los_Angeles&apikey=Qtv3sPp1ZYbDY2h1Q4Uri4Fmi2MBBi9f'+
              '&location='+latitude+','+longtitude+'&fields=temperature&fields=humidity&fields=windSpeed'+
              '&fields=visibility&fields=temperatureMin&fields=temperatureMax&fields=weatherCode&fields=sunriseTime'+
              '&fields=sunsetTime&fields=precipitationProbability&fields=precipitationType&&fields=cloudCover';
    
  const options = {method: 'GET', headers: {Accept: 'application/json'}};
  fetch(url, options)
    .then(result => result.json())
    .then(resultjson => res.json(resultjson));
    // .then(resultjson => console.log(resultjson));
    
});



app.get('/autocomplete', (req, res) => {
  // console.log(req.query.inputText+'"')
  const url1='https://maps.googleapis.com/maps/api/place/autocomplete/json'+
  '?input='+req.query.inputText+
  // '&location=37.76999%2C-122.44696'+
  // '&radius=500'+
  '&types=(cities)'+
  '&key=AIzaSyD9BnEyrsA8HgeAJcisPy7Qkege1nFpltM';
 

  axios({
    method: 'get',
    url: url1,
    headers: {Accept: 'application/json'},
    // responseType: 'json'
  })
  .then(function (response) {
    // console.log(response.data);
    res.json(response.data);
  });

});
app.get('/weathermeteogram', (req, res) => {
  latitude=req.query.latitude;
  longtitude=req.query.longtitude;
  const url = 'https://api.tomorrow.io/v4/timelines?units=metric&timesteps=1h&timezone=America/Los_Angeles&apikey=Qtv3sPp1ZYbDY2h1Q4Uri4Fmi2MBBi9f'+
              '&location='+latitude+','+longtitude+'&fields=temperature&fields=humidity'+
              '&fields=pressureSeaLevel&fields=windSpeed&fields=windDirection';
    
  const options = {method: 'GET', headers: {Accept: 'application/json'}};
  fetch(url, options)
    .then(result => result.json())
    .then(resultjson => res.json(resultjson));
    // .then(resultjson => console.log(resultjson));

});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});