export type cartType = {
  id: string;
  name: string;
  image: string;
  price: string;
  variant: {
    id: string;
    value: string;
  };
  size: {
    id: string;
    value: string;
  };
  amount: number;
};
