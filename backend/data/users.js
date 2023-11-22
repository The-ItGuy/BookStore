const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Ashish',
        email: 'gashish615@gmail.com',
        password: bcrypt.hashSync('123456', 10)
    },
    {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Ben',
        email: 'ben0806@gmail.com',
        password: bcrypt.hashSync('123456', 10)
    }
];

module.exports = users;
