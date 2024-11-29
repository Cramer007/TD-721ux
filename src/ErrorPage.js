import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div>
      <h1>Network Error</h1>
      <p>You are not connected to the Holesky network. Please switch your network in Metamask.</p>
      <Link to="/">Go Back to Home</Link>
    </div>
  );
}

export default ErrorPage;
