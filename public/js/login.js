const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', loginSubmit);

async function logined(data) {
    const response = await fetch("/api/auth/login", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return response.json();
}

async function loginSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const data = {email,password};

    const result = await logined(data);
    console.log("response " + JSON.stringify(result));
    
    if (result.success) {
        window.localStorage.setItem('token',result.token);
       return window.location.href = '/'
    }
    alert("Invalid Credentials");
}