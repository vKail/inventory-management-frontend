export interface MateriaPostAPIResponse {
    success: boolean;
    message: Message;
    data:    Data;
}

export interface Data {
    id:           number;
    name:         string;
    description:  string;
    materialType: string;
}

export interface Message {
    content:     string[];
    displayable: boolean;
}
