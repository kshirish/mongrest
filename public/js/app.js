(function(window, $, undefined) {

	$(document).ready(function() {

		// DOM cache

		var $form = $('#create-model-form');
		var $addRowButton = $('#add-row');
		var $rows = $('#rows');
		var $rowTemplate = $('#row-template');
		var rowHtml = $rowTemplate.html();

		// listeners

		$addRowButton.on('click', function(e) {
			
			// append row html to #rows
			$rows.append(rowHtml);			
		});

		$form.on('submit', function(e) {
			
			// do something on form submit
			e.preventDefault();
			
			var arr = [];
			var data;
			var name = $form.find('input[type="text"]').eq(0).val();

			$.each($(this).find('.form-row'), function(index, el) {

				var $el = $(el);
				var $input = $el.find('input[type="text"]');
				var $select = $el.find('select');

				// check on both column name and type
				if($input.val().trim() && $select.val().trim()) {

					arr.push({
						name: $input.val(),
						value: $select.val()
					});
				}
	
			});

			data = {
				name: name,
				columns: arr
			};

			$.ajax({			

				type: 'POST',
				url: '/api/v1/model',
				contentType: 'application/json; charset=utf-8',
				data: JSON.stringify(data),
				dataType: 'json'			
			
			}).done(function(response) {

				console.log('Response ', response)
			
			}).fail(function(error) {

				console.log('Error ', error)

			});
		});

		$rows.on('click', '.delete', function(e) {
			
			// get form-row through delete button
			$(e.target).closest('.form-row').remove();
		});
	});

})(window, jQuery);

