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
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
              alt="Medical Consultation"
              className="img-fluid rounded shadow-lg"
              style={{ maxWidth: "100%", height: "auto", borderRadius: "12px" }}
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
              <div className="premium-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2a6f97" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <h4 className="fw-bold">Search Specialists</h4>
                <p className="text-muted">Filter doctors by specialty, location, and fees to find your perfect match.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="premium-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2a6f97" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <h4 className="fw-bold">Instant Booking</h4>
                <p className="text-muted">Choose your preferred date and time and book your appointment in seconds.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="premium-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2a6f97" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
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
