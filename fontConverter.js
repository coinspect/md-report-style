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

async function convertFontFaces(url, outputFilename, selectedWeights) {
  const response = await fetch(url);
  const cssText = await response.text();

  const fontFaceRegex = /@font-face\s*\{[^\}]*?\}/g;
  const weightRegex = /font-weight:\s*(\d+)/;
  let replacedCssText = "";

  let match;
  while ((match = fontFaceRegex.exec(cssText))) {
    const fontFace = match[0];
    const weightMatch = fontFace.match(weightRegex);
    if (weightMatch && selectedWeights.includes(parseInt(weightMatch[1], 10))) {
      const urlMatch = fontFace.match(/url\(([^)]+)\)/);
      if (urlMatch) {
        const fontUrl = urlMatch[1];
        const base64Font = await fetchAndEncode(fontUrl);
        const modifiedFontFace = fontFace.replace(fontUrl, base64Font);
        replacedCssText += modifiedFontFace + "\n";
      }
    }
  }

  fs.writeFile(outputFilename, replacedCssText, function (err) {
    if (err) return console.log(err);
    console.log(`File ${outputFilename} saved successfully.`);
  });
}

// Usage example, only keep weights 400 and 700
convertFontFaces(
  "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
  "styl/inter_base64.css",
  [400, 700, 900]
);

convertFontFaces(
  "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100..700&display=swap",
  "styl/roboto_mono_base64.css",
  [400, 700]
);