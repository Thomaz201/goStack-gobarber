import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });

  it('should be able to recover the password if email is provided', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@teste.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'jhondoe@teste.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user\'s password', async () => {
    await expect(sendForgotPasswordEmailService.execute({
      email: 'jhondoe@teste.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@teste.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'jhondoe@teste.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
