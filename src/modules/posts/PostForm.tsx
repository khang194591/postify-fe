import { App, Button, Checkbox, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import apiClient from "../../config/axios";
import usePostStore from "./store";
import { CreatePostDto } from "./types";

export default function PostForm() {
  const { notification } = App.useApp();

  const [loading, setLoading] = useState(false);

  const [formState, patchForm, fetchPostList] = usePostStore((state) => [
    state.formState,
    state.patchForm,
    state.fetchPostList,
  ]);

  const [form] = Form.useForm<CreatePostDto>();

  useEffect(() => {
    form.setFieldsValue(formState.data);

    return () => {};
  }, [form, formState.data]);

  return (
    <>
      <Button type="primary" onClick={() => patchForm({})}>
        {"Tạo bài viết"}
      </Button>
      <Modal
        centered
        forceRender
        title={
          <span>
            {formState.type === "create"
              ? "Tạo bài viết"
              : "Chỉnh sửa bài viết"}
          </span>
        }
        open={formState.open}
        onCancel={() => patchForm({ open: false })}
        maskClosable={false}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            setLoading(true);
            const method = formState.type === "create" ? "post" : "patch";
            const response = await apiClient[method](
              `/posts/${formState.type === "create" ? "" : formState.data.id}`,
              { ...values, published: Boolean(values.published) }
            );
            if (response.success) {
              await fetchPostList();
              form.resetFields();
              patchForm({ open: false });
            } else {
              notification.error({ message: response.message });
            }
            setLoading(false);
          }}
        >
          <Form.Item
            label={"Tiêu đề"}
            name={"title"}
            rules={[{ required: true }]}
          >
            <Input placeholder="Bạn đang nghĩ gì thế?" />
          </Form.Item>
          <Form.Item label={"Nội dung"} name={"content"}>
            <Input.TextArea rows={10} placeholder="Hãy mô tả nó tại đây nào!" />
          </Form.Item>
          <Form.Item name={"published"} valuePropName="checked">
            <Checkbox>{"Bản nháp"}</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button block loading={loading} type="primary" htmlType="submit">
              Đăng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
