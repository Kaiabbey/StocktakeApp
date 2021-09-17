<?php
include "./connection.php";
include "./validation.php";
session_name();
session_start();
header('Content-type: application/json');
//function to check origin whitelist
//is_correct_origin();

$validation = new validation;

$validation->validatePost();
$validation->validateGet();

$resp_code = 504;
$resp_body = array('internal server error' => false);

$_SESSION['newtime'] = time();

//the two functions below control rate limiting; the passed int is how many requests users can do within a single day/second
dayratelimit(1000);
secondratelimit(5);

$dbfunctions = new dbfunc;
extract($_POST);

//the below switch case checks the Action parameter of the GET headers to control how the api reponds to the request
if(isset($_GET['action'])){
    switch ($_GET['action']){
        case 'isloggedin':
            if(isloggedin()){
                $resp_code = 201;
                $resp_body = array('isloggedin' => true);
            }
            else{
                $resp_code = 400;
                $resp_body = array('isloggedin' => false);
            }
            break;
        case 'login':
            if( $dbfunctions->login($email, $password)){
                $resp_code = 201;
                $resp_body = array( 'loggedin' => true);
            }
            else{
                $resp_code = 400;
                $resp_body = array( 'loggedin' => false);
            }
            break;
        case 'logout':
            if(isloggedin()){
                $resp_code = 201;    
                logout($resp_code);
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
            if(isloggedin()){
                if(checkadmin()){
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
            if(isloggedin()){
                $resp_code = 201;
                $resp_body = $dbfunctions->fetchcurrentuser($_SESSION['user_id']);
            }
            else{
                $resp_code = 400;
                $resp_body = array( 'logged in' => false);
            }
            break;
        case 'viewuser':
            if(isloggedin()){
                $resp_code = 201;
                $resp_body = $dbfunctions->fetchcurrentuser($_GET['user_id']);
            }
            else{
                $resp_code = 400;
                $resp_body = array( 'admin' => false);
            }
            break;
        case 'alluser':
            if(isloggedin()){
                if(checkadmin()){
                    $resp_code = 201;
                    $resp_body = $dbfunctions->fetchallusers();
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
            if(isloggedin()){
                if(checkadmin()|| checkuser($_GET['user_id'])){
                    $newresp = $dbfunctions->deleteuser($_GET['user_id']);
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
            if(fullcheck($_GET['user_id'])){
                $newresp = $dbfunctions->edituser();
                $resp_code = $newresp['code'];
                $resp_body = array($newresp['body'] => true);
            }
            else{
                $resp_code = 403;
                $resp_body = array( 'Authorised Editer' => false);
            }
            break;
        case 'addlocation':
            if(isloggedin()){
                $newresp = $dbfunctions->addlocation($_SESSION['user_id']);
                $resp_code = $newresp['code'];
                $resp_body = array($newresp['body'] => true);    
            }
            else{
                $resp_code = 403;
                $resp_body = array( 'loggedin' => false);
            }

            break;
        case 'getlocations':
            if(isloggedin()){
               $newresp = $dbfunctions->getlocations($_SESSION['user_id']);
                $resp_code = 201;
                $resp_body = $newresp; 
            }
            else{
                $resp_code = 403;
                $resp_body = array( 'loggedin' => false);
            }
            
            break;
        case 'getlocationstock':
            if(isloggedin()){
               $resp_body = $dbfunctions->getlocationstock();
                $resp_code = 201; 
            }
            else{
                $resp_code = 403;
                $resp_body = array( 'loggedin' => false);
            }
            
            break;
    }
}

//the below if else tree checks what happned in the api and runs a logging function to track api actions within the database
if($_GET['action'] != 'logout'){
    $newlog = new dbfunc;
    if(isloggedin()){
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

function isloggedin(){
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

function checkadmin(){
    if($_SESSION['role'] == 'admin'){
        return true;
    }
    else{
        return false;
    }
}

function checkuser($id){
    if($_SESSION['user_id'] == $id){
        return true;
    }
    else{
        return false;
    }
}

function fullcheck($id){
    if(isloggedin()){
        if(checkadmin() || checkuser($id)){
            return true;
        }
        else{
            return false;
        }
    }
}

function logout($resp_code){
    $log = new dbfunc;
    $log->logActions($resp_code,session_id(),$_GET['action'],$_SESSION['user_id']);
    $_SESSION['loggedin'] = false;
}

function dayratelimit($limit){
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

function secondratelimit($limit){
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

function is_correct_origin(){
    //HTTP_ORIGIN header
    $origin = $_SERVER["HTTP_REFERER"];
    // Allowed domain names
    $allowed_domains = [
        "http://localhost/php/StocktakeApp/StocktakeMainApplication/"
    ];

    if (in_array($origin, $allowed_domains)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        http_response_code(403);
        echo 'wrong origin';
        die();
    }
}

//the outputs for the API that are sent back to the client for processing, variables are populated in initial switch case
http_response_code($resp_code);
echo json_encode($resp_body);

?>