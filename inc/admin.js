var conn = require('./db');
module.exports = {


    dashboard() {
        return new Promise((resolve, reject) => {

            conn.query(`
            select 
            (select count(*) from ferias where dataretorno >= curdate()) as feriasaberta,
            (select count(*) from ferias where dataretorno <=  curdate()) as feriasfechadas,
            (select count(*) from funcionarios ) as totalfuncionarios,
            (SELECT count(*) from funcionarios where 1=1  and  length(ifnull(datasaida,0)) < 1 or datasaida = '0001-01-01'
             and  TIMESTAMPDIFF(MONTH, dataentrada + INTERVAL TIMESTAMPDIFF(YEAR,  dataentrada, current_date)
              YEAR , current_date) >= 11 ) as feriasavencer`
                , (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results[0]);
                    }
                });
        });

    },

    getMenuss(req) {

        let menus = [
            {
                text: "Dashboard",
                href: "/",
                icon: "home",
                active: false
            },
            {
                text: "Lista de Funcionários",
                href: "/funcionarios",
                icon: "content_paste",
                active: false
            },
            {
                text: "Cadastro de Funcionários",
                href: "/funcformulario",
                icon: "person",
                active: false
            },
            {
                text: "Férias",
                href: "/ferias",
                icon: "hotel",
                active: false
            },


        ];

        menus.map(menu => {

            if (menu.href.includes(`${req.url}`) && `${req.url}`.includes(menu.href)) menu.active = true
            else if (menu.href.includes(`ferias`) && `${req.url}`.includes('ferias')) menu.active = true
            else if (menu.href.includes(`funcionario`) && `${req.url}`.includes('funcionario')) menu.active = true

        });

        return menus;
    },

    getParams(req, params) {

        return Object.assign({}, {

            title: 'Controle de Funcionários',
            menus: req.menus,


        }, params);

    },




};
/*
@echo.
d:
cd Users\rafael.lara\Documents\teste\teste\bin
pm2 start www

*/