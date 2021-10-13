const puppeteer = require('puppeteer');

const ValidEmail = "test@test.com";
const ValidPassword = "Password123!";
const globalUrl = "http://localhost/php/StocktakeApp/Stocktakeapi/api?action=";

async function Maintesting(email, password){
    console.log("########## NEW UNIT TEST INITIALIZED ##########")
    await registerTest(email,"fergb","Testy","Mctest",402);
    await registerTest(email,password,"","Mctest",402);
    await registerTest(email,password,"Testy","",402);
    await registerTest(email,"","Testy","Mctest",402);
    await registerTest("",password,"Testy","Mctest",402);
    console.log("###END OF REGISTRATION VALIDATION TESTING###");
    console.log("###START OF GET TESTING###");
    await registerTest(email,password,"Testy","Mctest",201);
    await registerTest(email,password,"Testy","Mctest",400);
    await GenericGetTest(email,password,'addlocation',201,'locationname','Testlocation')
    await GenericGetTest(email,password,'getlocationstock',201,'location','Testlocation')
    await GenericGetTest(email,password,'getlocationstock',201,'location','Test')
    await GenericGetTest('yest@gmail.com',password,'getlocationstock',403,'location','Test')    
    await GenericGetTest('yest@mail.com',password,'addlocation',403,'locationname','Testlocation')
    await GenericGetTest(email,password,'addlocation',402,'locationname',"T")
    await GenericGetTest(email,password,'addlocation',402,'l',"Testlocation2")
    await GenericGetTest(email,password,'getlocations',201)
    await GenericGetTest('yesy@mail.com',password,'getlocations',403)
    await GenericGetTest(email,password,'isloggedin',201)
    await GenericGetTest('yest@mail.com',password,'isloggedin',400)
    await GenericGetTest(email,password,'checkadmin',400)
    await GenericGetTest('yest@mail.com',password,'checkadmin',400)
    await GenericGetTest(email,password,'currentuser',201)
    await GenericGetTest('yest@mail.com',password,'currentuser',400)
    await GenericGetTest(email,password,'alluser',400)
    await GenericGetTest('yest@gmail.com',password,'alluser',400)
    await EditTest(email,password,'blargh@email.com','s','s',402)
    await EditTest("yest@mail.com",password,'blargh@email.com','steve','joabs',403)
    await EditTest(email,password,'','','',402)
    await EditTest(email,password,'blargh@email.com','steve','joabs',201)
    await deleteTestUser("yest@mail.com",password,403)
    await GenericGetTest('blargh@email.com',password,'currentuser',201)
    await deleteTestUser('blargh@email.com',password, 201);
    console.log("########## UNIT TEST FINISHED! ##########")
}

