import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button, Badge, Nav } from "react-bootstrap";
import { Form, Input, TimePicker, Button as AntButton, message } from "antd";
import axios from "axios";
import moment from "moment";

function DoctorHome() {
  const [appointments, setAppointments] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState("appointments");
  const [doctorUser, setDoctorUser] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const getDoctorData = async () => {
    try {
      const data = localStorage.getItem("userData");
      if (data) {
        const parsedUser = JSON.parse(data);
        setDoctorUser(parsedUser);

        const res = await axios.get("http://localhost:5000/api/admin/getalldoctors", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (res.data.success) {
          const profile = res.data.data.find(d => d.userID === parsedUser._id);
          if (profile) {
            setDoctorProfile(profile);
            form.setFieldsValue({
              ...profile,
              timings: [
                moment(profile.timings[0], "HH:mm"),
                moment(profile.timings[1], "HH:mm")
              ]
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctor/getdoctorappointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDoctorData();
    getAppointments();
  }, []);

  const handleStatus = async (appointmentId, status) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/doctor/handlestatus",
        { appointmentId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to update status");
    }
  };

  const handleDownload = (appointmentId) => {
    window.open(`http://localhost:5000/api/doctor/getdocumentdownload?appointId=${appointmentId}&token=${localStorage.getItem("token")}`, "_blank");
  };

  const handleProfileUpdate = async (values) => {
    try {
      const timings = values.timings.map(t => t.format("HH:mm"));
      const res = await axios.post(
        "http://localhost:5000/api/doctor/updateprofile",
        {
          ...values,
          timings
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getDoctorData();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="container-fluid p-0">
      <Row className="g-0">
        <Col md={3} lg={2} className="sidebar-menu">
          <a href="/doctorhome" className="sidebar-brand">
            MideCareBook
          </a>
          <Nav className="flex-column">
            <Nav.Link
              className={`sidebar-link ${activeMenuItem === "appointments" ? "active" : ""}`}
              onClick={() => setActiveMenuItem("appointments")}
            >
              My Appointments
            </Nav.Link>
            <Nav.Link
              className={`sidebar-link ${activeMenuItem === "profile" ? "active" : ""}`}
              onClick={() => setActiveMenuItem("profile")}
            >
              Profile Settings
            </Nav.Link>
            <Nav.Link className="sidebar-link mt-5 text-danger" onClick={handleLogout}>
              Logout
            </Nav.Link>
          </Nav>
        </Col>

        <Col md={9} lg={10} className="p-0">
          <div className="dashboard-header shadow-sm">
            <h4 className="mb-0 fw-bold">Doctor Dashboard</h4>
            <span className="fw-semibold text-primary">
              Dr. {doctorUser ? doctorUser.fullName : ""}
            </span>
          </div>

          <Container className="py-4 px-4">
            {activeMenuItem === "appointments" && (
              <div className="premium-card p-4">
                <h3 className="fw-bold mb-4">Patient Bookings</h3>
                {appointments.length === 0 ? (
                  <p className="text-muted">No appointments booked with you yet.</p>
                ) : (
                  <Table responsive hover className="align-middle">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Phone</th>
                        <th>Date & Time</th>
                        <th>Document</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt._id}>
                          <td className="fw-semibold">
                            {appt.userInfo ? appt.userInfo.fullName : "Unknown Patient"}
                          </td>
                          <td>{appt.userInfo ? appt.userInfo.phone : ""}</td>
                          <td>{appt.date}</td>
                          <td>
                            {appt.document?.path ? (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleDownload(appt._id)}
                              >
                                View File
                              </Button>
                            ) : (
                              <span className="text-muted">None</span>
                            )}
                          </td>
                          <td>
                            <Badge
                              bg={
                                appt.status === "approved"
                                  ? "success"
                                  : appt.status === "rejected"
                                  ? "danger"
                                  : "warning"
                              }
                              className="px-2 py-1 text-capitalize"
                            >
                              {appt.status}
                            </Badge>
                          </td>
                          <td>
                            {appt.status === "pending" && (
                              <div className="d-flex gap-2">
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleStatus(appt._id, "approved")}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleStatus(appt._id, "rejected")}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            )}

            {activeMenuItem === "profile" && doctorProfile && (
              <div className="premium-card p-4">
                <h3 className="fw-bold mb-4">Edit Profile Settings</h3>
                <Form form={form} layout="vertical" onFinish={handleProfileUpdate}>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                        <Input disabled />
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item label="Specialization" name="specialisation" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item label="Experience" name="experience" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item label="Consultation Fees" name="fees" rules={[{ required: true }]}>
                        <Input type="number" />
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item label="Timings" name="timings" rules={[{ required: true }]}>
                        <TimePicker.RangePicker format="HH:mm" />
                      </Form.Item>
                    </div>
                  </div>
                  <AntButton type="primary" htmlType="submit" className="premium-btn border-0 py-2 mt-3">
                    Save Profile Settings
                  </AntButton>
                </Form>
              </div>
            )}
          </Container>
        </Col>
      </Row>
    </div>
  );
}

export default DoctorHome;
