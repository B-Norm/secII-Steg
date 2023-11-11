import React, { useState } from "react";
import { Card, Button, Row, Col, Space, Modal, Upload } from "antd";
import { fileDisplay } from "../bitManip/helper";
import { useAuthHeader } from "react-auth-kit";
import { deleteFile, getFiles } from "../interceptors/axios";
import DownloadFile from "../steg/DownloadFile";

const Images = (props) => {
  const [openDownload, setOpenDownload] = useState(false);
  const useAuth = useAuthHeader();

  const showDownload = () => {
    setOpenDownload(true);
  };
  const handleCancelDownload = () => {
    setOpenDownload(false);
  };

  const handleDelete = async (fileId) => {
    const result = await deleteFile(fileId, useAuth);
    if (result) {
      getFiles().then((data) => {
        props.setFiles(data);
      });
    } else {
      alert("File Failed to Delete");
    }
  };

  return (
    <>
      {" "}
      <Row gutter={[16, 16]}>
        {props.files?.map((file, i) => (
          <Col key={i}>
            <Card
              key={i}
              style={{ width: 300, marginTop: 16 }}
              cover={file && fileDisplay(file.stegName, file.file)}
            >
              <Space wrap>
                <Button onClick={showDownload}>Download Hidden File</Button>
                {useAuth() && (
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleDelete(file._id)}
                  >
                    Delete
                  </Button>
                )}
              </Space>
              <Modal
                title="Enter Download Comands"
                open={openDownload}
                destroyOnClose={true}
                onCancel={handleCancelDownload}
                footer={[]}
              >
                <DownloadFile
                  file={file}
                  handleCancelDownload={handleCancelDownload}
                />
              </Modal>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Images;
