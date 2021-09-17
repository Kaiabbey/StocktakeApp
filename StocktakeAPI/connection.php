<?php
class connection{

    private $pdo;

    // the main function for connecing our model and controls to the database
    public function connectdb(){
        $dsn = 'mysql:dbname=stocktakeapp;host=localhost;port=3306;';
        $user_name = 'root';
        $password = '';
        try{
            $pdo = new pdo($dsn,$user_name,$password);
            return $pdo;
        }
        catch(PDOExecption $e){
            header('location:../index.php?msg=Database_err'.$e->getMessage());
        }
    }
}

class dbfunc{

    function login($email, $password){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = "SELECT * FROM users WHERE email = :em";
        $stmt = $pdo->prepare($query);
        $stmt->bindparam(":em",$email);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if(isset($row['password'])){
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
        else{
            return false;
        }
    }

    function edituser(){
        extract($_POST);
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = "UPDATE users SET email = :em, firstname = :fn, lastname = :ln WHERE user_id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":em", $email);
        $stmt->bindParam(":fn", $firstname);
        $stmt->bindParam(":ln", $lastname);
        $stmt->bindParam(":id", $_GET['user_id']);
        $stmt->execute();
        $resp = array('code' => 201, 'body' => 'User edited');
        return $resp;
    }

    function fetchcurrentuser($user){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = "SELECT `datecreated`,`email`,`firstname`,`lastname`,`user_id` FROM users WHERE user_id = :id";
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

    function deleteuser($id){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query1 = 'SELECT * FROM users WHERE `user_id`=:id';
        $stmt1 = $pdo->prepare($query1);
        $stmt1->bindParam(":id",$id);
        $stmt1->execute();
        $row1 = $stmt1->fetch(PDO::FETCH_ASSOC);
        if($row1['role'] == 'admin'){
            $query2 = 'SELECT * FROM users WHERE `role`= admin';
            $stmt2 = $pdo->prepare($query1);
            $stmt2->execute();
            $row2 = $stmt2->fetch(PDO::FETCH_ASSOC);
            if($row2['role'] > 1){
                $query = "DELETE FROM `users` WHERE `user_id` = :id";
                $stmt = $pdo->prepare($query);
                $stmt->bindparam(":id", $id);
                $stmt->execute();
                $resp = array( 'code' => 201, 'body' => 'admin deleted');
                return $resp;
            }
            else{
                $resp = array( 'code' => 403, 'body' => 'cannot delete last admin');
                return $resp;
            }
        }
        else{
            $query = "DELETE FROM `users` WHERE `user_id` = :id";
            $stmt = $pdo->prepare($query);
            $stmt->bindparam(":id", $id);
            $stmt->execute();
            $resp = array( 'code' => 201, 'body' => 'user deleted');
            return $resp;
        }
    
    }

        
    function addlocation($id){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = 'INSERT INTO `location`(`location_name`,`user_id`) VALUES (:loc,:id)';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam("loc", $_GET['locationname']);
        $stmt->execute();
        if($pdo->lastInsertId() != null){
            $resp = array( 'code' => 201, 'body' => 'Location added');
            return $resp;
        }
        else{
            $resp = array( 'code' => 400, 'body' => 'Location not added');
            return $resp;
        }

    }

    function getlocations($id){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = 'SELECT `location_name`, `location_id` FROM `location` WHERE `user_id` = :id';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        $table = $stmt->fetchall(PDO::FETCH_ASSOC);
        return $table;
    }

    function getlocationstock(){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = 
        'SELECT users.user_id, stock_object.attributes, stock_data.stock_amount, location.location_name
        FROM stock_object
        INNER JOIN users on users.user_id = stock_object.user_id
        INNER JOIN stock_data on stock_data.item_id = stock_object.item_id
        INNER JOIN location on location.location_id = stock_data.location_id
        WHERE location.location_id = :loc && users.user_id = :id;';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id",$_SESSION['user_id']);
        $stmt->bindparam(":loc",$_GET['location']);
        $stmt->execute();
        $table = $stmt->fetchall(PDO::FETCH_ASSOC);
        return $table;
    }

}