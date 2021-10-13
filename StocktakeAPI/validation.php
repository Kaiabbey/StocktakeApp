<?php
    
    class validation{

        //function that loops over POST variables and creates a function call to validate data
        function validatePost(){
            foreach ($_POST as $key => $value) {
                $newValid = $key . 'Valid';
                if($this->$newValid($value) == false){
                    http_response_code(402);
                    echo json_encode(array('invalid POST data' => true));
                    die();
                } 
            }
        }

        // function that loops over GET variables and creates a function call to validate data
        function validateGet(){
            $validkeys = array('locationid','locationname','id','user_id','location');
            foreach ($_GET as $key => $value) {
                if($key != 'action'){
                    if(in_array($key, $validkeys)){
                        $newValid = $key . 'GETValid';
                        if($this->$newValid($value) == false){
                            http_response_code(402);
                            echo json_encode(array('invalid get value' => true));
                            die();
                        }      
                    }
                    else{
                        http_response_code(402);
                        echo json_encode(array('invalid get key' => true));
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

        function locationIdGETValid($id){
            if(preg_match('/^\d+$/', $id)){
                return true;
            }   
            else{
                return false;
            }
        }
        

        
    }