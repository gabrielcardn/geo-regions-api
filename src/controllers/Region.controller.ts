import { Request, Response } from "express";
import RegionService from "../services/Region.service";

class RegionController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      // Validação básica
      const { name, coordinates } = req.body;
      if (!name || !coordinates) {
        return res.status(400).json({ message: "Name and coordinates are required" });
      }

      const newRegion = await RegionService.create(req.body);
      return res.status(201).json(newRegion);
    } catch (error) {
      // Em um projeto real, teríamos um log mais detalhado aqui
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const regions = await RegionService.findAll();
      return res.status(200).json(regions);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const region = await RegionService.findById(id);

      if (!region) {
        return res.status(404).json({ message: "Region not found" });
      }

      return res.status(200).json(region);
    } catch (error) {
      // Este erro pode acontecer se o ID for inválido (não for um ObjectId do Mongo)
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async findContainingPoint(req: Request, res: Response): Promise<Response> {
    console.log("CONTROLLER findContainingPoint");
    console.log("req: ", req);
    console.log("res: ", res);
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        return res
          .status(400)
          .json({ message: "Latitude (lat) and Longitude (lng) query parameters are required" });
      }

      const point = {
        latitude: parseFloat(lat as string),
        longitude: parseFloat(lng as string),
      };

      if (isNaN(point.latitude) || isNaN(point.longitude)) {
        return res.status(400).json({ message: "Invalid latitude or longitude format" });
      }

      const regions = await RegionService.findContainingPoint(point);
      return res.status(200).json(regions);
    } catch (error) {
      // A MUDANÇA ESTÁ AQUI!
      console.error("ERROR in findContainingPoint:", error); // Adicione esta linha!
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async findNearPoint(req: Request, res: Response): Promise<Response> {
    try {
      const { lat, lng, distance } = req.query;

      if (!lat || !lng || !distance) {
        return res
          .status(400)
          .json({
            message:
              "Latitude (lat), Longitude (lng), and Distance (distance) query parameters are required",
          });
      }

      const point = {
        latitude: parseFloat(lat as string),
        longitude: parseFloat(lng as string),
      };
      const maxDistance = parseFloat(distance as string);

      if (isNaN(point.latitude) || isNaN(point.longitude) || isNaN(maxDistance)) {
        return res.status(400).json({ message: "Invalid latitude, longitude, or distance format" });
      }

      const regions = await RegionService.findNearPoint(point, maxDistance);
      return res.status(200).json(regions);
    } catch (error) {
      console.error("ERROR in findNearPoint:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async findByAddress(req: Request, res: Response): Promise<Response> {
    try {
      const { address } = req.query;

      if (!address) {
        return res.status(400).json({ message: "Address query parameter is required" });
      }

      const regions = await RegionService.findByAddress(address as string);
      return res.status(200).json(regions);
    } catch (error) {
      console.error("ERROR in findByAddress:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new RegionController();
