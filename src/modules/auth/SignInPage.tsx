import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../../config/axios";
import { AuthResponse, SignInDto } from "./types";
import { useAuthStore } from "./store";

export default function SignInPage() {
  const [form] = Form.useForm<SignInDto>();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fetchFromStorage = useAuthStore((state) => state.fetchFromStorage);

  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: SignInDto) => {
    setLoading(true);
    const response = await apiClient.post<AuthResponse>(
      "/auth/sign-in",
      values
    );
    if (response.success) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("profile", JSON.stringify(response.data.profile));
      fetchFromStorage();
      navigate(searchParams.get("redirect") ?? "/");
    } else {
      form.setFields([
        { name: "email", errors: [""] },
        { name: "password", errors: ["Thông tin đăng nhập không hợp lệ"] },
      ]);
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col gap-4">
      <span className="text-center">
        <span className="font-semibold text-2xl">AMS</span>
      </span>
      <h2 className="text-center text-2xl font-bold">Đăng nhập</h2>
      <Form
        name="sign-in-form"
        form={form}
        onFinish={onFinish}
        requiredMark={false}
        layout="vertical"
      >
        <Form.Item
          label={"Email"}
          name={"email"}
          rules={[{ type: "email", required: true }]}
        >
          <Input placeholder="Nhập địa chỉ mail" />
        </Form.Item>
        <Form.Item
          label={"Mật khẩu"}
          name={"password"}
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button
            block
            loading={loading}
            type="primary"
            htmlType="submit"
            className="uppercase mt-5"
          >
            Đăng nhập
          </Button>
        </Form.Item>
        <Form.Item>
          <span className="text-center">
            <p>
              Chưa có tài khoản? <Link to={"/auth/sign-up"}>Đăng ký ngay</Link>
            </p>
          </span>
        </Form.Item>
      </Form>
    </div>
  );
}
