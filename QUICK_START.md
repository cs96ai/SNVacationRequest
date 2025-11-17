# Quick Start - ServiceNow IT Vacation Request

## Current State

You have two folders in this repo:

1. **`HumberRiverVacationApp/`** - Reference templates and examples
2. **`f521bf413b55b65080b770e0c5e45ae0/`** - Your actual ServiceNow app (connected to your instance)

## What To Do Next

### Option A: Work in ServiceNow Studio (RECOMMENDED)

**This is the proper way to build ServiceNow apps:**

1. Open your ServiceNow instance in a browser
2. Go to **Studio** (System Applications > Studio)
3. Open the **IT Vacation Request** application
4. Follow the **SERVICENOW_COMPONENT_GUIDE.md** to add:
   - Tables and fields
   - UI Pages (dashboards)
   - Forms
   - Client scripts
   - Script includes
   - UI actions
   - Test data

5. As you work, Studio will automatically:
   - Create XML files in `f521bf413b55b65080b770e0c5e45ae0/update/`
   - Commit to source control
   - Update the checksum

### Option B: Import the Reference App

If you want to use the `HumberRiverVacationApp` structure:

1. This folder uses scope `x_hrh_it_vacreq` (different from your current scope `x_1782593_it_vac_0`)
2. You can either:
   - Create a NEW app in ServiceNow and import it
   - Use it as documentation for building components in your existing app

## Current App Details

**Your Active App:**
- Scope: `x_1782593_it_vac_0`
- Sys ID: `f521bf413b55b65080b770e0c5e45ae0`
- Name: IT Vacation Request
- Version: 1.0.0
- Created: 2025-11-17

**Existing Components:**
- Default admin role
- Default user role
- Application definition
- Logo image (TimeOff.jpg)

## What We Built (in HumberRiverVacationApp)

This folder contains examples you can recreate in Studio:
- ✅ Employee dashboard UI page
- ✅ Manager dashboard UI page
- ✅ Sample test data (4 vacation requests)
- ✅ Forms (default and approval views)
- ✅ Complete documentation

## How Source Control Works

```
ServiceNow Studio
      ↓
  (you make changes)
      ↓
  Studio saves
      ↓
  Auto-commits to git
      ↓
  Updates f521bf413b55b65080b770e0c5e45ae0/update/
      ↓
  Updates checksum.txt
```

**⚠️ DO NOT manually edit files in `f521bf413b55b65080b770e0c5e45ae0/`**
- This will break the checksum
- ServiceNow will reject the import
- Always work in Studio

## Summary

✅ **Your repo structure is correct** for a ServiceNow app with source control

✅ **The `f521bf413b55b65080b770e0c5e45ae0` folder is your live app**

✅ **Use Studio to add components** - follow SERVICENOW_COMPONENT_GUIDE.md

✅ **The `HumberRiverVacationApp` folder is reference material**

## Questions?

- See **SERVICENOW_COMPONENT_GUIDE.md** for step-by-step instructions
- See **DEPLOYMENT_GUIDE.md** for API configuration details
- ServiceNow docs: https://developer.servicenow.com

