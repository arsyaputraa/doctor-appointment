import React, { useState } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import { Badge } from "antd";
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userMenu = [
    {
      name: "Konsultasi",
      path: "/appointments",
      icon: "ri-calendar-check-line",
    },
    {
      name: "Saya Dokter",
      path: "/applydoctor",
      icon: "ri-file-user-line",
    },
  ];

  const adminMenu = [
    {
      name: "Pengguna",
      path: "/admin/users",
      icon: "ri-team-line",
    },
    {
      name: "Dokter",
      path: "/admin/doctors",
      icon: "ri-user-2-line",
    },
  ];

  const doctorMenu = [
    {
      name: "Appointment",
      path: "/doctor/appointments",
      icon: "ri-calendar-check-line",
    },
    {
      name: "Profil",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];

  const menuToRender = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  return (
    <div className="main">
      <div className="layout d-flex">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="product-title">
              {collapsed ? "TD" : "Temu Dokter"}
            </h1>
            <p className="user-role">
              {user?.isAdmin ? "Admin" : user?.isDoctor ? "Dokter" : "User"}
            </p>
          </div>
          <div className="menu">
            <div
              className={`menu-item d-flex cursor-pointer `}
              onClick={() => {
                navigate("/");
              }}
            >
              <i className="ri-home-line"></i>

              {!collapsed && <Link to="/">Beranda</Link>}
            </div>
            {menuToRender.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  className={`menu-item d-flex cursor-pointer ${
                    isActive && "active-menu-item"
                  }`}
                  onClick={() => {
                    navigate(menu.path);
                  }}
                >
                  {collapsed ? (
                    <Link to={menu.path}>
                      <i className={menu.icon}></i>
                    </Link>
                  ) : (
                    <i className={menu.icon}></i>
                  )}
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div
              className={`menu-item d-flex cursor-pointer `}
              onClick={() => {
                dispatch(setUser(null));
                localStorage.clear();
                navigate("/login");
              }}
            >
              <i className="ri-logout-circle-r-line"></i>

              {!collapsed && <Link to="/login">Log Out</Link>}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-menu-fill header-action-icon"
                onClick={() => {
                  setCollapsed(false);
                }}
              ></i>
            ) : (
              <i
                className="ri-close-fill header-action-icon"
                onClick={() => {
                  setCollapsed(true);
                }}
              ></i>
            )}
            <div className="d-flex align-items-center px-4">
              <Badge
                count={user?.unseenNotifications.length}
                onClick={() => {
                  navigate("/notifikasi");
                }}
              >
                <i className="ri-notification-line header-action-icon pr-2"></i>
              </Badge>

              <Link to="/profile" className="anchor ps-3">
                {user?.name}
              </Link>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
