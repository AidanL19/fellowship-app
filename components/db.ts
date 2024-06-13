import * as SQLite from 'expo-sqlite';
import { sections, foodBeverages, selfCareHealth, clothes, fun, gifts, 
    technology, housing, transportation, utilities, insurance, debt, 
    miscellaneous, } from '../components/lists';
import moment from 'moment';
import type { TransactionInfo, LimitInfo, CutDownInfo } from '../models/DatabaseEntryInfo';

let db: any;

const initializeDatabase = async () => {
    console.log("Opening database...");
    db = await SQLite.openDatabaseAsync('app.db');
    console.log("Database opened successfully");

    try {
        await db.execAsync(`CREATE TABLE IF NOT EXISTS Sections (
            section_id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_name TEXT NOT NULL
        )`);

        await db.execAsync(`CREATE TABLE IF NOT EXISTS Subsections (
            subsection_id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_id INTEGER NOT NULL,
            subsection_name TEXT NOT NULL,
            FOREIGN KEY (section_id) REFERENCES Sections(section_id)
        )`);

        await db.execAsync(`CREATE TABLE IF NOT EXISTS Transactions (
            transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_id INTEGER NOT NULL,
            subsection_id INTEGER NOT NULL,
            amount DECIMAL NOT NULL,
            transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (section_id) REFERENCES Sections(section_id),
            FOREIGN KEY (subsection_id) REFERENCES Subsections(subsection_id)
        )`);

        await db.execAsync(`CREATE TABLE IF NOT EXISTS LimitPlan (
            limit_plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount DECIMAL NOT NULL,
            section_id INTEGER NOT NULL,
            subsection_id INTEGER NOT NULL,
            time_period TEXT NOT NULL,
            limit_plan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (section_id) REFERENCES Sections(section_id),
            FOREIGN KEY (subsection_id) REFERENCES Subsections(subsection_id)
        )`);

        await db.execAsync(`CREATE TABLE IF NOT EXISTS CutDownPlan (
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
        )`);

        let checkData: any = await db.getFirstAsync('SELECT * FROM Sections');

        if (checkData !== null) {
            return;
        }

        for (const section of sections) {
            await db.runAsync('INSERT INTO Sections (section_name) VALUES (?)', [section]);
        } 
        
        const resultSections = await db.getAllAsync('SELECT * FROM Sections');
        console.log(resultSections);

        for (const subsection of foodBeverages) {
            await db.runAsync('INSERT INTO Subsections (section_id, subsection_name) VALUES (1, ?)', [subsection]);
        }
    
        for (const subsection of selfCareHealth) {
            await db.runAsync('INSERT INTO Subsections (section_id, subsection_name) VALUES (2, ?)', [subsection]);
        }

        for (const subsection of clothes) {
            await db.runAsync('INSERT INTO Subsections (section_id, subsection_name) VALUES (3, ?)', [subsection]);
        }

        for (const subsection of fun) {
            await db.runAsync('INSERT INTO Subsections (section_id, subsection_name) VALUES (4, ?)', [subsection]);
        }

        for (const subsection of gifts) {
            await db.runAsync('INSERT INTO Subsections (section_id, subsection_name) VALUES (5, ?)', [subsection]);
        }

        for (const subsection of technology) {
            await db.runAsync('INSERT INTO Subsections (section_id, subsection_name) VALUES (6, ?)', [subsection]);
        }

        for (const subsection of housing) {
            await db.runAsync('INSERT INTO Subsections (section_id, subsection_name) VALUES (7, ?)', [subsection]);
        }

        for (const subsection of transportation) {
            await db.runAsync('INSERT INTO Subsections (section_id, subsection_name) VALUES (8, ?)', [subsection]);
        }

        for (const subsection of utilities) {
            await db.runAsync('INSERT INTO Subsections (section_id, subsection_name) VALUES (9, ?)', [subsection]);
        }

        for (const subsection of insurance) {
            await db.runAsync('INSERT INTO Subsections (section_id, subsection_name) VALUES (10, ?)', [subsection]);
        }

        for (const subsection of debt) {
            await db.runAsync('INSERT INTO Subsections (section_id, subsection_name) VALUES (11, ?)', [subsection]);
        }

        for (const subsection of miscellaneous) {
            await db.runAsync('INSERT INTO Subsections (section_id, subsection_name) VALUES (12, ?)', [subsection]);
        }

        const resultSubsections = await db.getAllAsync('SELECT * FROM Subsections');
        console.log(resultSubsections);

        console.log('Database initialized successfully');
    } 
    catch (error) {
        console.error('Failed to initialize database:', error);
    }
};

