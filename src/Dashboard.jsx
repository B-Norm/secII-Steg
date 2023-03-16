import { useState } from "react";
// using code from antd
import { Button, Space, Layout, Modal, theme, Input } from "antd";
import Login from "./login/Login.jsx";
import Register from "./login/Register.jsx";
import UploadFile from "./steg/UploadFile.jsx";
import { useIsAuthenticated, useAuthUser, useSignOut } from "react-auth-kit";

const { Header, Content, Footer } = Layout;

const App = () => {
  // states for login button
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Login");
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

  // TODO: show all files with a button to decode
  return (
    <Layout
      style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
    >
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
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
          }}
        >
          Content
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
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
          setLoginOpen={setLoginOpen}
          registerOpen={registerOpen}
          setRegisterOpen={setRegisterOpen}
          modalTitle={modalTitle}
          setModalTitle={setModalTitle}
        />
      </Modal>
    </Layout>
  );
};
export default App;
