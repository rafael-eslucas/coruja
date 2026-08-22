const form = document.querySelector("form");

form.addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.currentTarget;

    const info = {
        "login": form.login.value,
        "password": form.password.value
    };

    const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    });

    const logged = await response.json();

    console.log(logged);
    if (logged.authorized) {
        window.location.href = "/pacientes";
    }
});