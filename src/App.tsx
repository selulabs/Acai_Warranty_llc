import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AboutPage from '@/pages/AboutPage';
import AutoWarrantyPage from '@/pages/AutoWarrantyPage';
import ContactPage from '@/pages/ContactPage';
import HomePage from '@/pages/HomePage';
import HomeWarrantyPage from '@/pages/HomeWarrantyPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import ProtectionPlansPage from '@/pages/ProtectionPlansPage';
import TermsPage from '@/pages/TermsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="auto-warranty" element={<AutoWarrantyPage />} />
        <Route path="home-warranty" element={<HomeWarrantyPage />} />
        <Route path="protection-plans" element={<ProtectionPlansPage />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms-and-conditions" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
