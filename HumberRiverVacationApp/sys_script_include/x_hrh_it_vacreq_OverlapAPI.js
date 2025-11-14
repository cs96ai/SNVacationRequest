var x_hrh_it_vacreq_OverlapAPI = Class.create();
x_hrh_it_vacreq_OverlapAPI.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  
  getOverlaps: function() {
    var startDate = this.getParameter('sysparm_start_date');
    var endDate = this.getParameter('sysparm_end_date');
    
    if (!startDate || !endDate) {
      return JSON.stringify({ error: true });
    }
    
    var rm = new sn_ws.RESTMessageV2('x_hrh_it_vacreq.Overlaps', 'get');
    rm.setStringParameterNoEscape('startDate', startDate);
    rm.setStringParameterNoEscape('endDate', endDate);
    rm.setHttpTimeout(10000);

    try {
      var response = rm.execute();
      var body = response.getBody();
      var status = response.getStatusCode();
      if (status !== 200) {
        gs.error('OverlapAPI: non-200 status ' + status + ' body=' + body);
        return JSON.stringify({ error: true });
      }
      return body;
    } catch (e) {
      gs.error('OverlapAPI error: ' + e);
      return JSON.stringify({ error: true });
    }
  },

  type: 'x_hrh_it_vacreq_OverlapAPI'
});
