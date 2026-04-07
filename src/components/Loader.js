import React from 'react';
import './Loader.css';

/**
 * Reusable loader component.
 *
 * Usage:
 *   <Loader />                  — full-page overlay spinner (mount loading)
 *   <Loader size="small" />     — inline small spinner (inside buttons)
 *   <Loader overlay={false} />  — inline centered spinner (inside cards/tables)
 */
export default function Loader({ size = 'default', overlay = true }) {
  if (size === 'small') {
    return <span className="loader-spinner loader-spinner--small" />;
  }

  if (!overlay) {
    return (
      <div className="loader-inline">
        <span className="loader-spinner" />
      </div>
    );
  }

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <span className="loader-spinner loader-spinner--large" />
      </div>
    </div>
  );
}
