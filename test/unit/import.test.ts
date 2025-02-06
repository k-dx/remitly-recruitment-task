import { expect } from "chai";
import { __TEST__ } from "@/import.js";

describe("preprocess", () => {
  const preprocess = __TEST__.preprocess;
  it("should trim the data", async () => {
    const input = [
      {
        countryISO2Code: " US ",
        swiftCode: " ABCDUS33 ",
        codeType: "BIC",
        name: " Bank of America ",
        address: " 123 Main St ",
        townName: " New York ",
        countryName: " United States ",
        timeZone: " EST ",
      },
    ];

    const result = await preprocess(input);

    expect(result.banks).to.deep.equal([
      {
        countryISO2Code: "US",
        swiftCode: "ABCDUS33",
        name: "Bank of America",
        address: "123 Main St",
      },
    ]);

    expect(result.countries).to.deep.equal([
      {
        iso2: "US",
        name: "United States",
      },
    ]);
  });

  it("should handle multiple rows", async () => {
    const input = [
      {
        countryISO2Code: " US ",
        swiftCode: " ABCDUS33 ",
        codeType: "BIC",
        name: " Bank of America ",
        address: " 123 Main St ",
        townName: " New York ",
        countryName: " United States ",
        timeZone: " EST ",
      },
      {
        countryISO2Code: " CA ",
        swiftCode: " ABCDCA33 ",
        codeType: "BIC",
        name: " Bank of Canada ",
        address: "  ",
        townName: " Toronto ",
        countryName: " Canada ",
        timeZone: " EST ",
      },
    ];

    const result = await preprocess(input);

    expect(result.banks).to.deep.equal([
      {
        countryISO2Code: "US",
        swiftCode: "ABCDUS33",
        name: "Bank of America",
        address: "123 Main St",
      },
      {
        countryISO2Code: "CA",
        swiftCode: "ABCDCA33",
        name: "Bank of Canada",
        address: "",
      },
    ]);

    expect(result.countries).to.deep.equal([
      {
        iso2: "US",
        name: "United States",
      },
      {
        iso2: "CA",
        name: "Canada",
      },
    ]);
  });

  it("should handle empty input", async () => {
    const input: any[] = [];

    const result = await preprocess(input);

    expect(result.banks).to.deep.equal([]);
    expect(result.countries).to.deep.equal([]);
  });
});
