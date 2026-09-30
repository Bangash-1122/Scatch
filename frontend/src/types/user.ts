export interface User {
    id: string;
    fullName: string;
    email: string;
    username?: string;
    role: 'user' | 'admin' | 'owner';
    avatar?: string;
    contact?: string;
    address?: string;
}
