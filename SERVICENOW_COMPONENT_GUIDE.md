# ServiceNow IT Vacation Request - Component Creation Guide

## Overview
This guide shows you how to add UI components and test data to your ServiceNow IT Vacation Request application (scope: `x_1782593_it_vac_0`) via Studio.

**Important:** Work directly in ServiceNow Studio rather than editing the `f521bf413b55b65080b770e0c5e45ae0/` folder manually. Studio will automatically sync changes to source control.

---

## Step 1: Access Your Application in Studio

1. Log into your ServiceNow instance
2. Navigate to **Studio** (System Applications > Studio)
3. Open your application: **IT Vacation Request** (`x_1782593_it_vac_0`)

---

## Step 2: Create the Main Table

### Create Table: Vacation Requests

1. In Studio, click **Create Application File**
2. Select **Table**
3. Configure:
   - **Label:** IT Vacation Request
   - **Name:** vacation_requests (will auto-prefix with your scope)
   - **Extends table:** Task [task]
   - **Add module to menu:** Yes
4. Click **Submit**

### Add Fields to the Table

After creating the table, add these fields:

| Field Label | Column Name | Type | Max Length | Mandatory | Read Only |
|------------|-------------|------|------------|-----------|-----------|
| Employee | employee | Reference (User) | - | Yes | No |
| Employee Name | employee_name | String | 100 | Yes | No |
| Start Date | start_date | Date | - | Yes | No |
| End Date | end_date | Date | - | Yes | No |
| Hours Requested | hours_requested | Decimal | - | Yes | No |
| Notes | notes | String | 4000 | No | No |
| Status | status | Choice | - | Yes | No |
| Decline Reason | decline_reason | String | 1000 | No | No |
| Remaining Hours | remaining_hours | Decimal | - | No | Yes |
| Remaining Days | remaining_days | Decimal | - | No | Yes |
| Overlapping Vacations HTML | overlapping_vacations_html | HTML | - | No | Yes |
| IT Changes HTML | it_changes_html | HTML | - | No | Yes |

**For Status field, add Choice values:**
- Pending
- Approved
- Declined

---

## Step 3: Create UI Pages

### Employee Dashboard

1. In Studio, click **Create Application File**
2. Select **UI Page**
3. Configure:
   - **Name:** employee_dashboard
   - **Client Callable:** Yes
   - **Direct:** No

4. Replace the HTML with:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">
  <div style="padding: 20px;">
    <h2>My Vacation Requests</h2>
    <p>Remaining Balance: <span id="remaining_balance">Loading...</span> days 
       (<span id="remaining_hours">Loading...</span> hours)</p>
    
    <button class="btn btn-primary" onclick="window.location.href='x_1782593_it_vac_0_vacation_requests.do?sys_id=-1'">
      Submit New Request
    </button>
    
    <h3 style="margin-top: 20px;">My Requests</h3>
    <g:list_view 
      table="x_1782593_it_vac_0_vacation_requests" 
      filter="employee=javascript:gs.getUserID()" 
      fields="start_date,end_date,status,hours_requested,notes" 
      order_by="start_date" 
      rows="20"/>
  </div>
  
  <script>
    // Fetch balance via GlideAjax (you'll create this Script Include next)
    var ga = new GlideAjax('x_1782593_it_vac_0.BalanceAPI');
    ga.addParam('sysparm_name', 'getBalance');
    ga.getXMLAnswer(function(answer) {
      try {
        var data = JSON.parse(answer);
        document.getElementById('remaining_balance').innerText = data.days || '0';
        document.getElementById('remaining_hours').innerText = data.hours || '0';
      } catch(e) {
        document.getElementById('remaining_balance').innerText = 'N/A';
        document.getElementById('remaining_hours').innerText = 'N/A';
      }
    });
  </script>
