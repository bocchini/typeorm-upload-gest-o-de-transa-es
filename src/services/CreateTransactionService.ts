import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_id: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_id,
  }: Request): Promise<Transaction> {
    const transactionRespository = getCustomRepository(TransactionRepository);

    const transaction = transactionRespository.create({
      title,
      value,
      type,
      category_id,
    });

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Transaction type is invalid');
    }

    if (type === 'outcome') {
      const { total } = await transactionRespository.getBalance();

      if (total < value) {
        throw new AppError('You do not have enough balance');
      }
    }

    await transactionRespository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
