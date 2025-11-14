var x_hrh_it_vacreq_CalendarSync = Class.create();
x_hrh_it_vacreq_CalendarSync.prototype = {
  initialize: function () {},

  syncToCalendar: function (requestGr) {
    if (!requestGr || !requestGr.employee) {
      return;
    }
    try {
      var rm = new sn_ws.RESTMessageV2('x_hrh_it_vacreq.CalendarSync', 'post');
      rm.setRequestBody(JSON.stringify({
        employeeId: requestGr.employee.employee_number || requestGr.employee.user_name,
        startDate: requestGr.start_date.getDisplayValue(),
        endDate: requestGr.end_date.getDisplayValue(),
        hoursRequested: requestGr.hours_requested,
        notes: requestGr.notes
      }));
      rm.setHttpTimeout(15000);
      var response = rm.execute();
      if (response.getStatusCode() !== 200) {
        gs.error('CalendarSync: non-200 status ' + response.getStatusCode());
      }
    } catch (e) {
      gs.error('CalendarSync error: ' + e);
    }
  },

  type: 'x_hrh_it_vacreq_CalendarSync'
};
