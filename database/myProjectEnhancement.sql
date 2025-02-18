CREATE TABLE maintenance_records (
    record_id SERIAL PRIMARY KEY,
    inv_id INT REFERENCES inventory(inv_id),
    maintenance_date DATE NOT NULL,
    description TEXT NOT NULL,
    cost NUMERIC NOT NULL
);