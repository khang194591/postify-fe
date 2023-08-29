import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, App as AntdApp } from "antd";
import AuthLayout from "./modules/auth/AuthLayout";
import SignInPage from "./modules/auth/SignInPage";
import SignUpPage from "./modules/auth/SignUpPage";
import vi_Vn from "antd/locale/vi_VN";
import HomePage from "./modules/home/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <StyleProvider hashPriority="high">
        <ConfigProvider
          locale={vi_Vn}
          theme={{
            token: {
              fontFamily: "JetBrains Mono",
              borderRadius: 10,
              colorPrimary: "#4f46e5",
            },
            components: {
              Button: {
                controlHeight: 40,
              },
              Input: {
                controlHeight: 40,
              },
            },
          }}
        >
          <AntdApp>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<HomePage />} />
              </Route>
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="sign-up" element={<SignUpPage />} />
                <Route path="sign-in" element={<SignInPage />} />
              </Route>
            </Routes>
          </AntdApp>
        </ConfigProvider>
      </StyleProvider>
    </BrowserRouter>
  );
}
