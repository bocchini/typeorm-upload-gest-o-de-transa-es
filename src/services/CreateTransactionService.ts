import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
class CreateTransactionService {
  public async execute({ title, value, type }: Request): Promise<Transaction> {
    const transactionRespository = getCustomRepository(TransactionRepository);

    const transaction = transactionRespository.create({
      title,
      value,
      type,
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
