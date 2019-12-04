class HcodeGrid {

  constructor(configs) {

    configs.listeners = Object.assign({
      afterUpdateClick: (e) => {
        $('#modal-update').modal('show');
      }
    }, configs.listeners);

    this.options = Object.assign({}, {
      formmodal: '#modal-update',
      formUpdate: '#modal-update form',
      btnDelete: '#btn-delete',
      btnUpdate: '#jj',
      btn: 'salva',
      msg: 'Funcionário Alterado Com Sucesso!',
      tipo: 'success',

    }, configs);

    this.initForms();
    this.initButtons();

  }

  initForms() {

    this.formUpdate = document.querySelector(this.options.formUpdate);


    this.formUpdate.save().then(json => {
      $(this.options.formmodal).modal('hide');
      setTimeout(function () {
        window.location.reload();
      }, 2500);
      this.alert('top', 'right', this.options.msg, this.options.tipo);
    }).catch(err => {
      console.log(err);
    });

  

  }

  fireEvent(name, args) {

    if (typeof this.options.listeners[name] === 'function') this.options.listeners[name].apply(this, args);

  }


  getTrData(e) {

    let tr = e.path.find(el => {
      return (el.tagName.toUpperCase() === 'TR');
    });

    return JSON.parse(tr.dataset.row);

  } 

  initButtons() {

    [...document.querySelectorAll(this.options.btnDelete)].forEach(btn => {
      btn.addEventListener('click', e => {

        let data = this.getTrData(e);

        if (confirm(eval('`' + this.options.urlMsg + '`'))) {

          fetch(eval('`' + this.options.urlDelete + '`'), {
            method: 'DELETE'
          })
            .then(response => response.json())
            .then(json => {
              this.alert('top', 'right', 'Funcionário Excluido Com Sucesso!', 'danger');
              setTimeout(function () {
                window.location.reload();
              }, 2000);

            })
        }
      })
    });


    [...document.querySelectorAll(this.options.btnUpdate)].forEach(tr => {
      tr.addEventListener('click', e => {

        let data = this.getTrData(e);

        for (let name in data) {
          switch (name) {
            case 'photo':
              this.formUpdate.querySelector("img").src = `/`+data[name];
        
              break;
            default:
              let input = this.formUpdate.querySelector(`[name=${name}]`);
              if (input) input.value = data[name];
          
          }
        }

        this.fireEvent('afterUpdateClick', [e]);
       
      })
    });

  }

  alert(from, align, msg, tipo) {

    $.notify({
      icon: "add_alert",
      message: msg

    }, {
        type: tipo,
        timer: 5000,
        placement: {
          from: from,
          align: align
        }
      });

  }

}


