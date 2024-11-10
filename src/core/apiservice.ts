import { QueryResponse } from "@/remoteModel/QueryResponse";

export class ApiService {
    baseUrl: string;
    username: string;
    password: string;
    token: string;
    constructor(baseUrl: string, auth: { username: string, password: string }) {
        this.baseUrl = baseUrl;
        this.username = auth.username;
        this.password = auth.password;
        this.token = "";
    }

    async login(): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: this.username, password: this.password}),
        });
        const data = await response.json();
        if (data) {
            this.token = data;
            return true;
        }
        return false;
    }

    async query(query: string): Promise<QueryResponse> {
        if (!this.token) {
            const success = await this.login();
            if (!success) {
                throw new Error("Failed to login");
            }
        }
        const response = await fetch(`${this.baseUrl}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                'Authorization': `Bearer ${this.token}`
            },
            body: query,
        });
        const data: QueryResponse = await response.json();
        return data;
    }
}
