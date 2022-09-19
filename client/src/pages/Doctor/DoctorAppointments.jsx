import React from "react";
import { Table } from "antd";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import moment from "moment";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getAllAppointments = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/doctor/get-appointments-by-doctor-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      } else {
        dispatch(hideLoading());
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Terjadi Kesalahan");
    }
  };

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/change-appointment-status",
        { appointmentId: record._id, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAllAppointments();
      } else {
        dispatch(hideLoading());
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Terjadi Kesalahan");
    }
  };

  useEffect(() => {
    getAllAppointments();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
      render: (text, record) => record.userInfo.name,
    },
    {
      title: "Email Pasien",
      dataIndex: "email",
      key: "email",
      render: (text, record) => record.userInfo.email,
    },
    {
      title: "Waktu",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (text, record) =>
        moment(record.date).format("DD-MM-YYYY") +
        " " +
        moment(record.time).format("HH:mm"),
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <p
          className={`${
            record.status === "approved"
              ? "text-success"
              : record.status === "rejected"
              ? "text-danger"
              : "text-primary"
          }`}
        >
          {record.status.toUpperCase()}
        </p>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        return (
          record.status === "pending" && (
            <div className="d-flex justify-content-between">
              <h1
                onClick={() => {
                  changeAppointmentStatus(record, "approved");
                }}
                className="anchor px-2 text-success"
              >
                Approve
              </h1>{" "}
              <h1
                onClick={() => {
                  changeAppointmentStatus(record, "rejected");
                }}
                className="anchor px-2 text-danger"
              >
                Reject
              </h1>
            </div>
          )
        );
      },
    },
    ,
  ];
  return (
    <Layout>
      <h1 className="page-title">Daftar Konsultasi</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default DoctorAppointments;
