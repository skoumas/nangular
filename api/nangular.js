var express = require('express');
var filesystem = require("fs");
var sizeOf = require('image-size');
var multer = require('multer');
var app = express();
var dir = "../data/";


var host = "http://localhost";

app.use(multer({ dest: dir}))


app.use(function (req, res, next)
{  
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.get("/", function (req,res)
{
	res.send("API");
});


app.post("/photos/list", function (req,res)
{

 	res.setHeader('Content-Type', 'application/json');
	var results = [];
	
    filesystem.readdirSync(dir).forEach(function(file)
    {
         
        var stat = filesystem.statSync(dir+file);
        if (stat && stat.isDirectory()) 
        {
            results = results.concat(_getAllFilesFromFolder(dir+file))
        } 
        else 
        {
        	if (String(file).substring(file.length, file.length - 3).toLowerCase()=="jpg")
        	{
        		results.push( {filename:file} );
        	}
         
        }

    });

	res.send(JSON.stringify(results));
});


app.post("/photos/list/:id/details", function (req,res)
{

	res.setHeader('Content-Type', 'application/json');

	var id = req.param("id");
	var dimensions = sizeOf(dir + id);
 
	res.send(JSON.stringify(dimensions));

});


 var readAndWriteFile = function(file){
    filesystem.readFile(file.path, function (err, data)
    {

        //Get Timestamp
        var ts = Math.round((new Date()).getTime() / 1000);

        var newPath = dir + "/"+ts+".jpg";
        filesystem.writeFile(newPath, data, function (err)
        {
            filesystem.unlink(req.files.file.path);
            res.send(200);
             
        });
        
    }); 
}

app.post("/photo/upload",  function (req,res)
{

for (var i = 0; i < req.files.length; i++) {    
  readAndWriteFile(files[i]);
}


res.end();
   
	
});
 

app.listen (1337, function()
{
	console.log("ready on port 1337");
});



function Right(str, n){
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
}