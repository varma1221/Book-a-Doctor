import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col, Button } from "react-bootstrap";
import heroImg from "../assets/hero.png";

function Home() {
  return (
    <div className="premium-home">
      <Navbar bg="white" expand="lg" className="py-3 border-bottom shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3">
            MediCareBook
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="align-items-center gap-3">
              <Nav.Link as={Link} to="/" className="fw-semibold">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/login" className="fw-semibold">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="fw-semibold btn btn-outline-primary px-3 py-1">
                Register
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-5 my-5">
        <Row className="align-items-center">
          <Col lg={6} className="mb-5 mb-lg-0">
            <h1 className="display-4 fw-bold mb-3" style={{ color: "#1e293b" }}>
              Find and Book the Best Doctors Instantly
            </h1>
            <p className="lead text-muted mb-4">
              Connect with top-rated healthcare professionals in your area. Schedule appointments, upload records, and manage your health seamlessly.
            </p>
            <div className="d-flex gap-3">
              <Button as={Link} to="/login" size="lg" className="premium-btn">
                Book Appointment
              </Button>
              <Button as={Link} to="/register" size="lg" variant="outline-secondary" className="px-4">
                Join as Patient
              </Button>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <img
              src={heroImg}
              alt="Medical Consultation"
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: "450px", objectFit: "cover" }}
            />
          </Col>
        </Row>
      </Container>

      <section className="bg-light py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold">Why Choose MediCareBook?</h2>
              <p className="text-muted">A modern solution for patient-doctor connection.</p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={4}>
              <div className="premium-card p-4 h-100 text-center">
                <div className="fs-1 text-primary mb-3">🔍</div>
                <h4 className="fw-bold">Search Specialists</h4>
                <p className="text-muted">Filter doctors by specialty, location, and fees to find your perfect match.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="premium-card p-4 h-100 text-center">
                <div className="fs-1 text-primary mb-3">📅</div>
                <h4 className="fw-bold">Instant Booking</h4>
                <p className="text-muted">Choose your preferred date and time and book your appointment in seconds.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="premium-card p-4 h-100 text-center">
                <div className="fs-1 text-primary mb-3">📂</div>
                <h4 className="fw-bold">Secure Records</h4>
                <p className="text-muted">Upload medical records and prescriptions securely to share with your physician.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <footer className="bg-dark text-white py-4 mt-auto">
        <Container className="text-center">
          <p className="mb-0">&copy; 2026 MediCareBook. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

export default Home;
