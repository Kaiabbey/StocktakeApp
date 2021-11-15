# StocktakeApp

<h1>Installing website</h1>

#1 clone directly into WWW folder or folder for your localhost stack

#2 create database called 'stocktakeapp' import stocktakeapp.sql file into new database

#3 open the connection.php file in StocktakeAPI and change to the $user_name and $password variables to your database's login



<h1>Testing</h1>

#5 navigate to the 'stocktakepuppet' folder and open a new terminal

#6 install puppeteer using 'npm i puppeteer'

#7 run in terminal 'node Logintest.js' and 'node RegisterTest.js' to do tests on the API

<h1>Functionality</h1>

This Web Application Uses a Barcode and QR scanning to creating stock items for a stock system

Users can create accounts then login to the created accounts

Users can create locations for stock to be added in the future once items have been created

When scanning codes if the code isnt associated with a item for that users it prompts them to create a new item
For that user, when that same code is scanned again a new prompt is shown to add inventory to a location.
Users can select amount they want to change by, then choose if they want add or remove that amount.

in the settings section users can see their details and set options to stay logged in or not,
and what theme they want to use.

<h1>Road Map</h1>

I want to add better functionality for features in regards to stock management and reports, future features can include:
	<p>- Search feature for stock items in locations</p>
	- pre-populating form data when new barcodes are scanned based on data from other users 
	  i.e if one user has a coca cola bottle item with an associated barcode then another user scans the same
	  Barcode it will check the database for items with the same barcode and offer attribute options
	- better integration of errors and popups not using integrated chrome alerts
	- A more custom ui design for the scanner i.e removal of ugly preset elements, animation to show scanning


<h2>Why Documentation is important</h2>
<p>
	Without the implementation of Help pages, Functionality specification, and a Road Map.
	Future potential developers and users wont have anything to help with interacting with our product
	and knowing what to work on as a developer. this information is crucial for the longevity of a project.
	Other documentation including how to deploy the website and how testing is implemented is important aswell.
</p>
