class enableCalcPage {
 
	constructor(target) {
		this.calc = new Area('.info-principal-produto')

		var _self = this
		$('.botao.botao-comprar.principal.grande:not(.desativo)').click(function(e) {
			_self.recordAreas(e.target)
		})//.attr('href', '#')

		this.calc.change(function (areas) {
			_self.applyQtd(areas)
		})
	}

	recordAreas (target) {
		var sku = $(target).parents('.acoes-produto').find('meta[itemprop=sku]').prop('content')
		
		if (sku) {
			var areas = JSON.stringify(this.calc.getAreas())
			localStorage.setItem(sku, areas)
			console.log('Adicinado:', sku, areas)
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

class enableCheckcoutPage {

	constructor() {
		this.observationsInput = $('textarea[name=cliente_obs]').first()
		this.observationsInput.val(this.getTextAreas())

		var newObservacao = $(this.observationsInput)
		.clone()
		.css('height', '100px')
		.prop('disabled', true)
		.prop('name', '')
		.prop('id', '')
		.insertAfter(this.observationsInput);

		$(this.observationsInput)
		.css('width', 0)
		//.css('height', 0)
		.css('position', 'absolute')
		.css('opacity', 0)
	}

	getCheckoutSkus () {
		var items = []
		$('.tabela-carrinho .produto-info > ul').each(function (index, element) {
			var sku = $(element).find('>li').first().find('strong').text().trim()
			if (sku) items.push(sku)
		})
		return items
	}

	getAreasFromSkus () {
		var checkoutSkus = this.getCheckoutSkus()

		var items = []
		checkoutSkus.forEach(function (sku, index) {
			var areas = localStorage.getItem(sku)

			if (sku && areas) {
				items.push({
					sku: sku,
					areas: JSON.parse(areas)
				})
			}
		})
		return items
	}

	getTextAreas () {
		var _self = this
		var skus = this.getAreasFromSkus()

		return skus.map(function (val) {
			var areas = val.areas.map(function (area) {
				return ""+_self.formatNumber(area.altura)+"m x "+_self.formatNumber(area.comprimento)+"m ("+_self.formatNumber(area.area)+"m)"
			}).join("\r\n")

			return [
				"SKU: "+val.sku,
				areas
			].join("\r\n")

		}).join("\r\n\r\n")
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

	isCalc () {
		var descricao = $("#descricao:contains('#rede-sobmedida')")
		return $(descricao).length && this.sandbox()
	}

	isCheckcout () {
		return $('textarea[name=cliente_obs]').length && this.sandbox()
	}

	sandbox () {
		var url = new URL(window.location.href);
		var test = url.searchParams.get("test");

		return test==='calc'
		
		//return true
	}
}


$(document).ready(function () {

	var pageType = new checkPageType

	if (pageType.isCalc()) {
		console.log('isCalcPage')
		new enableCalcPage
	}
	if (pageType.isCheckcout()) {
		console.log('isCheckcoutPage')
		new enableCheckcoutPage
	}

	
	if (pageType.sandbox()) {
		$('.calc-gismar02').hide()

		/*
		$('a').each(function (index, item) {
			var url = new URL($(item).prop('href'));
			url.searchParams.set("test", "calc");
			$(item).prop('href', url)
		})
		*/
	}

})