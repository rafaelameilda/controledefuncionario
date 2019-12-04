var express = require('express');
var admin = require("../inc/admin");
var funcionario = require("../inc/funcionario");
var ferias = require("../inc/ferias");
var moment = require("moment");
var router = express.Router();
var fs = require('fs');


moment.locale("pt-br");


router.use(function (req, res, next) {
  req.menus = admin.getMenus(req);
  next();
})

/* GET home page. */
router.get('/', function (req, res, next) {
  admin.dashboard().then(data => {
    res.render('index', admin.getParams(req, {
      subtitulobarra: 'Menu Principal',
      data
    }));
  }).catch(err => {
    console.log(err);
  })

});

router.get('/funcionarios', function (req, res, next) {

  funcionario.getFuncionariosInat(
    req.query.page,
    req.query.pesquisa).then(pagi => {
      inativo = pagi.data
    }), (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      };

    };


  funcionario.getFuncionarios(
    req.query.page,
    req.query.pesquisa
  ).then(pag => {
    res.render('listafuncionarios', admin.getParams(req, {
      subtitulobarra: 'Lista de Funcionários',
      data: pag.data,
      links: pag.links,
      inativo
    }));
  }).catch(err => {
    console.log(err);
  })

});

router.post('/funcionarios', function (req, res, next) {
  funcionario.save(req.fields, req.files).then(results => {
    res.send(results);
  }).catch(err => {
    res.send(err);
  });
});

router.delete("/funcionarios/:id", function (req, res, next) {
  funcionario.delete(req.params.id).then(results => {
    res.send(results);
  }).catch(err => {
    res.send(err);
  })
});

router.get('/funcformulario', function (req, res, next) {
  res.render('funcformulario', admin.getParams(req, {
    subtitulobarra: 'Cadastro de Funcionários',
  }));
});

router.post('/funcformulario', function (req, res, next) {

  funcionario.save(req.fields, req.files).then(results => {
    res.send(results);
  }).catch(err => {
    res.send(err);
  });
});

router.get('/ferias', function (req, res, next) {
  res.render('ferias', admin.getParams(req, {
    subtitulobarra: 'Administração de Férias'
  }));
});

router.get('/listaferias', function (req, res, next) {

  ferias.getFerias(
    req.query.page,
    req.query.pesquisa
  ).then(pag => {
    res.render('listaferias', admin.getParams(req, {
      subtitulobarra: 'Férias Lançadas',
      data: pag.data,
      moment,
      links: pag.links
    }));
  }).catch(err => {
    console.log(err);
  })
});

router.get('/lancarferias', function (req, res, next) {
  ferias.getFuncLancaFerias(
    req.query.page,
    req.query.pesquisa
  ).then(pag => {
    res.render('lancarferias', admin.getParams(req, {
      subtitulobarra: 'Lançar Férias',
      data: pag.data,
      links: pag.links
    }));
  }).catch(err => {
    console.log(err);
  })

});

router.post('/lancarferias', function (req, res, next) {
  ferias.lancaFerias(req.fields).then(results => {
    res.send(results);
  }).catch(err => {
    res.send(err);
  });
});


router.get('/arquivos', (req, res) => {

  let path = './' + req.query.path;

  if (fs.existsSync(path)) {

    fs.readFile(path, (err, data) => {
      if (err) {
        console.error(err);
        res.status(400).json({
          error: err
        });
      } else {

        res.status(200).send(data);

      }
    })

  } else {
    res.status(404).json({

      error: 'File not found'

    });
  }
});

module.exports = router;



