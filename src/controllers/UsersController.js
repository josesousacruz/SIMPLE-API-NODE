const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')
class UsersController {
    /**
     * index - GET para listar varios registros.
     * show - GET para exibis um registro especifico
     * create - POST para criar um registro
     * Updade - PUT para atualizar 
     * Delete - DELETE para remover
     */

    async getAll(request, response) {
        try {
            const database = await sqliteConnection();
            const users = await database.all("SELECT * FROM users");

            return response.status(200).json(users);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            return response.status(500).json({ error: "Erro ao buscar usuários" });
        }
    }

    async create(request, response) {
        const { email, password, name } = request.body

        try {

            const database = await sqliteConnection();

            const checkUser = await database.get("SELECT * FROM users WHERE email = (?)", [email])

            if (checkUser) {
                throw new AppError('Email já está em uso')
            }

            const hashPassword = await hash(password, 8)

            await database.run('INSERT INTO users (email,password, name) VALUES (?,?,?)', [email, hashPassword, name]);


            return response.status(201).json('Criado')

        } catch (error) {
            console.error("Erro ao executar a consulta:", error);
            return response.json({ error: error || "Erro desconhecido" });
        }

    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const { id } = request.params;

        const database = await sqliteConnection();

        const user = await database.get("SELECT * FROM users WHERE (id) = ?", [id])

        if (!user) {
            throw new AppError('Usuario não encontrado')
        }

        const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = ?", email)

        if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
            throw new AppError('Email já utilizado')

        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if (password && !old_password) {
            throw new AppError("Voce precisa informar a senha antiga")
        }


        if (password && old_password) {
            const isPasswordCorrect = await compare(old_password, user.password);

            if (!isPasswordCorrect) {
                throw new AppError('Senha antiga não confere')
            }

            user.password = await hash(password, 8)
        }


        await database.run("UPDATE users SET name=?,email=?,password=? WHERE id = ?",[name,email,user.password,id])

        return response.json('Atualizado')
    }
}

module.exports = UsersController;