
import React from "react";
import LeaveForm from "@/components/LeaveForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Gestion des Autorisations de Congé
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Sélectionnez un employé, complétez les informations et imprimez l'autorisation de congé.
          </p>
        </header>
        
        <LeaveForm />
      </div>
    </div>
  );
};

export default Index;
