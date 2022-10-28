const list = document.querySelector(".contacts-list");

let contacts = [];

const getAllContacts = (prefix) => {
  fetch(`http://localhost:3000/contacts?prefix=${prefix}`)
    .then((res) => res.json())
    .then((data) => {
      contacts = data;
      // console.log(contacts);
      buildContacts();
    });
};

const postNewContact = (newContact) => {
  fetch("http://localhost:3000/contacts", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(newContact),
  })
    .then((res) => {
      console.log(res);
      getAllContacts("");
    })
    .catch((res) => {
      console.log(res);
    });
};

const flipFav = (updatedContact, id) => {
  fetch(`http://localhost:3000/contacts/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(updatedContact),
  })
    .then((res) => {
      console.log(res);
      getAllContacts("");
    })
    .catch((res) => {
      console.log(res);
    });
};

const deleteContact = (id) => {
  fetch(`http://localhost:3000/contacts/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "DELETE",
  })
    .then((res) => {
      console.log(res);
      getAllContacts("");
    })
    .catch((res) => {
      console.log(res);
    });
};

buildContacts = () => {
  list.innerHTML = "";
  contacts.forEach((c, i) => {
    const newLi = document.createElement("li");
    newLi.classList.add("contact");
    const firstName = document.createElement("p");
    const lastName = document.createElement("p");
    const phoneNumber = document.createElement("p");
    const favButton = document.createElement("i");
    const trashButton = document.createElement("i");
    const btnsDiv = document.createElement("div");
    btnsDiv.classList.add("btns");
    favButton.classList.add("fa-solid", "fa-heart");
    trashButton.classList.add("fa-solid", "fa-trash-can");
    if (c.isFavorite) {
      favButton.classList.add("fav");
    }
    favButton.setAttribute("data-index", i);
    trashButton.setAttribute("data-id", c.id);
    firstName.textContent = c.fullName.firstName;
    lastName.textContent = c.fullName.lastName;
    phoneNumber.textContent = c.phoneNumber;
    btnsDiv.append(favButton, trashButton);
    newLi.append(firstName, lastName, phoneNumber, btnsDiv);
    list.append(newLi);
  });
};

document.querySelector("#filter").addEventListener("input", (e) => {
  getAllContacts(e.target.value);
});

document.querySelector(".add-contact").addEventListener("submit", (e) => {
  e.preventDefault();
  const fName = document.querySelector("#fn").value;
  const lName = document.querySelector("#ln").value;
  const pNumber = document.querySelector("#phone").value;
  const newContact = {
    fullName: {
      firstName: fName,
      lastName: lName,
    },
    phoneNumber: +pNumber,
    isFavorite: false,
  };
  console.log(newContact);
  postNewContact(newContact);
  document.querySelector("#filter").value = "";
});

list.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-heart")) {
    const index = e.target.getAttribute("data-index");
    const updatedContact = contacts[index];
    updatedContact.isFavorite = !updatedContact.isFavorite;
    console.log(updatedContact);
    const id = updatedContact.id;
    flipFav(updatedContact, id);
  }
  if (e.target.classList.contains("fa-trash-can")) {
    const id = e.target.getAttribute("data-id");
    deleteContact(id);
  }
});
getAllContacts("");
