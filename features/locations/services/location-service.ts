import { Location } from "../interfaces/location.interface";
import { mockLocations } from "../data/mock-locations";

export const locationService = {
  async getAll(): Promise<Location[]> {
    return mockLocations;
  },
  async getById(id: number): Promise<Location | undefined> {
    return mockLocations.find((location) => location.id === id);
  },
  async create(data: Location): Promise<Location> {
    return { ...data, id: Date.now() };
  },
  async update(id: number, data: Location): Promise<Location> {
    return { ...data, id };
  },
  async delete(id: number): Promise<boolean> {
    return true;
  },
};
