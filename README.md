# StocktakeApp

<h1>Setting up development enviroment</h1>

#1 Clone StocktakeApp into your local documents

#2 Copy out the StocktakeAPI into your local php stack

#3 import the stocktakeapp.sql file into your mysql database

#4 Open the Mainapplication folder in visual studio or code editer of your choice

#5 run 'npm install' to download all the required dependencies

#6 check the js.js and app.js they both will have two variables called API, one will be commented out, change the one with localhost in the url to the url of where you put
the StocktakeAPI folder

#7 open the connection.php file in the stocktakeAPI folder and change the database credentials to your Mysql Database login and port this also has one set of details for local
and hosted

#8 run 'npm start' this should open a react server on localhost:3000

<h1>Hosting</h1>

1# change the API variables found in js.js and app.js to the relative links and comment out the localhost variables

#2 in connection change the database credentials to the database hosted on your provider

#3 if any changes were made to the database structure export a new sql file from the database

#4 upload the database to the hosted mysql server

#5 once ready to host run 'npm run build' in the react developement enviroment in Mainstockapplication

#6 create a zip of the build file that is generated in the file structure

#7 create a zip of the StocktakeAPI folder located in the PHP stack

#8 upload both via Cpanel into the root directory of your hosted domain in the public folder

#9 extract both folder from the zips

#10 move all files in the build up one folder from build to the public folder (leave the API folder as is)

#11 if done correctly your domain should provide the website to users

<h1>Testing</h1>

#1 navigate to the 'stocktakepuppet' folder and open a new terminal

#2 install puppeteer using 'npm i puppeteer'

#3 run in terminal 'node Logintest.js' and 'node RegisterTest.js' to do tests on the API

<h1>Functionality</h1>

This Web Application Uses a Barcode and QR scanning to creating stock items for a stock system

Users can create accounts then login to the created accounts

Users can create locations for stock to be added in the future once items have been created

When scanning codes if the code isnt associated with a item for that users it prompts them to create a new item
For that user, when that same code is scanned again a new prompt is shown to add inventory to a location.
Users can select amount they want to change by, then choose if they want add or remove that amount.

in the settings section users can see their details and set options to stay logged in or not,
and what theme they want to use.

<h1>Technologies</h1>

<h3>Fomantic UI</h3>
<p>I'm using Fomantic UI As a CDN to keep it up to date it's run most of my styling on the front end and incorporates interactive elements such as the sidebar</p>

<h3>React</h3>
<p>I'm using the most recent React version to server administration data to better seperate the admin section from the sections for all users</p>

<h3>html5-qrcode</h3>
<p>i'm using a CDN to use the most recent version, i'm using this technology to power my scanning functionality and it integral to my application running</p>

<h3>Bouncer</h3>
<p>I'm using a CDN to import the most recent version of Bouncer. Bouncer is used for my front end validation and error handling on incorrect inputs</p>


<h1>Road Map</h1>

I want to add better functionality for features in regards to stock management and reports, future features can include:
	<p>- Search feature for stock items in locations</p>
	<p>- pre-populating form data when new barcodes are scanned based on data from other users 
	  i.e if one user has a coca cola bottle item with an associated barcode then another user scans the same
	  Barcode it will check the database for items with the same barcode and offer attribute options</p>
	<p>- better integration of errors and popups not using integrated chrome alerts</p>
	<p>- A more custom ui design for the scanner i.e removal of ugly preset elements, animation to show scanning</p>

<h1>In Relation to the plan</h1>
<P> I planned to use 'scandit' library to implement code scanning, but ended up using html5-qrcode library because of it being non-premium, if I were to make this a commerical product, I would potentially look at using 'scandit' or some other premium library for better code scanning</p>
<p>I originally planned to use a public API to reference Barcode information to help pre-populate scanned barcodes with item data, but i found that the API's i tryed using
	were not returning information on barcodes i was referencing and decided to just make all data insertion manual on the users end</p>

<h1>Why Documentation is important</h1>
<p>
	Without the implementation of Help pages, Functionality specification, and a Road Map.
	Future potential developers and users wont have anything to help with interacting with our product
	and knowing what to work on as a developer. this information is crucial for the longevity of a project.
	Other documentation including how to deploy the website and how testing is implemented is important aswell.
</p>
