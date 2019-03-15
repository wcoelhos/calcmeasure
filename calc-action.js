class enableCalcPageRede {
 
	constructor() {

		this.calc = new CalcRede('.info-principal-produto')	

		var _self = this
		$('.botao.botao-comprar.principal.grande:not(.desativo)').click(function(e) {
			_self.recordAreas(e.target)
		})//.attr('href', '#')


		$('.comprar').addClass('hide-comprar')
		this.calc.change(function (areas) {
			if (areas.length) {
				$('.comprar').removeClass('hide-comprar')
				_self.applyQtd(areas)
			} else {
				$('.comprar').addClass('hide-comprar')
			}
		})
	}

	recordAreas (target) {
		var sku = $(target).parents('.acoes-produto').find('meta[itemprop=sku]').prop('content')

		if (sku) {
			var areas = this.calc.getTextAreas()
			localStorage.setItem(sku, areas)
			console.log(sku, ":", areas)
		}
	}

	applyQtd (areas) {
		var qtdInput = $('.principal .comprar .qtde-adicionar-carrinho input[name=qtde-carrinho]')

		if (areas.length) {
			 var sum = areas
			.map(function (val) {
				return val.area
			})
			.reduce(function (accumulator, currentValue) {
				return accumulator + currentValue
			})
		} else {
			var sum = 0
		}

		qtdInput.val(sum)
		qtdInput.change()
	}
}

class enableCalcPageGol {
 
	constructor(type) {

		this.calc = new CalcGol('.info-principal-produto', type)
		
		var _self = this
		$('.botao.botao-comprar.principal.grande:not(.desativo)').click(function(e) {
			_self.recordAreas(e.target)
		})//.attr('href', '#')

		$('.comprar').addClass('hide-comprar')
		this.calc.change(function (areas, filled) {
			if (filled) {
				$('.comprar').removeClass('hide-comprar')
			} else {
				$('.comprar').addClass('hide-comprar')
			}
		})
	}

	recordAreas (target) {
		var sku = $(target).parents('.acoes-produto').find('meta[itemprop=sku]').prop('content')

		if (sku) {
			var areas = this.calc.getTextAreas()
			localStorage.setItem(sku, areas)
			console.log(sku, ":", areas)
		}
	}
}

class enableCheckcoutPage {

	constructor() {
		var value = this.getTextAreas()

		this.observationsInput = $('textarea[name=cliente_obs]').first()
		this.observationsInput.val(value)

		if (value) {
			var newObservacao = $(this.observationsInput)
			.clone()
			.css('height', '140px')
			.prop('disabled', true)
			.prop('name', '')
			.prop('id', '')
			.insertAfter(this.observationsInput);

			$(this.observationsInput)
			.css('width', 0)
			.css('position', 'absolute')
			.css('opacity', 0)
		} else {
			$(this.observationsInput).parents('.caixa-sombreada').hide()
		}
	}

	getTextAreas () {
		return this
		.getCheckoutSkus()
		.map(function (sku, index) {
			var textAreas = localStorage.getItem(sku)

			if (sku && textAreas) {
				return ["SKU: "+sku, textAreas].join("\r\n")	
			} else {
				return null
			}
		})
		.filter(function (v) {
			return v
		})
		.join("\r\n\r\n")
	}

	getCheckoutSkus () {
		var items = []
		$('.tabela-carrinho .produto-info > ul').each(function (index, element) {
			var sku = $(element).find('>li').first().find('strong').text().trim()
			if (sku) items.push(sku)
		})
		return items
	}

	formatNumber (num) {
		num = parseFloat(parseFloat(num).toFixed(2))
		return num.toLocaleString(
		  'pt-BR',
		  { minimumFractionDigits: 2 }
		)
	}

}

class checkPageType {

	constructor() {
	}

	isRedeSobMedida () {
		var descricao = $("#descricao:contains('#rede-sobmedida')")
		return $(descricao).length && this.sandbox()
	}

	isGolFutsal () {
		var descricao = $("#descricao:contains('#gol-sobmedida-futsal')")
		return $(descricao).length && this.sandbox()
	}
	
	isGolSociety () {
		var descricao = $("#descricao:contains('#gol-sobmedida-society')")
		return $(descricao).length && this.sandbox()
	}

	isGolCampo () {
		var descricao = $("#descricao:contains('#gol-sobmedida-campo')")
		return $(descricao).length && this.sandbox()
	}

	isCheckcout () {
		return $('textarea[name=cliente_obs]').length && this.sandbox()
	}

	sandbox () {
		var url = new URL(window.location.href);
		var test = url.searchParams.get("test");

		//return test==='calc'
		return true
	}
}


$(document).ready(function () {

	var pageType = new checkPageType

	if (pageType.isRedeSobMedida()) {
		console.log('isRedeSobMedida')
		new enableCalcPageRede()
	}
	
	if (pageType.isGolFutsal()) {
		console.log('isGolFutsal')
		new enableCalcPageGol('futsal')
	}
	
	if (pageType.isGolSociety()) {
		console.log('isGolSociety')
		new enableCalcPageGol('society')
	}
	
	if (pageType.isGolCampo()) {
		console.log('isGolCampo')
		new enableCalcPageGol('campo')
	}
	
	if (pageType.isCheckcout()) {
		console.log('isCheckcout')
		new enableCheckcoutPage()
	}

	if (pageType.sandbox()) {
		$('.calc-gismar01, .calc-gismar02').hide()
	}

})