let contacts = [];

const backgroundColors = [
  "#3498db",
  "#2ecc71",
  "#9b59b6",
  "#e74c3c",
  "#f39c12",
  "#1abc9c",
  "#34495e",
  "#95a5a6",
  "#d35400",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#c0392b",
  "#f1c40f",
  "#16a085",
  "#2c3e50",
  "#7f8c8d",
  "#e67e22",
  "#1abc9c",
  "#3498db",
  "#f39c12",
  "#d35400",
  "#2ecc71",
  "#8e44ad",
  "#34495e",
  "#e74c3c",
  "#2980b9",
  "#16a085",
  "#95a5a6",
  "#c0392b",
  "#f1c40f",
  "#27ae60",
  "#7f8c8d",
  "#e67e22",
  "#1abc9c",
  "#3498db",
  "#f39c12",
  "#d35400",
  "#2ecc71",
  "#8e44ad",
  "#34495e",
  "#e74c3c",
  "#2980b9",
  "#16a085",
  "#95a5a6",
  "#c0392b",
  "#f1c40f",
  "#27ae60",
  "#7f8c8d",
  "#e67e22",
];

async function init() {
  await includeHTML();
  await loadContacts();
  renderContactList();
}

async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.warn("no contacts found on server");
  }
}

/* --- Contact List --- */

function renderContactList() {
  document.getElementById("contact-list").innerHTML = "";

  sortContactsAtoZ();

  for (let i = 0; i < sortedContacts.length; i++) {
    let nameInitial = sortedContacts[i]["name"].charAt(0).toUpperCase();
    let contactListCategory = document.getElementById(
      `contact-category-${nameInitial}`
    );

    if (contactListCategory === null) {
      document.getElementById("contact-list").innerHTML +=
        returnContactListCategory(nameInitial) + returnContactListEntry([i]);
    } else {
      contactListCategory.innerHTML += returnContactListEntry([i]);
    }
  }
}

function returnContactListCategory(character) {
  return `
    <p class="contact-category" 
    id="contact-category-${character}">
      ${character.toUpperCase()}
    </p>
  `;
}

function returnContactListEntry(id) {
  let contact = contacts[id];

  return `
    <div id="contact-id-${
      contact["id"]
    }" class="contact-entry" onclick="renderContactDetails(${id}), highlightActiveContact(this)">
    ${renderContactInitials(returnInitials(contact["name"]), id)}
    <div>
      <name>${contact["name"]}</name>
      <email>${contact["email"]}</email>
    </div>
  </div>
`;
}

function renderContactInitials(initials, id) {
  return `
  <div class="acc-initials" style="background-color:${contacts[id]["bgColor"]}" >
      <p>${initials}</p>
    </div>
  `;
}

function highlightActiveContact(element) {
  if (window.innerWidth >= 1024) {
    Array.from(document.querySelectorAll(".contact-entry-active")).forEach(
      (el) => el.classList.remove("contact-entry-active")
    );
    element.classList.add("contact-entry-active");
  }
}

function sortContactsAtoZ() {
  sortedContacts = contacts;
  sortedContacts.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    let charsA = nameA.split("");
    let charsB = nameB.split("");

    for (let i = 0; i < charsA.length; i++) {
      if (charsA[i] < charsB[i]) return -1;
      if (charsA[i] > charsB[i]) return 1;
      return 0;
    }
  });
}

/* --- Contact List ends --- */

/* --- Contact Details --- */

function renderContactDetails(id) {
  if (window.innerWidth <= 1024) {
    document.getElementById("contact-container").classList.add("d-flex");
    document.getElementById("contact-list-container").classList.add("d-none");
    document
      .getElementById("contact-mobile-delete")
      .setAttribute("onclick", `deleteContact(${id}),hideMore()`);
    document
      .getElementById("contact-mobile-edit")
      .setAttribute("onclick", `showEditContactForm(${id}),hideMore()`);
  }

  document.getElementById("contact-details").classList.remove("d-none");
  document.getElementById("contact-innitials").innerHTML =
    renderContactInitials(returnInitials(contacts[id]["name"]), id);
  document.getElementById("contact-name").innerHTML = contacts[id]["name"];
  document.getElementById("contact-email").innerHTML = contacts[id]["email"];
  document.getElementById("contact-email").href = `
  mailto:${contacts[id]["email"]}`;
  document.getElementById("contact-phone").innerHTML = contacts[id]["phone"];
  document
    .getElementById("contact-delete")
    .setAttribute("onclick", `deleteContact(${id})`);
  document
    .getElementById("contact-edit")
    .setAttribute("onclick", `showEditContactForm(${id})`);
}

function hideContactDetails() {
  document.getElementById("contact-container").classList.remove("d-flex");
  document.getElementById("contact-list-container").classList.remove("d-none");
}
/* --- Contact Details end --- */

/* --- Add New Contact --- */
function showAddContactForm() {
  document
    .getElementById("add-contact-form-container")
    .classList.remove("fadeOut");
  document.getElementById("add-contact-bg").classList.remove("d-none");
  document.getElementById("add-contact-form-container").classList.add("fadeIn");
}

async function createNewContact() {
  const randomBgColorIndex = Math.floor(
    Math.random() * backgroundColors.length
  );

  contacts.push({
    id: Date.now(),
    name: document.getElementById("add-contact-name").value,
    email: document.getElementById("add-contact-email").value,
    phone: document.getElementById("add-contact-phone").value,
    bgColor: backgroundColors[randomBgColorIndex],
  });

  await setItem("contacts", JSON.stringify(contacts));

  renderContactList();
  highlightLatestContact();
  closeAddContactForm();
  setTimeout(showContactCreatedNotification, 2000);
}

