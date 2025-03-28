
const pg = require('pg')
const {Client}=pg
const client =new Client({
host:'localhost',
user:'postgres',

password:'1234',
database:'wedding',
port:5432


})
client.connect()

