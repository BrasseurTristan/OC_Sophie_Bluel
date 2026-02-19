const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", function(event){
    event.preventDefault();
    const user = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value
    };
    const userJson = JSON.stringify(user);
    fetch("http://localhost:5678/api/users/login",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: userJson,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Identifiants incorrects");
        }
        return response.json();
    })
    .then(data => {
        sessionStorage.setItem("token",data.token);
        sessionStorage.setItem("userId", data.userId);
        window.location.href= "http://127.0.0.1:5500/index.html";
    })
    .catch(errorMsg);
})

function errorMsg(){
    if (document.querySelector(".error-message")) return;
    const formBtn = document.querySelector("#formBtn");
    const errorP = document.createElement("p");
    errorP.innerText = "Email ou mot de passe incorrect";
    errorP.classList.add("error-message");
    formBtn.insertAdjacentElement("beforebegin", errorP);
}