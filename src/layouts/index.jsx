import React from 'react';

import '../styles/index.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default props => (
  <div>
    <Header />
    <main>
      {props.children()}
    </main>
    <Footer />
  </div>
);
