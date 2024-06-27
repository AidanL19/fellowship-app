CREATE TABLE IF NOT EXISTS Sections (
    section_id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Subsections (
    subsection_id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    subsection_name TEXT NOT NULL,
    FOREIGN KEY (section_id) REFERENCES Sections(section_id)
);

CREATE TABLE IF NOT EXISTS Transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    subsection_id INTEGER NOT NULL,
    amount DECIMAL NOT NULL,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES Sections(section_id),
    FOREIGN KEY (subsection_id) REFERENCES Subsections(subsection_id)
);

CREATE TABLE IF NOT EXISTS LimitPlan (
    limit_plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount DECIMAL NOT NULL,
    section_id INTEGER NOT NULL,
    subsection_id INTEGER NOT NULL,
    time_period TEXT NOT NULL,
    limit_plan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES Sections(section_id),
    FOREIGN KEY (subsection_id) REFERENCES Subsections(subsection_id)
);

CREATE TABLE IF NOT EXISTS CutDownPlan (
    cut_down_plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount DECIMAL NOT NULL,
    section_id INTEGER NOT NULL,
    subsection_id INTEGER NOT NULL,
    time_period TEXT NOT NULL,
    time_amount INTEGER NOT NULL,
    time_period_plural TEXT NOT NULL,
    base_amount DECIMAL NOT NULL,
    cut_down_plan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES Sections(section_id),
FOREIGN KEY (subsection_id) REFERENCES Subsections(subsection_id)
);