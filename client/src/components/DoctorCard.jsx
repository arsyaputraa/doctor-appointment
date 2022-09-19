import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card p-3 cursor-pointer"
      onClick={() => {
        navigate(`/book-appointment/${doctor._id}`);
      }}
    >
      <h1 className="card-title">
        dr. {doctor?.firstName} {doctor?.lastName}
      </h1>
      <hr />
      <p className="card-text">
        <span className="card-label">Spesialisasi: </span>
        {doctor?.specialization}
      </p>
      <p className="card-text">
        <span className="card-label">Pengalaman: </span>
        {doctor?.experience} Tahun
      </p>
      <p className="card-text">
        <span className="card-label">Lokasi: </span>
        {doctor?.address}
      </p>
      {/* <p className="card-text">
        <span className="card-label">Tarif Konsultasi: </span>
        {rupiah(doctor?.feePerConsultation)}
      </p> */}
      <p className="card-text">
        <span className="card-label">Jam Praktek: </span>
        {doctor?.timings[0]}
        {" - "}
        {doctor?.timings[1]}
      </p>
    </div>
  );
};

export default DoctorCard;
