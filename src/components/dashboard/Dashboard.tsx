  import React from 'react';
  import { motion } from 'framer-motion';
  import { Header } from './Header';
  import { Sidebar } from './Sidebar';
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
        case 'dashboard':
        default:
          return <DashboardHome />;
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Sidebar />
        <Header />
        
        <motion.main
          className={`
            pt-20 transition-all duration-300
            ${sidebarCollapsed ? 'ml-16' : 'ml-64'}
          `}
          animate={{ marginLeft: sidebarCollapsed ? 64 : 256 }}
        >
          <div className="p-6">
            {renderContent()}
          </div>
        </motion.main>
      </div>
    );
  }