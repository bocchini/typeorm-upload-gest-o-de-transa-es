import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from '../services/CreateCategoryService';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.find({
    select: ['id', 'title', 'value', 'created_at', 'updated_at'],
    relations: ['category'],
  });
  const balance = await transactionRepository.getBalance();
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const createCategoryService = new CreateCategoryService();

  const categoryRegistred = await createCategoryService.execute({
    title: category,
  });

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category_id: categoryRegistred.id,
  });

  const transactions = [transaction, categoryRegistred.title];
  return response.json(transactions);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute(request.params.id);
  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('fileTransaction'),
  async (request, response) => {
    const importTramsactionService = new ImportTransactionsService();
    const transactions = await importTramsactionService.execute(
      request.file.path,
    );
    return response.json(transactions);
  },
);

export default transactionsRouter;
