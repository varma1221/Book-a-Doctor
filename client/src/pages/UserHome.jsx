import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Badge, Button, Navbar, Nav } from "react-bootstrap";
import { message } from "antd";
import axios from "axios";
import DoctorList from "./DoctorList";
import ApplyDoctor from "./ApplyDoctor";
import Notification from "./Notification";

function UserHome() {
  const [doctors, setDoctors] = useState([]);
  const [userdata, setUserdata] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState("home");
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/getuserdata",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        setUserdata(res.data.data);
        localStorage.setItem("userData", JSON.stringify(res.data.data));
      } else {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
      navigate("/login");
    }
  };

  const getApprovedDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/getalldoctorsu", {
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

  const getUserAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/getuserappointments", {
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
    getUserData();
    getApprovedDoctors();
    getUserAppointments();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    navigate("/login");
  };

  if (!userdata) return null;

  return (
    <div className="container-fluid p-0">
      <Row className="g-0">
        <Col md={3} lg={2} className="sidebar-menu">
          <a href="/userhome" className="sidebar-brand">
            MediCareBook
          </a>
          <Nav className="flex-column">
            <Nav.Link
              className={`sidebar-link ${activeMenuItem === "home" ? "active" : ""}`}
              onClick={() => setActiveMenuItem("home")}
            >
              Doctors
            </Nav.Link>
            <Nav.Link
              className={`sidebar-link ${activeMenuItem === "appointments" ? "active" : ""}`}
              onClick={() => setActiveMenuItem("appointments")}
            >
              Appointments
            </Nav.Link>
            {!userdata.isdoctor && (
              <Nav.Link
                className={`sidebar-link ${activeMenuItem === "applyDoctor" ? "active" : ""}`}
                onClick={() => setActiveMenuItem("applyDoctor")}
              >
                Apply Doctor
              </Nav.Link>
            )}
            <Nav.Link
              className={`sidebar-link ${activeMenuItem === "notifications" ? "active" : ""}`}
              onClick={() => setActiveMenuItem("notifications")}
            >
              Notifications
            </Nav.Link>
            <Nav.Link className="sidebar-link mt-5 text-danger" onClick={handleLogout}>
              Logout
            </Nav.Link>
          </Nav>
        </Col>

        <Col md={9} lg={10} className="p-0">
          <div className="dashboard-header shadow-sm">
            <h4 className="mb-0 fw-bold">Patient Portal</h4>
            <div className="d-flex align-items-center gap-4">
              <div
                className="position-relative cursor-pointer"
                onClick={() => setActiveMenuItem("notifications")}
                style={{ cursor: "pointer" }}
              >
                <span className="fs-4">🔔</span>
                {userdata.notification?.length > 0 && (
                  <span className="notification-badge">{userdata.notification.length}</span>
                )}
              </div>
              <span className="fw-semibold text-primary">
                {userdata.isdoctor ? "Dr. " : ""}
                {userdata.fullName}
              </span>
            </div>
          </div>

          <Container className="py-4 px-4">
            {activeMenuItem === "home" && (
              <div>
                <h3 className="fw-bold mb-4">Available Specialists</h3>
                {doctors.length === 0 ? (
                  <div className="premium-card p-5 text-center">
                    <p className="text-muted mb-0">No approved doctors available at the moment.</p>
                  </div>
                ) : (
                  <Row className="g-4">
                    {doctors.map((doc) => (
                      <Col key={doc._id} md={6} lg={4}>
                        <DoctorList doctor={doc} userdata={userdata} userDoctorId={userdata._id} />
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            )}

            {activeMenuItem === "appointments" && (
              <div className="premium-card p-4">
                <h3 className="fw-bold mb-4">My Appointments</h3>
                {appointments.length === 0 ? (
                  <p className="text-muted">No appointments booked yet.</p>
                ) : (
                  <Table responsive hover className="align-middle">
                    <thead>
                      <tr>
                        <th>Doctor</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt._id}>
                          <td className="fw-semibold">Dr. {appt.docName}</td>
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
                              className="px-3 py-2 text-capitalize"
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

            {activeMenuItem === "applyDoctor" && (
              <ApplyDoctor userId={userdata._id} onComplete={() => setActiveMenuItem("home")} />
            )}

            {activeMenuItem === "notifications" && (
              <Notification onUpdate={getUserData} />
            )}
          </Container>
        </Col>
      </Row>
    </div>
  );
}

export default UserHome;
