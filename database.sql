create TABLE person(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    surname VARCHAR(255),
        password VARCHAR(255),
    login VARCHAR(255)
)

-- Create the "instruments" table
CREATE TABLE IF NOT EXISTS instruments (
    instrument_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    brand_id INTEGER REFERENCES brands(brand_id),
    type_id INTEGER REFERENCES instrument_types(type_id),
    description TEXT
    );

-- Create the "brands" table
CREATE TABLE IF NOT EXISTS brands (
    brand_id SERIAL PRIMARY KEY,
    name VARCHAR(255)
    );

-- Create the "instrument_types" table
CREATE TABLE IF NOT EXISTS instrument_types (
    type_id SERIAL PRIMARY KEY,
    name VARCHAR(255)
    );

-- Create the "inventory" table
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id SERIAL PRIMARY KEY,
    instrument_id INTEGER REFERENCES instruments(instrument_id),
    quantity INTEGER,
    price NUMERIC,
    condition VARCHAR(50)
    );

-- Create the "orders" table
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES person(id),
    order_date TIMESTAMP WITHOUT TIME ZONE,
    shipping_address_id INTEGER REFERENCES addresses(address_id)
    );

-- Create the "order_items" table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    inventory_id INTEGER REFERENCES inventory(inventory_id),
    quantity INTEGER,
    price_at_purchase NUMERIC
    );

-- Create the "addresses" table
CREATE TABLE IF NOT EXISTS addresses (
    address_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES person(id),
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(20)
    );
