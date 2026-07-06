import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button, Badge, Nav } from "react-bootstrap";
import { message } from "antd";
import axios from "axios";

function AdminHome() {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState("users");
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  const getAdminData = () => {
    const data = localStorage.getItem("userData");
    if (data) {
      setAdminUser(JSON.parse(data));
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/getallusers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/getalldoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/getallAppointmentsAdmin", {
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
    getAdminData();
    getUsers();
    getDoctors();
    getAppointments();
  }, []);

  const handleApprove = async (doctorId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/getapprove",
        { doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to approve");
    }
  };

  const handleReject = async (doctorId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/getreject",
        { doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to reject");
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
          <a href="/adminhome" className="sidebar-brand">
            MediCareBook
          </a>
          <Nav className="flex-column">
            <Nav.Link
              className={`sidebar-link ${activeMenuItem === "users" ? "active" : ""}`}
              onClick={() => setActiveMenuItem("users")}
            >
              Users
            </Nav.Link>
            <Nav.Link
              className={`sidebar-link ${activeMenuItem === "doctors" ? "active" : ""}`}
              onClick={() => setActiveMenuItem("doctors")}
            >
              Doctor Requests
            </Nav.Link>
            <Nav.Link
              className={`sidebar-link ${activeMenuItem === "appointments" ? "active" : ""}`}
              onClick={() => setActiveMenuItem("appointments")}
            >
              All Appointments
            </Nav.Link>
            <Nav.Link className="sidebar-link mt-5 text-danger" onClick={handleLogout}>
              Logout
            </Nav.Link>
          </Nav>
        </Col>

        <Col md={9} lg={10} className="p-0">
          <div className="dashboard-header shadow-sm">
            <h4 className="mb-0 fw-bold">Admin Panel</h4>
            <span className="fw-semibold text-primary">
              {adminUser ? adminUser.fullName : "Administrator"}
            </span>
          </div>

          <Container className="py-4 px-4">
            {activeMenuItem === "users" && (
              <div className="premium-card p-4">
                <h3 className="fw-bold mb-4">Registered Users</h3>
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="fw-semibold">{u.fullName}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>
                          <Badge bg={u.type === "admin" ? "danger" : u.isdoctor ? "success" : "primary"} className="px-2 py-1">
                            {u.type === "admin" ? "Admin" : u.isdoctor ? "Doctor" : "Patient"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}

            {activeMenuItem === "doctors" && (
              <div className="premium-card p-4">
                <h3 className="fw-bold mb-4">Doctor Applications</h3>
                {doctors.length === 0 ? (
                  <p className="text-muted">No applications found.</p>
                ) : (
                  <Table responsive hover className="align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Specialty</th>
                        <th>Experience</th>
                        <th>Fees</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doc) => (
                        <tr key={doc._id}>
                          <td className="fw-semibold">{doc.fullName}</td>
                          <td>{doc.specialisation}</td>
                          <td>{doc.experience}</td>
                          <td>${doc.fees}</td>
                          <td>
                            <Badge
                              bg={
                                doc.status === "approved"
                                  ? "success"
                                  : doc.status === "rejected"
                                  ? "danger"
                                  : "warning"
                              }
                              className="px-2 py-1 text-capitalize"
                            >
                              {doc.status}
                            </Badge>
                          </td>
                          <td>
                            {doc.status === "pending" && (
                              <div className="d-flex gap-2">
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleApprove(doc._id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleReject(doc._id)}
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

            {activeMenuItem === "appointments" && (
              <div className="premium-card p-4">
                <h3 className="fw-bold mb-4">All Appointments</h3>
                {appointments.length === 0 ? (
                  <p className="text-muted">No appointments scheduled.</p>
                ) : (
                  <Table responsive hover className="align-middle">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt._id}>
                          <td className="fw-semibold">
                            {appt.userInfo ? appt.userInfo.fullName : "Unknown User"}
                          </td>
                          <td>
                            Dr. {appt.doctorInfo ? appt.doctorInfo.fullName : "Unknown Doctor"}
                          </td>
                          <td>{appt.date}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            )}
          </Container>
        </Col>
      </Row>
    </div>
  );
}

export default AdminHome;
