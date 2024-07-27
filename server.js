const express = require("express");
const fs = require("fs");
const schedule = require("node-schedule");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { mergePdfMultiple } = require("./merge");

app.use(express.json());
app.use(bodyParser.json());

app.use("/static", express.static("public"));
app.use("/static", express.static("templates"));
// app.use(express.static(__dirname + "/templates"));

const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates/index.html"));
});
let receivedN;
app.post("/templates/script", (req, res) => {
  receivedN = req.body.n;
  console.log("Received n:", receivedN);

  res.json({ message: "Value of n received successfully" });
});

app.post("/merge", upload.array("pdfs"), async function (req, res, next) {
  try {
    console.log(req.files);

    const pdfPaths = req.files.map((file) => path.join(__dirname, file.path));

    let d = await mergePdfMultiple(pdfPaths, receivedN);

    clearUploads(req.files);

    res.redirect(`http://localhost:${port}/static/${d}.pdf`);
  } catch (err) {
    console.error("Error during PDF merge:", err);
    
  }
});

//cleanup uploads folder
function clearUploads(files) {
  files.forEach((file) => {
    const filePath = path.join(__dirname, file.path);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${file.path}:`, err);
      } else {
        console.log(`Deleted file: ${file.path}`);
      }
    });
  });
}

// Schedule public folder cleanup every 24 hours
schedule.scheduleJob("0 0 * * *", () => {
  cleanupPublicFolder();
});
function cleanupPublicFolder() {
  const publicFolderPath = path.join(__dirname, "public");

  fs.readdir(publicFolderPath, (err, files) => {
    if (err) {
      console.error("Error reading public folder:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(publicFolderPath, file);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${file}:`, err);
        } else {
          console.log(`Deleted file: ${file}`);
        }
      });
    });
  });
}

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
