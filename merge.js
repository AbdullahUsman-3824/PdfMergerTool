const PDFMerger = require("pdf-merger-js");

let merger = new PDFMerger();



const mergePdfMultiple = async (pdfPaths,n) => {
  for (const pdfPath of pdfPaths) {
    await merger.add(pdfPath, n);
  }

  let d = new Date().getTime();
  await merger.save(`public/${d}.pdf`);
  return d;
};

module.exports = { mergePdfMultiple };
