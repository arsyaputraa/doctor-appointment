import { Col, Row, TimePicker, Button, Form, Input, Select } from "antd";
import moment from "moment";
import React from "react";
import { useState } from "react";
import dataSpesialisasi from "../data/dataspesialis";

const { Option } = Select;

function DoctorForm({ onFinish, initialValues }) {
  initialValues = initialValues
    ? {
        ...initialValues,
        timings: [
          moment(initialValues.timings[0], "HH:mm"),
          moment(initialValues.timings[1], "HH:mm"),
        ],
      }
    : null;
  const [spesialisasi, setSpesialisasi] = useState(
    initialValues?.specialization ? initialValues.specialization : "Dokter Umum"
  );
  const onChange = (spesialisasi) => {
    setSpesialisasi(spesialisasi);
  };

  const submit = (values) => {
    values.specialization = spesialisasi;
    values.timings = [
      moment(values.timings[0]).format("HH:mm"),
      moment(values.timings[1]).format("HH:mm"),
    ];
    onFinish(values);
  };
  return (
    <Form layout="vertical" onFinish={submit} initialValues={initialValues}>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Nama Depan"
            name="firstName"
            rules={[{ required: true, message: "Data ini diperlukan" }]}
          >
            <Input placeholder="Nama Depan" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Nama Belakang"
            name="lastName"
            rules={[{ required: true, message: "Data ini diperlukan" }]}
          >
            <Input placeholder="Nama Belakang" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Nomor Telepon"
            name="phoneNumber"
            rules={[{ required: true, message: "Data ini diperlukan" }]}
          >
            <Input placeholder="Nomor Telepon" type="number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Alamat"
            name="address"
            rules={[{ required: true, message: "Data ini diperlukan" }]}
          >
            <Input placeholder="Alamat" />
          </Form.Item>
        </Col>
      </Row>
      <hr />
      <Row gutter={20}>
        {/* <Col span={8} xs={24} sm={24} lg={8}>
      <Form.Item
        required
        label="Spesialisasi"
        name="specialization"
        rules={[
          {
            required: true,
            message: "Data ini diperlukan",
          },
        ]}
      >
        <Input placeholder="Spesialisasi" />
      </Form.Item>
    </Col> */}
        <Col span={8} xs={24} sm={24} lg={8}>
          <div className="form-spesialisasi">
            <label for="specialization" className="ant-form-item-required">
              Spesialisasi
            </label>
            <Select
              required
              id="specialization"
              showSearch
              placeholder="Spesialisasi"
              optionFilterProp="children"
              onChange={onChange}
              defaultValue={spesialisasi}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {dataSpesialisasi.map((spesialisObj) => (
                <Option value={spesialisObj.spesialis}>
                  {spesialisObj.spesialis}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Nomor Surat Tanda Registrasi"
            name="nomorSuratRegistrasi"
            rules={[
              {
                required: true,
                message: "Data ini diperlukan",
              },
            ]}
          >
            <Input placeholder="Surat Tanda Registrasi" type="number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Pengalaman"
            name="experience"
            rules={[{ required: true, message: "Data ini diperlukan" }]}
          >
            <Input placeholder="Berapa Tahun" type="number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Harga per Konsultasi"
            name="feePerConsultation"
            rules={[{ required: true, message: "Data ini diperlukan" }]}
          >
            <Input placeholder="Rupiah" type="number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Jam Operasional"
            name="timings"
            rules={[{ required: true, message: "Data ini diperlukan" }]}
          >
            <TimePicker.RangePicker format={"HH:mm"} />
          </Form.Item>
        </Col>
      </Row>
      <div className="d-flex justify-content-end">
        <Button htmlType="submit" className="primary-button">
          KIRIM
        </Button>
      </div>
    </Form>
  );
}

export default DoctorForm;
