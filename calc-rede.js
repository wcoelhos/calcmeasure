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
			html += '		<div>'
			html += '			<label>--</label>'
			html += '			<button type="submit">Adicionar</button>'
			html += '		</div>'
			html += '	</form>'
			html += '	<ul class="calcarea-list list">'
			html += '		<li style="display: none;">'
			html += '			<a href="javascript:void(0)" class="remove">x</a>'
			html += '			<span class="altura">000</span>m Altura x <span class="comprimento">000</span>m Comprimento <strong>(<span class="area">00m²</span>)</strong>'
			html += '		</li>'
			html += '	</ul>'
			html += '</div>'

		this.calcarea = $(html)
		this.calcareaForm = $(this.calcarea).find('.calcarea-form')
		this.inputAltura = $(this.calcareaForm).find('input[name="altura"]')
		this.inputComprimento = $(this.calcareaForm).find('input[name="comprimento"]')
		this.calcareaListElement = $(this.calcarea).find('.calcarea-list')
		this.baseCalcareaElement = $(this.calcareaListElement).find(' > li:hidden').first().clone().css('display', 'block')
		this.changeFunc = null

		$(this.inputAltura).maskMoney({thousands:'.', decimal:','});
		$(this.inputComprimento).maskMoney({thousands:'.', decimal:','});

		$(target).append(this.calcarea)
		this.start()
	}

	addCalcareaItem (area, index) {
		var _self = this

		var item = $(this.baseCalcareaElement).clone()
			item.find('.altura').text(this.formatNumber(area.altura))
			item.find('.comprimento').text(this.formatNumber(area.comprimento))
			item.find('.area').text(this.formatNumber(area.area) + 'm²')
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
			this.changeFunc(this.areas)
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
		var index = num.lastIndexOf(".") > num.lastIndexOf(",") ? num.lastIndexOf(".") : num.lastIndexOf(",")
		
		if (index >= 0) {
			var number = num.substring(0, index)
			var decimal = num.substring(index+1)
			num = number.replace('.', '').replace(',', '') + '.' + decimal.replace('.', '').replace(',', '')
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

	submit (form) {
		var valAltura = this.parseNumber(this.inputAltura.val())
		var valComprimento = this.parseNumber(this.inputComprimento.val())

		if (valAltura && valComprimento) {
			this.addArea({
				altura: valAltura,
				comprimento: valComprimento,
				area: Math.round(valAltura * valComprimento)
			})
			this.inputAltura.removeClass('input-error').val('')
			this.inputComprimento.removeClass('input-error').val('')
		} else {
			if (!valAltura) this.inputAltura.addClass('input-error')
			if (!valComprimento) this.inputComprimento.addClass('input-error')
		}
	}

	getTextAreas () {
		var _self = this

		return this.areas
		.map(function (area) {
			return ""+_self.formatNumber(area.altura)+"m x "+_self.formatNumber(area.comprimento)+"m ("+_self.formatNumber(area.area)+"m)"
		}).join("\r\n")
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
		this.renderAreas()
	}
}