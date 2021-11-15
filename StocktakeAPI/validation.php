<?php
    
    class validation{

        //function that loops over POST variables and creates a function call to validate data
        function validatePost(){
            foreach ($_POST as $key => $value) {
                $newValid = $key . 'Valid';
                if($this->$newValid($value) == false){
                    http_response_code(406);
                    echo json_encode(array($key." invalid" => true));
                    die();
                } 
            }
        }

        // function that loops over GET variables and creates a function call to validate data
        function validateGet(){
            $validkeys = array('locationid','locationname','id','user_id','location','barcode','sign','amount');
            foreach ($_GET as $key => $value) {
                if($key != 'action'){
                    if(in_array($key, $validkeys)){
                        $newValid = $key . 'GETValid';
                        if($this->$newValid($value) == false){
                            http_response_code(406);
                            $resp = 'invalid get value:'.$value;
                            echo json_encode(array($resp => true));
                            die();
                        }      
                    }
                    else{
                        http_response_code(406);
                        echo json_encode(array('invalid action' => true));
                        die();
                    }
                }        
            }
        }
        
        function emailValid($email){
            if(filter_var($email,FILTER_VALIDATE_EMAIL)){
                return true;
            }
            else{
                return false;
            }
        }

        function passwordValid($password){
            if (strlen($password) < '8') {
                return false;
            }
            if(!preg_match("#[0-9]+#",$password)) {
                return false;
            }
            if(!preg_match("#[A-Z]+#",$password)) {
                return false;
            }
            if(!preg_match("#[a-z]+#",$password)) {
                return false;
            }
            return true;
        }

        function firstnameValid($firstname){
            if(preg_match('/[a-zA-z]{2,16}/',$firstname,)){
                return true;
            }   
            else{
                return false;
            }
        }

        function lastnameValid($lastname){
            if(preg_match('/[a-zA-z]{2,16}/',$lastname)){
                return true;
            }   
            else{
                return false;
            }
        }

        function barcodeValid($barcode){
            if(preg_match('/[0-9]{2,16}/',$barcode)){
                return true;
            }   
            else{
                return false;
            }
        }

        function barcodeGETValid($barcode){
            if(preg_match('/[0-9]{2,16}/',$barcode)){
                return true;
            }   
            else{
                return false;
            }
        }

        function signGETValid($sign){
            if($sign == 'add' || $sign == 'remove'){
                return true;
            }   
            else{
                return false;
            }
        }

        function attributesValid($lastname){
            if(preg_match('/[\S]{2,}/',$lastname)){
                return true;
            }   
            else{
                return false;
            }
        }

        function roleValid($role){
            if($role == 'admin' || $role == 'user'){
                return true;
            }   
            else{
                return false;
            }
        }

        function locationnameGETValid($location){
            if(preg_match('/[a-zA-z]{2,16}/',$location)){
                return true;
            }   
            else{
                return false;
            }
        }

        function locationGETValid($location){
            if(preg_match('/[a-zA-z]{2,16}/',$location)){
                return true;
            }   
            else{
                return false;
            }
        }

        function user_idGETValid($id){
            if(preg_match('/^\d+$/', $id)){
                return true;
            }   
            else{
                return false;
            }
        }

        
        function amountGETValid($amount){
            if(preg_match('/^\d+$/', $amount)){
                return true;
            }   
            else{
                return false;
            }
        }

        function locationIdGETValid($id){
            if(preg_match('/^\d+$/', $id)){
                return true;
            }   
            else{
                return false;
            }
        }
        

        
    }