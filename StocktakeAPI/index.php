<?php
include "./connection.php";
include "./validation.php";
session_name();
session_start();
header('Content-type: application/json');
//test header for local accesss
header("Access-Control-Allow-Origin: http://localhost:3000");
//header for live website
//header("Access-Control-Allow-Origin: https://kaiabbey.work");

header("Access-Control-Allow-Credentials: true");
//isCorrectOrigin();

$validation = new validation;

$validation->validatePost();
$validation->validateGet();

$resp_code = 504;
$resp_body = array('internal server error' => false);

$_SESSION['newtime'] = time();

//the two functions below control rate limiting; the passed int is how many requests users can do within a single day/second
dayRateLimit(10000);
secondRateLimit(5);

$dbfunctions = new dbFunc;

//the below switch case checks the Action parameter of the GET headers to control how the api reponds to the request
if(isset($_GET['action'])){
    switch ($_GET['action']){
        case 'isloggedin':
            if(isLoggedIn()){
                $resp_code = 201;
                $resp_body = array('isLoggedIn' => true);
            }
            else{
                $resp_code = 400;
                $resp_body = array('isLoggedIn' => false);
            }
            break;
        case 'login':
            if( $dbfunctions->login()){
                $resp_code = 201;
                $resp_body = array( 'loggedin' => true);
            }
            else{
                $resp_code = 400;
                $resp_body = array( 'loggedin' => false);
            }
            break;
        case 'logout':
            if(isLoggedIn()){
                $resp_code = 201;    
                logOut($resp_code);
                $resp_body = array( 'logout' => true);
            }      
            else{
                $resp_code = 400;
                $resp_body = array('logout' => false);
            }

            break;
        case 'register':
            $newresp = $dbfunctions->registerUser();
            $resp_code = $newresp['code'];
            $resp_body = array($newresp['body'] => true);
            break;
        case 'checkadmin':
            if(isLoggedIn()){
                if(checkAdmin()){
                    $resp_code = 201;
                    $resp_body = array( 'admin' => true);
                }
                else{
                    $resp_code = 400;
                    $resp_body = array( 'admin' => false);
                }
            }
            else{
                $resp_code = 400;
                $resp_body = array('admin' => false);
            }
            break;
        case 'currentuser':
            if(isLoggedIn()){
                $resp_code = 201;
                $resp_body = $dbfunctions->fetchCurrentUser($_SESSION['user_id']);
            }
            else{
                $resp_code = 400;
                $resp_body = array( 'logged in' => false);
            }
            break;
        case 'viewuser':
            if(isLoggedIn()){
                $resp_code = 201;
                $resp_body = $dbfunctions->fetchCurrentUser($_GET['user_id']);
            }
            else{
                $resp_code = 400;
                $resp_body = array( 'admin' => false);
            }
            break;
        case 'alluser':
            if(isLoggedIn()){
                if(checkAdmin()){
                    $resp_code = 201;
                    $resp_body = $dbfunctions->fetchAllUsers();
                }
                else{
                    $resp_code = 400;
                    $resp_body = array( 'admin' => false);
                }
            }
            else{
                $resp_code = 400;
                $resp_body = array( 'admin' => false);
            }
            break;
        case 'deleteuser':
            if(isLoggedIn()){
                if(checkAdmin()|| checkUser($_GET['user_id'])){
                    $newresp = $dbfunctions->deleteUser($_GET['user_id']);
                    $resp_code = $newresp['code'];
                    $resp_body = array( 'delete' => $newresp['body']);
                }
            }
            else{
                $resp_code = 403;
                $resp_body = array( 'delete' => false);
            }
            break;
        case 'edituser':
            if(fullCheck($_GET['user_id'])){
                $newresp = $dbfunctions->editUser();
                $resp_code = $newresp['code'];
                $resp_body = array($newresp['body'] => true);
            }
            else{
                $resp_code = 403;
                $resp_body = array( 'Authorised Editer' => false);
            }
            break;
        case 'addlocation':
            if(isLoggedIn()){
                $newresp = $dbfunctions->addLocation($_SESSION['user_id']);
                $resp_code = $newresp['code'];
                $resp_body = array($newresp['body'] => true);    
            }
            else{
                $resp_code = 403;
                $resp_body = array( 'loggedin' => false);
            }

            break;
        case 'getlocations':
            if(isLoggedIn()){
                $newresp = $dbfunctions->getLocations($_SESSION['user_id']);
                $resp_code = 201;
                $resp_body = $newresp; 
            }
            else{
                $resp_code = 403;
                $resp_body = array( 'loggedin' => false);
            }
            
            break;
        case 'getlocationstock':
            if(isLoggedIn()){
                $resp_body = $dbfunctions->getLocationStock();
                $resp_code = 201; 
            }
            else{
                $resp_code = 403;
                $resp_body = array( 'loggedin' => false);
            }
            
            break;
        case 'new_stock_object':
            if(isLoggedIn()){
                $newresp = $dbfunctions->createNewStockObject($_SESSION['user_id']);
                $resp_code = $newresp['code'];
                $resp_body = $newresp['body'];
            }
            break;
        case 'getstockobjects':
            if(isLoggedIn()){
                $resp_body = $dbfunctions->getStockObjects($_SESSION['user_id']);
                $resp_code = 201;
            }
            else{
                $resp_code = 403;
                $resp_body = array( 'loggedin' => false);
            }
            break;
        case 'getstockobject':
            if(isset($_GET['barcode'])){
                if(isLoggedIn()){
                    $resp_body = $dbfunctions->getStockObject($_SESSION['user_id']);
                    $resp_code = 201;
                }
                else{
                    $resp_code = 403;
                    $resp_body = array( 'loggedin' => false);
                }
            }
            else{
                $resp_code = 401;
                $resp_body = array( 'barcode' => false);
            }
            break;
        case 'deletestockobject':
            if(isLoggedIn()){
                $resp_body = $dbfunctions->deleteStockObject($_SESSION['user_id']);
                $resp_code = 201;
            }
            else{
                $resp_code = 401;
                $resp_body = array( 'deleted' => false);
            }
            break;
        case 'checkbarcode':
            if(isLoggedIn()){
                $barcode = $dbfunctions->checkBarcode($_SESSION['user_id']);
                if($barcode == true){
                    $resp_code = 201;
                    $resp_body = true;
                }
                else{
                    $resp_code = 204;
                    $resp_body = false;
                }
            }
            else{
                $resp_code = 403;
                $resp_body = array('loggedin' => false);
            } 
            break;
        case 'changeStock':
            if(isLoggedIn()){
                $newresp = $dbfunctions->changeStock($_SESSION['user_id']);
                $resp_code = $newresp['code'];
                $resp_body = $newresp['body'];
            }
            else{
                $resp_code = 403;
                $resp_body = array('loggedin' => false);
            }
            Break;
    }
}

