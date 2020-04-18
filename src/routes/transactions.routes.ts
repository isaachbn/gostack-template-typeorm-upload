import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request: Request, response: Response) => {
  const transactions = await getCustomRepository(
    TransactionsRepository,
  ).getBalance();

  return response.status(200).json(transactions);
});

transactionsRouter.post('/', async (request: Request, response: Response) => {
  const createTransactionService = new CreateTransactionService();
  const transaction = await createTransactionService.execute(request.body);

  return response.status(201).json({
    id: transaction.id,
    title: transaction.title,
    value: transaction.value,
    type: transaction.type,
    category: transaction.category.title,
  });
});

transactionsRouter.delete('/:id', async (request: Request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute({ id });
  return response.status(204).json();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();
    const transactions = await importTransactionsService.execute({
      filename: request.file.filename,
    });
    return response.json(transactions);
  },
);

export default transactionsRouter;
