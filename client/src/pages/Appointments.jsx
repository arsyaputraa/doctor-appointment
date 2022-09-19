import React from "react";
import { Table } from "antd";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import moment from "moment";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getAllAppointments = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/user/get-appointments-by-user-id",
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
      console.log(error);
      dispatch(hideLoading());
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
      render: (text, record) =>
        "dr." + record.doctorInfo.firstName + " " + record.doctorInfo.lastName,
    },
    {
      title: "Nomor Telepon",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text, record) => record.doctorInfo.phoneNumber,
    },
    {
      title: "Spesialisasi",
      dataIndex: "specialization",
      key: "specialization",
      render: (text, record) => record.doctorInfo.specialization,
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

    ,
  ];
  return (
    <Layout>
      <h1 className="page-title">Daftar Konsultasi</h1>
      <hr />
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default Appointments;
