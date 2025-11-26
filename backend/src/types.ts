interface Event {
    id: number;
    title: string;
    description?: string;
    image_url?: string;
    date: string;
    host_id: number;
    host: User;
    rsvps: RSVP[];
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
}

interface RSVP {
    id: number;
    name: string;
    email: string;
} 