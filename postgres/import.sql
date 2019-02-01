CREATE TABLE indexes (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    price double precision NOT NULL,
    parts text,
    time timestamp with time zone NOT NULL
);
