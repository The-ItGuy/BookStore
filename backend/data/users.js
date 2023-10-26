const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Ajitesh',
        email: 'ajitesh2k1@gmail.com',
        password: bcrypt.hashSync('123456', 10)
    },
    {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Barathraj',
        email: 'barathraj0806@gmail.com',
        password: bcrypt.hashSync('123456', 10)
    }
];

module.exports = users;