function sendEdit(id) {
    console.log(`Editing entry ${id}`);
    // TODO Add edit functionality
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://localhost:3000/setId/${id}`);
    xhr.setRequestHeader('Access-Control-Allow-Headers','*');
    xhr.send();

    // Slight delay to allow request to go through
    setTimeout(window.open('edit.html'), 250);
}

function sendDelete(id) {
    console.log(`Deleting entry ${id}`);
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:3000/delete/${id}`);
    xhr.setRequestHeader('Access-Control-Allow-Headers','*');
    xhr.send();
}

function updatePage() {
    let responseJson = JSON.parse(this.responseText); 
    let outputArea = document.getElementById("listOfData");
    let dataTable = document.createElement("table");
    let tableHead = document.createElement("tr");
    tableHead.innerHTML = '<th>ID</th><th>Title</th><th>Date</th><th>Options</th>';
    dataTable.appendChild(tableHead);

    // Create table
    for (let rowIndex in responseJson) {
        let tempRow = document.createElement("tr");
        tempRow.className = "tableRow"
        let data = responseJson[rowIndex];
        tempRow.innerHTML = `<td>${data.id}</td>
            <td>${data.title}</td>
            <td>${data.date}</td>
            <td>
                <button onclick="sendEdit(${data.id})">Edit</button>
                <button onclick="sendDelete(${data.id})">Delete</button>
            </td>`;
        dataTable.appendChild(tempRow);
    }

    outputArea.appendChild(dataTable);
}

let xhr = new XMLHttpRequest();
xhr.addEventListener("load", updatePage);
xhr.open("GET", "http://localhost:3000/home");
xhr.setRequestHeader('Access-Control-Allow-Headers','*');
xhr.send();