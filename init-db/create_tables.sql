CREATE TABLE countries_iso2 (
    country_iso2 CHAR(2) NOT NULL PRIMARY KEY,
    CONSTRAINT country_iso2_uppercase CHECK (country_iso2 = UPPER(country_iso2)),

    country_name TEXT NOT NULL,
    CONSTRAINT country_name_uppercase CHECK (country_name = UPPER(country_name))
);

CREATE TABLE swift_codes (
    id SERIAL PRIMARY KEY,

    country_iso2 CHAR(2) NOT NULL,
    CONSTRAINT country_iso2_uppercase CHECK (country_iso2 = UPPER(country_iso2)),
    CONSTRAINT fk_country_iso2 FOREIGN KEY (country_iso2) REFERENCES countries_iso2(country_iso2) ON DELETE RESTRICT,

    swift_code CHAR(11) NOT NULL UNIQUE,
    CONSTRAINT swift_code_uppercase CHECK (swift_code = UPPER(swift_code)),

    bank_name TEXT NOT NULL,
    CONSTRAINT bank_name_uppercase CHECK (bank_name = UPPER(bank_name)),

    address TEXT,
    CONSTRAINT address_uppercase CHECK (address = UPPER(address))
);
