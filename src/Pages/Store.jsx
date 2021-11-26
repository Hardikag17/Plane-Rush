import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Store = () => {
  return (
    <div>
      <Navbar />
      <center>
        <div style={{ fontSize: '50px' }}>
          <i className='fas fa-store-alt '>Store</i>
        </div>
        <div
          className='d-flex justify-content-center '
          style={{ flexWrap: 'wrap' }}>
          Items
        </div>
      </center>
      <Footer />
    </div>
  );
};

export default Store;
