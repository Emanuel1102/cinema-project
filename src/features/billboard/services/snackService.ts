import axios from "axios";
import type { SnackItem } from "../interfaces/snack.interface";

const API_BASE_URL = "http://localhost:3000/api";

const MOCK_SNACKS: SnackItem[] = [
  {
    id: "snack-1",
    name: "Combo Pareja",
    category: "combos",
    description: "Crispetas extragrandes + 2 gaseosas medianas + chocolatina",
    price: 32000,
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "snack-2",
    name: "Combo Personal",
    category: "combos",
    description: "Crispetas medianas + 1 gaseosa personal",
    price: 21000,
    image: "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "snack-3",
    name: "Crispetas de Caramelo",
    category: "crispetas",
    description: "Crispetas dulces con cobertura artesanal de caramelo",
    price: 15000,
    image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "snack-4",
    name: "Gaseosa Grande 32oz",
    category: "bebidas",
    description: "Sabor a elección (Coca-Cola, Cuatro, Sprite)",
    price: 9500,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "snack-5",
    name: "Nachos con Queso Cheddar",
    category: "combos",
    description: "Nachos crujientes con salsa de queso caliente y jalapeños opcionales",
    price: 17000,
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "snack-6",
    name: "Chocolatina M&M's",
    category: "dulces",
    description: "Paquete para compartir 120g",
    price: 8000,
    image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=500&auto=format&fit=crop&q=60",
  },
];

export const snackService = {
  async getSnacks(): Promise<SnackItem[]> {
    try {
      const res = await axios.get<SnackItem[]>(`${API_BASE_URL}/snacks`);
      return res.data;
    } catch {
      // Fallback automático al mock local sin romper la aplicación
      return MOCK_SNACKS;
    }
  },
};  