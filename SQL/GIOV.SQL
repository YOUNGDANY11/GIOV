CREATE TABLE roles(
    id_role SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    code VARCHAR(10) NOT NULL
);

CREATE TABLE users(
    id_user BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    document VARCHAR(10) NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar text,
    id_role INT NOT NULL REFERENCES roles(id_role) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE documents(
    id_document BIGSERIAL PRIMARY KEY,
    id_user BIGINT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100),
    document text NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE athletes(
    id_athlete BIGSERIAL PRIMARY KEY,
    id_user BIGINT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    date DATE NOT NULL,
    foot VARCHAR(20) NOT NULL,
    address VARCHAR(100) NOT NULL,
    blood_type VARCHAR(10) NOT NULL,
    stature VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE staff(
    id_staff BIGSERIAL PRIMARY KEY,
    id_user BIGINT NOT NULL UNIQUE REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    date DATE NOT NULL,
    address VARCHAR(100) NOT NULL,
    blood_type VARCHAR(10) NOT NULL,
    information VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE personal_information(
    id_per_inf BIGSERIAL PRIMARY KEY,
    id_user BIGINT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    country VARCHAR(50) NOT NULL,
    deparment VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,    
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE relatives(
    id_relative BIGSERIAL PRIMARY KEY,
    id_user BIGINT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    document VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    deparment VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- INSERCIONES --
INSERT INTO roles (id_role, name, code) VALUES 
(1, 'Admin', 'ADM'),
(2, 'Director Tecnico', 'DT'),
(3, 'Asistente Tecnico', 'AT'),
(4, 'Entrenador', 'ENT'),
(5, 'Medico General', 'MG'),
(6, 'Fisioterapeuta', 'FISIO'),
(7, 'Quiropractico', 'QUIRO'),
(8, 'Deportista', 'DEP'),
(9, 'Usuario Normal', 'USER');