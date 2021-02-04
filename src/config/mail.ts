interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'lucasthomaz@keebs.com.br',
      name: 'Thomaz do keebs',
    },
  },
} as IMailConfig;
