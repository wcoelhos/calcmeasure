class CalcGol	 {

	constructor(target, type) {
		this.areas = []

		var html = ''
			html += '<div class="calcarea">'
			html += '	<div class="calcarea-header">'
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
			html += '		<div class="breakline"></div>'
			html += '		<div>'
			html += '			<label>Qtd</label>'
			html += '			<input type="text" name="quantidade" value="1" placeholder="0">'
			html += '		</div>'
			html += '		<div>'
			html += '			<label>--</label>'
			html += '			<button type="submit">Adicionar</button>'
			html += '		</div>'
			html += '	</form>'
			html += '	<ul class="calcarea-list list">'
			html += '		<li style="display: none;">'
			html += '			<a href="javascript:void(0)" class="remove">x</a>'
			html += '			<span class="travessao">0</span>m Travessão x '
			html += '			<span class="altura">0</span>m Altura x '
			html += '			<span class="recuo-superior">0</span>m Recuo Superior x '
			html += '			<span class="recuo-inferior">0</span>m Recuo Inferior - '
			html += '			<span class="quantidade">0</span> par(es)'
			html += '		</li>'
			html += '	</ul>'
			html += '	<div class="image"><img src="https://cdn.jsdelivr.net/gh/wcoelhos/calcmeasure@0.0.6/img/gol-medidas.jpg"></div>'
			html += '</div>'

		this.calcarea = $(html)
		this.calcareaForm = $(this.calcarea).find('.calcarea-form')
		this.inputTravessao = $(this.calcareaForm).find('input[name="travessao"]')
		this.inputAltura = $(this.calcareaForm).find('input[name="altura"]')
		this.inputRecuoSuperior = $(this.calcareaForm).find('input[name="recuo-superior"]')
		this.inputRecuoInferior = $(this.calcareaForm).find('input[name="recuo-inferior"]')
		this.inputQuantidade = $(this.calcareaForm).find('input[name="quantidade"]')
		this.calcareaListElement = $(this.calcarea).find('.calcarea-list')
		this.baseCalcareaElement = $(this.calcareaListElement).find(' > li:hidden').first().clone().css('display', 'block')
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

		//$(this.inputTravessao).maskMoney({thousands:'.', decimal:','});
		//$(this.inputAltura).maskMoney({thousands:'.', decimal:','});
		//$(this.inputRecuoInferior).maskMoney({thousands:'.', decimal:','});
		//$(this.inputRecuoInferior).maskMoney({thousands:'.', decimal:','});

		this.setLabel()
		$(target).append(this.calcarea)
		this.start()
	}

	setLabel () {
		$(this.inputTravessao)
		.next()
		.text(this.formatNumber(this.limits.travessao.min) + ' até ' + this.formatNumber(this.limits.travessao.max) + 'm');
		
		$(this.inputAltura)
		.next()
		.text(this.formatNumber(this.limits.altura.min) + ' até ' + this.formatNumber(this.limits.altura.max) + 'm');
	
		$(this.inputRecuoSuperior)
		.next()
		.text(this.formatNumber(this.limits.recuoSuperior.min) + ' até ' + this.formatNumber(this.limits.recuoSuperior.max) + 'm');

		$(this.inputRecuoInferior)
		.next()
		.text(this.formatNumber(this.limits.recuoInferior.min) + ' até ' + this.formatNumber(this.limits.recuoInferior.max) + 'm');
	}

	addCalcareaItem (area, index) {
		var _self = this

		var item = $(this.baseCalcareaElement).clone()
			item.find('.travessao').text(this.formatNumber(area.travessao, 2))
			item.find('.altura').text(this.formatNumber(area.altura, 2))
			item.find('.recuo-superior').text(this.formatNumber(area.recuoSuperior, 2))
			item.find('.recuo-inferior').text(this.formatNumber(area.recuoInferior, 2))
			item.find('.quantidade').text(this.formatNumber(area.quantidade, 0))
			item.find('.area').text(this.formatNumber(area.area, 2) + 'm²')
			item.find('.remove').click(function () {
				_self.removeArea(index)
			})
		
		$(this.calcareaListElement).prepend(item)
	}

	renderAreas () {
		var _self = this
		
		$(this.calcareaListElement).find('> li').remove()

		this.areas.forEach(function (area, index) {
			_self.addCalcareaItem(area, index)
		})

		if (this.changeFunc) {
			this.changeFunc(this.areas, this.getAmount())
		}
	}

	addArea (area) {
		this.areas.push(area)
		this.renderAreas()
	}

	removeArea (index) {
		this.areas.splice(index, 1)
		this.renderAreas()
	}

	parseNumber (num) {
		num = num.replace(/[^0-9.,]/g, "")

		var index = num.lastIndexOf(".") > num.lastIndexOf(",") ? num.lastIndexOf(".") : num.lastIndexOf(",")
		
		if (index >= 0) {
			var number = num.substring(0, index)
			var decimal = num.substring(index+1)
			num = number.replace('.', '').replace(',', '') + '.' + decimal.replace('.', '').replace(',', '')
		}

		return $.isNumeric(num) ? parseFloat(num) : null
	}

	formatNumber (num, decimals=2) {
		num = parseFloat(parseFloat(num).toFixed(decimals))
		return num.toLocaleString(
		  'pt-BR',
		  { minimumFractionDigits: decimals }
		)
	}

	isValid (value, medida) {
		return value >= this.limits[medida].min && value <= this.limits[medida].max
	}

	submit (form) {
		var valTravessao = this.parseNumber(this.inputTravessao.val())
		var valAltura = this.parseNumber(this.inputAltura.val())
		var valRecuoSuperior = this.parseNumber(this.inputRecuoSuperior.val())
		var valRecuoInferior = this.parseNumber(this.inputRecuoInferior.val())
		var valQuantidade = this.parseNumber(this.inputQuantidade.val())

		this.inputTravessao.toggleClass('input-error', !this.isValid(valTravessao, 'travessao'))
		this.inputAltura.toggleClass('input-error', !this.isValid(valAltura, 'altura'))
		this.inputRecuoSuperior.toggleClass('input-error', !this.isValid(valRecuoSuperior, 'recuoSuperior'))
		this.inputRecuoInferior.toggleClass('input-error', !this.isValid(valRecuoInferior, 'recuoInferior'))
		this.inputQuantidade.toggleClass('input-error', !valQuantidade)

		if (
			!this.inputTravessao.is('.input-error') &&
			!this.inputAltura.is('.input-error') &&
			!this.inputRecuoSuperior.is('.input-error') &&
			!this.inputRecuoInferior.is('.input-error') &&
			!this.inputQuantidade.is('.input-error')
		) {
			this.addArea({
				travessao: valTravessao || 0,
				altura: valAltura || 0,
				recuoSuperior: valRecuoSuperior || 0,
				recuoInferior: valRecuoInferior || 0,
				quantidade: Math.round(valQuantidade)
			})
			this.inputTravessao.val('')
			this.inputAltura.val('')
			this.inputRecuoSuperior.val('')
			this.inputRecuoInferior.val('')
			this.inputQuantidade.val(1)
		}
	}

	getTextAreas () {
		var _self = this

		return this.areas
		.map(function (area) {
			return _self.formatNumber(area.travessao, 2)+"m (travessao) x " + _self.formatNumber(area.altura, 2)+"m (altura) x " + _self.formatNumber(area.recuoSuperior, 2)+"m (recuo superior) x " + _self.formatNumber(area.recuoInferior, 2)+"m (recuo inferior) - "+_self.formatNumber(area.quantidade, 0)+" par(es)"
		}).join("\r\n")
	}

	getAmount () {
		if (this.areas.length) {
			return this.areas
			.map(function (val) {
				return val.quantidade
			})
			.reduce(function (accumulator, currentValue) {
				return accumulator + currentValue
			})
		} else {
			return 0
		}
	}

	change (func) {
		this.changeFunc = func
	}

	start (target) {
		var _self = this
		$(this.calcareaForm).submit(function (el) {
			_self.submit()
		})
		
		$(_self.inputTravessao).keypress(function (el) {
			$(el.target).removeClass('input-error')
		})
		$(_self.inputAltura).keypress(function (el) {
			$(el.target).removeClass('input-error')
		})
		$(_self.inputRecuoSuperior).keypress(function (el) {
			$(el.target).removeClass('input-error')
		})
		$(_self.inputRecuoInferior).keypress(function (el) {
			$(el.target).removeClass('input-error')
		})
		$(_self.inputQuantidade).keypress(function (el) {
			$(el.target).removeClass('input-error')
		})
		this.renderAreas()
	}
}