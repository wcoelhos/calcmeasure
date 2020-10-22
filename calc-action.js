class enableCalcPageRede {
 
	constructor() {
		var _self = this

		this.calc = new CalcRede({'.atributos': 'insertAfter', '.info-principal-produto': 'insertAfter'})
		this.qtdInput = $('.principal .comprar .qtde-adicionar-carrinho input[name=qtde-carrinho]')
		this.btComprar = $('.botao.botao-comprar.principal.grande:not(.desativo)')
		this.boxCep = $('.principal .comprar, .principal .cep')
		this.qtdeTitle = $('.qtde-adicionar-carrinho .qtde-carrinho-title')

		$(this.btComprar).click(function(e) {
			_self.recordAreas(e.target)
		})//.attr('href', '#')

		//troca para metro quadrado
		$(this.qtdeTitle).text('m²')
		//esconde cep
		$(this.boxCep).addClass('hide-comprar')
		//desabilita botao
		$(this.qtdInput).prop('readonly', 'readonly').addClass('readonly-input')
		
		this.calc.change(function (areas, amount) {
			_self.applyQtd(amount)
			$(_self.boxCep).toggleClass('hide-comprar', !amount)
		})
	}

	recordAreas (target) {
		var sku = $(target).parents('.acoes-produto').find('meta[itemprop=sku]').prop('content')
		if (!sku) sku = $(target).parents('.principal').find('span[itemprop=sku]').text()

		if (sku) {
			var areas = this.calc.getTextAreas()
			localStorage.setItem(sku, areas)
			console.log(sku, ":", areas)
		}
	}

	applyQtd (amount) {
		$(this.qtdInput).val(amount)
		$(this.qtdInput).change()
	}
}

class enableCalcPageGol {
 
	constructor(type) {
		var _self = this

		this.calc = new CalcGol({'.atributos': 'insertAfter', '.info-principal-produto': 'insertAfter'}, type)
		this.qtdInput = $('.principal .comprar .qtde-adicionar-carrinho input[name=qtde-carrinho]')
		this.btComprar = $('.botao.botao-comprar.principal.grande:not(.desativo)')
		this.boxCep = $('.principal .comprar, .principal .cep')
		this.qtdeTitle = $('.qtde-adicionar-carrinho .qtde-carrinho-title')

		$(this.btComprar).click(function(e) {
			_self.recordAreas(e.target)
		})//.attr('href', '#')

		//troca para metro quadrado
		$(this.qtdeTitle).text('Par')
		//esconde cep
		$(this.boxCep).addClass('hide-comprar')
		//desabilita botao
		$(this.qtdInput).prop('readonly', 'readonly').addClass('readonly-input')
		
		this.calc.change(function (areas, amount) {
			_self.applyQtd(amount)
			$(_self.boxCep).toggleClass('hide-comprar', !amount)
		})
	}

	recordAreas (target) {
		var sku = $(target).parents('.acoes-produto').find('meta[itemprop=sku]').prop('content')
		if (!sku) sku = $(target).parents('.principal').find('span[itemprop=sku]').text()

		if (sku) {
			var areas = this.calc.getTextAreas()
			localStorage.setItem(sku, areas)
			console.log(sku, ":", areas)
		}
	}

	applyQtd (amount) {
		$(this.qtdInput).val(amount)
		$(this.qtdInput).change()
	}
}

class enableCheckoutPage {

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

class enableCartPage {

	constructor() {
		this.disableQtd()
	}

	ckeckStoredBySku (sku) {
		return localStorage.getItem(sku)
	}

	disableQtd () {
		var _self = this
		$('.tabela-carrinho > tbody > tr').each(function (index, el) {
			var sku = $(el).find('.produto-info > ul > li').first().find('strong').text().trim()
			var input = $(el).find('.quantidade > input[name=quantidade]')
			var form = $(el).find('form')
			var options = $(el).find('.quantidade > a.icon-minus, .quantidade > a.icon-plus, .quantidade > button.atualizar-quantidade')
			if (_self.ckeckStoredBySku(sku)) {
				input.attr('disabled', true)
				form.attr('disabled', true)
				$(options).remove()
			}
		})
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

	isCheckout () {
		return $('textarea[name=cliente_obs]').length && this.sandbox()
	}

	isCart () {
		return $('table.tabela-carrinho').length && this.sandbox()
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
	
	if (pageType.isCheckout()) {
		console.log('isCheckout')
		new enableCheckoutPage()
	}

	if (pageType.isCart()) {
		console.log('isCart')
		new enableCartPage()
	}

	if (pageType.sandbox()) {
		$('.calc-gismar01, .calc-gismar02').hide()
	}

})