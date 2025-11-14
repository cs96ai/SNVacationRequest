var x_hrh_it_vacreq_ApprovalActions = Class.create();
x_hrh_it_vacreq_ApprovalActions.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  
  declineRequest: function() {
    var requestId = this.getParameter('sysparm_request_id');
    var reason = this.getParameter('sysparm_reason');
    
    if (!requestId || !reason) {
      return 'error';
    }
    
    var gr = new GlideRecord('x_hrh_it_vacreq_vacation_requests');
    if (gr.get(requestId)) {
      gr.status = 'declined';
      gr.decline_reason = reason;
      gr.update();
      
      // Send notification to employee
      gs.eventQueue('x_hrh_it_vacreq.vacation.declined', gr, gs.getUserID(), gs.getUserName());
      
      return 'success';
    }
    
    return 'error';
  },
  
  type: 'x_hrh_it_vacreq_ApprovalActions'
});
