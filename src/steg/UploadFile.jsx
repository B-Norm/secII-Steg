import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, Input, InputNumber, Form } from "antd";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { bitsToBytes, saveByteArray, toBinString } from "../bitManip/helper";
import axios from "axios";

const UploadFile = (props) => {
  const [plaintext, setPlaintext] = useState(null);
  const [message, setMessage] = useState(null);
  let mSize = 0;
  const [inputValue, setInputValue] = useState("");
  const [intList, setIntList] = useState([]);
  const useAuth = useAuthHeader();

  // put message file into the bits of the
  // plaintext file and return modified plaintext
  const handleSteganography = (S, C) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      var hiddenBits = [];
      var modifiedBits = [];
      reader.onload = () => {
        let originalData = new Uint8Array(reader.result);
        const hiddenReader = new FileReader();
        hiddenReader.onload = () => {
          const hiddenData = new Uint8Array(hiddenReader.result);
          hiddenBits = toBinString(hiddenData);
          modifiedBits = toBinString(originalData);
          mSize = hiddenBits.length;
          // handle the replacing of the bits to the original array
          for (
            let i = S - 1, arrayIndexFinder = 0, j = 0;
            j < hiddenBits.length;
            i += C[arrayIndexFinder % C.length], j++
          ) {
            modifiedBits[i] = hiddenBits[j];
          }
          resolve(bitsToBytes(modifiedBits));
        };
        hiddenReader.readAsArrayBuffer(message);
      };
      reader.readAsArrayBuffer(plaintext);
    });
  };

  // Do steg on plaintext file and move the
  // hidden file to the database with the
  // fileType of message, Period/ mode,
  // skip bit,
  const upload = async (values) => {
    const url = "/api/upload";
    const { startingBit } = values;
    var period = [values.lengthB];
    if (intList) {
      period = period.concat(intList);
    }

    const stegFile = await handleSteganography(startingBit, period);

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: useAuth(),
      },
      data: {
        stegName: values.plaintext.file.name,
        file: stegFile.toString(),
        mName: values.message.file.name,
        mSkip: startingBit,
        mPeriod: period,
        mSize: mSize,
      },
      url: url,
    };

    const res = await axios(options)
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          props.setUploadOpen(false);
          props.setReload(props.reload + 1);
        }
      })
      .catch((err) => {
        alert("Upload Error");
        console.log(err);
      });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    const inputArray = inputValue.split(",");
    const intArray = inputArray.map((num) => parseInt(num.trim(), 10));
    setIntList(intArray.filter((num) => !isNaN(num)));
  };

  return (
    <>
      <Form
        name="normal_upload"
        className="upload-form"
        initialValues={{
          remember: true,
        }}
        onFinish={upload}
      >
        <Form.Item
          label="Plaintext File (P)"
          name="plaintext"
          rules={[
            {
              required: true,
              message: "Please input your Plaintext File!",
            },
          ]}
        >
          <Upload
            beforeUpload={(file) => {
              console.log({ file });
              return false;
            }}
            onChange={(info) => setPlaintext(info.file)}
          >
            <button>Click to Upload</button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Message File (M)"
          name="message"
          rules={[
            {
              required: true,
              message: "Please input your Message File!",
            },
          ]}
        >
          <Upload
            beforeUpload={(file) => {
              console.log({ file });
              return false;
            }}
            onChange={(info) => setMessage(info.file)}
          >
            <button>Click to Upload</button>
          </Upload>
        </Form.Item>

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
              //required: true,
              message: "Please input your Choice!",
            },
          ]}
        >
          <Input
            placeholder="Enter comma-separated integers"
            onChange={handleInputChange}
          />
          <Button type="primary" onClick={handleButtonClick}>
            Get Int List
          </Button>
          <div>Int List: {intList.join(", ")}</div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Upload
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UploadFile;
