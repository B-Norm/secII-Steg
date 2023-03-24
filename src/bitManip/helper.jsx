// holds helper functions for bit manipulation
export var toBinString = (bytes) => {
  var _str = bytes.reduce(
    (str, byte) => str + byte.toString(2).padStart(8, "0"),
    ""
  );
  return [..._str];
};

// converts a bit string into Bytes ChatGPT and me
export const bitsToBytes = (bits) => {
  //const _bits = bits.split("").map((_bits) => parseInt(_bits, 10));

  const bytes = new Uint8Array(Math.ceil(bits.length / 8));
  let byteIndex = 0;
  let bitIndex = 7;

  for (let i = 0; i < bits.length; i++) {
    if (bits[i] != 0) {
      bytes[byteIndex] |= 1 << bitIndex;
    }
    bitIndex--;

    if (bitIndex === -1) {
      bitIndex = 7;
      byteIndex++;
    }
  }

  return bytes;
};

export function saveByteArray(byteArray, fileName) {
  const blob = new Blob([byteArray], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
}

export const showSteg = (file, size, start, period, name) => {
  var modifiedFile = toBinString(file);
  var message = [];
  for (
    let i = start - 1, arrayIndexFinder = 0, j = 0;
    j < size;
    i += period[arrayIndexFinder % period.length], j++
  ) {
    message[j] = modifiedFile[i];
  }
  var messageBytes = bitsToBytes(message);
  saveByteArray(messageBytes, name);
};

// Display Files to Dash
export const FileDisplay = (fileName, fileString) => {
  const nums = fileString.split(",").map((n) => parseInt(n, 10));
  const byteStream = Uint8Array.from(nums);

  const blob = new Blob([byteStream], {
    type: "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);

  const fileType = fileName.split(".").pop();

  if (fileType === "jpg" || fileType === "png" || fileType === "gif") {
    // If the file is an image, display it using an img tag
    return <img src={url} alt={fileName} />;
  } else if (fileType === "mp4") {
    // If the file is a video, display it using a video tag
    return (
      <video controls>
        <source src={url} type="video/mp4" />
      </video>
    );
  } else if (fileType === "mp3") {
    return (
      <audio controls>
        <source src={url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    );
  } else {
    // If the file type is not supported, display an error message
    return <p>Unsupported file type: {fileType}</p>;
  }
};
