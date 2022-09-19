const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const getCurrentTimeStamp = require("../globalFunctions/getCurrentTimeStamp");

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Fetching Users berhasil",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error saat fetching users",
      success: false,
      error,
    });
  }
});

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
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

router.post(
  "/change-doctor-account-status",
  authMiddleware,
  async (req, res) => {
    try {
      const { doctorId, status } = req.body;
      const doctor = await Doctor.findByIdAndUpdate(doctorId, {
        status: status,
      });

      const userAccount = await User.findById(doctor.userId);

      const isDoctor = status === "active";
      userAccount.isDoctor = isDoctor;

      const unseenNotifications = userAccount.unseenNotifications;
      unseenNotifications.push({
        type: "doctor-status-change",
        message:
          status === "active"
            ? `Selamat ${doctor.firstName} ${doctor.lastName}! Akun doktermu telah aktif.`
            : `Status akun doktermu ${status}`,
        data: {
          doctorId: doctor._id,
          name: doctor.firstName + " " + doctor.lastName,
        },
        onClickPath: "/",
        createdAt: getCurrentTimeStamp(),
      });
      const updatedDoctor = await doctor.save();
      const updatedUserAccount = await userAccount.save();
      res.status(200).send({
        message: "Status dokter diubah",
        success: true,
        data: {
          doctorData: updatedDoctor,
          userData: updatedUserAccount,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error saat mengaktivasi akun",
        success: false,
        error,
      });
    }
  }
);

module.exports = router;
