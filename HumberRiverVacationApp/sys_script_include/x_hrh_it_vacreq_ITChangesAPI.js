var x_hrh_it_vacreq_ITChangesAPI = Class.create();
x_hrh_it_vacreq_ITChangesAPI.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  
  getChanges: function() {
    var startDate = this.getParameter('sysparm_start_date');
    var endDate = this.getParameter('sysparm_end_date');
    
    if (!startDate || !endDate) {
      return JSON.stringify({ error: true });
    }
    
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
        return JSON.stringify({ error: true });
      }
      return body;
    } catch (e) {
      gs.error('ITChangesAPI error: ' + e);
      return JSON.stringify({ error: true });
    }
  },

  type: 'x_hrh_it_vacreq_ITChangesAPI'
});
