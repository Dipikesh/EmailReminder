var regButton = document.getElementById("regForm");
regButton.addEventListener("submit", formSubmited);

async function validateCredentails(email, password, cnfrmPassword, name) {
  
  if (password === cnfrmPassword)
    return true;
  return false;

}

async function sendOtp(email = {}) {
  
  setTimeout(function () {
    alert("wait for 5-7 sec ");
  }, 500);

  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    
    // *GET, POST, PUT, DELETE, etc. // *default, no-cache, reload, force-cache, only-if-cached
   // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(email), // body data type must match "Content-Type" header
  });
  console.log("response: " + JSON.stringify(response));
  return response.json();

  
}

async function formSubmited(e) {

  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  const cnfrmPassword = e.target.cnfrmPassword.value;
  const name = e.target.name.value;

  const validate = validateCredentails(email, password, cnfrmPassword, name);
  if (!validate)
    return alert("Password does not match");
  

  sessionStorage.setItem("email", email);
  sessionStorage.setItem("name", name);
  sessionStorage.setItem("password", password);
  sessionStorage.setItem("cnfrmPassword", cnfrmPassword);




  const result = await sendOtp({ email });

   

  console.log("result: " + JSON.stringify(result));

  if (result.success) {
    window.location.href = "/otp";
  }

}
