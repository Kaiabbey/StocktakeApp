<?php
class connection{

    private $pdo;

    // the main function for connecing our model and controls to the database
    public function connectdb(){
        // localhost credentials 
        $dsn = 'mysql:dbname=stocktakeapp;host=localhost;port=3306;';
        $user_name = 'root';
        $password = '';
        // live credentials
        // $dsn = 'mysql:dbname=kaiabbe1_StocktakeApp;host=kaiabbey.work;port=3306;';
        // $user_name = 'kaiabbe1_kai';
        // $password = '!Might52Bird';
        try{
            $pdo = new pdo($dsn,$user_name,$password);
        }
        catch(PDOException $e){
            header('location:../index.php?msg=Database_err'.$e->getMessage());
        }
        return $pdo;
    }
}

class dbFunc{

    function login(){
        extract($_POST);
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

    function editUser(){
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

    function fetchCurrentUser($user){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = "SELECT `datecreated`,`email`,`firstname`,`lastname`,`user_id`,`role` FROM users WHERE user_id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindparam(":id",$user);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    function fetchAllUsers(){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = "SELECT `firstname`, `lastname`, `email`, `user_id`, `role` FROM users";
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchall(PDO::FETCH_ASSOC);
    }
    
    function registerUser(){
        $conn = new connection;
        $pdo = $conn->connectdb();
        extract($_POST);//POST extracts $firstname $email $lastname $password
        if($email == ''|| $firstname == ''|| $lastname == ''|| $password == ''){
            return array( 'code' => 401, 'body' => 'Empty credentials');
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
                return array( 'code' => 201, 'body' => 'userRegistered');
            }
            else{
                $_SESSION['user_id'] = 0;
                return array( 'code' => 400, 'body' => 'userExists');
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

    function deleteUser($id){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query1 = 'SELECT * FROM users WHERE `user_id`=:id';
        $stmt1 = $pdo->prepare($query1);
        $stmt1->bindParam(":id",$id);
        $stmt1->execute();
        $row1 = $stmt1->fetch(PDO::FETCH_ASSOC);
        if($row1['role'] == 'admin'){
            $query2 = 'SELECT * FROM users WHERE `role`= admin';
            $stmt2 = $pdo->prepare($query2);
            $stmt2->execute();
            $row2 = $stmt2->fetch(PDO::FETCH_ASSOC);
            if($row2['role'] > 1){
                $query = "DELETE FROM `users` WHERE `user_id` = :id";
                $stmt = $pdo->prepare($query);
                $stmt->bindparam(":id", $id);
                $stmt->execute();
                return array( 'code' => 201, 'body' => 'admin deleted');
            }
            else{
                return array( 'code' => 403, 'body' => 'cannot delete last admin');
            }
        }
        else{
            $query = "DELETE FROM `users` WHERE `user_id` = :id";
            $stmt = $pdo->prepare($query);
            $stmt->bindparam(":id", $id);
            $stmt->execute();
            return array( 'code' => 201, 'body' => 'user deleted');

        }
    
    }

        
    function addLocation($id){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = 'INSERT INTO `location`(`location_name`,`user_id`) VALUES (:loc,:id)';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam("loc", $_GET['locationname']);
        $stmt->execute();
        if($pdo->lastInsertId() != null){
            return array( 'code' => 201, 'body' => 'Location added');
        }
        else{
            return array( 'code' => 400, 'body' => 'Location not added');
        }

    }

    function getLocations($id){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = 'SELECT `location_name`, `location_id` FROM `location` WHERE `user_id` = :id';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetchall(PDO::FETCH_ASSOC);
    }

    function getLocationStock(){
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
        $stmt->bindparam(":loc",$_GET['locationid']);
        $stmt->execute();
        return $stmt->fetchall(PDO::FETCH_ASSOC);
    }

    function createNewStockObject($id){
        extract($_POST);
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = 'SELECT COUNT(*) FROM `stock_object` WHERE `user_id` = :id AND `barcode` = :bc';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":bc", $barcode);
        $stmt->execute();
        $ct = $stmt->fetchColumn();
        if($ct == 0){
            $conn1 = new connection;
            $pdo1 = $conn1->connectdb();
            $query1 = 'INSERT INTO `stock_object`(`user_id`, `barcode`, `attributes`) VALUES (:id,:bc,:atr)';
            $stmt1 = $pdo1->prepare($query1);
            $stmt1->bindParam(":id", $id);
            $stmt1->bindParam("bc", $barcode);
            $stmt1->bindParam(":atr", $attributes);
            $stmt1->execute();
            if($pdo1->lastInsertId() != null){
                return array( 'code' => 201, 'body' => 'Object Added');
            }
            else{
                return array( 'code' => 401, 'body' => 'Object not added');
            }
        }else{
            return array('code' => 400, 'body' => 'object with barcode already exists');
        }

    }

    function getStockObjects($id){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = 'SELECT `attributes`, `barcode` FROM `stock_object` WHERE `user_id` = :id';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetchall(PDO::FETCH_ASSOC);
    }

    function getStockObject($id){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = 'SELECT `attributes` FROM `stock_object` WHERE `user_id` = :id AND `barcode` = :bc';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":bc", $_GET['barcode']);
        $stmt->execute();
        return $stmt->fetchall(PDO::FETCH_ASSOC);
    }
    
    function deleteStockObject($id){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = 'DELETE FROM `stock_object` WHERE `user_id` = :id AND `barcode` = :bc';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":bc", $_GET['barcode']);
        $stmt->execute();
        return array('deleted' => true);
    }

    function checkBarcode($id){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = 'SELECT count(`attributes`) FROM `stock_object` WHERE `user_id` = :id AND `barcode` = :bc';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":bc", $_GET['barcode']);
        $stmt->execute();
        $ct = $stmt->fetchColumn();
        if($ct == 0){
            return true;
        }
        else{
            return false;
        }
    }

