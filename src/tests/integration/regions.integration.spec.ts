import 'mocha';
import * as chai from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { Application } from 'express';

import { startServer } from '../../server.js';
import Region from '../../models/Region.model.js';

const expect = chai.expect;

/**
 * Integration tests for /regions API endpoints.
 */
describe('Regions API - Integration Tests', () => {
  let app: Application;

  const testPolygonPayload = {
    type: 'Polygon' as const,
    coordinates: [[[-46, -23], [-45, -23], [-45, -24], [-46, -24], [-46, -23]]],
  };

  before(async () => {
    const server = await startServer();
    app = server.app;
  });

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Region.deleteMany({});
  });

  describe('POST /regions', () => {
    it('should create a new region with valid data and return 201', async () => {
      const regionPayload = {
        name: 'Valid Test Region',
        coordinates: testPolygonPayload,
      };

      const res = await request(app).post('/regions').send(regionPayload);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('name', regionPayload.name);
      expect(res.body).to.have.property('_id');
    });

    it('should return 400 if the name is missing', async () => {
      const regionPayload = { coordinates: testPolygonPayload };
      const res = await request(app).post('/regions').send(regionPayload);
      expect(res.status).to.equal(400);
    });
  });

  describe('GET /regions', () => {
    it('should return an empty array when no regions exist', async () => {
      const res = await request(app).get('/regions');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(0);
    });

    it('should return all existing regions', async () => {
      await Region.create({ name: 'Region 1', coordinates: testPolygonPayload });
      await Region.create({ name: 'Region 2', coordinates: testPolygonPayload });

      const res = await request(app).get('/regions');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(2);
    });
  });

  describe('GET /regions/:id', () => {
    it('should return a specific region by its ID', async () => {
      const region = await Region.create({ name: 'Unique Region', coordinates: testPolygonPayload });
      const res = await request(app).get(`/regions/${region._id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('_id', region._id.toString());
    });

    it('should return 404 for a non-existent ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/regions/${nonExistentId}`);
      expect(res.status).to.equal(404);
    });
  });

  describe('Geospatial Queries', () => {
    const spPolygon = {
      type: 'Polygon' as const,
      coordinates: [[[-46.8, -23.4], [-46.3, -23.4], [-46.3, -23.8], [-46.8, -23.8], [-46.8, -23.4]]],
    };

    beforeEach(async () => {
      await Region.create({ name: 'Greater São Paulo', coordinates: spPolygon });
    });

    describe('GET /regions/contains-point', () => {
      it('should find the region that contains the given point', async () => {
        const pointInside = { lat: -23.55, lng: -46.63 };
        const res = await request(app).get('/regions/contains-point').query(pointInside);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').with.lengthOf(1);
        expect(res.body[0]).to.have.property('name', 'Greater São Paulo');
      });

      it('should return an empty array if the point is outside', async () => {
        const pointOutside = { lat: 0, lng: 0 };
        const res = await request(app).get('/regions/contains-point').query(pointOutside);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').with.lengthOf(0);
      });
    });

    describe('GET /regions/near-point', () => {
      it('should find the region within the maximum distance', async () => {
        const nearbyPoint = { lat: -23.5, lng: -46.5, distance: 50000 };
        const res = await request(app).get('/regions/near-point').query(nearbyPoint);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').with.lengthOf(1);
      });

      it('should return an empty array if the point is too far', async () => {
        const farPoint = { lat: -22, lng: -43, distance: 10000 };
        const res = await request(app).get('/regions/near-point').query(farPoint);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').with.lengthOf(0);
      });
    });

    describe('GET /regions/by-address', () => {
      it('should find the region by its address', async function () {
        this.timeout(10000); // Increase timeout for real network call

        const address = 'Avenida Paulista, 1578, São Paulo';
        const res = await request(app).get('/regions/by-address').query({ address });

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').with.lengthOf(1);
        expect(res.body[0]).to.have.property('name', 'Greater São Paulo');
      });
    });
  });

  describe('PUT /regions/:id', () => {
    it('should update a region successfully and return 200', async () => {
      const region = await Region.create({ name: 'Original Region', coordinates: testPolygonPayload });
      const updatePayload = { name: 'Updated Region' };

      const res = await request(app).put(`/regions/${region._id}`).send(updatePayload);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', 'Updated Region');
    });

    it('should return 404 when trying to update a non-existent region', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).put(`/regions/${nonExistentId}`).send({ name: 'Ghost Name' });
      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /regions/:id', () => {
    it('should delete a region successfully and return 204', async () => {
      const region = await Region.create({ name: 'To Be Deleted', coordinates: testPolygonPayload });
      const res = await request(app).delete(`/regions/${region._id}`);
      expect(res.status).to.equal(204);

      const verificationRes = await request(app).get(`/regions/${region._id}`);
      expect(verificationRes.status).to.equal(404);
    });

    it('should return 404 when trying to delete a non-existent region', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/regions/${nonExistentId}`);
      expect(res.status).to.equal(404);
    });
  });
});
