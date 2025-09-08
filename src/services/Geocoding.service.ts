import axios from "axios";
import "dotenv/config";
import { IPoint } from "../types/geo";

/**
 * Service for geocoding addresses using Nominatim API.
 */
class GeocodingService {
  private readonly nominatimApiUrl = "https://nominatim.openstreetmap.org/search";

  /**
   * Converts an address string to geographic coordinates.
   * @param address Address to geocode
   * @returns Coordinates as IPoint or null if not found
   */
  public async getCoordsFromAddress(address: string): Promise<IPoint | null> {
    const countryCode = process.env.COUNTRY_CODE || "BR";

    try {
      const response = await axios.get(this.nominatimApiUrl, {
        params: {
          q: address,
          format: "json",
          countrycodes: countryCode,
          limit: 1,
        },
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching data from Nominatim:", error);
      throw new Error("Failed to geocode address");
    }
  }
}

export default new GeocodingService();
