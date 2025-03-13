import axios from "axios";

const HOST = process.env.REACT_APP_HOST;

export class PostService {
    static async create(formData: FormData) {
        if (formData.get('text') === null) {
            return;
        }

        return await axios.post(`${HOST}/api/post/create`, formData);
    }
}