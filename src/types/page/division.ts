export type SubDivisions = {
  id: string;
  name: string;
  division_id: string;
};

export type DivisionList = {
  id: string;
  division: string;
  subdivisions: SubDivisions[];
};
