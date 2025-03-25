
import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { Employee } from "../models/employeeTypes";
import { cn } from "@/lib/utils";

interface EmployeeSelectProps {
  employees: Employee[];
  value: Employee | null;
  onChange: (employee: Employee | null) => void;
  className?: string;
}

const EmployeeSelect: React.FC<EmployeeSelectProps> = ({
  employees,
  value,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (employee: Employee) => {
    onChange(employee);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <div
        className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer transition-all duration-200 hover:border-blue-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value ? value.name : "Sélectionner un employé"}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
      </div>
      
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10 overflow-hidden animate-fade-in">
          <div className="p-2 border-b sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-8 pr-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className={`p-2 cursor-pointer hover:bg-blue-50 transition-colors duration-150 ${
                    value?.id === employee.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleSelect(employee)}
                >
                  <div className="flex items-center">
                    {value?.id === employee.id && (
                      <Check className="h-4 w-4 text-blue-500 mr-2" />
                    )}
                    <span className={`${value?.id === employee.id ? "ml-0" : "ml-6"}`}>
                      {employee.name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">Aucun employé trouvé</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSelect;
