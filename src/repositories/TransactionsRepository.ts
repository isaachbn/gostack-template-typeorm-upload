import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface Response {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Response> {
    const balance = { income: 0, outcome: 0, total: 0 } as Balance;
    const transactions = await this.createQueryBuilder('transctions')
      .select([
        'transctions.id',
        'transctions.title',
        'transctions.value',
        'transctions.type',
      ])
      .addSelect(['category.id', 'category.title'])
      .leftJoin('transctions.category', 'category')
      .getMany();

    balance.outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((accumulator: number, transaction: Transaction) => {
        accumulator += this.convertFloat(transaction.value);
        return accumulator;
      }, 0);

    balance.income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((accumulator: number, transaction: Transaction) => {
        accumulator += this.convertFloat(transaction.value);
        return accumulator;
      }, 0);

    balance.total =
      this.convertFloat(balance.income) - this.convertFloat(balance.outcome);

    return { transactions, balance };
  }

  private convertFloat(value: string | number): number {
    return typeof value === 'string' ? parseFloat(value) : value;
  }
}

export default TransactionsRepository;
