import React from "react";
import Layout from "../components/Layout";
import { Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import toast from "react-hot-toast";
import { setUser } from "../redux/userSlice";

const Notifications = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/mark-all-notifications-as-seen",
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        dispatch(hideLoading());
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      dispatch(hideLoading());
    }
  };

  const deleteAllSeenNotifications = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/delete-all-seen-notifications",
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        dispatch(hideLoading());
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      dispatch(hideLoading());
    }
  };
  return (
    <Layout>
      <h1 className="page-title">Notifikasi</h1>
      <Tabs>
        <Tabs.TabPane tab="Belum dibaca" key={0}>
          <div className="d-flex justify-content-end">
            {user?.unseenNotifications.length > 0 && (
              <h2
                className="anchor"
                onClick={() => {
                  markAllAsSeen();
                }}
              >
                Sudah dibaca semua
              </h2>
            )}
          </div>

          {user?.unseenNotifications
            .slice(0)
            .reverse()
            .map((notification) => (
              <div
                className="card p-2 notification cursor-pointer p-2 mt-2"
                onClick={() => {
                  navigate(notification.onClickPath);
                }}
              >
                <div className="card-text">{notification.message}</div>
                <div className="card-timestamp">{notification.createdAt}</div>
              </div>
            ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Sudah dibaca" key={1}>
          <div className="d-flex justify-content-end">
            {user?.seenNotifications.length > 0 && (
              <h2
                onClick={() => {
                  deleteAllSeenNotifications();
                }}
                className="anchor"
              >
                Hapus semua notifikasi yang sudah dibaca
              </h2>
            )}
          </div>
          {user?.seenNotifications
            .slice(0)
            .reverse()
            .map((notification) => (
              <div
                className="card p-2 notification cursor-pointer p-2 mt-2"
                onClick={() => {
                  navigate(notification.onClickPath);
                }}
              >
                <div className="card-text">{notification.message}</div>
                <div className="card-timestamp">{notification.createdAt}</div>
              </div>
            ))}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default Notifications;
