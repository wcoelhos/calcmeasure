class CalcGol {

	constructor(target) {
		this.medidas = null

		var html = ''
			html += '<div class="calcarea">'
			html += '	<div class="calcarea-header danger">'
			html += '		Informe abaixo as medidas da rede'
			html += '	</div>'
			html += '	<form action="javascript:void(0)" class="calcarea-form">'
			html += '		<div>'
			html += '			<label>Comprimento</label>'
			html += '			<input type="text" name="comprimento" placeholder="0,00">'
			html += '		</div>'
			html += '		<div>'
			html += '			<label>Recuo Superior</label>'
			html += '			<input type="text" name="recuo-superior" placeholder="0,00">'
			html += '		</div>'
			html += '		<div class="breakline"></div>'
			html += '		<div>'
			html += '			<label>Altura</label>'
			html += '			<input type="text" name="altura" placeholder="0,00">'
			html += '		</div>'
			html += '		<div>'
			html += '			<label>Recuo Inferior</label>'
			html += '			<input type="text" name="recuo-inferior" placeholder="0,00">'
			html += '		</div>'
			html += '	</form>'
			html += '	<div class="image"><img src="https://cdn.jsdelivr.net/gh/wcoelhos/calcmeasure@0.0.2/img/gol-medidas.jpg"></div>'
			html += '</div>'

		this.calcarea = $(html)
		this.calcareaForm = $(this.calcarea).find('.calcarea-form')
		this.inputComprimento = $(this.calcareaForm).find('input[name="comprimento"]')
		this.inputAltura = $(this.calcareaForm).find('input[name="altura"]')
		this.inputRecuoSuperior = $(this.calcareaForm).find('input[name="recuo-superior"]')
		this.inputRecuoInferior = $(this.calcareaForm).find('input[name="recuo-inferior"]')
		this.divHeader = $(this.calcarea).find('.calcarea-header')
		
		this.changeFunc = null

		$(this.inputComprimento).maskMoney({thousands:'.', decimal:','});
		$(this.inputAltura).maskMoney({thousands:'.', decimal:','});
		$(this.inputRecuoSuperior).maskMoney({thousands:'.', decimal:','});
		$(this.inputRecuoInferior).maskMoney({thousands:'.', decimal:','});

		$(target).append(this.calcarea)
		this.start()
	}

	parseNumber (num) {
		if (num) {
			var index = num.lastIndexOf(".") > num.lastIndexOf(",") ? num.lastIndexOf(".") : num.lastIndexOf(",")

			if (index >= 0) {
				var number = num.substring(0, index)
				var decimal = num.substring(index+1)
				num = number.replace('.', '').replace(',', '') + '.' + decimal.replace('.', '').replace(',', '')
			}
		}

		return $.isNumeric(num) ? parseFloat(num) : null
	}

	formatNumber (num) {
		num = parseFloat(parseFloat(num).toFixed(2))
		return num.toLocaleString(
		  'pt-BR',
		  { minimumFractionDigits: 2 }
		)
	}

	getValues () {
		return {
			comprimento: this.parseNumber(this.inputComprimento.val()),
			altura: this.parseNumber(this.inputAltura.val()),
			recuoSuperior: this.parseNumber(this.inputRecuoSuperior.val()),
			recuoInferior: this.parseNumber(this.inputRecuoInferior.val())
		}
	}

	isFilled () {
		return this.getValues().comprimento && this.getValues().altura && this.getValues().recuoSuperior && this.getValues().recuoInferior
	}

	submit (form) {
		if (this.isFilled()) {
			$(this.divHeader).removeClass('danger').text('Medidas informadas corretamente!')
		} else {
			$(this.divHeader).addClass('danger').text('Informe abaixo as medidas da rede')
		}
	}

	getTextAreas () {
		if (this.isFilled()) {
			return [
				this.formatNumber(this.getValues().comprimento)+"m (comprimento)",
				this.formatNumber(this.getValues().altura)+"m (altura)",
				this.formatNumber(this.getValues().recuoSuperior)+"m (recuo superior)",
				this.formatNumber(this.getValues().recuoInferior)+"m (recuo inferior)"
			].join(' x ')
		} else {
			return "Medidas não informada"
		}
	}

	change (func) {
		this.changeFunc = func
	}

	start (target) {
		var _self = this
		$(_self.inputComprimento).keyup(function (el) {
			$(el.target).removeClass('input-error')
			_self.submit()
		})
		$(_self.inputAltura).keyup(function (el) {
			$(el.target).removeClass('input-error')
			_self.submit()
		})
		$(_self.inputRecuoSuperior).keyup(function (el) {
			$(el.target).removeClass('input-error')
			_self.submit()
		})
		$(_self.inputRecuoInferior).keyup(function (el) {
			$(el.target).removeClass('input-error')
			_self.submit()
		})
	}
}