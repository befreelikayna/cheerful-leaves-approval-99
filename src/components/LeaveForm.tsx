import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Employee, LeaveFormData } from "../models/employeeTypes";
import EmployeeSelect from "./EmployeeSelect";
import { employees } from "../data/employees";
import { Printer, Download, Edit, FileText } from "lucide-react";
import { Button } from "./ui/button";

const LeaveForm: React.FC = () => {
  const [formData, setFormData] = useState<LeaveFormData>({
    employee: null,
    location: "",
    date: "25/03/2025",
    cin: "",
    company: "",
  });
  
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const formRef = useRef<HTMLDivElement>(null);

  const handleEmployeeChange = (employee: Employee | null) => {
    setFormData({ ...formData, employee });
    
    if (employee?.cin) {
      setFormData(prev => ({ ...prev, employee, cin: employee.cin }));
    } else {
      setFormData(prev => ({ ...prev, employee }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateHtml = (forWord = false) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Autorisation de congé</title>
          <style>
            @page {
              size: A4;
              margin: 2cm;
            }
            @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman:wght@400;700&display=swap');
            body {
              font-family: 'Times New Roman', Times, serif;
              margin: 0;
              padding: 0;
              font-size: ${forWord ? '12pt' : '14pt'};
              font-weight: normal;
              line-height: 1.6;
            }
            .page {
              width: 21cm;
              height: 29.7cm;
              padding: 2cm;
              box-sizing: border-box;
              page-break-inside: avoid;
            }
            .document {
              width: 100%;
              height: 100%;
              page-break-inside: avoid;
            }
            .title {
              font-size: 22pt;
              font-weight: bold;
              text-decoration: underline;
              text-align: center;
              margin-bottom: 30px;
              font-style: italic;
            }
            .date-line {
              text-align: left;
              margin: 20px 0 25px 0;
              font-size: 14pt;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-line {
              margin-bottom: 15px;
              font-size: 14pt;
              font-weight: bold;
            }
            .object-line {
              font-weight: bold;
              margin: 25px 0 15px 0;
              font-size: 14pt;
            }
            .content {
              margin: 20px 0;
              text-align: justify;
              line-height: 1.6;
              font-size: 14pt;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 60px;
            }
            .signature-box {
              width: 40%;
              font-size: 14pt;
            }
            .bold {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="document">
              <div class="title">Autorisation de congé</div>
              
              <div class="date-line">
                Fait à : ${formData.location || "............................"} Le : ${formData.date}
              </div>
              
              <div class="info-section">
                <div class="info-line">Nom Et Prénom : ${formData.employee?.name || "..........................."}</div>
                <div class="info-line">CIN : ${formData.cin || "..........................."}</div>
              </div>
              
              <div class="info-section">
                <div class="object-line">Objet : Congé annuel payé</div>
              </div>
              
              <div class="info-section">
                <div class="info-line">Monsieur,</div>
                <div class="content">
                  Par la présente, j'atteste que l'entreprise 
                  <span class="bold">${formData.company || "..."}</span> m'a accordé cinq (5) jours de congé 
                  payé pour la période du 01/04/2025 au 05/04/2025, 
                  conformément à mes droits aux congés légaux.
                </div>
                <div class="content">
                  Veuillez agréer, Monsieur, l'expression de mes 
                  salutations distinguées.
                </div>
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
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = () => {
    if (!formData.employee) {
      toast.error("Veuillez sélectionner un employé");
      return;
    }
    
    // CIN is now optional - removing this validation
    // if (!formData.cin) {
    //   toast.error("Veuillez entrer le CIN");
    //   return;
    // }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Le blocage des popups peut empêcher l'impression. Veuillez les autoriser pour ce site.");
      return;
    }

    printWindow.document.write(generateHtml());
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.addEventListener('afterprint', () => {
        printWindow.close();
      });
    }, 500);
    
    toast.success("Document prêt pour impression");
  };

  const handleDownload = () => {
    if (!formData.employee) {
      toast.error("Veuillez sélectionner un employé");
      return;
    }
    
    // CIN is now optional - removing this validation
    // if (!formData.cin) {
    //   toast.error("Veuillez entrer le CIN");
    //   return;
    // }

    // Create a hidden iframe to generate the PDF content
    const iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    document.body.appendChild(iframe);

    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDocument) {
      toast.error("Impossible de créer le document");
      document.body.removeChild(iframe);
      return;
    }

    iframeDocument.write(generateHtml());
    iframeDocument.close();

    setTimeout(() => {
      try {
        const employeeName = formData.employee?.name || "document";
        const fileName = `autorisation_conge_${employeeName.replace(/\s+/g, '_').toLowerCase()}.pdf`;

        // Use browser print to save as PDF
        iframe.contentWindow?.print();
        
        // Display success message
        toast.success("Document téléchargé");
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      } catch (error) {
        toast.error("Erreur lors du téléchargement du document");
        document.body.removeChild(iframe);
      }
    }, 500);
  };

  const handleDownloadWord = () => {
    if (!formData.employee) {
      toast.error("Veuillez sélectionner un employé");
      return;
    }

    try {
      // Create a Blob with the HTML content
      const htmlContent = generateHtml(true);
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger the download
      const employeeName = formData.employee?.name || "document";
      const fileName = `autorisation_conge_${employeeName.replace(/\s+/g, '_').toLowerCase()}.doc`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Document Word téléchargé");
    } catch (error) {
      toast.error("Erreur lors du téléchargement du document Word");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      toast.info("Mode aperçu activé");
    } else {
      toast.info("Mode édition activé");
    }
  };
  
  return (
    <div className="form-paper animate-slide-up" ref={formRef}>
      <h1 className="form-title">Autorisation de congé</h1>
      
      {isEditing ? (
        <>
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
        </>
      ) : (
        <>
          <div className="preview-container border border-gray-200 rounded-md p-6 mb-6 bg-white shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold italic underline">Autorisation de congé</h2>
            </div>
            
            <div className="text-left mb-6">
              <p className="font-['Times_New_Roman'] text-base">Fait à : <span className="font-bold">{formData.location || "............................"}</span> Le : <span className="font-bold">{formData.date}</span></p>
            </div>
            
            <div className="mb-6">
              <p className="font-['Times_New_Roman'] text-base font-bold mb-2">Nom Et Prénom : {formData.employee?.name || "..........................."}</p>
              <p className="font-['Times_New_Roman'] text-base font-bold">CIN : {formData.cin || "..........................."}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-base font-bold mb-4">Objet : Congé annuel payé</h3>
              
              <p className="font-['Times_New_Roman'] text-base font-bold mb-4">Monsieur,</p>
              
              <p className="font-['Times_New_Roman'] text-base mb-4 text-justify">
                Par la présente, j'atteste que l'entreprise 
                <span className="font-bold"> {formData.company || "..."} </span> 
                m'a accordé cinq (5) jours de congé payé pour la période du 01/04/2025 au 05/04/2025, 
                conformément à mes droits aux congés légaux.
              </p>
              
              <p className="font-['Times_New_Roman'] text-base mb-4 text-justify">
                Veuillez agréer, Monsieur, l'expression de mes salutations distinguées.
              </p>
            </div>
            
            <div className="flex justify-between mt-16 pt-4">
              <div>
                <p className="text-base">Signature Salarié</p>
              </div>
              <div>
                <p className="text-base">Signature Directeur</p>
              </div>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-10 flex justify-center gap-4 flex-wrap">
        <Button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Printer size={18} />
          Imprimer
        </Button>
        
        <Button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Download size={18} />
          PDF
        </Button>
        
        <Button
          onClick={handleDownloadWord}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FileText size={18} />
          Word
        </Button>
        
        <Button
          onClick={toggleEdit}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Edit size={18} />
          {isEditing ? "Aperçu" : "Éditer"}
        </Button>
      </div>
    </div>
  );
};

export default LeaveForm;
