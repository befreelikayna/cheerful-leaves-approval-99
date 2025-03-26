
export interface Company {
  id: string;
  name: string;
}

export const companies: Company[] = [
  { id: "1", name: "Amayou Stone" },
  { id: "2", name: "SARL Example" },
  { id: "3", name: "Atlas Construction" },
  { id: "4", name: "Maroc Bâtiment" },
  { id: "5", name: "Casablanca Services" }
];

export const getDefaultCompany = (): Company => {
  return companies[0]; // Amayou Stone is the default
};