    function changeStock($id){
        $conn = new connection;
        $pdo = $conn->connectdb();
        $query = 'SELECT `item_id` FROM `stock_object` WHERE `user_id` = :id AND `barcode` = :bc';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":bc", $_GET['barcode']);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $item_id = $row['item_id'];
        $query1 = 'SELECT count(*) FROM `stock_data` WHERE `location_id` = :locid AND `item_id` = :iid';
        $stmt1 = $pdo->prepare($query1);
        $stmt1->bindParam(":locid", $_GET['locationid']);
        $stmt1->bindParam(":iid", $item_id);
        $stmt1->execute();
        $ct = $stmt1->fetchColumn();
        if($ct == 0){
            $query2 = 'INSERT INTO `stock_data`(`stock_amount`, `item_id`, `location_id`) VALUES (:amo,:iid,:locid)';
            $stmt2 = $pdo->prepare($query2);
            $stmt2->bindParam(":amo", $_GET['amount']);
            $stmt2->bindParam(":iid", $item_id);
            $stmt2->bindParam(":locid", $_GET['locationid']);
            $stmt2->execute();
            if($pdo->lastInsertId() != null){
                return array( 'code' => 201, 'body' => 'Stock Added');
            }
            else{
                return array( 'code' => 401, 'body' => 'Stock not added');
            }
        }
        else{
            if($_GET['sign'] == 'add'){
                $query3 = 'UPDATE `stock_data` SET `stock_amount` = `stock_amount` + :amo WHERE item_id = :iid AND location_id = :locid';
                $stmt3 = $pdo->prepare($query3);
                $stmt3->bindParam(":amo", $_GET['amount']);
                $stmt3->bindParam(":iid", $item_id);
                $stmt3->bindParam(":locid", $_GET['locationid']);
                $stmt3->execute();
                return array( 'code' => 201, 'body' => 'Stock Updated');
            }
            else{
                $query3 = 'UPDATE `stock_data` SET `stock_amount` = `stock_amount` - :amo WHERE item_id = :iid AND location_id = :locid';
                $stmt3 = $pdo->prepare($query3);
                $stmt3->bindParam(":amo", $_GET['amount']);
                $stmt3->bindParam(":iid", $item_id);
                $stmt3->bindParam(":locid", $_GET['locationid']);
                $stmt3->execute();
                return array( 'code' => 201, 'body' => 'Stock Updated');
            }

        }

    }

}