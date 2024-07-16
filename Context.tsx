import React, { createContext, useState, useContext, ReactNode } from 'react';

const SpendingGoalsContext = createContext<any>(undefined);

export const useSpendingGoals = () => useContext(SpendingGoalsContext);

export const SpendingGoalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [spendingList, setSpendingList] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0.00);
  const [limitGoalsList, setLimitGoalsList] = useState<string[]>([]);
  const [cutDownGoalsList, setCutDownGoalsList] = useState<string[]>([]);
  const [transactionSubmission, setTransactionSubmission] = useState<string>('');
  const [goalsList, setGoalsList] = useState<string[]>([]);
  const [limitsToRemove, setLimitsToRemove] = useState<number[]>([]);
  const [cutDownsToRemove, setCutDownsToRemove] = useState<number[]>([]);
  const [goalsToRemove, setGoalsToRemove] = useState<string[]>([]);
  const [moreGoalsToRemove, setMoreGoalsToRemove] = useState<string[]>([]);
  const [visualizationList, setVisualizationList] = useState<string[]>([]);
  const [sectionSelected, setSectionSelected] = useState<boolean>(false);

  const updateSpending = (results: any) => {
    setSpendingList(results.map((item: { spending_list: string[] }) => item.spending_list));
    const accumulatedAmount: any = (results.reduce((accumulator: any, currentValue: any) => (accumulator + currentValue.total), 0));
    const roundedAmount: number = Math.round(accumulatedAmount * 100) / 100;
    setTotalAmount(roundedAmount);
  };

  const updateLimitGoals = (results: any) => {
    setLimitGoalsList(results.map((item: { limit_goals_list: string[] }) => item.limit_goals_list));
  }

  const updateCutDownGoals = (results: any) => {
    setCutDownGoalsList(results.map((item: { cut_down_goals_list: string[]}) => item.cut_down_goals_list));
  }

  const updateGoalsToRemove = (results: any) => {
    setGoalsToRemove(results.map((item: { removed_goals_list: string[]}) => item.removed_goals_list));
  }

  const updateVisualizationList = (results: any) => {
    if (sectionSelected) {
      setVisualizationList(results.map((item: { section_list: string[] }) => item.section_list));
    }
    else {
      setVisualizationList(results.map((item: { subsection_list: string[] }) => item.subsection_list));
    }
  }

  return (
    <SpendingGoalsContext.Provider value = {{ spendingList, totalAmount, limitGoalsList, cutDownGoalsList, updateSpending, updateLimitGoals, 
    updateCutDownGoals, transactionSubmission, setTransactionSubmission, goalsList, setGoalsList, limitsToRemove, 
    setLimitsToRemove, cutDownsToRemove, setCutDownsToRemove, setLimitGoalsList, setCutDownGoalsList, updateGoalsToRemove,
    goalsToRemove, setGoalsToRemove, visualizationList, setVisualizationList, sectionSelected, setSectionSelected,
    updateVisualizationList, moreGoalsToRemove, setMoreGoalsToRemove }}>
      {children}
    </SpendingGoalsContext.Provider>
  );
};