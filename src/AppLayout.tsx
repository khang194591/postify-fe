import { Avatar, Button, FloatButton } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "./modules/auth/store";

export default function AppLayout() {
  const { pathname } = useLocation();

  const profile = useAuthStore((state) => state.profile);
  return (
    <div className="">
      <div className="w-full sticky top-0 z-50">
        <div className="flex flex-row items-center px-4 py-3 md:px-10 border-b bg-white space-x-2">
          <Link to={"/"} className="font-semibold text-2xl">
            AMS
          </Link>
          {[0, 1].map((item) => (
            <Link to={"#"} key={item}></Link>
          ))}
          <span className="flex-1"></span>
          {profile ? (
            <Avatar>{profile.fName.charAt(0)}</Avatar>
          ) : (
            <>
              <Link to={`/auth/sign-in?redirect=${pathname}`}>
                <Button type="default">Đăng nhập</Button>
              </Link>
              <Link to={`/auth/sign-up?redirect=${pathname}`}>
                <Button type="primary">Đăng ký</Button>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="">
        <Outlet />
      </div>
      <FloatButton.BackTop />
    </div>
  );
}
