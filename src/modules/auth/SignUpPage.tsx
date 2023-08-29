import { Button, Form, Input } from "antd";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../../config/axios";
import { AuthResponse, SignUpDto } from "./types";
import { useAuthStore } from "./store";

export default function SignUpPage() {
  const [form] = Form.useForm<SignUpDto>();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fetchFromStorage = useAuthStore((state) => state.fetchFromStorage);

  const [loading, setLoading] = useState(false);

  const onFinish = async (values: SignUpDto) => {
    setLoading(true);
    const response = await apiClient.post<AuthResponse>(
      "/auth/sign-up",
      values
    );
    if (response.success) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("profile", JSON.stringify(response.data.profile));
      fetchFromStorage();
      navigate(searchParams.get("redirect") ?? "/");
    } else {
      form.setFields([
        {
          name: "email",
          errors: ["Email đã được sử dụng"],
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="text-center">
        <span className="font-semibold text-2xl">AMS</span>
      </span>
      <h2 className="text-center text-2xl font-bold">Đăng ký</h2>
      <Form
        name="sign-up-form"
        form={form}
        onFinish={onFinish}
        requiredMark={false}
        layout="vertical"
      >
        <div className="inline-flex gap-3">
          <Form.Item
            label={"Họ và tên đệm"}
            name={"lName"}
            rules={[{ required: true, message: "Trường này là bắt buộc" }]}
          >
            <Input placeholder="Nhập họ và tên đệm" />
          </Form.Item>
          <Form.Item
            label={"Tên"}
            name={"fName"}
            rules={[{ required: true, message: "Trường này là bắt buộc" }]}
          >
            <Input placeholder="Nhập tên của bạn" />
          </Form.Item>
        </div>
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
            Đăng ký
          </Button>
        </Form.Item>
        <Form.Item>
          <span className="text-center">
            <p>
              Đã có tài khoản? <Link to={"/auth/sign-in"}>Đăng nhập ngay</Link>
            </p>
          </span>
        </Form.Item>
      </Form>
    </div>
  );
}
