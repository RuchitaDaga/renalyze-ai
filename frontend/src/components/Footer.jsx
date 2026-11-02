import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-main">
          <span className="footer-brand">Renalyze AI</span>
          <span className="footer-text">
            © {new Date().getFullYear()} 
          </span>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
