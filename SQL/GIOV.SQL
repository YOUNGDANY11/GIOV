CREATE TABLE roles(
    id_role SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    code VARCHAR(10) NOT NULL
);

CREATE TABLE users(
    id_user BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    document VARCHAR(10) not null,
    password VARCHAR(255) NOT NULL,
    id_role INT NOT NULL REFERENCES roles(id_role),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE documents(
    id_document BIGSERIAL PRIMARY KEY,
    id_user INT NOT NULL REFERENCES users(id_user),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE athletes(
    id_athlete BIGSERIAL PRIMARY KEY,
    id_user BIGINT NOT NULL REFERENCES users(id_user),
    id_role INT NOT NULL, REFERENCES roles(id_role),
    date DATE NOT NULL,
    foot VARCHAR(20) NOT NULL,
    address VARCHAR(100) NOT NULL,
    blood_type VARCHAR(20) NOT NULL,
    stature VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);

CREATE TABLE personal_information(
    id_per_inf BIGSERIAL PRIMARY KEY,
    id_user BIGINT NOT NULL REFERENCES users(id_user),
    country VARCHAR(50) NOT NULL,
    deparment VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,    
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
);

CREATE TABLE relatives(
    id_relative BIGSERIAL PRIMARY KEY,
    id_user BIGINT NOT NULL REFERENCES users(id_user),
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    document VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    deparment VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,    
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);

