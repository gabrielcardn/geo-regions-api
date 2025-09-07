import Region, { IRegion } from "../models/Region.model";
import GeocodingService from "./Geocoding.service";

// Interface para definir a estrutura de um ponto
interface IPoint {
  latitude: number;
  longitude: number;
}

class RegionService {
  public async create(
    regionData: Omit<IRegion, "_id" | "createdAt" | "updatedAt">
  ): Promise<IRegion> {
    // A 'omit' é uma boa prática para garantir que não estamos recebendo IDs ou timestamps (explicar melhor)

    const newRegion = new Region(regionData);
    await newRegion.save();
    return newRegion;
  }

  // Listar todas as regiões
  public async findAll(): Promise<IRegion[]> {
    const regions = await Region.find();
    return regions;
  }

  // Encontrar uma região pelo ID
  public async findById(id: string): Promise<IRegion | null> {
    const region = await Region.findById(id);
    return region; // Retorna o documento ou null se não encontrar
  }

  // Encontrar regiões que contêm um ponto
  public async findContainingPoint(point: IPoint): Promise<IRegion[]> {
    const { longitude, latitude } = point;

    // A query do MongoDB espera um formato específico para o ponto GeoJSON
    const geoJsonPoint = {
      type: "Point",
      coordinates: [longitude, latitude], // IMPORTANTE: A ordem é [longitude, latitude]
    };

    const regions = await Region.find({
      coordinates: {
        // O campo do nosso schema
        $geoIntersects: {
          // O operador que verifica a intersecção
          $geometry: geoJsonPoint, // A geometria que queremos verificar (nosso ponto)
        },
      },
    });

    return regions;
  }

   // Encontrar regiões próximas a um ponto
  public async findNearPoint(point: IPoint, maxDistance: number): Promise<IRegion[]> {
    const { longitude, latitude } = point;

    const regions = await Region.find({
      coordinates: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude] // Lembre-se: [longitude, latitude]
          },
          // $maxDistance espera o valor em METROS
          $maxDistance: maxDistance
        }
      }
    });

    return regions;
  }

   public async findByAddress(address: string): Promise<IRegion[]> {
    // 2. Chama o serviço de geocoding
    const point = await GeocodingService.getCoordsFromAddress(address);

    if (!point) {
      // Se o endereço não foi encontrado, retorna uma lista vazia
      return [];
    }

    // 3. Reutiliza a função que já tínhamos!
    return this.findContainingPoint(point);
  }
}

export default new RegionService();
