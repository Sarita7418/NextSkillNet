'use client';

import React from 'react';
import Header from '../components/organism/Header';
import HeroImage from '../components/molecules/HeroImage';
import AboutSkillNet from '../components/molecules/AboutSkillNet';
import Objective from '../components/molecules/Objective';
import FeaturesSkillNet from '../components/molecules/FeaturesSkillNet';
import Footer2 from '../components/organism/Footer2';
import Footer from '../components/organism/Footer';

const Institucional = () => {
  return (
    <div>
      <Header />

      <HeroImage />
      <AboutSkillNet />
      <Objective />
      <FeaturesSkillNet />

      <Footer />
    </div>
  );
};

export default Institucional;