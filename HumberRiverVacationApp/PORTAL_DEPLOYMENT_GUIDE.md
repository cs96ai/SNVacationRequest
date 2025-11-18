# Service Portal Deployment Guide - IT Vacation Request

## Overview
This guide shows you how to deploy the modern, role-based Service Portal pages for the IT Vacation Request application with:
- 🏖️ **Employee Portal** - Tropical themed vacation request interface
- 👔 **Manager Portal** - Professional dashboard for approvals

## What's Included

### Portal Pages
1. **Employee Home** (`employee_vacation_home`)
   - Tropical theme with palm trees and beach vibes
   - View vacation balance
   - Submit new requests
   - Track request status
   - Role: `x_hrh_it_vacreq_employee`

2. **Manager Home** (`manager_vacation_home`)
   - Modern professional dashboard
   - Statistics overview
   - Pending approval queue
   - Team calendar view
   - Quick approve/decline actions
   - Role: `x_hrh_it_vacreq_manager`

### Widgets
1. **Employee Dashboard Widget** - Handles employee vacation view and actions
2. **Manager Dashboard Widget** - Manages approval workflow and team oversight

### Security
- Employee portal: Only accessible to users with `x_hrh_it_vacreq_employee` role
- Manager portal: Only accessible to users with `x_hrh_it_vacreq_manager` role
- Enforced at page, widget, and data levels

## Deployment Steps

### Step 1: Import Portal Components via Studio

1. **Log into ServiceNow Studio**
   - Navigate to **Studio** > Open your IT Vacation Request app

2. **Import Portal Files**
   Since ServiceNow Studio with source control should auto-sync, the files will appear in:
   - `sys_portal/` - Portal definition
   - `sys_portal_page/` - Page layouts and CSS
   - `sys_portal_widget/` - Widget code and logic

3. **If files don't auto-sync**, manually create them:

#### Create Employee Portal Page
```
Create Application File > Service Portal > Page
- Name: employee_vacation_home
- Title: My Vacation Requests
- ID: employee_vacation_home
- Roles: x_hrh_it_vacreq_employee
```
Copy CSS from `sys_portal_page/x_hrh_it_vacreq_employee_home.xml`

#### Create Manager Portal Page
```
Create Application File > Service Portal > Page
- Name: manager_vacation_home
- Title: Manager - Vacation Approvals
- ID: manager_vacation_home
- Roles: x_hrh_it_vacreq_manager
```
Copy CSS from `sys_portal_page/x_hrh_it_vacreq_manager_home.xml`

#### Create Employee Widget
```
Create Application File > Service Portal > Widget
- Name: employee_vacation_dashboard
- ID: employee_vacation_dashboard
- Roles: x_hrh_it_vacreq_employee
```
Copy template, script, and server script from widget XML

#### Create Manager Widget
```
Create Application File > Service Portal > Widget
- Name: manager_vacation_dashboard
- ID: manager_vacation_dashboard
- Roles: x_hrh_it_vacreq_manager
```
Copy template, script, and server script from widget XML

### Step 2: Add Widgets to Pages

1. **Employee Page:**
   - Edit `employee_vacation_home` page
   - Drag the `employee_vacation_dashboard` widget onto the page
   - Save

2. **Manager Page:**
   - Edit `manager_vacation_home` page
   - Drag the `manager_vacation_dashboard` widget onto the page
   - Save

### Step 3: Configure Navigation

#### Create Portal Menu Module

1. Navigate to **System Definition > Application Menus**
2. Create new module:
   - **Title:** My Vacations
   - **Application:** IT Vacation Request
   - **Link:** `/sp?id=employee_vacation_home`
   - **Roles:** x_hrh_it_vacreq_employee
   - **Order:** 100

3. Create manager module:
   - **Title:** Vacation Approvals
   - **Application:** IT Vacation Request
   - **Link:** `/sp?id=manager_vacation_home`
   - **Roles:** x_hrh_it_vacreq_manager
   - **Order:** 200

### Step 4: Test Role-Based Access

#### As an Employee:
1. Log in with employee role
2. Navigate to: `https://your-instance.service-now.com/sp?id=employee_vacation_home`
3. Should see:
   - ✅ Tropical themed interface with palm trees
   - ✅ Vacation balance card
   - ✅ Request button
   - ✅ Personal requests grid
   - ❌ Should NOT be able to access manager dashboard

#### As a Manager:
1. Log in with manager role
2. Navigate to: `https://your-instance.service-now.com/sp?id=manager_vacation_home`
3. Should see:
   - ✅ Professional dashboard with stats
   - ✅ Pending approval cards
   - ✅ Approve/Decline buttons
   - ✅ Team calendar view

