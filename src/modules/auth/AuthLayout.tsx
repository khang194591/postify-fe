import { Modal } from "antd";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div>
      <Modal forceRender open closable={false} footer={null}>
        <Outlet />
      </Modal>
    </div>
  );
}
