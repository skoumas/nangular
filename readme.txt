Photo Managment Apllication using AngularJS and NodeJs.
George Papanikolaou 2014
www.skoumas.com


Features
================================
- Built into SAP framework.
- Uploads images via nodeJS server.
- Shows list of uploaded pictures.

Instructions
================================
- Place the folder nangular into your localhost server.
- Under the api folder execute the run.bat file to start the node server at port 1337.
- Run the application from your localhost


File Stucture
================================
/
  /api
    /node_modules
    nangular.js
    run.bat * Execute script that starts the nangular node
  /data *Photos are uploaded here by a unique name
  /media
    /css
    bootstrap.css
    nangular.css
    /js
    angular-min.js
    angular-animate.js
    angular-file-upload.js
    FileAPI.flash.swf
    FileApi.min.js
    ui-bootstrap-tpls-0.12.0.min.js
    upload.js
  /pages
    /directives
      photothumb.html
    about.html
    error.html
    myPhotos.html
    upload.html
index.html
nangular.js
readme.txt
upload.html


API calls
================================
The Node API can be called using the following routes.

Route: photos/list
Attributes:
Function: Lists all the photos from the data folder 

Route: photos/list/:id/details
Attributes: ID: The name of the image 
Function: Returns an array containing the dimensions of the image

Route: photos/list/:id/details
Attributes: Multipart Form Data 
Function: Uploads the image into the /data folder 


Dependencies
================================
- AngularJS and NgRoute.
- NodeJS.
- Angular-File-Upload
- angular-ui/bootstrap 
- localhost Server


Node Modules
================================
- express
- fs
- image-size
- multer

About
================================
Developed by George Papanikolaou
www.skoumas.com