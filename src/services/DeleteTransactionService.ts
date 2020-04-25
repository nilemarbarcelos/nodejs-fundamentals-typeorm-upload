import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactionExists = await transactionsRepository.findOne({
      where: { id },
    });
    if (!transactionExists) {
      throw new AppError('Transaction does not exist', 400);
    }
    await transactionsRepository.remove(transactionExists);
  }
}

export default DeleteTransactionService;
