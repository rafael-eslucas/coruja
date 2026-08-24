const addpatient = document.querySelector("#addpatient");
const addtutor = document.querySelector("#addtutor");
const getpatient = document.querySelector("#getpatient");
const gettutor = document.querySelector("#gettutor");
const editpatient = document.querySelector("#editpatient");
const edittutor = document.querySelector("#edittutor");

addpatient.addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.currentTarget;

    const info = {
        "name": form.name.value,
        "species": form.species.value,
        "breed": form.breed.value,
        "birth": form.birth.value === "" ? null : form.birth.value,
        "notes": form.notes.value === "" ? null : form.notes.value,
        "owner_id": form.owner.value
    };

    const response = await fetch("/api/addpatient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    });
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


getpatient.addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.currentTarget;

    const info = {
        "row": form.row.value,
        "value": form.value.value
    }

    const response = await fetch("/api/getpatient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    });

    const text = await response.text();
    const patients = JSON.parse(text);

    const answer = document.querySelector("#answer");
    answer.innerHTML = "";
    patients.forEach(patient => {
        const title = document.createElement("h2");
        title.textContent = patient.name;
        answer?.appendChild(title);

        const id = document.createElement("p");
        id.textContent = `id = ${patient.id}`;
        answer?.appendChild(id);
        
        const species = document.createElement("p");
        species.textContent = `Espécie = ${patient.species}`;
        answer?.appendChild(species);
        
        const breed = document.createElement("p");
        breed.textContent = `id = ${patient.breed}`;
        answer?.appendChild(breed);
        
        const birth = document.createElement("p");
        const date = new Date(patient.birth);
        const formatted = date.toLocaleDateString("pt-BR");
        birth.textContent = `date = ${formatted}`;
        answer?.appendChild(birth);
        
        const notes = document.createElement("p");
        notes.textContent = `notes = ${patient.notes}`;
        answer?.appendChild(notes);
        
        const owner = document.createElement("p");
        owner.textContent = `Owner ID = ${patient.owner_id}`;
        answer?.appendChild(owner);
    });
});

gettutor.addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.currentTarget;

    const info = {
        "row": form.row.value,
        "value": form.value.value
    }

    const response = await fetch("/api/gettutor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    });

    const text = await response.text();
    const tutors = JSON.parse(text);

    const answer = document.querySelector("#answer");
    answer.innerHTML = "";
    tutors.forEach(tutor => {
        const title = document.createElement("h2");
        title.textContent = tutor.name;
        answer?.appendChild(title);

        const id = document.createElement("p");
        id.textContent = `id = ${tutor.id}`;
        answer?.appendChild(id);
        
        const phone = document.createElement("p");
        phone.textContent = `Telefone = ${tutor.phone}`;
        answer?.appendChild(phone);
        
        const city = document.createElement("p");
        city.textContent = `Cidade = ${tutor.city}`;
        answer?.appendChild(city);
        
        const neighborhood = document.createElement("p");
        neighborhood.textContent = `Bairro = ${tutor.neighborhood}`;
        answer?.appendChild(neighborhood);
        
        const street = document.createElement("p");
        street.textContent = `Rua = ${tutor.street}`;
        answer?.appendChild(street);

        const number = document.createElement("p");
        number.textContent = `number = ${tutor.number}`;
        answer?.appendChild(number);
    });
});


editpatient.addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.currentTarget;

    const info = {
        "id": form.id.value,
        "name": form.name.value,
        "species": form.species.value,
        "breed": form.breed.value,
        "birth": form.birth.value === "" ? null : form.birth.value,
        "notes": form.notes.value === "" ? null : form.notes.value,
        "owner": form.owner.value
    };

    const response = await fetch("/api/editpatient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    });
});

edittutor.addEventListener("submit", async event => {
    event.preventDefault();

    const form = event.currentTarget;

    const info = {
        "id": form.id.value,
        "name": form.name.value,
        "phone": form.phone.value === "" ? null : form.phone.value,
        "city": form.city.value,
        "neighborhood": form.neighborhood.value,
        "street": form.street.value,
        "number": form.number.value
    };

    const response = await fetch("/api/edittutor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    });
});