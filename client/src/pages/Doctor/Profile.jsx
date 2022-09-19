import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import DoctorForm from "../../components/DoctorForm";
import axios from "axios";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
const Profile = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [doctor, setDoctor] = useState(null);
  const getDoctorData = async () => {
    try {
      dispatch(showLoading);
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-userId",
        { userId: params.userId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading);

      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading);
      toast.error("Terjadi kesalahan");
    }
  };

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/update-doctor-account",
        {
          ...values,
          userId: params.userId,
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
        getDoctorData();
      } else {
        dispatch(hideLoading());
        toast.error(response.data.message);
        getDoctorData();
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Terjadi Kesalahan");
    }
  };
  useEffect(async () => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Doctor Profile</h1>
      <hr />
      {doctor && (
        <DoctorForm
          onFinish={onFinish}
          initialValues={{ ...doctor, specialization: doctor.specialization }}
        />
      )}
    </Layout>
  );
};

export default Profile;
