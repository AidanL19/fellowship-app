CREATE TABLE Sections (
    section_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    section_name TEXT    NOT NULL
);

INSERT INTO Sections (section_name) VALUES
('Food/Beverages');
INSERT INTO Sections (section_name) VALUES
('Self Care/Health');
INSERT INTO Sections (section_name) VALUES
('Clothes');
INSERT INTO Sections (section_name) VALUES
('Fun');
INSERT INTO Sections (section_name) VALUES
('Gifts');
INSERT INTO Sections (section_name) VALUES
('Technology');
INSERT INTO Sections (section_name) VALUES
('Housing');
INSERT INTO Sections (section_name) VALUES
('Transportation');
INSERT INTO Sections (section_name) VALUES
('Utilities');
INSERT INTO Sections (section_name) VALUES
('Insurance');
INSERT INTO Sections (section_name) VALUES
('Debt');
INSERT INTO Sections (section_name) VALUES
('Miscellaneous');

CREATE TABLE Subsections (
    subsection_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id      INTEGER NOT NULL,
    subsection_name TEXT    NOT NULL,
    FOREIGN KEY (section_id) REFERENCES Sections(section_id)
);

INSERT INTO Subsections (section_id, subsection_name) VALUES 
(1, 'Groceries');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(1, 'Takeout');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(1, 'Restaurants');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(1, 'Groceries');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(1, 'Drinking Water');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(1, 'Alcoholic Drinks');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(1, 'Caffeinated Drinks');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(1, 'Sugary Drinks');

INSERT INTO Subsections (section_id, subsection_name) VALUES 
(2, 'Skin/Hair');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(2, 'Beauty/Cosmetics');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(2, 'Grooming/Scents');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(2, 'Hygeine');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(2, 'Physical Health');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(2, 'Mental Health');

INSERT INTO Subsections (section_id, subsection_name) VALUES 
(3, 'Overwear');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(3, 'Underwear');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(3, 'Accessories');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(3, 'Specialty Wear');

INSERT INTO Subsections (section_id, subsection_name) VALUES 
(4, 'Entertainment/Media');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(4, 'Hobbies/Recreation');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(4, 'Travel/Vacations');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(4, 'Events/Experiences');

INSERT INTO Subsections (section_id, subsection_name) VALUES 
(5, 'Personal Gifts');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(5, 'Business Gifts');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(5, 'Charitable Donations');

INSERT INTO Subsections (section_id, subsection_name) VALUES 
(6, 'Hardware/Devices');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(6, 'Software/Applications');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(6, 'Maintenance/Repairs');

INSERT INTO Subsections (section_id, subsection_name) VALUES 
(7, 'Mortgage/Rent');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(7, 'Maintencance/Renovations');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(7, 'Supplies/Furnishing');

INSERT INTO Subsections (section_id, subsection_name) VALUES 
(8, 'Fuel/Charging');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(8, 'Ridesharing/Taxis');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(8, 'Vehicle Ownership');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(8, 'Public Transportation');

INSERT INTO Subsections (section_id, subsection_name) VALUES 
(9, 'Electricity');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(9, 'Gas');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(9, 'Water');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(9, 'Internet');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(9, 'Cable');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(9, 'Security');

INSERT INTO Subsections (section_id, subsection_name) VALUES 
(10, 'Personal Insurance');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(10, 'Property Insurance');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(10, 'Casualty Insurance');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(10, 'Specialized Insurance');

INSERT INTO Subsections (section_id, subsection_name) VALUES 
(11, 'Secured Debt');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(11, 'Unsecured Debt');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(11, 'Medical Debt');
INSERT INTO Subsections (section_id, subsection_name) VALUES 
(11, 'Student Loans');

INSERT INTO Subsections (section_id, subsection_name) VALUES 
(12, 'Other Expenses');

CREATE TABLE Transactions (
    transaction_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id       INTEGER NOT NULL,
    subsection_id    INTEGER NOT NULL,
    amount           DECIMAL NOT NULL,  
    FOREIGN KEY (section_id) REFERENCES Sections(section_id),
    FOREIGN KEY (subsection_id) REFERENCES Subsections(subsection_id)
);