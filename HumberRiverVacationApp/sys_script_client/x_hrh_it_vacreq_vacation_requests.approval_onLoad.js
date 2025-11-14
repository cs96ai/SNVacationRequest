// Client script: onLoad for approval view - fetch overlaps and IT changes
function onLoad() {
  // Only run on approval view
  if (g_form.getViewName() !== 'approval') {
    return;
  }
  
  var startDate = g_form.getValue('start_date');
  var endDate = g_form.getValue('end_date');
  
  if (!startDate || !endDate) {
    return;
  }
  
  // Calculate adjusted dates (2 weeks before/after)
  var start = new Date(startDate);
  var end = new Date(endDate);
  var adjustedStart = new Date(start);
  adjustedStart.setDate(adjustedStart.getDate() - 14);
  var adjustedEnd = new Date(end);
  adjustedEnd.setDate(adjustedEnd.getDate() + 14);
  
  // Format dates as YYYY-MM-DD
  var formatDate = function(d) {
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  };
  
  // Fetch overlapping vacations
  var gaOverlaps = new GlideAjax('x_hrh_it_vacreq_OverlapAPI');
  gaOverlaps.addParam('sysparm_name', 'getOverlaps');
  gaOverlaps.addParam('sysparm_start_date', formatDate(adjustedStart));
  gaOverlaps.addParam('sysparm_end_date', formatDate(adjustedEnd));
  gaOverlaps.getXMLAnswer(function(response) {
    if (!response) {
      g_form.setValue('overlapping_vacations_html', '<p>No overlapping vacations data available.</p>');
      return;
    }
    try {
      var data = JSON.parse(response);
      if (data.error) {
        g_form.setValue('overlapping_vacations_html', '<p style="color:red;">Error fetching overlapping vacations.</p>');
        return;
      }
      
      var html = '<div style="font-size:12px;">';
      html += '<p><strong>Period:</strong> ' + data.periodStart + ' to ' + data.periodEnd + '</p>';
      html += '<p><strong>Total Overlaps:</strong> ' + data.totalOverlaps + '</p>';
      
      if (data.overlappingRequests && data.overlappingRequests.length > 0) {
        html += '<table style="width:100%; border-collapse:collapse; margin-top:10px;">';
        html += '<tr style="background:#f0f0f0;"><th style="border:1px solid #ccc; padding:5px;">Employee</th><th style="border:1px solid #ccc; padding:5px;">Start Date</th><th style="border:1px solid #ccc; padding:5px;">End Date</th><th style="border:1px solid #ccc; padding:5px;">Status</th></tr>';
        
        for (var i = 0; i < data.overlappingRequests.length; i++) {
          var req = data.overlappingRequests[i];
          html += '<tr>';
          html += '<td style="border:1px solid #ccc; padding:5px;">' + req.fullName + ' (' + req.employeeId + ')</td>';
          html += '<td style="border:1px solid #ccc; padding:5px;">' + req.startDate + '</td>';
          html += '<td style="border:1px solid #ccc; padding:5px;">' + req.endDate + '</td>';
          html += '<td style="border:1px solid #ccc; padding:5px;">' + req.status + '</td>';
          html += '</tr>';
        }
        html += '</table>';
      } else {
        html += '<p>No overlapping vacations found.</p>';
      }
      
      html += '<p style="font-size:10px; color:#666; margin-top:10px;">Last updated: ' + data.lastUpdated + '</p>';
      html += '</div>';
      
      g_form.setValue('overlapping_vacations_html', html);
    } catch (e) {
      g_form.setValue('overlapping_vacations_html', '<p style="color:red;">Error parsing overlapping vacations data.</p>');
    }
  });
  
  // Fetch IT changes
  var gaChanges = new GlideAjax('x_hrh_it_vacreq_ITChangesAPI');
  gaChanges.addParam('sysparm_name', 'getChanges');
  gaChanges.addParam('sysparm_start_date', formatDate(start));
  gaChanges.addParam('sysparm_end_date', formatDate(end));
  gaChanges.getXMLAnswer(function(response) {
    if (!response) {
      g_form.setValue('it_changes_html', '<p>No IT changes data available.</p>');
      return;
    }
    try {
      var data = JSON.parse(response);
      if (data.error) {
        g_form.setValue('it_changes_html', '<p style="color:red;">Error fetching IT changes.</p>');
        return;
      }
      
      var html = '<div style="font-size:12px;">';
      html += '<p><strong>Period:</strong> ' + data.periodStart + ' to ' + data.periodEnd + '</p>';
      html += '<p><strong>Total Changes:</strong> ' + data.totalChanges + '</p>';
      
      if (data.scheduledChanges && data.scheduledChanges.length > 0) {
        html += '<table style="width:100%; border-collapse:collapse; margin-top:10px;">';
        html += '<tr style="background:#f0f0f0;"><th style="border:1px solid #ccc; padding:5px;">Change ID</th><th style="border:1px solid #ccc; padding:5px;">Description</th><th style="border:1px solid #ccc; padding:5px;">Impact</th><th style="border:1px solid #ccc; padding:5px;">Start Time</th><th style="border:1px solid #ccc; padding:5px;">Services</th></tr>';
        
        for (var i = 0; i < data.scheduledChanges.length; i++) {
          var chg = data.scheduledChanges[i];
          var impactColor = chg.impact === 'High' ? 'red' : (chg.impact === 'Medium' ? 'orange' : 'green');
          html += '<tr>';
          html += '<td style="border:1px solid #ccc; padding:5px;">' + chg.changeId + '</td>';
          html += '<td style="border:1px solid #ccc; padding:5px;">' + chg.description + '</td>';
          html += '<td style="border:1px solid #ccc; padding:5px; color:' + impactColor + '; font-weight:bold;">' + chg.impact + '</td>';
          html += '<td style="border:1px solid #ccc; padding:5px;">' + chg.startTime + '</td>';
          html += '<td style="border:1px solid #ccc; padding:5px;">' + (chg.affectedServices ? chg.affectedServices.join(', ') : '') + '</td>';
          html += '</tr>';
        }
        html += '</table>';
      } else {
        html += '<p>No scheduled IT changes found.</p>';
      }
      
      html += '<p style="font-size:10px; color:#666; margin-top:10px;">Last updated: ' + data.lastUpdated + '</p>';
      html += '</div>';
      
      g_form.setValue('it_changes_html', html);
    } catch (e) {
      g_form.setValue('it_changes_html', '<p style="color:red;">Error parsing IT changes data.</p>');
    }
  });
}
