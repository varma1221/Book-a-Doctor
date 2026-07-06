import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { message } from "antd";
import axios from "axios";

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/user/login", credentials);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userData", JSON.stringify(res.data.data));
        message.success(res.data.message);
        
        const user = res.data.data;
        if (user.type === "admin") {
          navigate("/adminhome");
        } else if (user.isdoctor) {
          navigate("/doctorhome");
        } else {
          navigate("/userhome");
        }
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
        <Row className="justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <Col md={5}>
            <div className="premium-card p-5">
              <h2 className="text-center fw-bold mb-4" style={{ color: "#1e293b" }}>
                Welcome Back
              </h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="fw-semibold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </Form.Group>

                <Button type="submit" className="premium-btn w-100 py-2 mb-3">
                  Login
                </Button>
              </Form>
              <div className="text-center mt-3">
                Don't have an account? <Link to="/register" className="fw-bold text-decoration-none">Register here</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
