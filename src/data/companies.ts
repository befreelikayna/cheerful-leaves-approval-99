
export interface Company {
  id: string;
  name: string;
}

export const companies: Company[] = [
  { id: "1", name: "Amayou Stone" },
  { id: "2", name: "inedeq" },
  { id: "3", name: "ranstone" },
  { id: "4", name: "biostone" },
  { id: "5", name: "alicante" },
  { id: "6", name: "cabeza" }
];

export const getDefaultCompany = (): Company => {
  return companies[0]; // Amayou Stone is the default
};
