
import React from "react";
import { Link } from "react-router-dom";
import LeaveForm from "@/components/LeaveForm";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Gestion des Autorisations de Congé
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Sélectionnez un employé, complétez les informations et générez l'autorisation de congé.
          </p>
          
          <Link to="/editor">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2 mx-auto">
              <FileText size={18} />
              Éditeur avancé de document
            </Button>
          </Link>
        </header>
        
        <LeaveForm />
      </div>
    </div>
  );
};

export default Index;
