function updatePage() {
    let responseJson = JSON.parse(this.responseText)[0]; 
    let titleArea = document.getElementById("title");
    let textArea = document.getElementById("txt");

    console.log(titleArea);
    titleArea.value = responseJson.title;
    textArea.innerText = responseJson.txt;
}

let xhr = new XMLHttpRequest();
xhr.addEventListener("load", updatePage);
xhr.open("GET", "http://localhost:3000/getEdit");
xhr.setRequestHeader('Access-Control-Allow-Headers','*');
xhr.send();