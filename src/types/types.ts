export const swiftCode = "swiftCode";
export const countryISO2code = "countryISO2code";

export type MessageResponse = {
  message: string;
};

export type SwiftCodeParams = {
  [key in typeof swiftCode]: string;
};

export type CountryISO2CodeParams = {
  [key in typeof countryISO2code]: string;
};
