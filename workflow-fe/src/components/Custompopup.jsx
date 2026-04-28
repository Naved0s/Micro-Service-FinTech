import React from "react";

// const Custompopup = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div style={styles.overlay} onClick={onClose}>
//       <div
//         style={styles.modal}
//         onClick={(e) => e.stopPropagation()} // 👈 IMPORTANT
//       >
//         {children}
//         <button
//           className="bg-black text-white p-2 rounded"
//           onClick={onClose}
//           style={styles.closeBtn}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };
const Custompopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={styles.header}>
          <span>Execution Output</span>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
};

// const styles = {
//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     background: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   modal: {
//     background: "white",
//     padding: "20px",
//     borderRadius: "8px",
//     minWidth: "300px",
//     position: "relative",
//   },
//   closeBtn: { marginTop: "10px" },
//};
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#ffffff",
    color: "#1e293b",
    borderRadius: "12px",
    width: "650px",
    maxWidth: "90%",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },

  header: {
    background: "#f8fafc",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "600",
    borderBottom: "1px solid #e2e8f0",
  },

  body: {
    padding: "16px",
    fontFamily: "monospace",
    fontSize: "14px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    lineHeight: "1.6",
    background: "#f9fafb", // subtle code background
  },

  closeBtn: {
    background: "#e2e8f0",
    border: "none",
    color: "#1e293b",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
export default Custompopup;
