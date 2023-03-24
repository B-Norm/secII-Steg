import React from "react";
import { Card, Button, Row, Col } from "antd";
import { showSteg } from "../bitManip/helper";

const FileDisplay = (fileName, fileString) => {
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

const Images = ({ files }) => {
  const columnCount = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  };

  const downloadHiddenFile = (file) => {
    const nums = file.file.split(",").map((n) => parseInt(n, 10));
    const byteStream = Uint8Array.from(nums);
    showSteg(byteStream, file.mSize, file.mSkip, file.mPeriod, file.mName);
  };

  return (
    <>
      {" "}
      <Row gutter={[16, 16]}>
        {files?.map((file, i) => (
          <Col key={i} /* span={24 / columnCount} */>
            <Card
              key={i}
              style={{ width: 300, marginTop: 16 }}
              cover={file && FileDisplay(file.stegName, file.file)}
            >
              <Button onClick={() => downloadHiddenFile(file)}>
                Download Hidden File
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Images;
