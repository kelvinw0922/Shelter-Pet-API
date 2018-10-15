import fetchJsonp from "fetch-jsonp";
import { isValidZip, showAlert } from "./validate";

const petForm = document.querySelector("#pet-form");

petForm.addEventListener("submit", fetchAnimals);

// Fetch Animals From API

function fetchAnimals(e) {
  e.preventDefault();

  // Collect User Input
  const animal = document.querySelector("#animal").value;
  const zip = document.querySelector("#zip").value;

  // Validate Zip
  if (!isValidZip(zip)) {
    showAlert("Please Enter A Valid ZipCode!", "danger");
    return;
  }

  // Fetch Animals

  fetchJsonp(
    `https://api.petfinder.com/pet.find?format=json&key=30d4039bc0d0ed9e15820ef807aeab0b&animal=${animal}&location=${zip}&callback=callback`,
    { jsonpCallbackFunction: "callback" }
  )
    .then(res => res.json())
    .then(data => showAnimals(data.petfinder.pets.pet))
    .catch(err => console.log(err));
}

// Show Listing Of Animals
function showAnimals(pets) {
  console.log(pets);
  const results = document.querySelector("#results");

  // Clear First
  results.innerHTML = "";

  // Loop Through Pets
  pets.forEach(pet => {
    // Check json variable

    // Breed
    let pet_breed = "";
    if (pet.breeds.breed.$t) {
      pet_breed = pet.breeds.breed.$t;
    } else {
      pet_breed = "";
    }

    // Address
    let pet_address1 = "";
    if (pet.contact.address1.$t) {
      pet_address1 = pet.contact.address1.$t;
    } else {
      pet_address1 = "";
    }

    // Phone
    let pet_phone = "";
    if (pet.contact.phone.$t) {
      pet_phone = pet.contact.phone.$t;
    } else {
      pet_phone = "N/A";
    }

    const div = document.createElement("div");
    div.classList.add("card", "card-body", "mb-5");
    div.innerHTML = `
        <div class="row">
            <div class="col-sm-6">
                <h4>${pet.name.$t} (${pet.age.$t})</h4>
                <p class="text-seconday">${pet_breed}</p>
                <p>${pet_address1} ${pet.contact.city.$t} ${
      pet.contact.state.$t
    } ${pet.contact.zip.$t}</p>
                <ul class="list-group">
                    <li class="list-group-item">Phone: ${pet_phone}</li>
                    ${
                      pet.contact.email.$t
                        ? `<li class="list-group-item">E-Mail: ${
                            pet.contact.email.$t
                          }</li>`
                        : ``
                    }
                    <li class="list-group-item">Shelter ID: ${
                      pet.shelterId.$t
                    }</li>
                </ul>
            </div>
            <div class="col-sm-6 text-center">
                <img class="img-fluid mt-2" src="${
                  pet.media.photos.photo[3].$t
                }">
            </div>
        </div>
    `;

    results.appendChild(div);
  });
}
