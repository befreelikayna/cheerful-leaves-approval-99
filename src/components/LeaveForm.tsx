
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Employee, LeaveFormData } from "../models/employeeTypes";
import EmployeeSelect from "./EmployeeSelect";
import { employees } from "../data/employees";
import { Printer } from "lucide-react";

const LeaveForm: React.FC = () => {
  const [formData, setFormData] = useState<LeaveFormData>({
    employee: null,
    location: "",
    date: "25/03/2025",
    cin: "",
    company: "",
  });
  
  const formRef = useRef<HTMLDivElement>(null);

  const handleEmployeeChange = (employee: Employee | null) => {
    setFormData({ ...formData, employee });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePrint = () => {
    if (!formData.employee) {
      toast.error("Veuillez sélectionner un employé");
      return;
    }
    
    if (!formData.cin) {
      toast.error("Veuillez entrer le CIN");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Le blocage des popups peut empêcher l'impression. Veuillez les autoriser pour ce site.");
      return;
    }

    const formContent = formRef.current?.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Autorisation de congé - ${formData.employee?.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.6;
            }
            .document {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .title {
              font-size: 20px;
              font-weight: bold;
              font-style: italic;
              text-decoration: underline;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-line {
              margin-bottom: 8px;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
            }
            .signature-box {
              width: 200px;
            }
          </style>
        </head>
        <body>
          <div class="document">
            <div class="header">
              <div class="title">Autorisation de congé</div>
            </div>
            
            <div class="info-section">
              <div class="info-line">Fait à : ${formData.location || "........................"} Le : ${formData.date}</div>
            </div>
            
            <div class="info-section">
              <div class="info-line">Nom Et Prénom : ${formData.employee?.name}</div>
              <div class="info-line">CIN : ${formData.cin}</div>
            </div>
            
            <div class="info-section">
              <div class="info-line"><strong>Objet : Congé annuel payé</strong></div>
            </div>
            
            <div class="info-section">
              <div class="info-line">Monsieur,</div>
              <p>
                Par la présente, j'atteste que l'entreprise 
                ${formData.company || "........................"} m'a accordé six (5) jours de congé 
                payé pour la période du 01/04/2025 au 05/04/2025, 
                conformément à mes droits aux congés légaux.
              </p>
              <p>
                Veuillez agréer, Monsieur, l'expression de mes 
                salutations distinguées.
              </p>
            </div>
            
            <div class="signature-section">
              <div class="signature-box">
                <div>Signature Salarié</div>
              </div>
              <div class="signature-box">
                <div>Signature Directeur</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Give time for resources to load then print
    setTimeout(() => {
      printWindow.print();
      // Close after print
      printWindow.addEventListener('afterprint', () => {
        printWindow.close();
      });
    }, 500);
    
    toast.success("Document prêt pour impression");
  };
  
  return (
    <div className="form-paper animate-slide-up" ref={formRef}>
      <h1 className="form-title">Autorisation de congé</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="form-field">
          <label className="form-label">Fait à :</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Lieu"
          />
        </div>
        
        <div className="form-field">
          <label className="form-label">Le :</label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Date"
          />
        </div>
      </div>
      
      <div className="form-field mb-6">
        <label className="form-label">Nom Et Prénom :</label>
        <EmployeeSelect
          employees={employees}
          value={formData.employee}
          onChange={handleEmployeeChange}
          className="mb-4"
        />
        
        <label className="form-label">CIN :</label>
        <input
          type="text"
          name="cin"
          value={formData.cin}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Numéro de CIN"
        />
      </div>
      
      <div className="form-field mb-6">
        <label className="form-label">Entreprise :</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Nom de l'entreprise"
        />
      </div>
      
      <div className="border-t border-gray-200 pt-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Objet : Congé annuel payé</h2>
        
        <p className="mb-4">Monsieur,</p>
        
        <p className="mb-4">
          Par la présente, j'atteste que l'entreprise 
          <span className="font-medium"> {formData.company || "........................"} </span> 
          m'a accordé six (5) jours de congé payé pour la période du 01/04/2025 au 05/04/2025, 
          conformément à mes droits aux congés légaux.
        </p>
        
        <p className="mb-4">
          Veuillez agréer, Monsieur, l'expression de mes salutations distinguées.
        </p>
      </div>
      
      <div className="flex justify-between mt-10 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm">Signature Salarié</p>
        </div>
        <div>
          <p className="text-sm">Signature Directeur</p>
        </div>
      </div>
      
      <div className="mt-10 flex justify-center">
        <button
          onClick={handlePrint}
          className="print-button flex items-center gap-2"
        >
          <Printer size={18} />
          Imprimer le document
        </button>
      </div>
    </div>
  );
};

export default LeaveForm;
