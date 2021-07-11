import * as request from "supertest";
import app from "../../src/app";
var mongoose = require("mongoose");

describe("Client", () => {
  afterEach(async () => {
    mongoose.connect(process.env.MONGO_DB_URL, function () {
      mongoose.connection.db.dropDatabase();
    });
  });

  it("should be able to create user", async () => {
    const expectedResponseBody = {
      msg: "Criado com sucesso",
    };
    const response = await request(app)
      .post("/client")
      .send({
        name: "Teste",
        active: true,
        subDomains: ["magalu"],
        departaments: ["Financeiro", "Suporte", "Vendas"],
        user: {
          name: "Teste",
          email: "teste@pessoalize.com",
          password: "123",
          active: true,
          firstUser: true,
        },
      })
      .set("Accept", "application/json");

    await expect(response.status).toBe(201);
    await expect(response.body).toStrictEqual(expectedResponseBody);
  });

  it("should not be able to create user when user email already exists", async () => {
    const expectedResponseBody = {
      errors: "email ja cadastrado",
    };
    await request(app)
      .post("/client")
      .send({
        name: "dezena",
        active: true,
        subDomains: ["magalu"],
        departaments: ["Financeiro", "Suporte", "Vendas"],
        user: {
          name: "Teste",
          email: "dezena@pessoalize.com",
          password: "123",
          active: true,
          firstUser: true,
        },
      })
      .set("Accept", "application/json");
    const response = await request(app)
      .post("/client")
      .send({
        name: "pessoalize",
        active: true,
        subDomains: ["pessoalze"],
        departaments: ["Financeiro", "Suporte", "Vendas"],
        user: {
          name: "Teste",
          email: "dezena@pessoalize.com",
          password: "123",
          active: true,
          firstUser: true,
        },
      })
      .set("Accept", "application/json");

    await expect(response.status).toBe(401);
    await expect(response.body).toStrictEqual(expectedResponseBody);
  });

  it("should not be able to create user when subdomain already exists", async () => {
    const expectedResponseBody = {
      errors: "Sub Domínio já cadastrado",
    };
    await request(app)
      .post("/client")
      .send({
        name: "dezena",
        active: true,
        subDomains: ["magalu"],
        departaments: ["Financeiro", "Suporte", "Vendas"],
        user: {
          name: "Teste",
          email: "dezena@pessoalize.com",
          password: "123",
          active: true,
          firstUser: true,
        },
      })
      .set("Accept", "application/json");
    const response = await request(app)
      .post("/client")
      .send({
        name: "pessoalize",
        active: true,
        subDomains: ["magalu"],
        departaments: ["Financeiro", "Suporte", "Vendas"],
        user: {
          name: "Teste",
          email: "pessoalize@pessoalize.com",
          password: "123",
          active: true,
          firstUser: true,
        },
      })
      .set("Accept", "application/json");

    await expect(response.status).toBe(400);
    await expect(response.body).toStrictEqual(expectedResponseBody);
  });

  it("should not be able to create user when client name already exists", async () => {
    const expectedResponseBody = {
      errors: "Cliente já cadastrado",
    };
    await request(app)
      .post("/client")
      .send({
        name: "dezena",
        active: true,
        subDomains: ["magalu"],
        departaments: ["Financeiro", "Suporte", "Vendas"],
        user: {
          name: "Teste",
          email: "dezena@pessoalize.com",
          password: "123",
          active: true,
          firstUser: true,
        },
      })
      .set("Accept", "application/json");
    const response = await request(app)
      .post("/client")
      .send({
        name: "dezena",
        active: true,
        subDomains: ["pessoaize"],
        departaments: ["Financeiro", "Suporte", "Vendas"],
        user: {
          name: "Teste",
          email: "pessoalize@pessoalize.com",
          password: "123",
          active: true,
          firstUser: true,
        },
      })
      .set("Accept", "application/json");

    await expect(response.status).toBe(400);
    await expect(response.body).toStrictEqual(expectedResponseBody);
  });

  it("should not be able to create user when subdomain not exists", async () => {
    const response = await request(app)
      .post("/client")
      .send({
        name: "dezena",
        active: true,
        departaments: ["Financeiro", "Suporte", "Vendas"],
        user: {
          name: "Teste",
          email: "dezena@pessoalize.com",
          password: "123",
          active: true,
          firstUser: true,
        },
      })
      .set("Accept", "application/json");

    await expect(response.status).toBe(400);
  });

  it("should be able to get user", async () => {
    await request(app)
      .post("/client")
      .send({
        name: "Teste",
        active: true,
        subDomains: ["magalu"],
        departaments: ["Financeiro", "Suporte", "Vendas"],
        user: {
          name: "Teste",
          email: "teste@pessoalize.com",
          password: "123",
          active: true,
          firstUser: true,
        },
      })
      .set("Accept", "application/json");

    const auth = await request(app)
      .post("/auth")
      .send({
        email: "teste@pessoalize.com",
        password: "123",
      })
      .set("Accept", "application/json");

    const response = await request(app)
      .get("/client")
      .set("Accept", "application/json")
      .set("Authorization", auth.body.token);

    await expect(response.status).toBe(200);
    await expect(response.body).toMatchObject({
      active: true,
      subDomains: ["magalu"],
      departaments: ["Financeiro", "Suporte", "Vendas"],
      name: "teste",
    });
  });

  it("should not be able to get user whithout authenticate", async () => {
    const expectedResponseBody = {
      msg: "Não autorizado",
    };
    await request(app)
      .post("/client")
      .send({
        name: "Teste",
        active: true,
        subDomains: ["magalu"],
        departaments: ["Financeiro", "Suporte", "Vendas"],
        user: {
          name: "Teste",
          email: "teste@pessoalize.com",
          password: "123",
          active: true,
          firstUser: true,
        },
      })
      .set("Accept", "application/json");

    const response = await request(app)
      .get("/client")
      .set("Accept", "application/json");

    await expect(response.status).toBe(401);
    await expect(response.body).toStrictEqual(expectedResponseBody);
  });
});
