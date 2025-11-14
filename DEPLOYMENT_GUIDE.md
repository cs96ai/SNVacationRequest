# Humber River IT Vacation Requests - Deployment Guide

## Overview
Complete ServiceNow scoped application for IT department vacation request management at Humber River Health.

**GitHub Repository:** https://github.com/cs96ai/SNVacationRequest/

**Scope:** `x_hrh_it_vacreq`

---

## What's Included

### Core Application Structure
- **Scope Definition** (`sys_app/`)
  - Application: Humber River IT Vacation Requests
  - Trackable and unloadable enabled

### Security & Roles (`sys_user_role/`)
- `x_hrh_it_vacreq_employee` - Submit and view own requests
- `x_hrh_it_vacreq_manager` - Approve/decline requests
- `x_hrh_it_vacreq_hr_records` - Read-only access for reporting

### Data Model (`sys_db_object/`, `sys_dictionary/`)
- **Main Table:** `x_hrh_it_vacreq_vacation_requests` (extends task)
  - Fields: employee, employee_name, start_date, end_date, hours_requested, notes, status, decline_reason, remaining_hours, remaining_days
  - HTML fields: overlapping_vacations_html, it_changes_html
- **History Table:** `x_hrh_it_vacreq_vacation_history`
  - Audit trail for status changes

### Choice Lists (`sys_choice/`)
- Status: Pending, Approved, Declined

### Forms & UI (`sys_ui_form/`)
- **Default view** - Employee submission form
- **Approval view** - Manager approval form with overlaps and IT changes snapshots

### Client Scripts (`sys_script_client/`)
- **onLoad** - Auto-populate employee info and fetch HR balance
- **onSubmit** - Validate hours against balance (weekends excluded)
- **Approval onLoad** - Fetch and display overlapping vacations and IT changes

### Script Includes (`sys_script_include/`)
- `x_hrh_it_vacreq_HRBalanceAPI` - Fetch vacation balance from HR API
- `x_hrh_it_vacreq_OverlapAPI` - Fetch overlapping vacation requests
- `x_hrh_it_vacreq_ITChangesAPI` - Fetch scheduled IT changes
- `x_hrh_it_vacreq_CalendarSync` - Sync approved requests to Outlook/calendar
- `x_hrh_it_vacreq_ApprovalActions` - Handle decline actions via GlideAjax

### Business Rules (`sys_script/`)
- **Submit BR** - Set status to pending on insert
- **Audit BR** - Log changes to history table

### UI Actions (`sys_ui_action/`)
- **Approve** - Server-side approval with calendar sync and notifications
- **Decline** - Client-side prompt for reason, server-side update

### UI Policies (`sys_ui_policy/`)
- Show/hide decline_reason based on status
- Mobile-responsive field optimization

### Workflow & Flow (`wf_workflow/`, `sys_hub_flow/`)
- **Classic Workflow** - Approval routing with timers
- **Flow Designer** - Alternative flow with reminders and escalations
  - Route to employee's manager or default to Grace/Othman
  - 3-day reminder
  - 7-day escalation

### Notifications (`sysevent_email_action/`)
- `x_hrh_it_vacreq.vacation.approved` - Employee notification
- `x_hrh_it_vacreq.vacation.approved.hr` - Diana Moretti notification
- `x_hrh_it_vacreq.vacation.declined` - Employee notification with reason
- `x_hrh_it_vacreq.vacation.reminder` - 3-day reminder to manager
- `x_hrh_it_vacreq.vacation.escalation` - 7-day escalation

### REST Messages (`sys_rest_message/`)
- `x_hrh_it_vacreq.HRBalance` - https://api.humberriver.ca/hr/v1/employees/{employeeId}/leave/vacation/balance
- `x_hrh_it_vacreq.Overlaps` - https://api.humberriver.ca/hr/v1/leave/vacation/overlaps
- `x_hrh_it_vacreq.ITChanges` - https://api.humberriver.ca/it/v1/changes/scheduled
- `x_hrh_it_vacreq.CalendarSync` - https://graph.microsoft.com/v1.0/users/{userPrincipalName}/calendar/events

### Access Control (`sys_security_acl/`)
- **Read** - Employees see own, managers/HR see all
- **Write** - Employees edit own pending, managers edit any
- **Create** - Any employee can create
- **Delete** - Managers only

### Reporting (`sys_report/`, `sys_ui_page/`)
- Vacation usage summary report
- Employee dashboard for request history

### Sample Data (`data/`)
- Manager role assignments (Grace Mercieca, Othman Khan)
- Sample vacation request

---

## Deployment Steps

### 1. Link Repository to ServiceNow
1. Navigate to **Studio** in your ServiceNow instance
2. Click **Import from Source Control**
3. Enter repository URL: `https://github.com/cs96ai/SNVacationRequest/`
4. Set branch: `main`
5. Application path: `HumberRiverVacationApp/`
6. Click **Import**

### 2. Configure REST Messages
For each REST message, configure authentication:

**HR Balance, Overlaps, IT Changes:**
- Navigate to **System Web Services > Outbound > REST Message**
- Open each message (x_hrh_it_vacreq.HRBalance, etc.)
- Configure authentication (Basic Auth, OAuth, or API Key)
- Test endpoints

**Calendar Sync (Microsoft Graph):**
- Set up OAuth 2.0 profile
- Register app in Azure AD
- Configure permissions: Calendars.ReadWrite
- Add OAuth profile to REST message

