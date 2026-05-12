const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//register and login user

const pool = require('../data/db');

const Secret_Key = "your_secret_key"; //NB! bruk .env for å lagre hemmelige nøkler i miljøvariabler


const register = async (req, res) => {

    console.log("Test")

    const { Username, Password, Role } = req.body;

    console.log("Username:", Username);
    console.log("Password:", Password);
    console.log("Role:", Role);

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        console.log("Hashed Password:", hashedPassword);

        const [result] = await pool.query(
            'INSERT INTO users (Username, Password, Role) VALUES (?, ?, ?)',
            [Username, hashedPassword, Role]
        );

        console.log("Database Insert Result:", result);

        res.status(201).json({
            id: result.insertId,
            username: Username,
            Password: hashedPassword,
            role: Role
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }

}



const login = async (req, res) => {
    const { Username, Password } = req.body;


    try {
        const [results] = await pool.query('select * from users where Username = ?', [Username]);

        const user = results[0];

        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(Password, user.Password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }


        // Generate JWT token
        const token = jwt.sign({ username: user.Username, role: user.Role }, Secret_Key, { expiresIn: '1h' });
        res.json({ token });


    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {
    register,
    login
}