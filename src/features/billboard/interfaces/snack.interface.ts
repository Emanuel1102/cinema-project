export interface SnackItem {
  id: string;
  name: string;
  category: "combos" | "crispetas" | "bebidas" | "dulces";
  description: string;
  price: number;
  image: string;
}

export interface SelectedSnack {
  snack: SnackItem;
  quantity: number;
}