const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface State {
  id: number;
  name: string;
  description: string;
  requiresMaintenance: boolean;
  active: boolean;
}

interface PaginatedResponse<T> {
  records: T[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  // borar ssi para activar token 
  // const token = getTokenFromStorageOrCookie();
  return {
    "Content-Type": "application/json",
    // ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getStates(page = 1, limit = 10): Promise<PaginatedResponse<State>> {
  const res = await fetch(`${API_URL}states?page=${page}&limit=${limit}`, {
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch states");
  }

  const json = await res.json();
  return json.data;
}

export async function getStateById(id: number): Promise<State> {
  const res = await fetch(`${API_URL}/states/${id}`, {
    headers: await getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`State with ID ${id} not found`);
  }

  const json = await res.json();
  return json.data;
}

export async function createState(data: Omit<State, "id">): Promise<State> {
  const res = await fetch(`${API_URL}/states`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create state");
  }

  const json = await res.json();
  return json.data;
}

export async function updateState(id: number, data: Omit<State, "id">): Promise<State> {
  const res = await fetch(`${API_URL}/states/${id}`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update state");
  }

  const json = await res.json();
  return json.data;
}

export async function deleteState(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/states/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to delete state");
  }
}
