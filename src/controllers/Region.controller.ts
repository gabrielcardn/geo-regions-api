import { Request, Response } from 'express';
import RegionService from '../services/Region.service.js';

class RegionController {
  // Create a new region
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, coordinates } = req.body;
      if (!name || !coordinates) {
        return res.status(400).json({ message: 'Name and coordinates are required' });
      }

      const newRegion = await RegionService.create(req.body);
      return res.status(201).json(newRegion);
    } catch (error) {
      console.error('Error creating region:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Get all regions
  public async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const regions = await RegionService.findAll();
      return res.status(200).json(regions);
    } catch (error) {
      console.error('Error fetching regions:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Get region by ID
  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const region = await RegionService.findById(id);

      if (!region) {
        return res.status(404).json({ message: 'Region not found' });
      }

      return res.status(200).json(region);
    } catch (error) {
      console.error(`Error fetching region by ID ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Get regions containing a specific point
  public async findContainingPoint(req: Request, res: Response): Promise<Response> {
    try {
      const { lat, lng } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({
          message: 'Latitude (lat) and Longitude (lng) query parameters are required',
        });
      }

      const point = {
        latitude: parseFloat(lat as string),
        longitude: parseFloat(lng as string),
      };
      if (isNaN(point.latitude) || isNaN(point.longitude)) {
        return res.status(400).json({ message: 'Invalid latitude or longitude format' });
      }

      const regions = await RegionService.findContainingPoint(point);
      return res.status(200).json(regions);
    } catch (error) {
      console.error('Error in findContainingPoint:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Get regions near a specific point within a distance
  public async findNearPoint(req: Request, res: Response): Promise<Response> {
    try {
      const { lat, lng, distance } = req.query;
      if (!lat || !lng || !distance) {
        return res.status(400).json({
          message: 'Latitude (lat), Longitude (lng), and Distance (distance) query parameters are required',
        });
      }

      const point = {
        latitude: parseFloat(lat as string),
        longitude: parseFloat(lng as string),
      };
      const maxDistance = parseFloat(distance as string);
      if (isNaN(point.latitude) || isNaN(point.longitude) || isNaN(maxDistance)) {
        return res.status(400).json({ message: 'Invalid latitude, longitude, or distance format' });
      }

      const regions = await RegionService.findNearPoint(point, maxDistance);
      return res.status(200).json(regions);
    } catch (error) {
      console.error('Error in findNearPoint:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Get regions by address
  public async findByAddress(req: Request, res: Response): Promise<Response> {
    try {
      const { address } = req.query;
      if (!address) {
        return res.status(400).json({ message: 'Address query parameter is required' });
      }

      const regions = await RegionService.findByAddress(address as string);
      return res.status(200).json(regions);
    } catch (error) {
      console.error('Error in findByAddress:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Update region by ID
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const region = await RegionService.update(id, req.body);

      if (!region) {
        return res.status(404).json({ message: 'Region not found' });
      }

      return res.status(200).json(region);
    } catch (error) {
      console.error(`Error updating region ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Delete region by ID
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const region = await RegionService.delete(id);

      if (!region) {
        return res.status(404).json({ message: 'Region not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error(`Error deleting region ${req.params.id}:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default new RegionController();
