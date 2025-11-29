export type Id= number;
export interface Event {
    id: Id;
    title: string;
    description?: string;
    image_url?: string;
    date: string;
    host_id: number;
    host: User;
    rsvps: RSVP[];
}

export interface User {
    id: Id;
    name: string;
    email: string;
    avatar_url?: string;
}

export interface RSVP {
    id: Id;
    name: string;
    email: string;
} 

