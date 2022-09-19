import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useDispatch } from "react-redux";
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/register", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        dispatch(hideLoading());
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Terjadi Kesalahan");
      dispatch(hideLoading());
    }
  };
  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Daftar</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Nama Lengkap"
            name="name"
            rules={[
              {
                required: true,
                message: "Masukkan Nama!",
              },
            ]}
          >
            <Input placeholder="Nama" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Masukkan Email!",
              },
            ]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "masukkan password!",
              },
            ]}
          >
            <Input.Password placeholder="Password" id="password-register" />
          </Form.Item>
          <div className="d-flex flex-column">
            <Button
              className="primary-button my-2 full-width-button"
              htmlType="submit"
            >
              Daftar
            </Button>
            <Link className="anchor" to="/login">
              LOGIN
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