function closeAddContactForm() {
  document
    .getElementById("add-contact-form-container")
    .classList.remove("fadeIn");
  document
    .getElementById("add-contact-form-container")
    .classList.add("fadeOut");
  setTimeout(resetAddContactForm, 950);
}

function resetAddContactForm() {
  document.getElementById("add-contact-bg").classList.add("d-none");
  document.getElementById("add-contact-name").value = "";
  document.getElementById("add-contact-email").value = "";
  document.getElementById("add-contact-phone").value = "";
}

function highlightLatestContact() {
  const idOfmostRecentObject = Math.max(...contacts.map((e) => e.id));
  const index = contacts.findIndex((i) => i.id == idOfmostRecentObject);

  let element = document.getElementById(`contact-id-${idOfmostRecentObject}`);

  Array.from(document.querySelectorAll(".contact-entry-active")).forEach((el) =>
    el.classList.remove("contact-entry-active")
  );

  element.classList.add("contact-entry-active");
  element.scrollIntoView(false);

  renderContactDetails(index);
}

async function showContactCreatedNotification() {
  document.getElementById("contact-created").classList.remove("d-none");
  document
    .getElementById("contact-created")
    .classList.add("createdNotification");
  await setTimeout(() => {
    document.getElementById("contact-created").classList.add("d-none");
  }, 1950);
}

/* --- Add New Contact end --- */

/* --- Delete Contact --- */

async function deleteContact(id) {
  contacts.splice(id, 1);
  await setItem("contacts", JSON.stringify(contacts));
  document.getElementById("contact-details").classList.add("d-none");
  renderContactList();

  if (window.innerWidth <= 1024) {
    hideContactDetails();
  }
}

/* --- Delete Contact end--- */

/* --- Edit Contact --- */

function showEditContactForm(id) {
  loadEditContactValues(id);
  document
    .getElementById("edit-contact-form-container")
    .classList.remove("fadeOut");
  document.getElementById("edit-contact-bg").classList.remove("d-none");
  document
    .getElementById("edit-contact-form-container")
    .classList.add("fadeIn");
}

function loadEditContactValues(id) {
  const contact = contacts[id];
  document.getElementById("edit-contact-name").value = contact["name"];
  document.getElementById("edit-contact-phone").value = contact["phone"];
  document.getElementById("edit-contact-email").value = contact["email"];
  document
    .getElementById("edit-contact-form")
    .setAttribute("onsubmit", `editContact(${id}); return false`);
}

async function editContact(id) {
  contacts[id] = {
    id: contacts[id]["id"],
    name: document.getElementById("edit-contact-name").value,
    email: document.getElementById("edit-contact-email").value,
    phone: document.getElementById("edit-contact-phone").value,
    bgColor: contacts[id]["bgColor"],
  };

  await setItem("contacts", JSON.stringify(contacts));
  closeEditContactForm();
  renderContactList();
  renderContactDetails(id);
}

function resetEditContactForm() {
  document.getElementById("edit-contact-bg").classList.add("d-none");
  document.getElementById("edit-contact-name").value = "";
  document.getElementById("edit-contact-email").value = "";
  document.getElementById("edit-contact-phone").value = "";
}

function closeEditContactForm() {
  document
    .getElementById("edit-contact-form-container")
    .classList.remove("fadeIn");
  document
    .getElementById("edit-contact-form-container")
    .classList.add("fadeOut");
  setTimeout(resetEditContactForm, 950);
}

/* --- Edit Contact end --- */

async function addTestContacts() {
  contacts = [
    {
      id: Date.now() + 0,
      name: "Eva Evans",
      email: "eva@email.com",
      phone: "555555",
      bgColor: "#d35400",
    },
    {
      id: Date.now() + 1,
      name: "Peter Parker",
      email: "peter@email.com",
      phone: "161616",
      bgColor: "#2ecc71",
    },
    {
      id: Date.now() + 2,
      name: "Zoe Zane",
      email: "zoe@email.com",
      phone: "262626",
      bgColor: "#8e44ad",
    },
    {
      id: Date.now() + 3,
      name: "Alice Adams",
      email: "alice@email.com",
      phone: "111111",
      bgColor: "#34495e",
    },
  ];
  await setItem("contacts", JSON.stringify(contacts));
  renderContactList();
}

function showMore() {
  document.getElementById("content-container-more").classList.remove("d-none");
  document
    .getElementById("content-container-more")
    .classList.remove("fadeOutMore");
  document.getElementById("content-container-more").classList.add("fadeInMore");
}

function hideMore() {
  document
    .getElementById("content-container-more")
    .classList.remove("fadeInMore");
  document
    .getElementById("content-container-more")
    .classList.add("fadeOutMore");
  setTimeout(() => {
    document.getElementById("content-container-more").classList.add("d-none");
  }, 950);
}

function returnInitials(string) {
  let words = string.split(" ");
  let innitials = "";

  for (let i = 0; i < words.length; i++) {
    innitials += words[i].charAt(0).toUpperCase();
  }

  return innitials;
}

function highlightInvalid(element) {
  if (!element.checkValidity())
    element.parentNode.classList.add("input-invalid");
  else element.parentNode.classList.remove("input-invalid");
}
