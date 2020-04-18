import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface TransactionRquest {
  id: string;
}

class DeleteTransactionService {
  private transactionRepository: TransactionsRepository;

  constructor() {
    this.transactionRepository = getCustomRepository(TransactionsRepository);
  }

  public async execute({ id }: TransactionRquest): Promise<void> {
    const transaction = await this.transactionRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction does not exist.');
    }

    await this.transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
