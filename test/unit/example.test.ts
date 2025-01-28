import { expect } from "chai";
import * as myModule from "../../src/sum.js";

describe("myModule", () => {
  it("should return expected result", () => {
    const result = myModule.sum(3, 4);
    expect(result).to.equal(7);
  });
});

describe("test suite", () => {
  it("test case", function () {
    const num: number = 5;
    expect(num).to.be.above(4);
  });
});
