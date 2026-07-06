import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { message } from "antd";
import axios from "axios";

function Register() {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    type: "user"
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/user/register", userData);
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
  };

  return (
    <div className="premium-auth-page py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="premium-card p-5">
              <h2 className="text-center fw-bold mb-4" style={{ color: "#1e293b" }}>
                Create Account
              </h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="fullName">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="fw-semibold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label className="fw-semibold">Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="type">
                  <Form.Label className="fw-semibold">Register As</Form.Label>
                  <Form.Select name="type" value={userData.type} onChange={handleChange}>
                    <option value="user">Patient / Doctor Application</option>
                    <option value="admin">Administrator</option>
                  </Form.Select>
                </Form.Group>

                <Button type="submit" className="premium-btn w-100 py-2 mb-3">
                  Register
                </Button>
              </Form>
              <div className="text-center mt-3">
                Already have an account? <Link to="/login" className="fw-bold text-decoration-none">Login here</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;
