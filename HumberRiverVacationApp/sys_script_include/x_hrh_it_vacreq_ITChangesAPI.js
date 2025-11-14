var x_hrh_it_vacreq_ITChangesAPI = Class.create();
x_hrh_it_vacreq_ITChangesAPI.prototype = {
  initialize: function () {},

  getChanges: function (startDate, endDate) {
    var rm = new sn_ws.RESTMessageV2('x_hrh_it_vacreq.ITChanges', 'get');
    rm.setStringParameterNoEscape('startDate', startDate);
    rm.setStringParameterNoEscape('endDate', endDate);
    rm.setHttpTimeout(10000);

    try {
      var response = rm.execute();
      var body = response.getBody();
      var status = response.getStatusCode();
      if (status !== 200) {
        gs.error('ITChangesAPI: non-200 status ' + status + ' body=' + body);
        return body;
      }
      return body;
    } catch (e) {
      gs.error('ITChangesAPI error: ' + e);
      return JSON.stringify({ error: true });
    }
  },

  type: 'x_hrh_it_vacreq_ITChangesAPI'
};
