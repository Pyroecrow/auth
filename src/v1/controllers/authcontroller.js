const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//register and login user

const pool = require('../data/db');

const Secret_Key = "your_secret_key"; //NB! bruk .env for å lagre hemmelige nøkler i miljøvariabler


const register = async (req, res) => {

    const { Username, Password, Role } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (Username, Password, Role) VALUES (?, ?, ?)',
            [Username, hashedPassword, Role]
        );

        res.status(201).json({
            id: result.insertId,
            username,
            Password,
            
            role,
            });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }

}



const login = async (req, res) => {
    res.send("login user")
}


module.exports = {
    register,
    login
}