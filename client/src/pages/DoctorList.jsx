import React, { useState } from "react";
import { Modal, Button, Form as BootstrapForm } from "react-bootstrap";
import { message } from "antd";
import axios from "axios";

function DoctorList({ doctor, userdata, userDoctorId }) {
  const [show, setShow] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  const handleClose = () => {
    setShow(false);
    setDateTime("");
    setDocumentFile(null);
  };
  const handleShow = () => setShow(true);

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!dateTime) {
      message.error("Please select date and time");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("date", dateTime);
      formData.append("doctorInfo", JSON.stringify(doctor));
      formData.append("userInfo", JSON.stringify(userdata));
      if (documentFile) {
        formData.append("image", documentFile);
      }

      const res = await axios.post("http://localhost:8000/api/user/getappointment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.data.success) {
        message.success(res.data.message);
        handleClose();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to book appointment");
    }
  };

  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <>
      <div className="premium-card p-4 h-100 d-flex flex-column justify-content-between">
        <div>
          <h4 className="fw-bold mb-2">Dr. {doctor.fullName}</h4>
          <p className="mb-1 text-primary fw-semibold">{doctor.specialisation}</p>
          <hr className="my-2" />
          <p className="mb-1 text-muted"><strong>Experience:</strong> {doctor.experience}</p>
          <p className="mb-1 text-muted"><strong>Fees:</strong> ${doctor.fees}</p>
          <p className="mb-1 text-muted">
            <strong>Timings:</strong> {doctor.timings[0]} - {doctor.timings[1]}
          </p>
          <p className="mb-1 text-muted"><strong>Phone:</strong> {doctor.phone}</p>
          <p className="mb-3 text-muted"><strong>Address:</strong> {doctor.address}</p>
        </div>
        <Button className="premium-btn w-100 mt-3 border-0" onClick={handleShow}>
          Book Now
        </Button>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <BootstrapForm onSubmit={handleBook}>
          <Modal.Body>
            <div className="mb-3">
              <h5>Dr. {doctor.fullName}</h5>
              <p className="text-muted">{doctor.specialisation}</p>
            </div>
            
            <BootstrapForm.Group className="mb-3" controlId="apptDate">
              <BootstrapForm.Label className="fw-semibold">Appointment Date & Time</BootstrapForm.Label>
              <BootstrapForm.Control
                type="datetime-local"
                min={minDateTime}
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
              />
            </BootstrapForm.Group>

            <BootstrapForm.Group className="mb-3" controlId="apptDoc">
              <BootstrapForm.Label className="fw-semibold">Upload Medical Document (Optional)</BootstrapForm.Label>
              <BootstrapForm.Control
                type="file"
                onChange={handleFileChange}
              />
            </BootstrapForm.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="premium-btn border-0">
              Submit Appointment
            </Button>
          </Modal.Footer>
        </BootstrapForm>
      </Modal>
    </>
  );
}

export default DoctorList;
