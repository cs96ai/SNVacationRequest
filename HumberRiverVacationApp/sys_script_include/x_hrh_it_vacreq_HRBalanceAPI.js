var x_hrh_it_vacreq_HRBalanceAPI = Class.create();
x_hrh_it_vacreq_HRBalanceAPI.prototype = {
  initialize: function () {},

  getBalance: function () {
    var user = gs.getUser();
    var employeeId = gs.getSession().getProperty('x_hrh_it_vacreq.employee_id') || user.getName();

    var rm = new sn_ws.RESTMessageV2('x_hrh_it_vacreq.HRBalance', 'get');
    rm.setStringParameterNoEscape('employeeId', employeeId);
    rm.setHttpTimeout(10000);

    try {
      var response = rm.execute();
      var body = response.getBody();
      var status = response.getStatusCode();
      if (status !== 200) {
        gs.error('HRBalanceAPI: non-200 status ' + status + ' body=' + body);
        return JSON.stringify({ error: true });
      }
      var data = JSON.parse(body);
      return JSON.stringify({
        remainingHours: data.remainingHours || 0,
        remainingDays: data.remainingDays || 0
      });
    } catch (e) {
      gs.error('HRBalanceAPI error: ' + e);
      return JSON.stringify({ error: true });
    }
  },

  type: 'x_hrh_it_vacreq_HRBalanceAPI'
};
