import { expect } from "chai";
import { Request, Response, NextFunction } from "express";
import { validatePostPayload } from "../../src/middleware/validatePostPayload.js";

describe("validatePostPayload middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (body) {
        this.json = body;
        return body;
      },
    } as Partial<Response>;
    nextFunction = () => {};
  });

  it("should call next() when all required fields are present", () => {
    let nextCalled = false;
    mockRequest.body = {
      address: "123 Main St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      () => {
        nextCalled = true;
      }
    );

    expect(nextCalled).to.be.true;
  });

  it("should return 400 when address is missing", () => {
    mockRequest.body = {
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.statusCode).to.equal(400);
    expect(mockResponse.json).to.deep.equal({
      message: "Missing required fields",
    });
  });

  it("should return 400 when bankName is missing", () => {
    mockRequest.body = {
      address: "123 Main St",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.statusCode).to.equal(400);
    expect(mockResponse.json).to.deep.equal({
      message: "Missing required fields",
    });
  });

  it("should return 400 when countryISO2 is missing", () => {
    mockRequest.body = {
      address: "123 Main St",
      bankName: "Test Bank",
      countryName: "United States",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.statusCode).to.equal(400);
    expect(mockResponse.json).to.deep.equal({
      message: "Missing required fields",
    });
  });

  it("should return 400 when countryName is missing", () => {
    mockRequest.body = {
      address: "123 Main St",
      bankName: "Test Bank",
      countryISO2: "US",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.statusCode).to.equal(400);
    expect(mockResponse.json).to.deep.equal({
      message: "Missing required fields",
    });
  });

  it("should return 400 when isHeadquarter is missing", () => {
    mockRequest.body = {
      address: "123 Main St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      swiftCode: "TESTUS33XXX",
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.statusCode).to.equal(400);
    expect(mockResponse.json).to.deep.equal({
      message: "Missing required fields",
    });
  });

  it("should return 400 when swiftCode is missing", () => {
    mockRequest.body = {
      address: "123 Main St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: true,
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.statusCode).to.equal(400);
    expect(mockResponse.json).to.deep.equal({
      message: "Missing required fields",
    });
  });

  it("should return 400 when countryISO2 is not 2 characters", () => {
    mockRequest.body = {
      address: "123 Main St",
      bankName: "Test Bank",
      countryISO2: "U",
      countryName: "United States",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.statusCode).to.equal(400);
    expect(mockResponse.json).to.deep.equal({
      message: "Country ISO2 code must be 2 characters",
    });
  });

  it("should return 400 when countryISO2 is not 2 characters", () => {
    mockRequest.body = {
      address: "123 Main St",
      bankName: "Test Bank",
      countryISO2: "USA",
      countryName: "United States",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.statusCode).to.equal(400);
    expect(mockResponse.json).to.deep.equal({
      message: "Country ISO2 code must be 2 characters",
    });
  });

  it("should call next() when all required fields are present", () => {
    let nextCalled = false;
    mockRequest.body = {
      address: "123 Main St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      () => {
        nextCalled = true;
      }
    );

    expect(nextCalled).to.be.true;
  });

  it("should allow empty address field", () => {
    let nextCalled = false;
    mockRequest.body = {
      address: "",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      () => {
        nextCalled = true;
      }
    );

    expect(nextCalled).to.be.true;
  });

  it("should return 400 when swiftCode is not 11 characters", () => {
    mockRequest.body = {
      address: "123 Main St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: true,
      swiftCode: "TESTUS33",
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.statusCode).to.equal(400);
    expect(mockResponse.json).to.deep.equal({
      message: "Swift code must be 11 characters",
    });
  });

  it("should return 400 when isHeadquarter is not boolean", () => {
    mockRequest.body = {
      address: "123 Main St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: 1,
      swiftCode: "TESTUS33",
    };

    validatePostPayload(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.statusCode).to.equal(400);
    expect(mockResponse.json).to.deep.equal({
      message: "Swift code must be 11 characters",
    });
  });
});
