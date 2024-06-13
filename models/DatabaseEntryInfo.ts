type TransactionInfo = {
    listSection: string;
    listSubsection: string;
    listAmount: string;
};

type LimitInfo = {
    limitAmount: string;
    limitSection: string;
    limitSubsection: string;
    limitTimePeriod: string;
};

type CutDownInfo = {
    cutDownAmount: string;
    cutDownSection: string;
    cutDownSubsection: string;
    cutDownTimePeriod: string;
    cutDownTimeAmount: number;
    cutDownTimePeriodPlural: string;
    cutDownBaseAmount: string;
};

export { TransactionInfo, LimitInfo, CutDownInfo };