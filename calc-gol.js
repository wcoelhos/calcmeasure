class CalcGol {

	constructor(target, type) {
		this.medidas = null

		var html = ''
			html += '<div class="calcarea">'
			html += '	<div class="calcarea-header danger">'
			html += '		Informe abaixo as medidas (em metros) da rede'
			html += '	</div>'
			html += '	<form action="javascript:void(0)" class="calcarea-form">'
			html += '		<div>'
			html += '			<label>Travessão</label>'
			html += '			<input type="text" name="travessao" placeholder="0,00" maxlength="4">'
			html += '			<small></small>'
			html += '		</div>'
			html += '		<div>'
			html += '			<label>Altura</label>'
			html += '			<input type="text" name="altura" placeholder="0,00" maxlength="4">'
			html += '			<small></small>'
			html += '		</div>'
			html += '		<div class="breakline"></div>'
			html += '		<div>'
			html += '			<label>Recuo Superior</label>'
			html += '			<input type="text" name="recuo-superior" placeholder="0,00" maxlength="4">'
			html += '			<small></small>'
			html += '		</div>'
			html += '		<div>'
			html += '			<label>Recuo Inferior</label>'
			html += '			<input type="text" name="recuo-inferior" placeholder="0,00" maxlength="4">'
			html += '			<small></small>'
			html += '		</div>'
			html += '	</form>'
			html += '	<div class="image"><img src="https://cdn.jsdelivr.net/gh/wcoelhos/calcmeasure@0.0.6/img/gol-medidas.jpg"></div>'
			html += '</div>'

		this.calcarea = $(html)
		this.calcareaForm = $(this.calcarea).find('.calcarea-form')
		this.inputTravessao = $(this.calcareaForm).find('input[name="travessao"]')
		this.inputAltura = $(this.calcareaForm).find('input[name="altura"]')
		this.inputRecuoSuperior = $(this.calcareaForm).find('input[name="recuo-superior"]')
		this.inputRecuoInferior = $(this.calcareaForm).find('input[name="recuo-inferior"]')
		this.divHeader = $(this.calcarea).find('.calcarea-header') 
		this.changeFunc = null

		if (type === 'futsal') {
			this.limits = {
				travessao: {min: 1.50, max: 3.30},
				altura: {min: 1.50, max: 2.50},
				recuoSuperior: {min: 0.00, max: 1.50},
				recuoInferior: {min: 0.40, max: 1.50}
			}
		}
		if (type === 'society') {
			this.limits = {
				travessao: {min: 3.31, max: 6.50},
				altura: {min: 1.50,  max: 2.50},
				recuoSuperior: {min: 0.00, max: 2.50},
				recuoInferior: {min: 0.40, max: 2.50}
			}
		}
		if (type === 'campo') {
			this.limits = {
				travessao: {min: 6.51, max: 7.60},
				altura: {min: 1.50,  max: 2.60},
				recuoSuperior: {min: 0.00, max: 2.50},
				recuoInferior: {min: 0.40, max: 2.50}
			}
		}

		this.setActions()
		$(target).append(this.calcarea)
		this.start()
	}

	setActions () {
		$(this.inputTravessao)
		//.maskMoney({thousands:'.', decimal:',', allowZero: true})
		.next()
		.text(this.formatNumber(this.limits.travessao.min) + ' até ' + this.formatNumber(this.limits.travessao.max) + 'm');
		
		$(this.inputAltura)
		//.maskMoney({thousands:'.', decimal:',', allowZero: true})
		.next()
		.text(this.formatNumber(this.limits.altura.min) + ' até ' + this.formatNumber(this.limits.altura.max) + 'm');
	
		$(this.inputRecuoSuperior)
		//.maskMoney({thousands:'.', decimal:',', allowZero: true})
		.next()
		.text(this.formatNumber(this.limits.recuoSuperior.min) + ' até ' + this.formatNumber(this.limits.recuoSuperior.max) + 'm');

		$(this.inputRecuoInferior)
		//.maskMoney({thousands:'.', decimal:',', allowZero: true})
		.next()
		.text(this.formatNumber(this.limits.recuoInferior.min) + ' até ' + this.formatNumber(this.limits.recuoInferior.max) + 'm');
	}

	parseNumber (num) {
		num = num.replace(/[^0-9.,]/g, "")
		
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
			travessao: this.parseNumber(this.inputTravessao.val()),
			altura: this.parseNumber(this.inputAltura.val()),
			recuoSuperior: this.parseNumber(this.inputRecuoSuperior.val()),
			recuoInferior: this.parseNumber(this.inputRecuoInferior.val())
		}
	}

	isFilled () {
		return this.isValid(this.getValues().travessao, 'travessao')
		&& this.isValid(this.getValues().altura, 'altura')
		&& this.isValid(this.getValues().recuoSuperior, 'recuoSuperior')
		&& this.isValid(this.getValues().recuoInferior, 'recuoInferior')
	}

	submit (form) {
		if (this.isFilled()) {
			$(this.divHeader).removeClass('danger').text('Medidas informadas corretamente!')
		} else {
			$(this.divHeader).addClass('danger').text('Informe abaixo as medidas (em metros) da rede')
		}

		if (this.changeFunc) {
			this.changeFunc(this.getValues(), this.isFilled())
		}
	}

	getTextAreas () {
		if (this.isFilled()) {
			return [
				this.formatNumber(this.getValues().travessao)+"m (travessao)",
				this.formatNumber(this.getValues().altura)+"m (altura)",
				this.formatNumber(this.getValues().recuoSuperior)+"m (recuo superior)",
				this.formatNumber(this.getValues().recuoInferior)+"m (recuo inferior)"
			].join(' x ')
		} else {
			return "Medidas não informada"
		}
	}

	isValid (value, medida) {
		return value >= this.limits[medida].min && value <= this.limits[medida].max
	}

	change (func) {
		this.changeFunc = func
	}

	start (target) {
		var _self = this
		$(_self.inputTravessao)
		.keyup(function (el) {
			$(el.target).removeClass('input-error')
			_self.submit()
		})
		.blur(function (el) {
			var value = _self.parseNumber(el.target.value)
			if (value && !_self.isValid(value, 'travessao')) {
				$(el.target).addClass('input-error')
			}
		})

		$(_self.inputAltura)
		.keyup(function (el) {
			$(el.target).removeClass('input-error')
			_self.submit()
		})
		.blur(function (el) {
			var value = _self.parseNumber(el.target.value)
			if (value && !_self.isValid(value, 'altura')) {
				$(el.target).addClass('input-error')
			}
		})

		$(_self.inputRecuoSuperior)
		.keyup(function (el) {
			$(el.target).removeClass('input-error')
			_self.submit()
		})
		.blur(function (el) {
			var value = _self.parseNumber(el.target.value)
			if (value && !_self.isValid(value, 'recuoSuperior')) {
				$(el.target).addClass('input-error')
			}
		})

		$(_self.inputRecuoInferior)
		.keyup(function (el) {
			$(el.target).removeClass('input-error')
			_self.submit()
		})
		.blur(function (el) {
			var value = _self.parseNumber(el.target.value)
			if (value && !_self.isValid(value, 'recuoInferior')) {
				$(el.target).addClass('input-error')
			}
		})
	}
}