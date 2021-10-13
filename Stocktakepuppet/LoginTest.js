const puppeteer = require('puppeteer');
const globalUrl = "http://localhost/php/StocktakeApp";


async function Loginmain(){
    await Logintest("kai.j.abbey@gmail.com","Password123!",201);
    await Logintest("kai@mail.com","Password123!",400);
    await Logintest("kai.j.abbey@gmail.com","PassWwor123!",400);
    await Logintest("","",402);
    await Logintest("gergre","vdfvgre", 402);
    await logout();
    await loginlogout("kai.j.abbey@gmail.com","Password123!");
}

async function Logintest(email,password,code) {
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

    const response = await page.goto(globalUrl+"/Stocktakeapi/api?action=login");

    if(response.status() === code){
        console.log({   action: 'Login',
                        Expected_code: code,
                        ValidCredentials: 'Success', 
                        statusCode: response.status(),
                        body: await response.text()});
    }
    else{
        console.log({   action: 'Login',
                        Expected_code: code,
                        ValidCredentials: 'Failure',
                        statusCode: response.status(),
                        body: await response.text()});
    }

    await browser.close();
  }
  
    
async function loginlogout(email, password) {
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

    const response = await page.goto(globalUrl+"/Stocktakeapi/api?action=logout");

    if(response.status() === 201){
        console.log({   action: 'LoginLogout',
                        Expected_code: 201,
                        ValidCredentials: 'Success', 
                        statusCode: response.status(),
                        body: await response.text()});
    }
    else{
        console.log({   action: 'LoginLogout',
                        Expected_code: 201,
                        ValidCredentials: 'Failure',
                        statusCode: response.status(),
                        body: await response.text()});
    }

    await browser.close();
}

async function logout() {
    const browser = await puppeteer.launch({
        args: ["--enable-features=NetworkService", "--no-sandbox"],
        ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();

    const response = await page.goto(globalUrl+"/Stocktakeapi/api?action=logout");

    if(response.status() === 400){
        console.log({   action: 'Logout',
                        Expected_code: 400,  
                        ValidCredentials: 'Success', 
                        statusCode: response.status(),
                        body: await response.text()});
    }
    else{
        console.log({   action: 'Logout',
                        Expected_code: 400,
                        ValidCredentials: 'Failure',
                        statusCode: response.status(),
                        body: await response.text()});
    }

    await browser.close();
}



Loginmain();

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
//   function writelog(log){
//     var fs = require('fs')
//     var logger = fs.createWriteStream('log.txt', {
//     flags: 'a' // 'a' means appending (old data will be preserved)
//     })

//     logger.write( log + '\n') // append string to your file

// }
  
  


