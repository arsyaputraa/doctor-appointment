import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import bookingIllustration from "../assets/images/bookingIllustration.svg";

const BookAppointment = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);

  const params = useParams();

  const dispatch = useDispatch();

  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Terjadi Kesalahan");
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: doctor._id,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        setTime();
        setDate();
        setIsAvailable(false);
        navigate("/appointments");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Terjadi Kesalahan");
      dispatch(hideLoading());
    }
  };
  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: doctor._id,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Terjadi Kesalahan");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      <div>
        <h1 className="page-title">
          dr. {doctor?.firstName} {doctor?.lastName}
        </h1>
        <hr />
        <Row gutter={25} className="mt-5" align="top">
          <Col span={8} lg={8} sm={24} xs={24}>
            <img
              src={bookingIllustration}
              alt="booking-illustration"
              width="100%"
            />
          </Col>
          <Col span={8} lg={8} sm={24} xs={24}>
            <h2 className="card-title big-text">Jam Praktek</h2>
            <p className="normal-text">
              {doctor?.timings[0]} - {doctor?.timings[1]}
            </p>
            <div className="d-flex flex-column">
              <DatePicker
                placeholder="Pilih Tanggal"
                format={"DD-MM-YYYY"}
                onChange={(value) => {
                  setIsAvailable(false);
                  setDate(moment(value).format("DD-MM-YYYY"));
                }}
              />
              <TimePicker
                placeholder="Pilih Jam"
                format={"HH-mm"}
                className="mt-3"
                onChange={(value) => {
                  setIsAvailable(false);
                  setTime(moment(value).format("HH:mm"));
                }}
              />

              <Button
                disabled={isAvailable}
                type="primary"
                className="primary-button mt-3 full-width-button"
                onClick={checkAvailability}
              >
                Cek Ketersediaan
              </Button>

              <Button
                type="primary"
                disabled={!isAvailable}
                className="primary-button mt-3 full-width-button"
                onClick={bookNow}
              >
                Booking Sekarang
              </Button>
            </div>
          </Col>
          <Col span={8} lg={8} sm={24} xs={24}>
            <h2 className="card-title big-text">Informasi Dokter</h2>
            <div className="pt-3">
              <p className="normal-text">
                <span className="card-label">Spesialisasi: </span>
                {doctor?.specialization}
              </p>
              <p className="normal-text">
                <span className="card-label">Lokasi: </span>
                {doctor?.address}
              </p>
              <p className="normal-text">
                <span className="card-label">Pengalaman: </span>
                {doctor?.experience} Tahun
              </p>
              <p className="normal-text">
                <span className="card-label">Nomor Telepon: </span>
                {doctor?.phoneNumber}
              </p>
              <p className="normal-text">
                <span className="card-label">Tarif Konsultasi: </span>
                {rupiah(doctor?.feePerConsultation)}
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default BookAppointment;
