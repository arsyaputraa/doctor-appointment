const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const getCurrentTimeStamp = require("../globalFunctions/getCurrentTimeStamp");
const Appointment = require("../models/appointmentModel");

const saltRounds = 10;
const moment = require("moment");

router.post("/register", async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    res
      .status(200)
      .send({ message: "User created successfully", success: true });
    newUser.save();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "email/password salah", success: false });
    }
    const password = req.body.password;
    const hashedPassword = user.password;
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatch) {
      return res
        .status(200)
        .send({ message: "email/password salah", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({ message: "Login berhasil", success: true, token: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Terjadi kesalahhan", success: false, error });
  }
});

router.get("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user tidak ada, silahkan login kembali",
        success: false,
      });
    }
    res.status(200).send({
      data: user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "authorization error", success: false });
  }
});

router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    const newDoctor = new Doctor({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} mendaftar untuk menjadi dokter`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onClickPath: "/admin/doctors",
      createdAt: getCurrentTimeStamp(),
    });
    await User.findByIdAndUpdate(adminUser._id, {
      unseenNotifications: unseenNotifications,
    });
    res.status(200).send({
      message: "Pengajuan dokter berhasil dikirim",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error saat mendaftar sebagai dokter",
      success: false,
      error,
    });
  }
});

router.post(
  "/mark-all-notifications-as-seen",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      user.seenNotifications.push(...user.unseenNotifications);
      user.unseenNotifications = [];
      const updatedUser = await user.save();
      res.status(200).send({
        message: "Semua notifikasi telah dibaca",
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error saat memindahkan notifikasi",
        success: false,
        error,
      });
    }
  }
);
router.post(
  "/delete-all-seen-notifications",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      user.seenNotifications = [];
      const updatedUser = await user.save();
      res.status(200).send({
        message: "notifikasi berhasil dihapus",
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error saat menghapus notifikasi",
        success: false,
        error,
      });
    }
  }
);

router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "active" });
    res.status(200).send({
      message: "Fetching Doctors berhasil",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error saat fetching doctors",
      success: false,
      error,
    });
  }
});

router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const appointment = new Appointment(req.body);
    await appointment.save();
    const doctorUserAccount = await User.findOne({
      _id: req.body.doctorInfo.userId,
    });
    doctorUserAccount.unseenNotifications.push({
      type: "new-appointment-request",
      message: `Permintaan konsultasi baru dari ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await doctorUserAccount.save();
    res.status(200).send({
      success: true,
      message: "Booking berhasil",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error saat membuat booking",
      success: false,
      error,
    });
  }
});

router.post("/check-booking-availability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(60, "minutes")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm")
      .add(60, "minutes")
      .toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId: doctorId,
      date: date,
      time: { $gte: fromTime, $lte: toTime },
      status: "approved",
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Jadwal tidak tersedia",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Jadwal tersedia",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error saat mengecek jadwal",
      success: false,
      error,
    });
  }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.find({
      userId: req.body.userId,
    }).sort({ date: 1, time: 1 });
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
});
module.exports = router;
