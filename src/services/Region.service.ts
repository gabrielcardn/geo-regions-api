import Region, { IRegion } from "../models/Region.model.js";
import { IPoint } from "../types/geo.js";
import GeocodingService from "./Geocoding.service.js";

/**
 * Service for region-related business logic.
 */
class RegionService {
  /** Create a new region */
  public async create(
    regionData: Omit<IRegion, "_id" | "createdAt" | "updatedAt">,
  ): Promise<IRegion> {
    const newRegion = new Region(regionData);
    return newRegion.save();
  }

  /** Retrieve all regions */
  public async findAll(): Promise<IRegion[]> {
    return Region.find();
  }

  /** Retrieve a region by ID */
  public async findById(id: string): Promise<IRegion | null> {
    return Region.findById(id);
  }

  /** Find regions containing a geographic point */
  public async findContainingPoint(point: IPoint): Promise<IRegion[]> {
    const { longitude, latitude } = point;
    const geoJsonPoint = {
      type: "Point" as const,
      coordinates: [longitude, latitude],
    };

    return Region.find({
      coordinates: {
        $geoIntersects: {
          $geometry: geoJsonPoint,
        },
      },
    });
  }

  /** Find regions near a geographic point within a distance */
  public async findNearPoint(point: IPoint, maxDistance: number): Promise<IRegion[]> {
    const { longitude, latitude } = point;

    return Region.find({
      coordinates: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    });
  }

  /** Find regions containing an address by geocoding it first */
  public async findByAddress(address: string): Promise<IRegion[]> {
    const point = await GeocodingService.getCoordsFromAddress(address);
    if (!point) return [];
    return this.findContainingPoint(point);
  }

  /** Update a region by ID */
  public async update(id: string, regionData: Partial<IRegion>): Promise<IRegion | null> {
    return Region.findByIdAndUpdate(id, { $set: regionData }, { new: true });
  }

  /** Delete a region by ID */
  public async delete(id: string): Promise<IRegion | null> {
    return Region.findByIdAndDelete(id);
  }
}

export default new RegionService();
