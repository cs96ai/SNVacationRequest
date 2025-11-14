// Client script: onLoad - populate employee fields and remaining balance
function onLoad() {
  var user = g_user;
  if (!g_form.getValue('employee')) {
    g_form.setValue('employee', user.userID);
  }
  if (!g_form.getValue('employee_name')) {
    g_form.setValue('employee_name', user.firstName + ' ' + user.lastName);
  }

  // GlideAjax to fetch HR balance
  var ga = new GlideAjax('x_hrh_it_vacreq_HRBalanceAPI');
  ga.addParam('sysparm_name', 'getBalance');
  ga.addParam('sysparm_employee_id', user.userName);
  ga.getXMLAnswer(function (response) {
    if (!response) {
      return;
    }
    try {
      var data = JSON.parse(response);
      if (data && typeof data.remainingHours !== 'undefined') {
        g_form.setValue('remaining_hours', data.remainingHours);
      }
      if (data && typeof data.remainingDays !== 'undefined') {
        g_form.setValue('remaining_days', data.remainingDays);
      }
    } catch (e) {
      console.log('Error parsing HR balance response: ' + e);
    }
  });
}