//the below if else tree checks what happned in the api and runs a logging function to track api actions within the database
if($_GET['action'] != 'logout'){
    $newlog = new dbfunc;
    if(isLoggedIn()){
        if(isset($_GET['action'])){
            $newlog->logActions($resp_code,session_id(),$_GET['action'],$_SESSION['user_id']);
        }
        else{
            $newlog->logActions($resp_code,session_id(),'NO ACTION',$_SESSION['user_id']);
        }
    }
    else{
        if(isset($_GET['action'])){
            switch($_GET['action']){
                case 'register':
                    $newlog->logActions($resp_code,session_id(),$_GET['action'],$_SESSION['user_id']);
                    break;
                default:
                $newlog->logActions($resp_code,session_id(),$_GET['action'],'0');
            }
        }
        else{
            $newlog->logActions($resp_code,session_id(),'NO ACTION','0');
        }
    }
}

//below is the definitions of the functions that are called in the main logic of the api

function isLoggedIn(){
    if(isset($_SESSION['loggedin'])){
        if($_SESSION['loggedin'] == true){
        return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}

function checkAdmin(){
    if($_SESSION['role'] == 'admin'){
        return true;
    }
    else{
        return false;
    }
}

function checkUser($id){
    if($_SESSION['user_id'] == $id){
        return true;
    }
    else{
        return false;
    }
}

function fullCheck($id){
    if(isLoggedIn()){
        if(checkAdmin() || checkUser($id)){
            return true;
        }
        else{
            return false;
        }
    }
}

function logOut($resp_code){
    $log = new dbfunc;
    $log->logActions($resp_code,session_id(),$_GET['action'],$_SESSION['user_id']);
    $_SESSION['loggedin'] = false;
}

function dayRateLimit($limit){
    //checks if an initial visit time variable has been initialised, and creates one if it hasn't
    if(isset($_SESSION['lastTime']) == false){
        $_SESSION['lastTime'] = time();
        $_SESSION['Bucket'] = 0;
    }
    else{
        // takes the subtraction of current time and the initial visit variable to create time since initial visit
        $timeElapsed = $_SESSION['newtime'] - $_SESSION['lastTime'];
        //if the $timeElapsed variable has a value in seconds greater than seconds in a day the initial visit is set to current time and the bucket is emptied, reseting the rate limit process
        if($timeElapsed > 86400){
            $_SESSION['lastTime'] = time();
            $_SESSION['Bucket'] = 0;
        }
        // if it's been less than a day it then checks the bucket to see if the API has been requested less than a set amount of times in a day
        else if($_SESSION['Bucket'] >= $limit){
            http_response_code(429);
            echo 'Too many requests today';
            die();
        }
        //if the API is under the rate limit it then increments the bucket up by one step then allows the API to run as normal
        else{
            $_SESSION['Bucket'] = $_SESSION['Bucket'] + 1;
        }
    }
}

function secondRateLimit($limit){
    if(isset($_SESSION['secondlastTime']) == false){
        $_SESSION['secondlastTime'] = time();
        $_SESSION['secondBucket'] = 0;
    }
    else{
        if($_SESSION['newtime'] > $_SESSION['secondlastTime']){
            $_SESSION['secondlastTime'] = time();
            $_SESSION['secondBucket'] = 0;
        }
        else if($_SESSION['secondBucket'] >= $limit){
            http_response_code(429);
            echo 'Too many requests per second';
            die();
        }
        else{
            $_SESSION['secondBucket'] = $_SESSION['secondBucket'] + 1;
        }
    }
}

function isCorrectOrigin(){
    //HTTP_ORIGIN header
    $origin = $_SERVER["HTTP_ORIGIN"];
    // Allowed domain names
    $allowed_domains = [
        "http://localhost:3000",
        "https://kaiabbey.work"
    ];

    if (in_array($origin, $allowed_domains)) {
        //header("Access-Control-Allow-Origin: http://localhost:3000");
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        http_response_code(403);
        echo 'wrong origin!';
        die();
    }
}

//the outputs for the API that are sent back to the client for processing, variables are populated in initial switch case
http_response_code($resp_code);
echo json_encode($resp_body);

?>