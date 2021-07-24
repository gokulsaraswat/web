$('input[name="theme"]').on('change', function() {
    if ($(this).prop("checked", true)) {
      $('body').attr('data-theme', $(this).prop('value'));
    }
  });