async function registerTest(email,password,firstname,lastname,code) {
    const browser = await puppeteer.launch({
      args: ["--enable-features=NetworkService", "--no-sandbox"],
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.once("request", interceptedRequest => {
      interceptedRequest.continue({
        method: "POST",
        postData: "email="+email+"&password="+password+"&firstname="+firstname+"&lastname="+lastname,
        headers: {
          ...interceptedRequest.headers(),
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
    });

    const response = await page.goto(globalUrl+"register");

    if(response.status() === code){
        console.log({   action: 'register',
                        Expected_code: code,
                        Test_Results: 'Success', 
                        statusCode: response.status(),
                        body: await response.text()});
    }
    else{
      console.warn({   action: 'register',
                        Expected_code: code,
                        Test_Results: 'Failure',
                        statusCode: response.status(),
                        body: await response.text()});
    }

    await browser.close();
  }


  //delete test user just made
  async function deleteTestUser(email,password,code) {
    const browser = await puppeteer.launch({
      args: ["--enable-features=NetworkService", "--no-sandbox"],
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.once("request", interceptedRequest => {
      interceptedRequest.continue({
        method: "POST",
        postData: "email="+email+"&password="+password,
        headers: {
          ...interceptedRequest.headers(),
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
    });

    await page.goto(globalUrl+"login");

    const response = await page.goto(globalUrl+"currentuser");

    //console.log( await response.status());

    const body = await response.text();

  
    var id = await JSON.parse(body).user_id

    if(id == undefined){
      id = 0;
    }

    console.log(await id);

    const url = globalUrl+"deleteuser&user_id="+id;

    const delresponse = await page.goto(url);

    if(delresponse.status() === code){
        console.log({ action: 'DeleteUser',  
                      Expected_code: code,
                      Test_Results: 'Success', 
                      statusCode: delresponse.status(),
                      body: await delresponse.text()});
    }
    else{
        console.log({   action: 'DeleteUser',  
                        Expected_code: code,
                        Test_Results: 'Failure',
                        statusCode: delresponse.status(),
                        body: await delresponse.text()});
    }

    await browser.close();
  }

  async function GenericGetTest(email,password,action,code,key= null,Value = null) {
    const browser = await puppeteer.launch({
      args: ["--enable-features=NetworkService", "--no-sandbox"],
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.once("request", interceptedRequest => {
      interceptedRequest.continue({
        method: "POST",
        postData: "email="+email+"&password="+password,
        headers: {
          ...interceptedRequest.headers(),
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
    });

    await page.goto(globalUrl+"login");

    if(key != null){
  
      const url = globalUrl+action+"&"+key+"="+Value;
  
      const response = await page.goto(url);
  
      if(response.status() === code){
          console.log({   Action: action,
                          Expected_code: code,
                          Test_Results: 'Success', 
                          statusCode: response.status(),
                          body: await response.text()});
      }
      else{
          console.log({   Action: action,
                          Expected_code: code, 
                          Test_Results: 'Failure',
                          statusCode: response.status(),
                          body: await response.text()});
      }
  
      await browser.close();
    }
    else{
      const url = globalUrl+action
  
      const response = await page.goto(url);
  
      if(response.status() === code){
          console.log({   Action: action,
                          Expected_code: code, 
                          Test_Results: 'Success', 
                          statusCode: response.status(),
                          body: await response.text()});
      }
      else{
          console.log({   Action: action,
                          Expected_code: code, 
                          Test_Results: 'Failure',
                          statusCode: response.status(),
                          body: await response.text()});
      }
  
      await browser.close();
    }

  }

  async function EditTest(email,password,newEmail,firstname,lastname,code) {
    const browser = await puppeteer.launch({
      args: ["--enable-features=NetworkService", "--no-sandbox"],
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on("request", interceptedRequest => {
      const url = interceptedRequest.url();

      if(url == globalUrl+"login"){
        interceptedRequest.continue({
          method: "POST",
          postData: "email="+email+"&password="+password,
          headers: {
            ...interceptedRequest.headers(),
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
      }
      else{
        interceptedRequest.continue({
          method: "POST",
          postData: "email="+newEmail+"&firstname="+firstname+"&lastname="+lastname,
          headers: {
            ...interceptedRequest.headers(),
            "Content-Type": "application/x-www-form-urlencoded"
          }
          });
      }
      
    });

    await page.goto(globalUrl+"login");

    const response1 = await page.goto(globalUrl+"currentuser");

    //console.log( await response.status());

    const body = await response1.text();

  
    var id = await JSON.parse(body).user_id

    if(id == undefined){
      id = 0;
    }


    const Eurl = globalUrl+"edituser&user_id="+ id;

    const response = await page.goto(Eurl);

    if(response.status() === code){
        console.log({   action: 'Edituser',
                        Expected_code: code,
                        Test_Results: 'Success', 
                        statusCode: response.status(),
                        body: await response.text()});
    }
    else{
      console.warn({   action: 'Edituser',
                        Expected_code: code,
                        Test_Results: 'Failure',
                        statusCode: response.status(),
                        body: await response.text()});
    }

    await browser.close();
  }



  Maintesting(ValidEmail,ValidPassword);