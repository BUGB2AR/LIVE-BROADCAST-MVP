
export default {
    jwt: {
      secret: process.env.JWT_SECRET || 'umsegredomuitoseguroepadrao',
      expiresIn: 60 * 60 * 24,
    },
  };