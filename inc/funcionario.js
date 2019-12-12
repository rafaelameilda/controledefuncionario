var conn = require('./db');
var path = require('path');
var Pagination = require("./../inc/pagination");
let fs = require('fs');


module.exports = {

    save(fields, files) {

        return new Promise((resolve, reject) => {


            if (files.photo.name) {
                fields.photo = `arquivos/${path.parse(files.photo.path).base}`;
            } else {
                fields.photo = `arquivos/imgpadrao.jpg`;
            }

            let query, queryPhoto = ``, params = [
                fields.nomecompleto,
                fields.cpf,
                fields.datanascimento,
                fields.endereco,
                fields.numero,
                fields.bairro,
                fields.localnascimento,
                fields.telefone,
                fields.celular,
                fields.rg,
                fields.dataexped,
                fields.numerofilho,
                fields.informacoes,
                fields.contatoemergencia,
                fields.ctps,
                fields.dataentrada,
                fields.datasaida,
                fields.cargo,
                fields.orgexped,

            ];

            if (files.photo.name) {

                queryPhoto = `,photo = ?`;

                params.push(fields.photo);

            }



            if (parseInt(fields.id) > 0) {

                params.push(fields.id);

                query = `
            UPDATE funcionarios
            SET nomecompleto = ?,
            cpf = ?,
            datanascimento = ?,
            endereco = ?,
            numero = ?,
            bairro = ?,
            localnascimento = ?,
            telefone = ?,
            celular = ?,
            rg = ?,
            dataexped = ?,
            numerofilho = ?,
            informacoes = ?,
            contatoemergencia = ?,
            ctps = ?,
            dataentrada = ?,
            datasaida = ?,
            cargo = ?,
            orgexped = ?
            ${queryPhoto} 
            WHERE id = ?
          `;

            } else {

                params.push(fields.photo);

                query = `
                INSERT INTO funcionarios
                (nomecompleto,
                cpf,
                datanascimento,
                endereco,
                numero,
                bairro,
                localnascimento,
                telefone,
                celular,
                rg,
                dataexped,
                numerofilho,
                informacoes,
                contatoemergencia,
                ctps,
                dataentrada,
                datasaida,
                cargo,
                orgexped,
                photo)

                VALUES
                (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)` ;
            }

            conn.query(query, params, (err, results) => {
                if (err) {
                    reject(err);

                } else {
                    resolve(results);

                }
            });

        });

    },

    getFuncionarios(page, pesquisa) {

        if (!page) page = 1;

        return new Promise((resolve, reject) => {

            if (!page) page = 1;

            let params = [];

            if (pesquisa) params.push(pesquisa);

            let pag = new Pagination(

                `SELECT 
                SQL_CALC_FOUND_ROWS * 
                FROM funcionarios 
                where length(ifnull(datasaida,0)) < 2
                ${(pesquisa) ? `and nomecompleto LIKE replace("%?%","'",'')  ` : ''} 
                ORDER BY id 
                 LIMIT ?,? `,
                params

            );

            pag.getPage(page).then(data => {

                resolve({
                    data,
                    links: pag.getNavigation()
                })
            });

        })
    },


    getFuncionariosInat(page, pesquisa) {

        if (!page) page = 1;

        return new Promise((resolve, reject) => {

            if (!page) page = 1;

            let params = [];

            if (pesquisa) params.push(pesquisa);

            let pag = new Pagination(

                `SELECT 
                SQL_CALC_FOUND_ROWS * 
                FROM funcionarios 
                where  length(ifnull(datasaida,0)) > 2
                ${(pesquisa) ? `and nomecompleto LIKE replace("%?%","'",'')  ` : ''} 
                ORDER BY id 
                 LIMIT ?,? `,
                params

            );

            pag.getPage(page).then(data => {

                resolve({
                    data,
                    links: pag.getNavigation()
                })
            });

        })
    },


    delete(id) {

        return new Promise((resolve, reject) => {

            foto = conn.query(`select photo from funcionarios WHERE id = ?`
                , [
                    id
                ], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);

                        if (results[0].photo != `arquivos/imgpadrao.jpg`  && results[0].photo != null ) {

                            caminho = `./public/${results[0].photo}`

                            if (caminho != null) {
                                fs.unlinkSync(caminho);
                            }

                        }

                    }
                });


            conn.query(`
        DELETE FROM funcionarios WHERE id = ?`
                , [
                    id
                ], (err, results) => {
                    if (err) {
                        reject(err);

                    } else {
                        resolve(results);

                    }
                });


        })
    }

}
