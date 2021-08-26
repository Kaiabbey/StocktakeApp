<?php
include "./connection.php";
session_name();
session_start();
header('Content-type: application/json');

$resp_code = 504;
$resp_body = array('internal server error' => false);

$_SESSION['newtime'] = time();

if(isset($_SESSION['lastTime']) == false){
    $_SESSION['lastTime'] = time();
    $_SESSION['Bucket'] = 0;
}
else{
    $timeElapsed = $_SESSION['newtime'] - $_SESSION['lastTime'];
    if($timeElapsed > 60){
        $_SESSION['lastTime'] = time();
        $_SESSION['Bucket'] = 0;
    }

    if($_SESSION['Bucket'] >= 20){
        http_response_code(429);
        die();
    }
    else{
        $_SESSION['Bucket'] = $_SESSION['Bucket'] + 1;
    }
}

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
            if( login()){
                $resp_code = 201;
                $resp_body = array( 'loggedin' => true);
            }
            else{
                $resp_code = 400;
                $resp_body = array( 'loggedin' => false);
            }
            break;
        case 'logout':
            logout();
            $resp_code = 201;
            $resp_body = array( 'logout' => true);
            break;
        case 'register':
            $newresp = registerUser();
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
            break;
        case 'currentuser':
            if(isloggedin()){
                $resp_code = 201;
                $resp_body = fetchcurrentuser($_SESSION['user_id']);
            }
            else{
                $resp_code = 400;
                $resp_body = array( 'admin' => false);
            }
            break;
        case 'edituser':
            if(isloggedin()){
                $resp_code = 201;
                $resp_body = fetchcurrentuser($_GET['user_id']);
            }
            else{
                $resp_code = 400;
                $resp_body = array( 'admin' => false);
            }
            break;
        case 'alluser':
            if(isloggedin()){
                $resp_code = 201;
                $resp_body = fetchallusers();
            }
            else{
                $resp_code = 400;
                $resp_body = array( 'admin' => false);
            }
            break;    
    }
}

if($_GET['action'] != 'logout'){
    if(isloggedin()){
        if(isset($_GET['action'])){
            logActions($resp_code,session_id(),$_GET['action'],$_SESSION['user_id']);
        }
        else{
            logActions($resp_code,session_id(),'NO ACTION',$_SESSION['user_id']);
        }
    }
    else{
        if(isset($_GET['action'])){
            switch($_GET['action']){
                case 'register':
                    logActions($resp_code,session_id(),$_GET['action'],$_SESSION['user_id']);
                    break;
                default:
                logActions($resp_code,session_id(),$_GET['action'],'0');
            }
        }
        else{
            logActions($resp_code,session_id(),'NO ACTION','0');
        }
    }
}

function login(){
    extract($_POST);
    $conn = new connection;
    $pdo = $conn->connectdb();
    $query = "SELECT * FROM users WHERE email = :em";
    $stmt = $pdo->prepare($query);
    $stmt->bindparam(":em",$email);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $stored_hashed_password = $row['password'];
    if(password_verify($password, $stored_hashed_password)){
        $_SESSION['loggedin'] = true;
        $_SESSION['user_id'] = $row['user_id'];
        $_SESSION['role'] = $row['role'];
        return true;
    }
    else{
        return false;
    }
}

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

function logout(){
    logActions($resp_code,session_id(),$_GET['action'],$_SESSION['user_id']);
    session_unset();
    session_destroy();
}

function fetchcurrentuser($user){
    $conn = new connection;
    $pdo = $conn->connectdb();
    $query = "SELECT * FROM users WHERE user_id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->bindparam(":id",$user);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row;
}

function fetchallusers(){
    $conn = new connection;
    $pdo = $conn->connectdb();
    $query = "SELECT `firstname`, `lastname`, `email`, `user_id` FROM users";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $table = $stmt->fetchall(PDO::FETCH_ASSOC);
    return $table;
}

function registerUser(){
    $conn = new connection;
    $pdo = $conn->connectdb();
    extract($_POST);
    if($email == ''|| $firstname == ''|| $lastname == ''|| $password == ''){
        $resp = array( 'code' => 401, 'body' => 'Empty credentials');
        return $resp;
    }
    else{
        $query1 = 'SELECT COUNT(*) FROM users WHERE email=:em';
        $stmt1 = $pdo->prepare($query1);
        $stmt1->bindParam(":em",$email);
        $stmt1->execute();
        $ct = $stmt1->fetchColumn();
        if($ct == 0){
            $hashed_password = password_hash($password,PASSWORD_DEFAULT);
            $query = "INSERT into users(`firstname`, `lastname`, `email`, `password`) values(:fn,:ln,:em,:pwd)";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(":em", $email);
            $stmt->bindParam(":fn", $firstname);
            $stmt->bindParam(":ln", $lastname);
            $stmt->bindParam(":pwd",$hashed_password);
            $stmt->execute() or die($resp = array( 'code' => 500, 'body' => 'insertfail'));
            $last_id = $pdo->lastInsertId();
            $_SESSION['user_id'] = $last_id;
            $resp = array( 'code' => 201, 'body' => 'userRegistered');
            return $resp;
        }
        else{
            $resp = array( 'code' => 400, 'body' => 'userExists');
            $_SESSION['user_id'] = 0;
            return $resp;
        }
    }
}

function logActions($response,$session,$action,$user = 0){
    $conn = new connection;
    $pdo = $conn->connectdb();
    $query = "INSERT into `logs`(`session_name`,`user_id`,`action`,`response`) values(:si,:ui,:ac,:re)";
    $stmt = $pdo->prepare($query);
    $stmt->bindparam(":si",$session);
    $stmt->bindparam(":ui",$user);
    $stmt->bindparam(":ac",$action);
    $stmt->bindparam(":re",$response);
    $stmt->execute();
}

http_response_code($resp_code);
echo json_encode($resp_body);

?>