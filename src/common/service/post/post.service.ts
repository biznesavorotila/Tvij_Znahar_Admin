import axios from "axios";

const HOST = 'https://tvijznahar-production.up.railway.app';

export class PostService {
    static async create(formData: FormData) {
        if (formData.get('text') === null) {
            return;
        }

        return await axios.post(`${HOST}/api/post/create`, formData);
    }
}