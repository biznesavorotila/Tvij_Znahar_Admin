import axios from "axios";
import { TProduct } from "./types";

const HOST = process.env.REACT_APP_HOST;

export class ProductService {
    static async create(formData: FormData) {
        return await axios.post(`${HOST}/api/product/create`, formData)
    }

    static async getAllWithParents() {
        return await axios.get(`${HOST}/api/product/getAll`);
    }

    static async getAll(isCatalog?: boolean) {
        return await axios.get<TProduct[]>(`${HOST}/api/product/getAll`, {  
            params: { isCatalog },
        });
    }

    static async getProduct(id: number) {
        return await axios.get(`${HOST}/api/product/getOne/${id}`);
    }

    static async update(id: number, formData: FormData) {
        return await axios.patch(`${HOST}/api/product/update/${id}`, formData);
    }

    static async delete(id: number) {
        return await axios.delete(`${HOST}/api/product/${id}`);
    }
}