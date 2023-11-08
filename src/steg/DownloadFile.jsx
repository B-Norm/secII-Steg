import React, { useState } from "react";
import { Button, Upload, Input, InputNumber, Form } from "antd";
import { downloadHiddenFile } from "../bitManip/helper";

const UploadFile = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [intList, setIntList] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    const inputArray = inputValue.split(",");
    const intArray = inputArray.map((num) => parseInt(num.trim(), 10));
    setIntList(intArray.filter((num) => !isNaN(num)));
  };

  const download = (file) => {
    downloadHiddenFile(file);
  };

  return (
    <>
      <Form
        name="download-file"
        className="download-form"
        initialValues={{
          remember: true,
        }}
        onFinish={() => download(props.file)}
      >
        <Form.Item
          label="Starting Bit (S)"
          name="startingBit"
          rules={[
            {
              required: true,
              message: "Please input your Starting Bit!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("startingBit") % 1 == 0) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("Enter a number with No Decimal!")
                );
              },
            }),
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Length between bits (L)"
          name="lengthB"
          rules={[
            {
              required: true,
              message: "Please input your Length!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("lengthB") % 1 == 0) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("Enter a number with No Decimal!")
                );
              },
            }),
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Mode of Operation (C)"
          name="choice"
          rules={[
            {
              message: "Please input your Choice!",
            },
          ]}
        >
          <Input
            placeholder="Enter comma-separated integers"
            onChange={handleInputChange}
          />
          <Button type="primary" onClick={handleButtonClick}>
            Set Int List
          </Button>
          <div>Int List: {intList.join(", ")}</div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Download
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UploadFile;
