const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const getCurrentTimeStamp = require("../globalFunctions/getCurrentTimeStamp");

router.post("/get-doctor-info-by-userId", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    if (!doctor) {
      return res.status(200).send({
        message: "Tidak terdaftar sebagai dokter",
        success: false,
      });
    }
    res.status(200).send({
      data: doctor,
      success: true,
      message: "Data dokter berhasil di-fetch",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error saat fetching data dokter", success: false });
  }
});

router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    if (!doctor) {
      return res.status(200).send({
        message: "Tidak terdaftar sebagai dokter",
        success: false,
      });
    }
    res.status(200).send({
      data: doctor,
      success: true,
      message: "Data dokter berhasil di-fetch",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error saat fetching data dokter", success: false });
  }
});

router.post("/update-doctor-account", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    doctor.save();
    res.status(200).send({
      data: doctor,
      success: true,
      message: "Update berhasil",
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "Error saat update data dokter", success: false });
  }
});

router.get(
  "/get-appointments-by-doctor-id",
  authMiddleware,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.body.userId });
      const appointment = await Appointment.find({
        doctorId: doctor._id,
      }).sort({ date: 1, time: 1, createdAt: 1 });
      res.status(200).send({
        data: appointment,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .send({ message: "Error fetching appointment", success: false });
    }
  }
);

router.post("/change-appointment-status", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status: status,
    });

    const userAccount = await User.findById(appointment.userId);

    const unseenNotifications = userAccount.unseenNotifications;
    unseenNotifications.push({
      type: `appointment-status-changed`,
      message:
        status === "approved"
          ? `Konsultasi dengan dr. ${appointment.doctorInfo.firstName} ${appointment.doctorInfo.lastName} telah disetujui`
          : `Status konsultasi dengan dr. ${appointment.doctorInfo.firstName} ${appointment.doctorInfo.lastName} : ${status}`,
      onClickPath: "/appointments",
      createdAt: getCurrentTimeStamp(),
    });
    await appointment.save();
    await userAccount.save();
    res.status(200).send({
      message: "Status berhasil diubah",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error saat mengubah status",
      success: false,
      error,
    });
  }
});

module.exports = router;
