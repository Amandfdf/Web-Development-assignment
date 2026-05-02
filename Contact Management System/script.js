const form = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");
const search = document.getElementById("search");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

// Display contacts
function displayContacts(data) {
    contactList.innerHTML = "";

    data.forEach((contact, index) => {
        const row = document.createElement("div");
        row.className = "row";

        row.innerHTML = `
            <span>${contact.name}</span>
            <span>${contact.email}</span>
            <span>${contact.phone}</span>
            <button class="delete-btn" onclick="deleteContact(${index})">Delete</button>
        `;

        contactList.appendChild(row);
    });
}

// Add contact
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !email || !phone) return;

    contacts.push({ name, email, phone });

    localStorage.setItem("contacts", JSON.stringify(contacts));

    displayContacts(contacts);
    form.reset();
});

// Delete contact
function deleteContact(index) {
    contacts.splice(index, 1);
    localStorage.setItem("contacts", JSON.stringify(contacts));
    displayContacts(contacts);
}

// Search
search.addEventListener("input", () => {
    const value = search.value.toLowerCase();

    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(value)
    );

    displayContacts(filtered);
});

// Load
displayContacts(contacts);