import path from 'path';
import csv from 'csvtojson';
import fs from 'fs';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface UploadtRequest {
  filename: string;
}
interface CsvTransaction {
  title: string;
  type: string;
  value: number;
  category: string;
}

class ImportTransactionsService {
  private createTransactionService: CreateTransactionService;

  constructor() {
    this.createTransactionService = new CreateTransactionService();
  }

  async execute({ filename }: UploadtRequest): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory, filename);
    const csvTransactions = await csv().fromFile(csvFilePath);
    csvTransactions.map(async (transaction: CsvTransaction) => {
      await this.createTransactionService.execute({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: transaction.category,
      });
    });

    const csvFileExists = await fs.promises.stat(csvFilePath);

    if (csvFileExists) {
      await fs.promises.unlink(csvFilePath);
    }

    return csvTransactions;
  }
}

export default ImportTransactionsService;
