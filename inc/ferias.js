var conn = require('./db');
var Pagination = require("./../inc/pagination");

module.exports = {

    lancaFerias(fields) {

        return new Promise((resolve, reject) => {

            let query, params = [
                fields.idfuncionario,
                fields.datasaida,
                fields.dataretorno
            ];

            query = `
                INSERT INTO ferias
                (idfuncionario,
                datasaida,
                dataretorno)

                VALUES
                (?,?,?) ` ;
            conn.query(query, params, (err, results) => {
                if (err) {
                    reject(err);

                } else {
                    resolve(results);

                }
            });

        });

    },

    getFerias(page, pesquisa) {

        return new Promise((resolve, reject) => {

            if (!page) page = 1;

            let params = [];

            if (pesquisa) params.push(pesquisa);

            let pag = new Pagination(
                `
            SELECT SQL_CALC_FOUND_ROWS
            FUNC.ID as id,
            FUNC.NOMECOMPLETO as nome,
            FUNC.CARGO as cargo,
            F.DATASAIDA as saida,
            F.dataretorno as volta,
            DATEDIFF(F.dataretorno, F.datasaida) dias
            FROM ferias F,FUNCIONARIOS FUNC
            WHERE F.IDFUNCIONARIO = FUNC.ID
            ${(pesquisa) ? `AND func.nomecompleto LIKE replace("%?%","'",'')  ` : ''} 
            ORDER BY func.id LIMIT ?,?
            `,
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

    getFuncLancaFerias(page, pesquisa) {

        if (!page) page = 1;

        return new Promise((resolve, reject) => {

            if (!page) page = 1;

            let params = [];

            if (pesquisa) params.push(pesquisa);

            let pag = new Pagination(

                `SELECT SQL_CALC_FOUND_ROWS  id as idfuncionario,
                 nomecompleto ,
                 case when   TIMESTAMPDIFF(MONTH, dataentrada + INTERVAL TIMESTAMPDIFF(YEAR,  dataentrada, current_date)
                 YEAR , current_date) >= 11 then 'Sim'
                 ELSE 'Não' END AS avencer 
                 FROM funcionarios
            where  length(ifnull(datasaida,0)) < 2  
            and   TIMESTAMPDIFF(MONTH, dataentrada + INTERVAL TIMESTAMPDIFF(YEAR,  dataentrada, current_date) YEAR , current_date) > 0
                ${(pesquisa) ? `and nomecompleto LIKE replace("%?%","'",'')  ` : ''} 

                order by avencer desc
        
                 limit ?,?`,
                params

            );

            pag.getPage(page).then(data => {

                resolve({
                    data,
                    links: pag.getNavigation()
                })
            });

        });

    }

}
