import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Printer, Download, FileText, Save, ArrowLeft, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { companies, getDefaultCompany } from "@/data/companies";
import { employees } from "@/data/employees";
import { Employee } from "@/models/employeeTypes";

const DocEditor = () => {
  const [documentStyle, setDocumentStyle] = useState({
    font: "Times New Roman",
    titleSize: "22",
    contentSize: "14",
    margins: "2",
    lineHeight: "1.6",
  });

  const [documentContent, setDocumentContent] = useState({
    title: "Autorisation de congé",
    location: "Casablanca",
    date: "25/03/2025",
    name: "",
    cin: "",
    company: getDefaultCompany().name,
    period: "du 01/04/2025 au 05/04/2025",
    days: "cinq (5)",
    greeting: "Monsieur",
    conclusion: "Veuillez agréer, Monsieur, l'expression de mes salutations distinguées."
  });

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handlePreview();
  }, []);

  const handleStyleChange = (field: string, value: string) => {
    setDocumentStyle({
      ...documentStyle,
      [field]: value
    });
  };

  const handleContentChange = (field: string, value: string) => {
    setDocumentContent({
      ...documentContent,
      [field]: value
    });
  };

  const handleEmployeeChange = (employeeId: string) => {
    const selectedEmployee = employees.find(e => e.id.toString() === employeeId);
    
    if (selectedEmployee) {
      setDocumentContent({
        ...documentContent,
        name: selectedEmployee.name,
        cin: "" // Leave CIN empty as requested
      });
    }
  };

  const generateHtml = (forWord = false) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentContent.title}</title>
          <style>
            @page {
              size: A4;
              margin: ${documentStyle.margins}cm;
            }
            @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman:wght@400;700&display=swap');
            body {
              font-family: '${documentStyle.font}', Times, serif;
              margin: 0;
              padding: 0;
              font-size: ${documentStyle.contentSize}pt;
              font-weight: normal;
              line-height: ${documentStyle.lineHeight};
            }
            .page {
              width: 21cm;
              height: 29.7cm;
              padding: ${documentStyle.margins}cm;
              box-sizing: border-box;
              page-break-inside: avoid;
            }
            .document {
              width: 100%;
              height: 100%;
              page-break-inside: avoid;
            }
            .title {
              font-size: ${documentStyle.titleSize}pt;
              font-weight: bold;
              text-decoration: underline;
              text-align: center;
              margin-bottom: 30px;
              font-style: italic;
            }
            .date-line {
              text-align: left;
              margin: 20px 0 25px 0;
              font-size: ${documentStyle.contentSize}pt;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-line {
              margin-bottom: 15px;
              font-size: ${documentStyle.contentSize}pt;
              font-weight: bold;
            }
            .object-line {
              font-weight: bold;
              margin: 25px 0 15px 0;
              font-size: ${documentStyle.contentSize}pt;
            }
            .content {
              margin: 20px 0;
              text-align: justify;
              line-height: ${documentStyle.lineHeight};
              font-size: ${documentStyle.contentSize}pt;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 60px;
            }
            .signature-box {
              width: 40%;
              font-size: ${documentStyle.contentSize}pt;
            }
            .bold {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="document">
              <div class="title">${documentContent.title}</div>
              
              <div class="date-line">
                Fait à : ${documentContent.location} Le : ${documentContent.date}
              </div>
              
              <div class="info-section">
                <div class="info-line">Nom Et Prénom : ${documentContent.name}</div>
                <div class="info-line">CIN : ${documentContent.cin}</div>
              </div>
              
              <div class="info-section">
                <div class="object-line">Objet : Congé annuel payé</div>
              </div>
              
              <div class="info-section">
                <div class="info-line">${documentContent.greeting},</div>
                <div class="content">
                  Par la présente, j'atteste que l'entreprise 
                  <span class="bold"> ${documentContent.company} </span> m'a accordé ${documentContent.days} jours de congé 
                  payé pour la période ${documentContent.period}, 
                  conformément à mes droits aux congés légaux.
                </div>
                <div class="content">
                  ${documentContent.conclusion}
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

  const handlePreview = () => {
    if (previewRef.current) {
      previewRef.current.innerHTML = generateHtml();
    }
  };

  const handlePrint = () => {
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

  const handleDownloadPDF = () => {
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
        const fileName = `autorisation_conge_${documentContent.name.replace(/\s+/g, '_').toLowerCase()}.pdf`;

        iframe.contentWindow?.print();
        
        toast.success("Document téléchargé");
        
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
    try {
      const htmlContent = generateHtml(true);
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `autorisation_conge_${documentContent.name.replace(/\s+/g, '_').toLowerCase()}.doc`;
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Document Word téléchargé");
    } catch (error) {
      toast.error("Erreur lors du téléchargement du document Word");
    }
  };

  const handleDownloadExcel = () => {
    try {
      // Create simple Excel data in CSV format
      const csvContent = [
        ["Document Type", documentContent.title],
        ["Date", documentContent.date],
        ["Location", documentContent.location],
        ["Employee Name", documentContent.name],
        ["CIN", documentContent.cin],
        ["Company", documentContent.company],
        ["Period", documentContent.period],
        ["Days", documentContent.days],
        ["Greeting", documentContent.greeting],
        ["Conclusion", documentContent.conclusion]
      ]
        .map(row => row.join(","))
        .join("\n");
      
      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `autorisation_conge_${documentContent.name.replace(/\s+/g, '_').toLowerCase()}.csv`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Document Excel téléchargé");
    } catch (error) {
      toast.error("Erreur lors du téléchargement du document Excel");
    }
  };

  const handleSaveTemplate = () => {
    toast.success("Modèle enregistré avec succès");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft size={20} />
            <span>Retour</span>
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">
            Éditeur de Document
          </h1>
          <div></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Tabs defaultValue="style">
              <TabsList className="mb-6 w-full">
                <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
                <TabsTrigger value="content" className="flex-1">Contenu</TabsTrigger>
              </TabsList>
              
              <TabsContent value="style" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Police de caractères</label>
                  <Select 
                    value={documentStyle.font} 
                    onValueChange={(value) => handleStyleChange('font', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une police" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Calibri">Calibri</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Taille du titre (pt)</label>
                  <Input 
                    type="number" 
                    value={documentStyle.titleSize}
                    onChange={(e) => handleStyleChange('titleSize', e.target.value)}
                    min="12"
                    max="36"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Taille du contenu (pt)</label>
                  <Input 
                    type="number" 
                    value={documentStyle.contentSize}
                    onChange={(e) => handleStyleChange('contentSize', e.target.value)}
                    min="8"
                    max="20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Marges (cm)</label>
                  <Input 
                    type="number" 
                    value={documentStyle.margins}
                    onChange={(e) => handleStyleChange('margins', e.target.value)}
                    min="1"
                    max="5"
                    step="0.5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Hauteur de ligne</label>
                  <Input 
                    type="number" 
                    value={documentStyle.lineHeight}
                    onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                    min="1"
                    max="3"
                    step="0.1"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Titre du document</label>
                  <Input 
                    value={documentContent.title}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Lieu</label>
                    <Input 
                      value={documentContent.location}
                      onChange={(e) => handleContentChange('location', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Date</label>
                    <Input 
                      value={documentContent.date}
                      onChange={(e) => handleContentChange('date', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Nom et Prénom</label>
                  <Select 
                    value={documentContent.name ? employees.find(e => e.name === documentContent.name)?.id.toString() : ""}
                    onValueChange={handleEmployeeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>{employee.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">CIN</label>
                  <Input 
                    value={documentContent.cin}
                    onChange={(e) => handleContentChange('cin', e.target.value)}
                    placeholder="Numéro de CIN (optionnel)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Entreprise</label>
                  <Select 
                    value={documentContent.company}
                    onValueChange={(value) => handleContentChange('company', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une entreprise" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.name}>{company.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Période</label>
                    <Input 
                      value={documentContent.period}
                      onChange={(e) => handleContentChange('period', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Nombre de jours</label>
                    <Input 
                      value={documentContent.days}
                      onChange={(e) => handleContentChange('days', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Formule de politesse</label>
                  <Select 
                    value={documentContent.greeting} 
                    onValueChange={(value) => handleContentChange('greeting', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une formule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monsieur">Monsieur</SelectItem>
                      <SelectItem value="Madame">Madame</SelectItem>
                      <SelectItem value="Madame, Monsieur">Madame, Monsieur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Conclusion</label>
                  <Textarea 
                    value={documentContent.conclusion}
                    onChange={(e) => handleContentChange('conclusion', e.target.value)}
                    rows={3}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handlePreview}
                className="px-4 py-2 flex items-center gap-2"
              >
                Mettre à jour l'aperçu
              </Button>
              
              <Button 
                onClick={handleSaveTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 flex items-center gap-2"
              >
                <Save size={18} />
                Enregistrer le modèle
              </Button>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 min-h-[297mm] max-h-[297mm] overflow-auto">
              <div className="border border-gray-200 min-h-full p-8" ref={previewRef}>
                <h2 className="text-2xl font-bold italic underline text-center mb-8">{documentContent.title}</h2>
                
                <p className="text-left mb-6">
                  Fait à : <span className="font-bold">{documentContent.location}</span> Le : <span className="font-bold">{documentContent.date}</span>
                </p>
                
                <div className="mb-6">
                  <p className="font-bold mb-2">Nom Et Prénom : {documentContent.name}</p>
                  <p className="font-bold">CIN : {documentContent.cin}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-bold mb-4">Objet : Congé annuel payé</h3>
                  
                  <p className="font-bold mb-4">{documentContent.greeting},</p>
                  
                  <p className="mb-4 text-justify">
                    Par la présente, j'atteste que l'entreprise 
                    <span className="font-bold"> {documentContent.company} </span> 
                    m'a accordé {documentContent.days} jours de congé payé pour la période {documentContent.period}, 
                    conformément à mes droits aux congés légaux.
                  </p>
                  
                  <p className="mb-4 text-justify">
                    {documentContent.conclusion}
                  </p>
                </div>
                
                <div className="flex justify-between mt-16 pt-4">
                  <div>
                    <p>Signature Salarié</p>
                  </div>
                  <div>
                    <p>Signature Directeur</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Printer size={18} />
                Imprimer
              </Button>
              
              <Button
                onClick={handleDownloadPDF}
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
                onClick={handleDownloadExcel}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FileSpreadsheet size={18} />
                Excel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocEditor;
