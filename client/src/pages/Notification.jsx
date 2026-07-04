import React, { useState, useEffect } from "react";
import { Tabs, Tab, Button, Card, Alert } from "react-bootstrap";
import { message } from "antd";
import axios from "axios";

function Notification({ onUpdate }) {
  const [user, setUser] = useState(null);

  const fetchUserData = () => {
    const data = localStorage.getItem("userData");
    if (data) {
      setUser(JSON.parse(data));
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const markAllAsRead = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/user/getallnotification",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        localStorage.setItem("userData", JSON.stringify(res.data.data));
        setUser(res.data.data);
        if (onUpdate) onUpdate();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to mark notifications as read");
    }
  };

  const deleteAllRead = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/user/deleteallnotification",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        localStorage.setItem("userData", JSON.stringify(res.data.data));
        setUser(res.data.data);
        if (onUpdate) onUpdate();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to delete notifications");
    }
  };

  if (!user) return null;

  return (
    <div className="premium-card p-4">
      <h3 className="fw-bold mb-4">Notifications</h3>
      <Tabs defaultActiveKey="unread" className="mb-4">
        <Tab eventKey="unread" title={`Unread (${user.notification?.length || 0})`}>
          <div className="d-flex justify-content-end mb-3">
            {user.notification?.length > 0 && (
              <Button className="premium-btn border-0 btn-sm" onClick={markAllAsRead}>
                Mark All Read
              </Button>
            )}
          </div>
          {user.notification?.length === 0 ? (
            <Alert variant="info">No unread notifications</Alert>
          ) : (
            user.notification.map((n, index) => (
              <Card key={index} className="mb-2 border-0 shadow-sm bg-light">
                <Card.Body className="py-3 px-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{n.message}</span>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </Tab>
        <Tab eventKey="read" title={`Read (${user.seennotification?.length || 0})`}>
          <div className="d-flex justify-content-end mb-3">
            {user.seennotification?.length > 0 && (
              <Button variant="outline-danger" size="sm" onClick={deleteAllRead}>
                Delete All Read
              </Button>
            )}
          </div>
          {user.seennotification?.length === 0 ? (
            <Alert variant="info">No read notifications</Alert>
          ) : (
            user.seennotification.map((n, index) => (
              <Card key={index} className="mb-2 border-0 shadow-sm">
                <Card.Body className="py-3 px-4 text-muted">
                  {n.message}
                </Card.Body>
              </Card>
            ))
          )}
        </Tab>
      </Tabs>
    </div>
  );
}

export default Notification;
