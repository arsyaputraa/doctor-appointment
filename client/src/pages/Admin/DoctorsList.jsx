import { Table } from "antd";
import axios from "axios";
import moment from "moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { hideLoading, showLoading } from "../../redux/alertsSlice";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getAllDoctors = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
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

  const changeDoctorAccountStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/change-doctor-account-status",
        { doctorId: record._id, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAllDoctors();
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
    getAllDoctors();
  }, []);

  const columns = [
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <>
          {record.firstName} {record.lastName}
        </>
      ),
    },
    {
      title: "Nomor Telepon",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Nomor Surat",
      dataIndex: "nomorSuratRegistrasi",
      key: "nomorSuratRegistrasi",
    },
    {
      title: "Spesialisasi",
      dataIndex: "specialization",
      key: "specialization",
    },
    {
      title: "Created At",
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
            record.status === "active"
              ? "text-success"
              : record.status === "blocked"
              ? "text-danger"
              : record.status === "rejected"
              ? "text-warning"
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
          <div className="d-flex">
            {record.status === "pending" && (
              <>
                <h1
                  onClick={() => {
                    changeDoctorAccountStatus(record, "active");
                  }}
                  className="anchor"
                >
                  Approve
                </h1>
                <h1
                  onClick={() => {
                    changeDoctorAccountStatus(record, "rejected");
                  }}
                  className="anchor px-2 text-danger"
                >
                  Reject
                </h1>
              </>
            )}
            {record.status === "active" && (
              <h1
                onClick={() => {
                  changeDoctorAccountStatus(record, "blocked");
                }}
                className="anchor"
              >
                Block
              </h1>
            )}
          </div>
        );
      },
    },
    ,
  ];

  return (
    <Layout>
      <h1 className="page-title">Doctors</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
};

export default DoctorsList;
