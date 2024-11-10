import { QueryResponse } from "@/remoteModel/QueryResponse";

export class ApiService {
    baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async query(query: string): Promise<QueryResponse> {
        const response = await fetch(`${this.baseUrl}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: query
        });
        const data: QueryResponse = await response.json();
        return data;
    }
}
