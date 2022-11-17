// Performs validations for the edit page
let validTitle = true;
let validText = true;

let titleElement = document.getElementById("title");
let textAreaElement = document.getElementById("txt");
let inputForm = document.querySelector("form");

titleElement.addEventListener("input", checkTitle);
textAreaElement.addEventListener("input", checkText);
inputForm.addEventListener("submit", checkForSubmit);

function checkTitle() {
    let title = titleElement.value;
    title = title.trim();
    validTitle = title.length < 60 && title.length > 0;

    // toggle red outline accordingly
    if (!validTitle && !titleElement.classList.contains("redOutline")) {
        titleElement.classList.add("redOutline");
    } else if (validTitle && titleElement.classList.contains("redOutline")) {
        titleElement.classList.remove("redOutline");
    }
}

function checkText() {
    let text = textAreaElement.value;
    text = text.trim();
    validText = text.length > 0;

    // toggle red outline accordingly
    if (!validText && !textAreaElement.classList.contains("redOutline")) {
        textAreaElement.classList.add("redOutline");
    } else if (validText && textAreaElement.classList.contains("redOutline")) {
        textAreaElement.classList.remove("redOutline");
    }
}

function checkForSubmit(event) {
    if (!validText || !validTitle) {
        event.preventDefault();

        // Add warning message
        if(!document.getElementById("warning")){
            let warning = document.createElement("p");
            warning.id = "warning"
            warning.innerText = "ERROR: The text field and title must have a value. The title must be less than 60 characters"
            document.body.appendChild(warning);
        }
    } else { // Indicate success
        // Gives delay for form submission
        setTimeout(() => {
            if (document.getElementById("warning")) {
                document.body.removeChild(document.getElementById("warning"));
            }
            document.body.removeChild(inputForm);
            let linkHome = document.createElement("a");
            linkHome.href = "../views/user.html";
            linkHome.innerText = "Blog created, return to user Page";
            document.body.appendChild(linkHome);
        }, 500);
    }
}
