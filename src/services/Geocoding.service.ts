import axios from "axios";
import "dotenv/config";

interface IPoint {
  latitude: number;
  longitude: number;
}

class GeocodingService {
  private readonly nominatimApi = "https://nominatim.openstreetmap.org/search";

  public async getCoordsFromAddress(address: string): Promise<IPoint | null> {
    const countryCode = process.env.COUNTRY_CODE || "BR"; // Padrão 'BR' se não definido

    try {
      const response = await axios.get(this.nominatimApi, {
        params: {
          q: address, // O endereço que queremos buscar
          format: "json", // Queremos a resposta em JSON
          countrycodes: countryCode, // Filtra os resultados pelo país
          limit: 1, // Queremos apenas o resultado mais provável
        },
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        };
      }

      return null; // Endereço não encontrado
    } catch (error) {
      console.error("Error fetching data from Nominatim:", error);
      // Em um app real, teríamos um tratamento de erro mais robusto
      throw new Error("Failed to geocode address");
    }
  }
}

export default new GeocodingService();