### 3. Assign Roles
1. Navigate to **User Administration > Users**
2. Find Grace Mercieca (gmercieca@hrh.ca) and Othman Khan (okhan@hrh.ca)
3. Add role: `x_hrh_it_vacreq_manager`
4. Assign `x_hrh_it_vacreq_employee` to all IT staff
5. Assign `x_hrh_it_vacreq_hr_records` to Diana Moretti (dmoretti@hrh.ca)

### 4. Activate Workflow/Flow
Choose one:
- **Classic Workflow:** Navigate to **Workflow > Workflow Editor**, open "IT Vacation Request Approval", publish
- **Flow Designer:** Navigate to **Flow Designer**, open "IT Vacation Request Approval Flow", activate

### 5. Test the Application
1. As an employee, create a vacation request
2. Verify HR balance is fetched
3. As a manager, open the approval view
4. Verify overlaps and IT changes are displayed
5. Approve or decline the request
6. Verify notifications are sent
7. Check calendar sync (if configured)

### 6. Configure Scheduled Jobs (Optional)
For reminder/escalation timers:
- Navigate to **System Scheduler > Scheduled Jobs**
- Create jobs to trigger workflow timers if not using Flow Designer

---

## API Configuration Notes

### HR Balance API
**Endpoint:** `GET https://api.humberriver.ca/hr/v1/employees/{employeeId}/leave/vacation/balance`

**Expected Response:**
```json
{
  "employeeId": "E123456",
  "fullName": "John Doe",
  "department": "IT",
  "remainingHours": 120.0,
  "remainingDays": 15.0,
  "accrualRate": 8.0,
  "lastUpdated": "2025-11-14T15:00:00Z"
}
```

### Overlaps API
**Endpoint:** `GET https://api.humberriver.ca/hr/v1/leave/vacation/overlaps?department=IT&startDate={start}&endDate={end}`

**Expected Response:**
```json
{
  "periodStart": "2025-11-01",
  "periodEnd": "2025-12-15",
  "overlappingRequests": [
    {
      "employeeId": "E789012",
      "fullName": "John Smith",
      "startDate": "2025-11-20",
      "endDate": "2025-11-25",
      "status": "Approved"
    }
  ],
  "totalOverlaps": 2,
  "lastUpdated": "2025-11-14T15:00:00Z"
}
```

### IT Changes API
**Endpoint:** `GET https://api.humberriver.ca/it/v1/changes/scheduled?startDate={start}&endDate={end}`

**Expected Response:**
```json
{
  "periodStart": "2025-11-15",
  "periodEnd": "2025-11-30",
  "scheduledChanges": [
    {
      "changeId": "CHG00123",
      "description": "Network Upgrade - Data Center Maintenance",
      "impact": "High",
      "startTime": "2025-11-22T02:00:00Z",
      "endTime": "2025-11-22T06:00:00Z",
      "affectedServices": ["Email", "Intranet"]
    }
  ],
  "totalChanges": 2,
  "lastUpdated": "2025-11-14T15:00:00Z"
}
```

---

## Customization Tips

### Add Holidays
Update the onSubmit client script to exclude company holidays when calculating hours_requested.

### Change Approval Routing
Modify the workflow/flow to add additional approval levels or parallel approvals.

### Customize Email Templates
Navigate to **System Notification > Email > Notifications** and edit templates.

### Add Fields
Use Studio to add custom fields to the vacation_requests table and update forms accordingly.

### Reporting Enhancements
Create additional reports using **Reports > Create New** for department-level analytics.

---

## Support & Maintenance

### Logs
- Check **System Logs > System Log > All** for REST API errors
- Review **System Logs > Script Log Statements** for gs.error() messages

### Troubleshooting
- **Balance not loading:** Check REST message authentication and endpoint availability
- **Overlaps/changes not displaying:** Verify API responses match expected JSON structure
- **Notifications not sending:** Check notification records are active and recipients are valid
- **Workflow not triggering:** Verify workflow is published and condition matches

### Key Contacts
- **IT Managers:** Grace Mercieca (gmercieca@hrh.ca), Othman Khan (okhan@hrh.ca)
- **HR Records:** Diana Moretti (dmoretti@hrh.ca)

---

## File Structure Summary
```
HumberRiverVacationApp/
├── sys_app/                      # Application definition
├── sys_user_role/                # Role definitions
├── sys_db_object/                # Table definitions
├── sys_dictionary/               # Field definitions
├── sys_choice/                   # Choice list values
├── sys_ui_form/                  # Form layouts
├── sys_ui_policy/                # UI policies
├── sys_ui_action/                # UI actions (buttons)
├── sys_script/                   # Business rules
├── sys_script_client/            # Client scripts
├── sys_script_include/           # Script includes
├── sys_rest_message/             # REST message definitions
├── sys_security_acl/             # Access control rules
├── sys_email_template/           # Email templates (legacy)
├── sysevent_email_action/        # Notification definitions
├── wf_workflow/                  # Classic workflow
├── sys_hub_flow/                 # Flow Designer flow
├── sys_ui_page/                  # UI pages/dashboards
├── sys_report/                   # Reports
└── data/                         # Sample/seed data
```

---

## Version History
- **v1.0** (2025-11-14) - Initial release with full feature set

---

**Ready for deployment to ServiceNow!**
