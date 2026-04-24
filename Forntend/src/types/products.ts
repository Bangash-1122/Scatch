export interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    description: string;
    stock: number;
    category: string;
    bgColor: string;
    panelColor: string;
    textColor: string;
    discountPercent?: number;
}

export interface CartItem extends Product {
    quantity: number;
}