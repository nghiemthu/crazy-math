var bodyParser = require('body-parser');
var express =require('express');
var app =express();
var fs =require('fs');

var data = fs.readFileSync('points.json');
var points =JSON.parse(data);
 
app.set("view engine", "ejs");
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
    "use strict";
    // We need the following as you'll run HTML+JS+Ajax+jQuery on http://localhost, 
    // but service is taken from http://protoNNN.haaga-helia.fi (NNN is some number)
    // https://www.w3.org/TR/cors/#access-control-allow-origin-response-header
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.put("/:name/:point", sendPoint);
function sendPoint(req, res){
	var data = req.params;
	var name = data.name;
	var point = Number(data.point);
	
	points.shift();
	points.push({"name":name, "point": point});
	fs.writeFile("points.json",JSON.stringify(points), finished);
	res.send(points);
};

app.post("/create", function(req, res){

    var data = req.body;
	var name = data.name;
	var point = Number(data.point);
    
    points.shift();
	points.push({"name":name, "point": point});
	fs.writeFile("points.json",JSON.stringify(points), finished);
    res.send("Post");
});

function finished(err){
	if(err){
		console.log(err);
	};
};

app.get("/get", getPoint);
function getPoint(req, res){
	res.send(points);
}

app.get("/*", function(req, res){
    res.render('index');
});



// Start server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server stated!");
});

