export enum TransactionType {
  DEBIT_CARD = 'DEBIT_CARD',
  CREDIT_CARD = 'CREDIT_CARD',
}

export const TransactionTypeList = [
  TransactionType.CREDIT_CARD,
  TransactionType.DEBIT_CARD,
];

export enum RecibleStatusType {
  PAID = 'PAID',
  WAITING_FUNDS = 'WAITING_FUNDS',
}

export const RecibleStatusTypeList = [
  RecibleStatusType.PAID,
  RecibleStatusType.WAITING_FUNDS,
];
