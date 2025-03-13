export type TableProduct = {
    id: number;
    parent: TableProduct;
    name: string;
    price: number | null;
    description: string;
    image: string;
    isCatalog: boolean;
    isPublished: boolean;

    isChecked: boolean;
}