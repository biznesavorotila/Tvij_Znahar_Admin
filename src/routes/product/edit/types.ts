export type TProduct = {
    id: number;
    parent: TProduct;
    name: string;
    price: number | null;
    description: string;
    image: string;
    isCatalog: boolean;
    isPublished: boolean;
}