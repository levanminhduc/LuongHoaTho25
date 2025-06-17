# 📁 Test Files & Development Archives

This directory contains all test files, temporary development files, and archived documentation that were created during the development process of the LuongHoaTho25 payroll management system.

## 📂 Directory Structure

### 🔧 `backend-test-files/`
Contains all backend testing and development scripts:
- **Database test scripts**: `check-database.js`, `check-tables.js`, `check-payroll-data.js`
- **Data seeding scripts**: `add-test-data.js`, `seed-simple.js`, `quick-add-data.js`
- **API testing scripts**: `test-api-direct.js`, `test-payroll-sign.js`, `test-startup.js`
- **SSE testing**: `direct-sse-test.js`, `test-sign-and-watch.js`
- **Database fixes**: `fix-nhan-vien-table.js`, `add-ma-nv-column.js`, `reset-nv001.js`
- **Development utilities**: `simple-test.js`, `start-with-logs.js`, `app.js`

### 🎨 `frontend-test-files/`
Contains all frontend testing and demo HTML files:
- **API testing pages**: `api-test.html`, `test-api.html`
- **Demo pages**: `demo.html`, `frontend-demo.html`, `index.html`
- **Feature testing**: `test-simple.html`, `test-sse.html`

### 📊 `sample-data/`
Contains sample data files and database scripts:
- **CSV test data**: `test-import-sample.csv`, `test-payroll-data.csv`, `test-salary-data.csv`
- **JSON test data**: `test-data.json`
- **Database scripts**: `create-test-data.sql`, `fix-database.sql`, `fix-database-now.sql`

### 🚀 `scripts/`
Contains all batch files and startup scripts:
- **System startup**: `start-all-systems.bat`, `start-nestjs.ps1`, `start.sh`
- **Backend scripts**: `start-backend.bat`, `start-nestjs-backend.bat`, `start-nestjs-only.bat`
- **Frontend scripts**: `start-frontend.bat`
- **Testing scripts**: `test-both-backends.bat`, `test-new-system.bat`
- **Utility scripts**: `fix-connection-issue.bat`, `stop-all.bat`

### 📚 `documentation-files/`
Contains archived documentation and development notes:
- **Migration docs**: `NEXTJS-NESTJS-MIGRATION.md`, `NEXTJS-FRONTEND-MIGRATION.md`
- **Fix documentation**: `COMPREHENSIVE_FIX_SOLUTION.md`, `URGENT-FIX-LOGIN-ERROR.md`
- **Setup guides**: `CORRECT-SETUP-NEXTJS-NESTJS.md`, `STARTUP-GUIDE.md`
- **System documentation**: `SYSTEM_SUMMARY.md`, `TEST-REPORT.md`
- **Development notes**: `BACKENDS-COMPARISON.md`, `HYDRATION_FIX_DOCUMENTATION.md`

## 🎯 Purpose

These files were moved here to:
1. **Clean up the main project directory** - Keep only essential production files in the root
2. **Preserve development history** - Maintain all test files and documentation for reference
3. **Organize by category** - Group similar files together for easy access
4. **Maintain project structure** - Keep the main codebase clean and professional

## ⚠️ Important Notes

- **Do not delete these files** - They contain valuable development history and test cases
- **Reference for debugging** - These files can be useful for troubleshooting issues
- **Development examples** - New developers can learn from these test implementations
- **Backup documentation** - Contains multiple versions of setup and fix procedures

## 🔄 Usage

If you need to:
- **Run old tests**: Navigate to the appropriate subdirectory
- **Reference old documentation**: Check the `documentation-files/` folder
- **Use sample data**: Files in `sample-data/` can be used for testing
- **Run development scripts**: Scripts in `scripts/` folder are still functional

## 📝 Maintenance

This directory should be:
- **Kept for reference** but not actively developed
- **Excluded from production builds** (already in .gitignore)
- **Periodically reviewed** for files that can be safely removed
- **Used as a learning resource** for new team members

---

**Created**: June 2025  
**Purpose**: Development archive and test file organization  
**Status**: Archived - Reference only
