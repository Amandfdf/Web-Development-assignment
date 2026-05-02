// Typing Effect
const text = ["Student", "Content Creator", "Web Developer"];
let i = 0;
let j = 0;
let currentText = "";
let isDeleting = false;

function type() {
    currentText = text[i];
    
    if (!isDeleting) {
        document.getElementById("typing").innerHTML = currentText.substring(0, j++);
        if (j > currentText.length) {
            isDeleting = true;
            setTimeout(type, 1000);
            return;
        }
    } else {
        document.getElementById("typing").innerHTML = currentText.substring(0, j--);
        if (j === 0) {
            isDeleting = false;
            i = (i + 1) % text.length;
        }
    }
    setTimeout(type, isDeleting ? 50 : 100);
}

type();

// Theme Toggle
const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
});