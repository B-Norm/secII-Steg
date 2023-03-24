import { useEffect, useState } from "react";
// using code from antd
import { Button, Space, Layout, Modal, theme, Input } from "antd";
import Login from "../login/Login.jsx";
import Register from "../login/Register.jsx";
import UploadFile from "../steg/UploadFile.jsx";
import { useIsAuthenticated, useAuthUser, useSignOut } from "react-auth-kit";
import Images from "./Images.jsx";
import axios from "axios";

const { Header, Content, Footer } = Layout;
const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  // states for login button
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [reload, setReload] = useState(0);
  const [modalTitle, setModalTitle] = useState("Login");
  const [files, setFiles] = useState([]);
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const signOut = useSignOut();

  const showLogin = () => {
    setLoginOpen(true);
  };
  const showUpload = () => {
    setUploadOpen(true);
  };
  const handleCancel = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
    setModalTitle("Login");
  };
  const handleCancelUpload = () => {
    setUploadOpen(false);
  };

  const logout = () => {
    signOut();
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const getFiles = async () => {
    const url = "/api/getFiles";

    const options = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        api_key: API_KEY,
      },
      url: url,
    };

    const res = await axios(options)
      .then((response) => {
        if (response.status === 200) {
          setFiles(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getFiles();
  }, [reload]);

  return (
    <Layout style={{ top: 0, bottom: 0, left: 0, right: 0 }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
        }}
      >
        {isAuthenticated() && (
          <h1 style={{ color: "white", float: "left" }}>
            {" "}
            Hello {auth().username}
          </h1>
        )}

        <div style={{ textAlign: "center" }}>
          <Space wrap>
            {!isAuthenticated() ? (
              <Button type="primary" padding="5px" onClick={showLogin}>
                Login
              </Button>
            ) : (
              <>
                <Button type="primary" padding="5px" onClick={logout}>
                  Logout
                </Button>
                <Button type="primary" padding="5px" onClick={showUpload}>
                  upload
                </Button>
              </>
            )}
          </Space>
        </div>
      </Header>
      <Content
        className="site-layout"
        style={{
          padding: "50px 50px",
          background: "#1f1f1f",
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: "#696969",
          }}
        >
          <Images files={files} />
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          background: "#1f1f1f",
          bottom: 0,
          width: "100%",
        }}
      >
        Assignment 4 Created by Bradley Norman 1000902210
      </Footer>

      <Modal
        title={modalTitle}
        open={loginOpen}
        destroyOnClose={true}
        //onOk={handleLogin}
        //confirmLoading={confirmLogin}
        onCancel={handleCancel}
        footer={[]}
      >
        {!registerOpen ? (
          <Login
            loginOpen={loginOpen}
            setLoginOpen={setLoginOpen}
            registerOpen={registerOpen}
            setRegisterOpen={setRegisterOpen}
            modalTitle={modalTitle}
            setModalTitle={setModalTitle}
          />
        ) : (
          <Register
            loginOpen={loginOpen}
            setLoginOpen={setLoginOpen}
            registerOpen={registerOpen}
            setRegisterOpen={setRegisterOpen}
            modalTitle={modalTitle}
            setModalTitle={setModalTitle}
          />
        )}
      </Modal>

      <Modal
        title="Upload Image"
        open={uploadOpen}
        destroyOnClose={true}
        //onOk={handleLogin}
        //confirmLoading={confirmLogin}
        onCancel={handleCancelUpload}
        footer={[]}
      >
        <UploadFile
          loginOpen={loginOpen}
          setUploadOpen={setUploadOpen}
          modalTitle={modalTitle}
          setModalTitle={setModalTitle}
          setReload={setReload}
          reload={reload}
        />
      </Modal>
    </Layout>
  );
};
export default App;
