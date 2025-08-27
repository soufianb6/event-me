

export type Id = string | number;

export interface User {
    id: Id;
    name: string;
    email: string;
    username: string;
}

export interface Rsvp {
    event_id: Id;
    name: User['name'];
    email: User['email'];
}

export interface Event {
    id: Id;
    title: string;
    date: string;
    image_url: string;
    host_id: Id;
    description?: string;
    host?: User;
    rsvps?: Rsvp[];
}
