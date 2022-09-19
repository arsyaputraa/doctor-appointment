import { Col, Row } from "antd";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import DoctorCard from "../components/DoctorCard";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertsSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const getDoctors = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("api/user/get-all-approved-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        dispatch(hideLoading());
        setDoctors(response.data.data);
      } else {
        dispatch(hideLoading());
        toast(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Terjadi Kesalahan");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);
  return (
    <Layout>
      <h1 className="page-title">Beranda</h1>
      <hr />
      <Row gutter={15}>
        {doctors?.map((doctor, index) => {
          return (
            <Col span={8} lg={8} xs={24} sm={24} md={12}>
              <DoctorCard doctor={doctor} key={index} />
            </Col>
          );
        })}
      </Row>
    </Layout>
  );
};

export default Home;
