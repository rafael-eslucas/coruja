const form = document.querySelector("form");

form.addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.currentTarget;

    const info = {
        "name": form.name.value,
        "species": form.species.value,
        "breed": form.breed.value,
        "birth": form.birth.value,
        "notes": form.notes.value,
        "owner_id": form.owner.value
    };

    const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    });

    const made = await response.json();

    console.log(made.success);
    if (logged.authorized) {
        window.location.href = "/patients";
    }
});