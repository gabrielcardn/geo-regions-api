import 'mocha';
import * as chai from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import GeocodingService from '../../services/Geocoding.service.js';

const expect = chai.expect;

/**
 * Unit tests for GeocodingService.
 * Axios is stubbed to isolate service logic.
 */
describe('Geocoding Service - Unit Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return coordinates when the address is found', async () => {
    const fakeAddress = 'Avenida Paulista, 1578, São Paulo';
    const fakeApiResponse = [{ lat: '-23.5613533', lon: '-46.6565328' }];
    const axiosStub = sinon.stub(axios, 'get').resolves({ data: fakeApiResponse });

    const result = await GeocodingService.getCoordsFromAddress(fakeAddress);

    expect(result).to.deep.equal({
      latitude: -23.5613533,
      longitude: -46.6565328,
    });
    expect(axiosStub.calledOnce).to.be.true;
  });

  it('should return null when the address is not found', async () => {
    const fakeAddress = 'Non-existent address';
    const axiosStub = sinon.stub(axios, 'get').resolves({ data: [] });

    const result = await GeocodingService.getCoordsFromAddress(fakeAddress);

    expect(result).to.be.null;
    expect(axiosStub.calledOnce).to.be.true;
  });

  it('should throw an error when the external API call fails', async () => {
    const fakeAddress = 'Any address';
    const axiosStub = sinon.stub(axios, 'get').rejects(new Error('Network Error'));

    try {
      await GeocodingService.getCoordsFromAddress(fakeAddress);
      expect.fail('Expected error was not thrown');
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
      expect((error as Error).message).to.equal('Failed to geocode address');
    }

    expect(axiosStub.calledOnce).to.be.true;
  });
});
