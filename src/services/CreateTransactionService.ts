import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    let existingCategory;

    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > total) {
      throw new AppError('Your balance is not enough for this expense', 400);
    }

    existingCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!existingCategory) {
      existingCategory = await categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(existingCategory);
    }

    const transaction = await transactionsRepository.create({
      title,
      value,
      type,
      category: existingCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
