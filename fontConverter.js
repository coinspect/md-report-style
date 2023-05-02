import fetch from 'node-fetch';
import fs from 'fs';

async function fetchAndEncode(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return `data:${response.headers.get("content-type")};base64,${base64}`;
  }
  
  async function convertFontFaces(url, outputFilename) {
    const response = await fetch(url);
    const cssText = await response.text();
  
    const regex = /url\(([^)]+)\)/g;
    let match;
    let replacedCssText = cssText;
  
    while ((match = regex.exec(cssText))) {
      const fontUrl = match[1];
      const base64Font = await fetchAndEncode(fontUrl);
      replacedCssText = replacedCssText.replace(fontUrl, base64Font);
    }

    // write replacedCssText to output file
    fs.writeFile(outputFilename, replacedCssText, function (err) {
        if (err) return console.log(err);
        console.log(`File ${outputFilename} saved successfully.`);
    });
  }
  
  // Usage example
  convertFontFaces(
    "https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    "styl/nunito_base64.css"
  );

  convertFontFaces(
    "https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    "styl/roboto_base64.css"
  );
  