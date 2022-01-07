//jshint esversion:6
const express = require("express");
const app = express();
const port = 3000;
const https = require("https");
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}));
app.listen(port,function(){
  console.log("Connected to Port " + port);
})
app.get("/",function(request,response){
  response.sendFile(__dirname + "/index.html");
  console.log("html loaded")
});
app.post("/", function(req,res){
  var city = req.body.city;
  const apiKey = " "; //api key hidden
  const units = req.body.units
  console.log(req.body.units)
  var url = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid="+ apiKey +"&units=" + units + "&lang=en";
  https.get(url , function(resOfApi){//must use full url with https:
    console.log(resOfApi.statusCode);
    resOfApi.on("data",function(data){
      const weatherData = JSON.parse(data); //Parse hexadecimal data into JSON objects. Similarly JSON.stringify(object) will js object -> flatpack string
      console.log(weatherData);
      if (weatherData.name != undefined){
      const location = weatherData.name;
      const weather = weatherData.weather[0].description;
      const temp = weatherData.main.temp;
      const icon = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png"; //weather[0].icon
      if (units == "standard"){
        tempUnits = "Kelvin"
      }else if (units =="imperial"){
        tempUnits = "Farenheit"
      }else if (units=="metric"){
        tempUnits = "degrees Celsius"
      }
      res.write("<p>The weather in <strong>"+location+"</strong> is <strong>"+weather+"</strong>, temperature is <strong>"+temp+"</strong> "+ tempUnits + ".</p>");
      res.write("<img src="+icon+">");
      res.send()
      }else{
        res.send("<h2>404 City not found.</h2>")
      }
      
  });
        });
});

