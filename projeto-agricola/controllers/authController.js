const Usuario = require('../models/Usuario');

const axios = require('axios');

exports.login = async (req, res) => {
    const { email, senha } = req.body;
    console.log("--- Iniciando login ---");

    try {
        const user = await Usuario.findOne({ username: email });

        if (user) {
            const match = await user.comparePassword(senha);
            if (match) {
                console.log("✅ Login local OK");
                req.session.userId = user._id;
                return res.redirect('/servicos');
            }
        }

        // Login externo via Django
        const response = await axios.post(
            'http://web:8000/coordenador/api/autenticar/',
            { email, password: senha },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                validateStatus: s => s >= 200 && s < 500
            }
        );

        if (response.data && response.data.autenticado === true) {
            console.log("🔓 Login via Django aprovado");

            const novoUsuario = new Usuario({
                username: email,
                password: senha
            });

            await novoUsuario.save();
            req.session.userId = novoUsuario._id;
            return res.redirect('/servicos');
        } else {
            console.log("❌ Login negado pela API do Django");
            req.flash('error', 'E-mail ou senha inválidos.');
            return res.redirect('/login');
        }
    } catch (err) {
        console.error("🔥 Erro no login:", err);
        req.flash('error', 'Erro interno no servidor.');
        return res.redirect('/login');
    }
};


exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    res.redirect('/login');
  }
};