</j:jelly>
```

### Manager Dashboard

1. Create another **UI Page**
2. Configure:
   - **Name:** manager_dashboard
   - **Client Callable:** Yes

3. Replace the HTML with:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">
  <div style="padding: 20px;">
    <h2>Team Vacation Requests - Pending Approvals</h2>
    
    <g:list_view 
      table="x_1782593_it_vac_0_vacation_requests" 
      filter="status=Pending^assigned_toISNOTEMPTY" 
      fields="employee,employee_name,start_date,end_date,hours_requested,notes" 
      order_by="start_date" 
      rows="20"/>
    
    <h3 style="margin-top: 30px;">Team Calendar Overview</h3>
    <div id="team_calendar">Loading team vacations...</div>
  </div>
  
  <script>
    // Fetch team overlaps
    var ga = new GlideAjax('x_1782593_it_vac_0.OverlapAPI');
    ga.addParam('sysparm_name', 'getTeamCalendar');
    ga.getXMLAnswer(function(answer) {
      try {
        var data = JSON.parse(answer);
        var html = '<table class="table table-striped"><thead><tr><th>Employee</th><th>Start Date</th><th>End Date</th><th>Status</th></tr></thead><tbody>';
        data.forEach(function(req) {
          html += '<tr><td>' + req.employee + '</td><td>' + req.start_date + '</td><td>' + req.end_date + '</td><td>' + req.status + '</td></tr>';
        });
        html += '</tbody></table>';
        document.getElementById('team_calendar').innerHTML = html;
      } catch(e) {
        document.getElementById('team_calendar').innerHTML = 'No team data available';
      }
    });
  </script>
</j:jelly>
```

---

## Step 4: Create Forms

### Default Form (Employee View)

1. In Studio, click **Create Application File**
2. Select **Form**
3. Configure:
   - **Table:** x_1782593_it_vac_0_vacation_requests
   - **View:** Default
4. Design the form with these sections:

**Section 1: Request Details**
- Employee
- Employee Name
- Start Date
- End Date
- Hours Requested
- Notes
- Status
- Decline Reason

**Section 2: Balance Information**
- Remaining Hours
- Remaining Days

### Approval Form (Manager View)

1. Create another **Form**
2. Configure:
   - **Table:** x_1782593_it_vac_0_vacation_requests
   - **View:** approval
3. Design with these sections:

**Section 1: Request Details** (same as default)

**Section 2: Balance Information** (same as default)

**Section 3: Team Impact**
- Overlapping Vacations HTML

**Section 4: IT Operations**
- IT Changes HTML

---

## Step 5: Create Script Includes (APIs)

### Balance API

1. Create **Script Include**
2. Configure:
   - **Name:** BalanceAPI
   - **Client Callable:** Yes
   - **API Name:** x_1782593_it_vac_0.BalanceAPI

3. Code:

```javascript
var BalanceAPI = Class.create();
BalanceAPI.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    
    getBalance: function() {
        var userID = gs.getUserID();
        
        // Mock data - replace with actual HR API call
        var balance = {
            days: 15,
            hours: 120
        };
        
        // TODO: Call actual HR API
        // var r = new sn_ws.RESTMessageV2('HRBalanceAPI', 'GET');
        // r.setStringParameterNoEscape('employeeId', userID);
        // var response = r.execute();
        // var body = response.getBody();
        // balance = JSON.parse(body);
        
        return JSON.stringify(balance);
    },
    
    type: 'BalanceAPI'
});
```

### Overlap API

1. Create **Script Include**
2. Configure:
   - **Name:** OverlapAPI
   - **Client Callable:** Yes

3. Code:

```javascript
var OverlapAPI = Class.create();
OverlapAPI.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    
    getTeamCalendar: function() {
        var results = [];
        
        // Query approved/pending vacations
        var gr = new GlideRecord('x_1782593_it_vac_0_vacation_requests');
        gr.addQuery('status', 'IN', 'Pending,Approved');
        gr.addQuery('start_date', '>=', gs.daysAgo(30));
        gr.orderBy('start_date');
        gr.setLimit(50);
        gr.query();
        
        while (gr.next()) {
            results.push({
                employee: gr.employee_name.toString(),
                start_date: gr.start_date.toString(),
                end_date: gr.end_date.toString(),
                status: gr.status.toString()
            });
        }
        
        return JSON.stringify(results);
    },
    
    type: 'OverlapAPI'
});
```

---

## Step 6: Create Client Scripts

### onLoad Script

1. Create **Client Script**
2. Configure:
   - **Table:** x_1782593_it_vac_0_vacation_requests
   - **Type:** onLoad
   - **UI Type:** Desktop

3. Script:

```javascript
function onLoad() {
    // Auto-populate employee info
    if (g_form.isNewRecord()) {
        var userID = g_user.userID;
        var userName = g_user.firstName + ' ' + g_user.lastName;
        
        g_form.setValue('employee', userID);
        g_form.setValue('employee_name', userName);
        
        // Fetch balance
        var ga = new GlideAjax('x_1782593_it_vac_0.BalanceAPI');
        ga.addParam('sysparm_name', 'getBalance');
        ga.getXMLAnswer(function(answer) {
            try {
                var data = JSON.parse(answer);
                g_form.setValue('remaining_hours', data.hours);
                g_form.setValue('remaining_days', data.days);
            } catch(e) {
                console.error('Error fetching balance:', e);
            }
        });
    }
}
```

