import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DashboardHome } from './DashboardHome';
import { PromotionForm } from './PromotionForm';
import { SalaryForm } from './SalaryForm';
import { BulkPromotionForm } from './BulkPromotionForm';
import { LicenseForm } from './LicenseForm';
import { EducationForm } from './EducationForm';
import { TransferInForm } from './TransferInForm';
import { TransferOutForm } from './TransferOutForm';
import { ArchiveView } from './ArchiveView';
import { useAppStore } from '../../store/useAppStore';

export function Dashboard() {
  const { currentPage, sidebarCollapsed } = useAppStore();

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <DashboardHome />;
      case 'promotion':
        return <PromotionForm />;
      case 'salary':
        return <SalaryForm />;
      case 'bulk-promotion':
        return <BulkPromotionForm />;
      case 'license':
        return <LicenseForm />;
      case 'education':
        return <EducationForm />;
      case 'transfer-in':
        return <TransferInForm />;
      case 'transfer-out':
        return <TransferOutForm />;
      case 'archive':
        return <ArchiveView />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
        <Header />
        <main className="p-6 pt-24">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}