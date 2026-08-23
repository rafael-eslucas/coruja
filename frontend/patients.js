const addpatient = document.querySelector("#addpatient");
const addtutor = document.querySelector("#addtutor");

addpatient.addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.currentTarget;

    const info = {
        "name": form.name.value,
        "species": form.species.value,
        "breed": form.breed.value,
        "birth": form.birth.value === "" ? null : form.birth.value,
        "notes": form.notes.value === "" ? null : form.birth.value,
        "owner_id": form.owner.value
    };

    const response = await fetch("/api/addpatient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    });

/*    const made = await response.json();

    console.log(made.success);
    if (logged.authorized) {
        window.location.href = "/patients";
    }*/
});

addtutor.addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.currentTarget;

    const info = {
        "name": form.name.value,
        "phone": form.phone.value === "" ? null : form.phone.value,
        "city": form.city.value,
        "neighborhood": form.neighborhood.value,
        "street": form.street.value,
        "number": form.number.value
    };

    const response = await fetch("/api/addowner", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    });
});