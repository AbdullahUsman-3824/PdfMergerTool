const fileInput = document.getElementById("fileInput");
const fileLabel = document.getElementById("fileLabel");
const selectedFiles = document.getElementById("selectedFiles");

//display selected files
function updateFileName() {
  selectedFiles.innerHTML = "";
  let ihtml = "";

  for (const file of fileInput.files) {
    ihtml += `<div>>${file.name}</div>`;
  }
  selectedFiles.innerHTML = ihtml;
}
//pg intruction
const pageDiv = document.getElementById("pageDiv");
function showInfo() {
  let info = document.createElement("div");
  info.textContent =
    "Type page numbers or page ranges seperated by commas counting from start of the document or the section. For example, type 1, 3, 5-12";
  pageDiv.appendChild(info);

  setTimeout(() => {
    info.style.animation = "slideUp 0.5s ease-in-out forwards";
  }, 2000);
}
//select page number
const send = document.getElementById("sendPg");

let n;
send.addEventListener("click", () => {
  let pgNo = document.getElementById("pgNo");
  let value = pgNo.value;
  n = value;
  if (n == "") {
    return 0;
  }
  // Create an object to send to the server
  const dataToSend = { n };

  // Create an AJAX request to send the data to the server
  fetch("/templates/script", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => response.text())
    .then((result) => {
      console.log(result); // Server's response
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
