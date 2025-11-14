// Client script: onSubmit - validate hours requested against remaining balance
function onSubmit() {
  var start = g_form.getValue('start_date');
  var end = g_form.getValue('end_date');
  if (!start || !end) {
    return true;
  }

  var startDate = new Date(start);
  var endDate = new Date(end);
  if (endDate < startDate) {
    alert('End date must be on or after start date.');
    return false;
  }

  // Simple 8-hour-day calculation; weekends skipped. Holidays assumed handled server-side if needed.
  var msPerDay = 24 * 60 * 60 * 1000;
  var hours = 0;
  for (var d = new Date(startDate); d <= endDate; d = new Date(d.getTime() + msPerDay)) {
    var day = d.getDay();
    if (day !== 0 && day !== 6) { // skip Sunday (0) and Saturday (6)
      hours += 8;
    }
  }

  g_form.setValue('hours_requested', hours);

  var remaining = parseFloat(g_form.getValue('remaining_hours') || 0);
  if (hours > remaining) {
    alert('Requested hours (' + hours + ') exceed remaining hours (' + remaining + ').');
    return false;
  }

  return true;
}