### onSubmit Script

1. Create **Client Script**
2. Configure:
   - **Type:** onSubmit

3. Script:

```javascript
function onSubmit() {
    // Validate hours requested vs balance
    var hoursRequested = g_form.getValue('hours_requested');
    var remainingHours = g_form.getValue('remaining_hours');
    
    if (parseFloat(hoursRequested) > parseFloat(remainingHours)) {
        alert('You have requested more hours than your available balance.');
        return false;
    }
    
    return true;
}
```

---

## Step 7: Create UI Actions (Buttons)

### Approve Button

1. Create **UI Action**
2. Configure:
   - **Table:** x_1782593_it_vac_0_vacation_requests
   - **Action name:** approve
   - **Show insert:** false
   - **Show update:** true
   - **Condition:** current.status == 'Pending'

3. Script:

```javascript
(function() {
    current.status = 'Approved';
    current.update();
    
    // TODO: Send notification, sync calendar
    gs.addInfoMessage('Vacation request approved');
    
    action.setRedirectURL(current);
})();
```

### Decline Button

1. Create **UI Action**
2. Configure:
   - **Action name:** decline
   - **Condition:** current.status == 'Pending'

3. Script:

```javascript
(function() {
    var reason = prompt('Please provide a reason for declining this request:');
    
    if (reason) {
        current.status = 'Declined';
        current.decline_reason = reason;
        current.update();
        
        gs.addInfoMessage('Vacation request declined');
    }
    
    action.setRedirectURL(current);
})();
```

---

## Step 8: Add Test Data

1. Navigate to **x_1782593_it_vac_0_vacation_requests** table
2. Click **New** to create test records:

**Record 1:**
- Employee: Grace Mercieca
- Start Date: 2025-11-20
- End Date: 2025-11-25
- Hours Requested: 40
- Notes: Family vacation
- Status: Approved

**Record 2:**
- Employee: John Doe
- Start Date: 2025-12-01
- End Date: 2025-12-05
- Hours Requested: 40
- Notes: Holiday break
- Status: Pending

**Record 3:**
- Employee: Alice Smith
- Start Date: 2025-12-10
- End Date: 2025-12-12
- Hours Requested: 24
- Notes: Personal time
- Status: Approved

**Record 4:**
- Employee: Bob Johnson
- Start Date: 2025-12-15
- End Date: 2025-12-20
- Hours Requested: 48
- Notes: Year-end vacation
- Status: Declined
- Decline Reason: Conflicts with team schedule

---

## Step 9: Test the Application

1. **As an Employee:**
   - Navigate to: `https://your-instance.service-now.com/x_1782593_it_vac_0_employee_dashboard.do`
   - Click "Submit New Request"
   - Fill out the form and submit
   - Verify balance is displayed

2. **As a Manager:**
   - Navigate to: `https://your-instance.service-now.com/x_1782593_it_vac_0_manager_dashboard.do`
   - View pending requests
   - Open a request and use Approve/Decline buttons

3. **Verify Source Control:**
   - After creating components, check the `f521bf413b55b65080b770e0c5e45ae0/update/` folder
   - New files should appear automatically via git sync

---

## Step 10: Configure Roles & Access

### Create Roles

1. **Employee Role:**
   - Navigate to **User Administration > Roles**
   - Create new role: `x_1782593_it_vac_0.employee`
   - Description: "Submit and view own vacation requests"

2. **Manager Role:**
   - Create role: `x_1782593_it_vac_0.manager`
   - Description: "Approve/decline team vacation requests"

### Assign ACLs

Create ACL rules in Studio for the vacation_requests table:
- **Read:** Employees can read own records, managers can read all
- **Write:** Employees can write own pending records, managers can write all
- **Create:** All employees can create
- **Delete:** Managers only

---

## Tips

1. **Work in Studio:** Always make changes via Studio, not by editing XML files
2. **Save Regularly:** Studio auto-saves, but click Save to ensure commits
3. **Test Incrementally:** Test each component as you create it
4. **Check Source Control:** Verify changes sync to git automatically
5. **Use the HumberRiverVacationApp folder as reference:** The detailed examples are there

---

## Next Steps

After completing this guide:
1. Add workflow/approval routing
2. Configure email notifications
3. Integrate with actual HR/Calendar APIs
4. Add reporting dashboards
5. Configure mobile responsive policies

---

## Need Help?

- ServiceNow Documentation: https://docs.servicenow.com
- Community: https://community.servicenow.com
- Developer Portal: https://developer.servicenow.com

