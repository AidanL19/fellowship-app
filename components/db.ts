import * as SQLite from 'expo-sqlite';
import { sections, foodBeverages, selfCareHealth, clothes, fun, gifts, 
    technology, housing, transportation, utilities, insurance, debt, 
    miscellaneous, } from '../components/lists';
import moment from 'moment';
import { useSpendingGoals } from '../Context';
import type { TransactionInfo, LimitInfo, CutDownInfo, RemovedGoalInfo } from '../models/DatabaseEntryInfo';

let db: any;
let ready: boolean = false;

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
            time_amount INTEGER NOT NULL,
            time_period_plural TEXT NOT NULL,
            start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            end_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            counter DECIMAL NOT NULL,
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
            base_amount_to_change DECIMAL NOT NULL,
            start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            end_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            counter DECIMAL NOT NULL,
            FOREIGN KEY (section_id) REFERENCES Sections(section_id),
            FOREIGN KEY (subsection_id) REFERENCES Subsections(subsection_id)
        )`);

        await db.execAsync(`CREATE TABLE IF NOT EXISTS RemovedGoals (
            removed_goal_id INTEGER PRIMARY KEY AUTOINCREMENT,
            removed_goal TEXT NOT NULL,
            UNIQUE(removed_goal)
        )`);

        let checkData: any = await db.getFirstAsync('SELECT * FROM Sections');

        if (checkData !== null) {
            ready = true;
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

        ready = true;

        console.log(resultSubsections);

        console.log('Database initialized successfully');
    } 
    catch (error) {
        console.error('Failed to initialize database:', error);
    }
};

const databaseReady = () => {
    return ready;
};

const clearDatabase = async () => {
    try {
        await db.execAsync('DROP TABLE IF EXISTS Transactions');
        await db.execAsync('DROP TABLE IF EXISTS Subsections');
        await db.execAsync('DROP TABLE IF EXISTS Sections');
        await db.execAsync('DROP TABLE IF EXISTS LimitPlan');
        await db.execAsync('DROP TABLE IF EXISTS CutDownPlan');
        await db.execAsync('DROP TABLE IF EXISTS RemovedGoals');

        console.log('Database cleared successfully');
    }
    catch (error) {
        console.error('Failed to clear database:', error);
    }
}

const getLocalTime = () => {
    return moment().format('YYYY-MM-DD'); 
};

const getEndTime = (timeAmount: any, timePeriod: string) => {
    return moment().add(timeAmount, timePeriod).format('YYYY-MM-DD');
};

const addDays = (initialDate: string, timeAmount: any, timePeriod: string) => {
    return moment(initialDate).add(timeAmount, timePeriod).format('YYYY-MM-DD');
}

const getDaysUntilEnd = (startDate: string, endDate: string) => {
    const start = moment(startDate, 'YYYY-MM-DD');
    const end = moment(endDate, 'YYYY-MM-DD');
    return end.diff(start, 'days');
};

const checkCutDownAmounts = async () => {
    console.log("Checking cut down amounts...");
    
    try {
        const currentDate = getLocalTime();

        const cutDownPlanResults = await db.getAllAsync('SELECT * FROM CutDownPlan');

        console.log('Cut down plan results:', cutDownPlanResults);

        for (let i: number = 0; i < cutDownPlanResults.length; i++) {
            const current = cutDownPlanResults[i];

            const startDate = current.start_date;
            const endDate = current.end_date;
            const numDays = getDaysUntilEnd(startDate, endDate);
            let divisor: number = 0;

            if (current.time_period === "Day") {
                divisor = 1;
            }
            else if (current.time_period === "Week") {
                divisor = 7;
            }
            else if (current.time_period === "Month") {
                divisor = 30;
            }
            else if (current.time_period === "Year") {
                divisor = 365;
            }

            const difference = Math.floor(numDays / divisor);
            let dateList: string[] = [startDate, endDate];

            for (let j: number = 0; j < difference; j++) {
                const date = addDays(startDate, divisor, 'days');
                dateList.splice(j + 1, 0, date);
                divisor += divisor;
            }

            let multiplier: number = 0;

            for (let j: number = 0; j < dateList.length - 1; j++) {
                if (moment(currentDate, 'YYYY-MM-DD').isBetween(moment(dateList[j], 'YYYY-MM-DD'), moment(dateList[j + 1], 'YYYY-MM-DD'), null, '[]')) {
                    multiplier = j;
                    break; 
                }
            }

            const amountToSubtract = (current.amount * multiplier);

            await db.runAsync('UPDATE CutDownPlan SET base_amount_to_change = base_amount - ? WHERE cut_down_plan_id = ?', [amountToSubtract, (i + 1)]);
        }

        console.log('Cut down amounts checked successfully');
    }
    catch (error) {
        console.error('Failed to check cut down amounts:', error);
    }
};

const addRemovedGoal = async (newEntry: RemovedGoalInfo) => {
    console.log("Adding removed goal...");

    try {
        const removedGoalsEntry = newEntry.removedGoalEntry;

        await db.runAsync('INSERT INTO RemovedGoals (removed_goal) VALUES (?)', 
            [removedGoalsEntry]
        );

        console.log('Removed goal added successfully');
    }
    catch (error) {
        console.error('Failed to add removed goal:', error);
    }
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

        await db.runAsync('INSERT INTO Transactions (section_id, subsection_id, amount, transaction_date) VALUES (?, ?, ?, ?)', 
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

        const limitPlanTimeAmount = newEntry.limitTimeAmount;

        const limitPlanTimePeriodPlural = newEntry.limitTimePeriodPlural;

        const limitPlanStartDate = getLocalTime();

        const limitPlanEndDate = getEndTime(limitPlanTimeAmount, limitPlanTimePeriodPlural.toLowerCase());

        const limitPlanCounter = 0.00;

        return await db.runAsync('INSERT INTO LimitPlan (amount, section_id, subsection_id, time_amount, time_period_plural, start_date, end_date, counter) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [limitPlanAmount, limitPlanSection[0].section_id, limitPlanSubsection[0].subsection_id, limitPlanTimeAmount, 
            limitPlanTimePeriodPlural, limitPlanStartDate, limitPlanEndDate, limitPlanCounter]
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

        const cutDownPlanStartDate = getLocalTime();

        const cutDownPlanEndDate = getEndTime(cutDownPlanTimeAmount, cutDownPlanTimePeriodPlural.toLowerCase());

        const cutDownPlanCounter = 0.00;

        return await db.runAsync('INSERT INTO CutDownPlan (amount, section_id, subsection_id, time_period, time_amount, time_period_plural, base_amount, base_amount_to_change, start_date, end_date, counter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [cutDownPlanAmount, cutDownPlanSection[0].section_id, cutDownPlanSubsection[0].subsection_id, cutDownPlanTimePeriod, 
            cutDownPlanTimeAmount, cutDownPlanTimePeriodPlural, cutDownPlanBaseAmount, cutDownPlanBaseAmount, cutDownPlanStartDate, cutDownPlanEndDate, cutDownPlanCounter]
        );

        console.log('Cut down plan added successfully');
    }
    catch (error) {
        console.error('Failed to add cut down plan:', error);
    }
};

const checkTransaction = async (newEntry: TransactionInfo) => {
    console.log("Checking transaction...");

    try {
        const transactionSection = [newEntry.listSection]

        const transactionSubsection = [newEntry.listSubsection]

        const transactionAmount = [newEntry.listAmount];

        return { transactionSection, transactionSubsection, transactionAmount };

        console.log('Transaction checked successfully');
    }
    catch (error) {
        console.error('Failed to check transaction:', error);
    }
};

const checkGoals = async (transactionSection: string, transactionSubsection: string, currentGoal: string) => {
    console.log("Checking goals...");

    try {
        if (currentGoal.includes(transactionSection) && currentGoal.includes(transactionSubsection)) {
            return true;
        }
        else {
            return false;
        }

        console.log('Goals checked successfully');
    }
    catch (error) {
        console.error('Failed to check goals:', error);
    }
};

const changeCounter = async (transactionSection: string, transactionSubsection: string, transactionAmount: string) => {
    console.log("Changing counter...");

    try {
        const goalSection = await db.getAllAsync(
            'SELECT section_id FROM Sections WHERE section_name = ?', [transactionSection[0]]
        );

        const goalSubsection = await db.getAllAsync(
            'SELECT subsection_id FROM Subsections WHERE subsection_name = ?', [transactionSubsection[0]]
        );

        await db.runAsync('UPDATE LimitPlan SET counter = counter + ? WHERE section_id = ? AND subsection_id = ?', [transactionAmount[0], goalSection[0].section_id, goalSubsection[0].subsection_id]);
        await db.runAsync('UPDATE CutDownPlan SET counter = counter + ? WHERE section_id = ? AND subsection_id = ?', [transactionAmount[0], goalSection[0].section_id, goalSubsection[0].subsection_id]);

        const newLimitCounters = await db.getAllAsync(
            'SELECT counter FROM LimitPlan WHERE section_id = ? AND subsection_id = ?', [goalSection[0].section_id, goalSubsection[0].subsection_id]
        ); 

        const newCutDownCounters = await db.getAllAsync(
            'SELECT counter FROM CutDownPlan WHERE section_id = ? AND subsection_id = ?', [goalSection[0].section_id, goalSubsection[0].subsection_id]
        );

        const limitAmounts = await db.getAllAsync(
            'SELECT amount FROM LimitPlan WHERE section_id = ? AND subsection_id = ?', [goalSection[0].section_id, goalSubsection[0].subsection_id]
        ); 

        const cutDownAmounts = await db.getAllAsync(
            'SELECT base_amount_to_change FROM CutDownPlan WHERE section_id = ? AND subsection_id = ?', [goalSection[0].section_id, goalSubsection[0].subsection_id]
        );

        let limitIndices: number[] = [], cutDownIndices: number[] = [];

        for (let i: number = 0; i < newLimitCounters.length; i++) {
            if (newLimitCounters[i].counter >= limitAmounts[i].amount) {
                limitIndices.push(i);
            }
        }

        for (let i: number = 0; i < newCutDownCounters.length; i++) {
            if (newCutDownCounters[i].counter >= cutDownAmounts[i].base_amount_to_change) {
                cutDownIndices.push(i);
            }
        }

        return { limitIndices, cutDownIndices };

        console.log('Counter changed successfully');
    }
    catch (error) {
        console.error('Failed to change counter:', error);
    }
};

const getTimePeriod = async (timePeriod: string) => {
    console.log("Getting time period...");

    try {
        switch (timePeriod) {
            case 'Day':
                return "strftime('%Y-%m-%d', t.transaction_date) = strftime('%Y-%m-%d', date('now'))";
            case 'Week':
                return "strftime('%Y-%W', t.transaction_date) = strftime('%Y-%W', date('now'))";
            case 'Month':
                return "strftime('%Y-%m', t.transaction_date) = strftime('%Y-%m', date('now'))";
            case 'Year':
                return "strftime('%Y', t.transaction_date) = strftime('%Y', date('now'))";
        }
    }
    catch (error) {
        console.error('Failed to get time period:', error);
    }
};

const displaySpending = async (timePeriod: string) => {
    console.log("Displaying spending...");

    const timeFilter = await getTimePeriod(timePeriod);

    try {
        return await db.getAllAsync(`
            SELECT s.section_name, ss.subsection_name, SUM(t.amount) as total, 
                concat(s.section_name, ' - ', ss.subsection_name, ': $', SUM(t.amount)) as spending_list 
            FROM Transactions t 
                INNER JOIN main.Sections S on S.section_id = t.section_id 
                INNER JOIN main.Subsections SS on SS.subsection_id = t.subsection_id 
            WHERE 
                ${timeFilter}
            GROUP BY 
                s.section_id, ss.subsection_id 
            ORDER BY 
                SUM(t.amount) DESC
        `);
    }
    catch (error) {
        console.error('Failed to display spending:', error);

        return [];
    }
};

const displayVisualization = async (timePeriod: string, sectionSelected: boolean, subsectionNum: number) => {
    console.log("Displaying visualization...");

    const timeFilter = await getTimePeriod(timePeriod);

    try {
        if (sectionSelected) {
            return await db.getAllAsync(`
                SELECT s.section_name, SUM(t.amount), 
                    concat(s.section_name, ': $', SUM(t.amount)) as section_list
                FROM Transactions t
                    INNER JOIN main.Sections S on S.section_id = t.section_id
                WHERE
                    ${timeFilter}
                GROUP BY 
                    s.section_id
                ORDER BY
                    SUM(t.amount) DESC
            `);
        }
        else {
            return await db.getAllAsync(`
                SELECT ss.subsection_name, SUM(t.amount),
                    concat(ss.subsection_name, ': $', SUM(t.amount)) as subsection_list
                FROM Transactions t
                    INNER JOIN main.Subsections SS on SS.subsection_id = t.subsection_id 
                WHERE
                    ${timeFilter} AND ss.section_id = ?
                GROUP BY
                    ss.subsection_id
                ORDER BY
                    SUM(t.amount) DESC
            `, [subsectionNum]);
        }
    }
    catch (error) {
        console.error('Failed to display visualization:', error);

        return [];
    }
};

const displayLimitGoals = async () => {
    console.log("Displaying limit goals...");

    try {
        return await db.getAllAsync(`
            SELECT lp.amount, s.section_name, ss.subsection_name, lp.time_amount, lp.time_period_plural, lp.end_date,
                concat('Spend less than $', lp.amount, ' on ', s.section_name, ' - ', ss.subsection_name, ' for ', 
                lp.time_amount, ' ', lp.time_period_plural, '. Ends on ', lp.end_date) as limit_goals_list
            FROM LimitPlan lp
                INNER JOIN main.Sections S on S.section_id = lp.section_id 
                INNER JOIN main.Subsections SS on SS.subsection_id = lp.subsection_id
        `);
    }
    catch (error) {
        console.error('Failed to display limit goals:', error);

        return [];
    }
};

const displayCutDownGoals = async () => {
    console.log("Displaying cut down goals...");

    try {
        return await db.getAllAsync(`
            SELECT cdp.amount, s.section_name, ss.subsection_name, cdp.time_period, cdp.time_amount, cdp.time_period_plural,
            cdp.base_amount, cdp.end_date,
                concat('Spend $', cdp.amount, ' less on ', s.section_name, ' - ', ss.subsection_name, ' each ',
                cdp.time_period, ' for ', cdp.time_amount, ' ', cdp.time_period_plural, ' with base $',
                cdp.base_amount, '. Ends on ', cdp.end_date) as cut_down_goals_list
            FROM CutDownPlan cdp
                INNER JOIN main.Sections S on S.section_id = cdp.section_id 
                INNER JOIN main.Subsections SS on SS.subsection_id = cdp.subsection_id
        `);
    }
    catch (error) {
        console.error('Failed to display cut down goals:', error);

        return [];
    }
};

const displayRemovedGoals = async () => {
    console.log('Displaying removed goals...');

    try {
        return await db.getAllAsync(`
            SELECT rg.removed_goal,
                concat(rg.removed_goal) as removed_goals_list
            FROM RemovedGoals rg
        `);
    }
    catch (error) {
        console.error('Failed to display removed goals:', error);

        return [];
    }
};

export { initializeDatabase, clearDatabase, addTransaction, addLimitPlan, addCutDownPlan, displaySpending, 
    getTimePeriod, databaseReady, displayLimitGoals, displayCutDownGoals, checkTransaction, checkGoals,
    changeCounter, getDaysUntilEnd, checkCutDownAmounts, addRemovedGoal, displayRemovedGoals, displayVisualization };