### Step 5: Customize (Optional)

#### Change Employee Theme Colors
Edit `employee_vacation_home` page CSS:
```css
/* Main gradient background */
.vacation-portal {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Header gradient */
.tropical-header {
  background: linear-gradient(to right, #f093fb 0%, #f5576c 100%);
}

/* Balance card gradient */
.balance-card {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}
```

#### Change Manager Theme
Edit `manager_vacation_home` page CSS:
```css
/* Header colors */
.manager-header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}
```

#### Add Different Emojis
Replace emojis in widget templates:
- 🌴 Palm tree
- 🏖️ Beach
- 🌺 Flower
- 🗓️ Calendar
- ⏱️ Timer
- 📋 Clipboard
- 👔 Manager
- ✓ Approve
- ✗ Decline

### Step 6: Configure Mobile Responsiveness

Both portals are designed to be mobile-responsive. Test on:
- Desktop (1920x1080)
- Tablet (768px)
- Mobile (375px)

The grid layouts will automatically adjust.

## URLs

Once deployed, users can access:

**Employee Portal:**
```
https://your-instance.service-now.com/sp?id=employee_vacation_home
```

**Manager Portal:**
```
https://your-instance.service-now.com/sp?id=manager_vacation_home
```

## Features Breakdown

### Employee Portal Features
- 🏖️ **Tropical Theme** - Beach/vacation vibes with gradients
- 📊 **Balance Display** - Days and hours remaining
- ➕ **Quick Request** - One-click to new form
- 📋 **Request Cards** - Grid layout with status badges
- 🔍 **Request Details** - View notes and decline reasons
- 📱 **Mobile Optimized** - Responsive grid system

### Manager Portal Features
- 📈 **Statistics Dashboard** - Pending, approved, declined counts
- 👥 **Team Overview** - Total team members
- ⏰ **Approval Queue** - Pending requests with full details
- 👤 **Employee Cards** - Avatar, name, email
- ⚠️ **Conflict Warnings** - Team overlaps and IT changes
- ✅ **Quick Actions** - One-click approve/decline
- 📅 **Team Calendar** - Upcoming vacations timeline
- 🔒 **Secure** - Manager role required

## Troubleshooting

### Portal page shows "Access Denied"
- Check user has the correct role assigned
- Verify role is set on the page definition
- Clear browser cache

### Widget not loading
- Check widget is added to page in Page Designer
- Verify server script has no syntax errors
- Check browser console for JavaScript errors

### Data not showing
- Verify table name matches: `x_hrh_it_vacreq_vacation_requests`
- Check ACL rules allow read access
- Test query in Scripts - Background

### Styling issues
- Clear ServiceNow cache: `cache.do`
- Check CSS is properly escaped in XML (no unescaped `<` or `>`)
- Verify gradient syntax is supported

## Advanced Customization

### Add Calendar Integration
In employee widget, add calendar picker for date selection:
```javascript
// Add to widget dependencies
c.data.calendarOptions = {
  minDate: new Date(),
  excludeWeekends: true
};
```

### Add Email Notifications
In manager widget approve/decline functions:
```javascript
// In server script after status update
gs.eventQueue('x_hrh_it_vacreq.vacation.approved', gr, gr.employee, gs.getUserID());
```

### Add Analytics
Track portal usage:
```javascript
// Add to widget onLoad
gs.log('Employee portal accessed by: ' + gs.getUserID());
```

## Performance Tips

1. **Limit query results** - Use `setLimit()` on GlideRecord queries
2. **Cache balance data** - Store in user preferences
3. **Lazy load images** - If adding employee photos
4. **Optimize CSS** - Remove unused styles
5. **Enable CDN** - For faster asset loading

## Next Steps

After deployment:
1. ✅ Gather user feedback on design
2. ✅ Add more test data
3. ✅ Configure email notifications
4. ✅ Set up reporting dashboards
5. ✅ Add mobile app shortcuts
6. ✅ Integrate calendar sync
7. ✅ Add bulk approval features (manager)
8. ✅ Implement vacation policy rules

## Support

- ServiceNow Community: https://community.servicenow.com
- Service Portal Docs: https://docs.servicenow.com/portal
- Widget Development: https://developer.servicenow.com/dev.do#!/learn/courses/quebec/app_store_learnv2_serviceportal_quebec_service_portal

---

**Enjoy your modern, tropical-themed vacation portal! 🏖️**

