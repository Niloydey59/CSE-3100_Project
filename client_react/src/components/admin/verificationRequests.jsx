import { useState, useEffect } from "react";
// Api
import { fetchVerificationRequests, handleVerification } from "../../FetchApi";
// Styling
import "../../styling/admin/verificationRequests.css";

const VerificationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const getRequests = async () => {
      try {
        setLoading(true);
        const response = await fetchVerificationRequests();
        if (response.success) {
          setRequests(response.payload.requests);
        } else {
          console.error("Failed to fetch verification requests");
        }
      } catch (error) {
        console.error("Error fetching verification requests:", error);
      } finally {
        setLoading(false);
      }
    };

    getRequests();
  }, []);

  const handleAction = async (userId, field, status) => {
    try {
      setProcessing(true);
      const response = await handleVerification({ userId, field, status });

      if (response.success) {
        // Update the requests list
        setRequests((prevRequests) =>
          prevRequests
            .map((req) =>
              req.user._id === userId
                ? {
                    ...req,
                    pendingFields: req.pendingFields.filter((f) => f !== field),
                  }
                : req
            )
            .filter((req) => req.pendingFields.length > 0)
        );

        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Error processing verification:", error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fa-solid fa-spinner fa-spin"></i> Loading verification
        requests...
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="no-requests">
        <i className="fa-solid fa-check-circle"></i>
        <p>No pending verification requests at this time.</p>
      </div>
    );
  }

  return (
    <div className="verification-requests">
      <h2>Pending Verification Requests ({requests.length})</h2>

      <div className="requests-container">
        <div className="requests-list">
          {requests.map((request) => (
            <div
              key={request.user._id}
              className={`request-item ${
                selectedRequest?.user._id === request.user._id ? "active" : ""
              }`}
              onClick={() => setSelectedRequest(request)}
            >
              <div className="request-user">
                <div className="user-initial">
                  {request.user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <div className="username">{request.user.username}</div>
                  <div className="email">{request.user.email}</div>
                </div>
              </div>
              <div className="pending-fields">
                {request.pendingFields.map((field) => (
                  <span key={field} className="field-badge">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </span>
                ))}
              </div>
              <div className="request-date">
                {new Date(request.submittedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {selectedRequest && (
          <div className="request-details">
            <div className="details-header">
              <h3>Verification Details</h3>
              <button
                className="close-details"
                onClick={() => setSelectedRequest(null)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div className="user-profile">
              <div className="profile-header">
                <div className="large-initial">
                  {selectedRequest.user.username.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h4>{selectedRequest.user.username}</h4>
                  <p>{selectedRequest.user.email}</p>
                </div>
              </div>
            </div>

            <div className="verification-document">
              <h4>Verification Document</h4>
              <div className="document-preview">
                <img
                  src={selectedRequest.verificationDocument}
                  alt="Verification document"
                />
              </div>
            </div>

            <div className="verification-fields">
              <h4>Requested Verifications</h4>

              {selectedRequest.pendingFields.includes("series") && (
                <div className="verification-field">
                  <div className="field-details">
                    <span className="field-label">Series:</span>
                    <span className="field-value">
                      {selectedRequest.user.series.value}
                    </span>
                  </div>
                  <div className="action-buttons">
                    <button
                      className="approve-btn"
                      onClick={() =>
                        handleAction(
                          selectedRequest.user._id,
                          "series",
                          "approve"
                        )
                      }
                      disabled={processing}
                    >
                      <i className="fa-solid fa-check"></i> Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() =>
                        handleAction(
                          selectedRequest.user._id,
                          "series",
                          "reject"
                        )
                      }
                      disabled={processing}
                    >
                      <i className="fa-solid fa-times"></i> Reject
                    </button>
                  </div>
                </div>
              )}

              {selectedRequest.pendingFields.includes("department") && (
                <div className="verification-field">
                  <div className="field-details">
                    <span className="field-label">Department:</span>
                    <span className="field-value">
                      {selectedRequest.user.department.value}
                    </span>
                  </div>
                  <div className="action-buttons">
                    <button
                      className="approve-btn"
                      onClick={() =>
                        handleAction(
                          selectedRequest.user._id,
                          "department",
                          "approve"
                        )
                      }
                      disabled={processing}
                    >
                      <i className="fa-solid fa-check"></i> Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() =>
                        handleAction(
                          selectedRequest.user._id,
                          "department",
                          "reject"
                        )
                      }
                      disabled={processing}
                    >
                      <i className="fa-solid fa-times"></i> Reject
                    </button>
                  </div>
                </div>
              )}

              {selectedRequest.pendingFields.includes("position") && (
                <div className="verification-field">
                  <div className="field-details">
                    <span className="field-label">Position:</span>
                    <span className="field-value">
                      {selectedRequest.user.position.value
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                  </div>
                  <div className="action-buttons">
                    <button
                      className="approve-btn"
                      onClick={() =>
                        handleAction(
                          selectedRequest.user._id,
                          "position",
                          "approve"
                        )
                      }
                      disabled={processing}
                    >
                      <i className="fa-solid fa-check"></i> Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() =>
                        handleAction(
                          selectedRequest.user._id,
                          "position",
                          "reject"
                        )
                      }
                      disabled={processing}
                    >
                      <i className="fa-solid fa-times"></i> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationRequests;
