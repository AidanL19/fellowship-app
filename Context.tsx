import React, { createContext, useState, useContext, ReactNode } from 'react';

const SpendingGoalsContext = createContext<any>(undefined);

export const useSpendingGoals = () => useContext(SpendingGoalsContext);

export const SpendingGoalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [spendingList, setSpendingList] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0.00);
  const [limitGoalsList, setLimitGoalsList] = useState<string[]>([]);
  const [cutDownGoalsList, setCutDownGoalsList] = useState<string[]>([]);
  const [transactionSubmission, setTransactionSubmission] = useState(null);
  const [goalsList, setGoalsList] = useState<string[]>([]);

  const updateSpending = (results: any) => {
    setSpendingList(results.map((item: { spending_list: string[] }) => item.spending_list));
    const accumulatedAmount: any = (results.reduce((accumulator: any, currentValue: any) => (accumulator + currentValue.total), 0));
    const roundedAmount: number = Math.round(accumulatedAmount * 100) / 100;
    setTotalAmount(roundedAmount);
  };

  const updateLimitGoals = (results: any) => {
    setLimitGoalsList(results.map((item: { limit_goals_list: string[]}) => item.limit_goals_list));
  }

  const updateCutDownGoals = (results: any) => {
    setCutDownGoalsList(results.map((item: { cut_down_goals_list: string[]}) => item.cut_down_goals_list));
  }

  return (
    <SpendingGoalsContext.Provider value = {{ spendingList, totalAmount, limitGoalsList, cutDownGoalsList, updateSpending, updateLimitGoals, 
    updateCutDownGoals, transactionSubmission, setTransactionSubmission, goalsList, setGoalsList }}>
      {children}
    </SpendingGoalsContext.Provider>
  );
};