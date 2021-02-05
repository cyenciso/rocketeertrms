import axios from 'axios';
import { Request } from '../models/request.model';

class RequestService {

    private URI: string;

    constructor() {
        this.URI = 'http://localhost:9000/requests';
    }

    // add request
    addRequest(request: Request): Promise<null> {
        return axios.post(this.URI, request, {withCredentials: true}).then(result => null);
    }

    // update request
    updateRequest(request: Request): Promise<null> {
        return axios.put(this.URI+"/update", request).then( result => result.data);
    }

    // get requests by user
    // getRequestById(id: number): Promise<Employee[]> {
    //     return axios.get(this.URI+'/'+role).then(result => result.data);
    // }
}

export default new RequestService();