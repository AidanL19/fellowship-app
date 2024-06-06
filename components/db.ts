import * as SQLite from 'expo-sqlite';
import { sections, foodBeverages, selfCareHealth, clothes, fun, gifts, 
    technology, housing, transportation, utilities, insurance, debt, 
    miscellaneous, } from '../components/lists';
import type { TransactionInfo } from '../models/TransactionInfo';

let db: any;

const initializeDatabase = async () => {
    console.log("Opening database...");
    db = await SQLite.openDatabaseAsync('app.db');
    console.log("Database opened successfully");

    try {
        await db.execAsync(`CREATE TABLE IF NOT EXISTS Sections (
            section_id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_name TEXT NOT NULL
        );`);

        await db.execAsync(`CREATE TABLE IF NOT EXISTS Subsections (
            subsection_id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_id INTEGER NOT NULL,
            subsection_name TEXT NOT NULL,
            FOREIGN KEY (section_id) REFERENCES Sections(section_id)
        );`);

        await db.execAsync(`CREATE TABLE IF NOT EXISTS Transactions (
            transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_id INTEGER NOT NULL,
            subsection_id INTEGER NOT NULL,
            amount DECIMAL NOT NULL,
            FOREIGN KEY (section_id) REFERENCES Sections(section_id),
            FOREIGN KEY (subsection_id) REFERENCES Subsections(subsection_id)
        );`);

        for (const section of sections) {
            await db.runAsync(`INSERT INTO Sections (section_name) VALUES (?)`, [section]);
        }
        const result = await db.execAsync('SELECT * FROM Sections');
        if (result) {
            const rows = await result.getAllAsync();
            console.log(rows);
        }

        for (const subsection of foodBeverages) {
            await db.runAsync(`INSERT INTO Subsections (section_id, subsection_name) VALUES (1, ?);`, [subsection]);
        }

        for (const subsection of selfCareHealth) {
            await db.runAsync(`INSERT INTO Subsections (section_id, subsection_name) VALUES (2, ?);`, [subsection]);
        }

        for (const subsection of clothes) {
            await db.runAsync(`INSERT INTO Subsections (section_id, subsection_name) VALUES (3, ?);`, [subsection]);
        }

        for (const subsection of fun) {
            await db.runAsync(`INSERT INTO Subsections (section_id, subsection_name) VALUES (4, ?);`, [subsection]);
        }

        for (const subsection of gifts) {
            await db.runAsync(`INSERT INTO Subsections (section_id, subsection_name) VALUES (5, ?);`, [subsection]);
        }

        for (const subsection of technology) {
            await db.runAsync(`INSERT INTO Subsections (section_id, subsection_name) VALUES (6, ?);`, [subsection]);
        }

        for (const subsection of housing) {
            await db.runAsync(`INSERT INTO Subsections (section_id, subsection_name) VALUES (7, ?);`, [subsection]);
        }

        for (const subsection of transportation) {
            await db.runAsync(`INSERT INTO Subsections (section_id, subsection_name) VALUES (8, ?);`, [subsection]);
        }

        for (const subsection of utilities) {
            await db.runAsync(`INSERT INTO Subsections (section_id, subsection_name) VALUES (9, ?);`, [subsection]);
        }

        for (const subsection of insurance) {
            await db.runAsync(`INSERT INTO Subsections (section_id, subsection_name) VALUES (10, ?);`, [subsection]);
        }

        for (const subsection of debt) {
            await db.runAsync(`INSERT INTO Subsections (section_id, subsection_name) VALUES (11, ?);`, [subsection]);
        }

        for (const subsection of miscellaneous) {
            await db.runAsync(`INSERT INTO Subsections (section_id, subsection_name) VALUES (12, ?);`, [subsection]);
        }

        console.log('Database initialized successfully');
    } 
    catch (error) {
        console.error('Failed to initialize database:', error);
    }
};

const addTransaction = async (newEntry: TransactionInfo) => {
    console.log("Adding transaction...");

    try {
        const result = await db.execAsync(
            `SELECT section_id FROM Sections WHERE section_name = ?;`, [newEntry.listSection])
        console.log(newEntry);
        console.log(result);

        console.log('Transaction added successfully');
    }
    catch (error) {
        console.error('Failed to add transaction:', error);
    }
};

export { initializeDatabase, addTransaction };