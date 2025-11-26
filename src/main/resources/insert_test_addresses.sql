-- Insert test addresses for the Ekart application
-- Run this script in your PostgreSQL database (ekart database)

INSERT INTO address (id, street, city, pincode, state) VALUES
(1, '123 Main Street', 'Mumbai', 400001, 'Maharashtra'),
(2, '456 Park Avenue', 'Delhi', 110001, 'Delhi'),
(3, '789 Beach Road', 'Bangalore', 560001, 'Karnataka'),
(4, '321 Tech Park', 'Hyderabad', 500001, 'Telangana'),
(5, '654 River Lane', 'Kolkata', 700001, 'West Bengal'),
(6, '987 Mountain View', 'Pune', 411001, 'Maharashtra'),
(7, '111 Valley Road', 'Chennai', 600001, 'Tamil Nadu'),
(8, '222 Ocean Drive', 'Ahmedabad', 380001, 'Gujarat');

-- Verify the data was inserted
SELECT * FROM address;
