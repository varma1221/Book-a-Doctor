import React, { useState } from "react";
import { Form, Input, TimePicker, Button, message } from "antd";
import axios from "axios";

function ApplyDoctor({ userId, onComplete }) {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const timings = values.timings.map(t => t.format("HH:mm"));
      const payload = {
        ...values,
        timings,
        userID: userId,
        status: "pending"
      };
      const res = await axios.post("http://localhost:8000/api/user/registerdoc", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        message.success(res.data.message);
        if (onComplete) onComplete();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to apply");
    }
  };

  return (
    <div className="premium-card p-4">
      <h3 className="fw-bold mb-4">Apply as a Doctor</h3>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <h5 className="mb-3 text-secondary">Personal Details</h5>
        <div className="row">
          <div className="col-md-6">
            <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}>
              <Input placeholder="Enter your full name" />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
              <Input placeholder="Enter email address" />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item label="Address" name="address" rules={[{ required: true }]}>
              <Input placeholder="Enter clinic/hospital address" />
            </Form.Item>
          </div>
        </div>

        <h5 className="mt-4 mb-3 text-secondary">Professional Details</h5>
        <div className="row">
          <div className="col-md-6">
            <Form.Item label="Specialization" name="specialisation" rules={[{ required: true }]}>
              <Input placeholder="e.g. Cardiologist" />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item label="Experience (Years)" name="experience" rules={[{ required: true }]}>
              <Input placeholder="e.g. 5 years" />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item label="Consultation Fees" name="fees" rules={[{ required: true }]}>
              <Input type="number" placeholder="Enter fee amount" />
            </Form.Item>
          </div>
          <div className="col-md-6">
            <Form.Item label="Working Timings" name="timings" rules={[{ required: true }]}>
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
          </div>
        </div>

        <Form.Item className="mt-4">
          <Button type="primary" htmlType="submit" className="premium-btn border-0 py-2">
            Submit Application
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ApplyDoctor;
