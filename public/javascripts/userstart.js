function updatePage() {
    let responseJson = JSON.parse(this.responseText); 
    let outputArea = document.getElementById("entries");

    // Make list of divs
    for (let rowIndex in responseJson) {
        let tempDiv = document.createElement("div");
        tempDiv.className = "entry"
        tempDiv.innerHTML = `<div class="title">${responseJson[rowIndex].title} ${responseJson[rowIndex].date}</div>
            <br><p class="text">${responseJson[rowIndex].txt}</p>`;
        outputArea.appendChild(tempDiv);
    }
}

let xhr = new XMLHttpRequest();
xhr.addEventListener("load", updatePage);
xhr.open("GET", "http://localhost:3000/home");
xhr.setRequestHeader('Access-Control-Allow-Headers','*');
xhr.send();