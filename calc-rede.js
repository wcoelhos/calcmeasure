class CalcRede {

	constructor(target) {
		this.areas = []

		var html = ''
			html += '<div class="calcarea">'
			html += '	<div class="calcarea-header">'
			html += '		Calcule abaixo quantos m² você precisa:'
			html += '	</div>'
			html += '	<form action="javascript:void(0)" class="calcarea-form">'
			html += '		<div>'
			html += '			<label>Altura</label>'
			html += '			<input type="text" name="altura" placeholder="0,00">'
			html += '		</div>'
			html += '		<div>'
			html += '			<label>Comprimento</label>'
			html += '			<input type="text" name="comprimento" placeholder="0,00">'
			html += '		</div>'
			html += '		<div class="breakline"></div>'
			html += '		<div>'
			html += '			<label>Quantidade</label>'
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
			html += '			<span class="altura">0</span>m x <span class="comprimento">0</span>m <strong>(<span class="area">0m²</span>)</strong> - <span class="quantidade">0</span> unidades'
			html += '		</li>'
			html += '	</ul>'
			html += '</div>'

		this.calcarea = $(html)
		this.calcareaForm = $(this.calcarea).find('.calcarea-form')
		this.inputAltura = $(this.calcareaForm).find('input[name="altura"]')
		this.inputComprimento = $(this.calcareaForm).find('input[name="comprimento"]')
		this.inputQuantidade = $(this.calcareaForm).find('input[name="quantidade"]')
		this.calcareaListElement = $(this.calcarea).find('.calcarea-list')
		this.baseCalcareaElement = $(this.calcareaListElement).find(' > li:hidden').first().clone().css('display', 'block')
		this.changeFunc = null

		//$(this.inputAltura).maskMoney({thousands:'.', decimal:','});
		//$(this.inputComprimento).maskMoney({thousands:'.', decimal:','});

		for (var selector in target) {
		  const position = target[selector]
		  if ($(selector).length) {
		  	if (position === 'insertAfter') $(this.calcarea).insertAfter($(selector))
			else if (position === 'prepend') $(selector).prepend(this.calcarea)
			else $(selector).append(this.calcarea)
			break;
		  }
		}

		this.start()
	}

	addCalcareaItem (area, index) {
		var _self = this

		var item = $(this.baseCalcareaElement).clone()
			item.find('.altura').text(this.formatNumber(area.altura, 2))
			item.find('.comprimento').text(this.formatNumber(area.comprimento, 2))
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

	submit (form) {
		var valAltura = this.parseNumber(this.inputAltura.val())
		var valComprimento = this.parseNumber(this.inputComprimento.val())
		var valQuantidade = this.parseNumber(this.inputQuantidade.val())

		this.inputAltura.toggleClass('input-error', !valAltura)
		this.inputComprimento.toggleClass('input-error', !valComprimento)
		this.inputQuantidade.toggleClass('input-error', !valQuantidade)

		if (
			!this.inputAltura.is('.input-error') &&
			!this.inputComprimento.is('.input-error') &&
			!this.inputQuantidade.is('.input-error')
		) {
			this.addArea({
				altura: valAltura,
				comprimento: valComprimento,
				area: Math.round(valAltura * valComprimento),
				quantidade: Math.round(valQuantidade)
			})
			this.inputAltura.val('')
			this.inputComprimento.val('')
			this.inputQuantidade.val(1)
		}
	}

	getTextAreas () {
		var _self = this

		return this.areas
		.map(function (area) {
			return _self.formatNumber(area.altura, 2)+"m x "+_self.formatNumber(area.comprimento, 2)+"m ("+_self.formatNumber(area.area, 2)+"m)"+" - "+_self.formatNumber(area.quantidade, 0)+" unidade(s)"
		}).join("\r\n")
	}

	getAmount () {
		if (this.areas.length) {
			return this.areas
			.map(function (val) {
				return val.area * val.quantidade
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
		
		$(_self.inputAltura).keypress(function (el) {
			$(el.target).removeClass('input-error')
		})
		$(_self.inputAltura).keypress(function (el) {
			$(el.target).removeClass('input-error')
		})
		$(_self.inputQuantidade).keypress(function (el) {
			$(el.target).removeClass('input-error')
		})
		this.renderAreas()
	}
}