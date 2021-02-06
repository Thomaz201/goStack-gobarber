import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import { toDate } from 'date-fns';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments tests', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it("should be able to list the provider's appointments on a specific day", async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 4, 20, 14, 0, 0),
      user_id: '123456',
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 4, 20, 15, 0, 0),
      user_id: '123456',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11, 0, 0).getTime();
    });

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: 'provider',
      month: 5,
      year: 2020,
      day: 20,
    });

    const cachedAppointments = await listProviderAppointmentsService.execute({
      provider_id: 'provider',
      month: 5,
      year: 2020,
      day: 20,
    });

    const formatedCacheAppointments = cachedAppointments.map(appointment => {
      appointment.date = new Date(appointment.date);

      return appointment;
    });

    expect(appointments).toEqual([appointment1, appointment2]);
    expect(formatedCacheAppointments).toEqual([appointment1, appointment2]);
  });
});
