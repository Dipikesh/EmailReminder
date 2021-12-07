const otpBtn = document.getElementById('otpForm');
otpBtn.addEventListener('submit', otpForm);

async function verifyingOtp(data) {
   const result = await fetch("http://localhost:8000/api/auth/cnfrm-register", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(data),
   });
    
    console.log("result", result);
    return result.json();


}


async function otpForm(e) {
    e.preventDefault();
    const otp = e.target.otp.value;
    const name = sessionStorage.getItem("name");
    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");
    const cnfPassword = sessionStorage.getItem("cnfrmPassword");


    const data = { otp, name, email, password, cnfPassword };


    const verifyOtp = await verifyingOtp(data);
    console.log(JSON.stringify(verifyOtp));
    if (verifyOtp.success) {
    return window.location.href = "http://localhost:8000/login";
    
    }


    //TODO IF otp is not verifid , then alert the error
    


}