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