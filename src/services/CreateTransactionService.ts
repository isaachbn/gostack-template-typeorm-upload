import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryByNameService from './CreateCategoryByNameService';

interface TransactionRequest {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  private transactionRepository: TransactionsRepository;

  private createCategoryByNameService: CreateCategoryByNameService;

  constructor() {
    this.createCategoryByNameService = new CreateCategoryByNameService();
    this.transactionRepository = getCustomRepository(TransactionsRepository);
  }

  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionRequest): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError(
        'Incorrect type for transaction, must be "income" or "outcome".',
      );
    }

    const { balance } = await this.transactionRepository.getBalance();

    if (type === 'outcome' && balance.income - value < 0) {
      throw new AppError('Your wallet does not have enough balance.');
    }

    const categoryModel = await this.createCategoryByNameService.execute({
      category,
    });
    const category_id = categoryModel.id;
    const transaction = this.transactionRepository.create({
      title,
      value,
      category_id,
      type,
    });
    await this.transactionRepository.save(transaction);
    transaction.category = categoryModel;

    return transaction;
  }
}

export default CreateTransactionService;
