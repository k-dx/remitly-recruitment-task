CREATE TABLE countries_iso2 (
    iso2_code CHAR(2) NOT NULL PRIMARY KEY,
    CONSTRAINT iso2_code_uppercase CHECK (iso2_code = UPPER(iso2_code)),

    country_name TEXT NOT NULL,
    CONSTRAINT country_name_uppercase CHECK (country_name = UPPER(country_name))
);

CREATE TABLE swiftcodes (
    id SERIAL PRIMARY KEY,

    iso2_code CHAR(2) NOT NULL,
    CONSTRAINT iso2_code_uppercase CHECK (iso2_code = UPPER(iso2_code)),

    swift_code CHAR(11) NOT NULL,
    CONSTRAINT swift_code_uppercase CHECK (swift_code = UPPER(swift_code)),

    bank_name TEXT NOT NULL,
    CONSTRAINT bank_name_uppercase CHECK (bank_name = UPPER(bank_name)),

    address TEXT,
    CONSTRAINT address_uppercase CHECK (address = UPPER(address)),

    city TEXT NOT NULL,
    CONSTRAINT city_uppercase CHECK (city = UPPER(city)),

    timezone TEXT NOT NULL
);
