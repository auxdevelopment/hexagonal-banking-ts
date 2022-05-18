import knex, { Knex } from 'knex';                                                                                                                                                                                                            

export const config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database:'banking',
  }
}

const connection: Knex = knex(config as Knex.Config)

export default connection;