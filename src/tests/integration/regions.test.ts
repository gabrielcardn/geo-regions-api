import "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { startServer } from "../../server"; // Importamos a função que inicia o servidor
import Region from "../../models/Region.model";
import { Application } from "express";

chai.use(chaiHttp);

describe("Region API", () => {
  let app: Application;

  // Hook que roda UMA VEZ ANTES de todos os testes
  before(async () => {
    const server = await startServer();
    app = server.app; // Pegamos a instância do app Express
  });

  // Hook que roda ANTES DE CADA teste (`it`)
  beforeEach(async () => {
    // Limpa a coleção para garantir que um teste não interfira no outro
    await Region.deleteMany({});
  });

  /**
   * Testes para a rota POST /regions
   */
  describe("POST /regions", () => {
    it("deve criar uma nova região com sucesso e retornar status 201", async () => {
      const regionPayload = {
        name: "Região de Teste",
        coordinates: {
          type: "Polygon",
          coordinates: [
            [
              [-46.63, -23.55],
              [-46.62, -23.55],
              [-46.62, -23.56],
              [-46.63, -23.56],
              [-46.63, -23.55],
            ],
          ],
        },
      };

      const res = await chai.request(app).post("/regions").send(regionPayload);

      expect(res).to.have.status(201);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("name", "Região de Teste");
      expect(res.body).to.have.property("_id");
    });

    it("deve retornar erro 400 se o nome não for fornecido", async () => {
      const regionPayload = {
        coordinates: {
          type: "Polygon",
          coordinates: [
            [
              [-46.63, -23.55],
              [-46.62, -23.55],
              [-46.62, -23.56],
              [-46.63, -23.56],
              [-46.63, -23.55],
            ],
          ],
        },
      };

      const res = await chai.request(app).post("/regions").send(regionPayload);

      expect(res).to.have.status(400);
    });
  });

});
