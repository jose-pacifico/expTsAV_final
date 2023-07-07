import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Departamentos } from '../models/Departamentos';
import { Funcionarios } from '../models/Funcionarios';

const index = (req: Request, res: Response) => {
  res.render('main/index');
};

const about = (req: Request, res: Response) => {
  res.render('main/about');
};

const ui = (req: Request, res: Response) => {
  res.render('main/ui');
};

const createCookie = (req: Request, res: Response) => {
  if (!req.cookies['nomeCookie']) {
    res.cookie('nomeCookie', 'valorCookie');
    res.send('voce nunca passou por aqui');
  } else {
    res.send('voce ja passou por aqui');
  }
};

const clearCookie = (req: Request, res: Response) => {
  res.clearCookie('nomeCookie');
  res.send('cookie apagado');
};

const signup = async (req: Request, res: Response) => {
  const departamentos = await Departamentos.findAll();
  if (req.route.methods.get) {
    res.render('main/signup', {
      csrf: req.csrfToken(),
      departamentos: departamentos.map((d) => d.toJSON()),
    });
  } else {
    console.log('entrei');
    const funcionario = req.body;
    try {
      const rounds = parseInt(process.env.BCRYPT_ROUNDS!, 10);
      bcrypt.genSalt(rounds, (err, salt) => {
        bcrypt.hash(funcionario.senha, salt, async (err, hash) => {
          await Funcionarios.create({
            ...funcionario,
            senha: hash,
          });
        });
      });
      res.redirect('/');
    } catch (e: any) {
      console.log(e);
      res.render('main/signup', {
        csrf: req.csrfToken(),
        errors: e.errors,
        departamentos: departamentos.map((d) => d.toJSON()),
        funcionario: funcionario,
      });
    }
  }
};

const login = async (req: Request, res: Response) => {
  if (req.route.methods.get) {
    res.render('main/login', { csrf: req.csrfToken() });
  } else {
    const { email, senha } = req.body;
    const funcionario = await Funcionarios.findOne({ where: { email: email } });
    if (funcionario) {
      bcrypt.compare(senha, funcionario.senha, (err, ok) => {
        if (ok) {
          res.cookie('logado', true);
          res.redirect('/');
        } else {
          res.render('main/login', {
            email,
            senhaIncorreta: true,
            csrf: req.csrfToken(),
          });
        }
      });
    } else {
      res.render('main/login', {
        email,
        senha,
        senhaIncorreta: true,
        csrf: req.csrfToken(),
      });
    }
  }
};

const logout = (req: Request, res: Response) => {
  res.clearCookie('logado');
  res.redirect('/');
};

export default {
  index,
  about,
  ui,
  createCookie,
  clearCookie,
  login,
  logout,
  signup,
};