const clearDatabase = async () => {
    try {
        await db.execAsync('DROP TABLE IF EXISTS Transactions');
        await db.execAsync('DROP TABLE IF EXISTS Subsections');
        await db.execAsync('DROP TABLE IF EXISTS Sections');

        console.log('Database cleared successfully');
    }
    catch (error) {
        console.error('Failed to clear database:', error);
    }
}

const getLocalTime = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss'); 
};

const addTransaction = async (newEntry: TransactionInfo) => {
    console.log("Adding transaction...");

    try {
        const transactionSection = await db.getAllAsync(
            'SELECT section_id FROM Sections WHERE section_name = ?', [newEntry.listSection]
        );

        const transactionSubsection = await db.getAllAsync(
            'SELECT subsection_id FROM Subsections WHERE subsection_name = ?', [newEntry.listSubsection]
        );

        const transactionAmount = newEntry.listAmount;

        const transactionDate = getLocalTime();

        await db.runAsync('INSERT INTO Transactions (section_id, subsection_id, amount) VALUES (?, ?, ?, ?)', 
            [transactionSection[0].section_id, transactionSubsection[0].subsection_id, transactionAmount, transactionDate]
        );

        console.log('Transaction added successfully');
    }
    catch (error) {
        console.error('Failed to add transaction:', error);
    }
};

const addLimitPlan = async (newEntry: LimitInfo) => {
    console.log("Adding limit plan...");

    try {
        const limitPlanAmount = newEntry.limitAmount;

        const limitPlanSection = await db.getAllAsync(
            'SELECT section_id FROM Sections WHERE section_name = ?', [newEntry.limitSection]
        );

        const limitPlanSubsection = await db.getAllAsync(
            'SELECT subsection_id FROM Subsections WHERE subsection_name = ?', [newEntry.limitSubsection]
        );

        const limitPlanTimePeriod = newEntry.limitTimePeriod;

        const limitPlanDate = getLocalTime();

        await db.runAsync('INSERT INTO LimitPlan (amount, section_id, subsection_id, time_period) VALUES (?, ?, ?, ?, ?)', 
            [limitPlanAmount, limitPlanSection[0].section_id, limitPlanSubsection[0].subsection_id, limitPlanTimePeriod, limitPlanDate]
        );

        console.log('Limit plan added successfully');
    }
    catch (error) {
        console.error('Failed to add limit plan:', error);
    }
};

const addCutDownPlan = async (newEntry: CutDownInfo) => {
    console.log("Adding limit plan...");

    try {
        const cutDownPlanAmount = newEntry.cutDownAmount;

        const cutDownPlanSection = await db.getAllAsync(
            'SELECT section_id FROM Sections WHERE section_name = ?', [newEntry.cutDownSection]
        );

        const cutDownPlanSubsection = await db.getAllAsync(
            'SELECT subsection_id FROM Subsections WHERE subsection_name = ?', [newEntry.cutDownSubsection]
        );

        const cutDownPlanTimePeriod = newEntry.cutDownTimePeriod;

        const cutDownPlanTimeAmount = newEntry.cutDownTimeAmount;

        const cutDownPlanTimePeriodPlural = newEntry.cutDownTimePeriodPlural;

        const cutDownPlanBaseAmount = newEntry.cutDownBaseAmount;

        const cutDownPlanDate = getLocalTime();

        await db.runAsync('INSERT INTO CutDownPlan (amount, section_id, subsection_id, time_period, time_amount, time_period_plural, base_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [cutDownPlanAmount, cutDownPlanSection[0].section_id, cutDownPlanSubsection[0].subsection_id, cutDownPlanTimePeriod, 
            cutDownPlanTimeAmount, cutDownPlanTimePeriodPlural, cutDownPlanBaseAmount, cutDownPlanDate]
        );

        console.log('Cut down plan added successfully');
    }
    catch (error) {
        console.error('Failed to add cut down plan:', error);
    }
};

export { initializeDatabase, clearDatabase, addTransaction, addLimitPlan, addCutDownPlan };