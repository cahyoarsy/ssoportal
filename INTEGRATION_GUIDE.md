# Portal SSO Sangsongko Engineering - Integration Guide

## 🚀 **Sistem Terintegrasi**

Portal SSO Sangsongko Engineering sekarang telah terintegrasi dengan berbagai modul HTML yang sudah ada, memberikan pengalaman pembelajaran yang seamless dan terpadu.

## 📋 **Konfigurasi Port**

### **Port Utama dan Backup:**
- **Primary Port**: `5174` - `npm run dev` atau `npm run dev:5174`
- **Backup Port**: `3000` - `npm run dev:backup` atau `npm run dev:3000`  
- **Alternative Port**: `8080` - `npm run dev:alt` atau `npm run dev:8080`

### **Akses Portal:**
- **Primary**: http://localhost:5174/
- **Backup**: http://localhost:3000/
- **Alternative**: http://localhost:8080/

## 🔗 **Integrasi HTML**

### **1. Admin Center**
- **Path**: `/integrations/elearning-iml/index.html`
- **Fitur**: Pembelajaran terintegrasi dengan SSO
- **Akses**: Via dashboard modul atau direct URL
- **Status**: ✅ Terintegrasi dengan SSO token

### **2. Monitoring Guru**
- **Path**: `/integrations/monitoring/index.html`
- **Fitur**: Monitoring aktivitas pembelajaran lanjutan
- **Akses**: Via dashboard atau direct URL
- **Status**: ✅ Terintegrasi dengan SSO context

### **3. System Monitoring (Internal)**
- **Path**: Internal React component
- **Fitur**: Real-time monitoring siswa dan sistem
- **Akses**: Via dashboard modul "System Monitoring"
- **Status**: ✅ Fully integrated

### **4. Portal Test**
- **Path**: `/test-portal.html`
- **Fitur**: Testing dan diagnostik sistem
- **Akses**: Via dashboard atau direct URL
- **Status**: ✅ Available

## 🛠 **Konfigurasi Environment**

File `.env.development` telah dikonfigurasi dengan:

```bash
# Port configurations
VITE_PRIMARY_PORT=5174
VITE_BACKUP_PORT=3000
VITE_ALT_PORT=8080

# Integration paths
VITE_ELEARNING_PATH=/integrations/elearning-iml/
VITE_MONITORING_PATH=/integrations/monitoring/
VITE_TEST_PORTAL_PATH=/test-portal.html

# Application Settings
VITE_APP_NAME=Portal SSO Sangsongko Engineering
VITE_APP_DESCRIPTION=Platform Terpadu Pembelajaran & Penelitian Teknik Kelistrikan
VITE_COMPANY_NAME=Sangsongko Engineering
```

## 📱 **Dashboard Modules**

Dashboard kini menampilkan modul-modul berikut:

### **Internal Modules (React Components):**
1. **E-Learning Dasar** - Pembelajaran dasar TITL SMK
2. **Instalasi Motor Listrik (IML)** - Motor 3 fasa
3. **System Monitoring** - Monitoring real-time (internal)
4. **Assessment Center** - Pusat penilaian



## 🔐 **SSO Integration**

Semua external HTML files menerima SSO context melalui:
- **SSO Token**: User information passed via URL parameter
- **Timestamp**: Session validation
- **Auto-redirect**: Back to portal after logout

### **URL Pattern:**
```
/integrations/module/?sso_token={user_data}&timestamp={current_time}
```

## 🎯 **Fitur Utama**

### **Multi-Port Support:**
- Automatic port conflict resolution
- Multiple development servers
- Backup port availability

### **Seamless Integration:**
- External HTML files integrated into portal
- SSO context preservation
- Unified navigation experience

### **Modern UI/UX:**
- Framer Motion animations
- Responsive design
- Dark theme support
- Professional styling

## 📊 **Monitoring Features**

### **Real-time Monitoring:**
- Student activity tracking
- Progress monitoring
- System status indicators
- Connection status management

### **External Monitoring:**
- Advanced teacher dashboard
- Detailed analytics
- Comprehensive reporting

## 🚀 **Usage Instructions**

### **Starting Development:**
```bash
# Primary port (recommended)
npm run dev

# Backup port (if 5174 is busy)
npm run dev:backup

# Alternative port  
npm run dev:alt
```

### **Accessing Integrated Modules:**
1. Login to Portal SSO
2. Navigate to Dashboard
3. Click desired module
4. External modules open in new tab with SSO context
5. Internal modules navigate within portal

### **Direct Access to HTML Files:**
- http://localhost:5174/integrations/elearning-iml/index.html
- http://localhost:5174/integrations/monitoring/index.html  
- http://localhost:5174/test-portal.html

## ✅ **Testing Checklist**

- [x] Primary port (5174) working
- [x] Backup port (3000) working  
- [x] Alternative port (8080) working
- [x] Dashboard module integration
- [x] External HTML file access
- [x] SSO token passing
- [x] Navigation between modules
- [x] Responsive design
- [x] Real-time monitoring
- [x] Authentication flow

## 🔧 **Troubleshooting**

### **Port Issues:**
```bash
# Check port usage
npm run port:who

# Free specific ports
npm run port:free        # Port 5174
npm run port:free:3000   # Port 3000  
npm run port:free:8080   # Port 8080
```

### **Integration Issues:**
1. Verify file paths in `/public/integrations/`
2. Check SSO token format in URL
3. Ensure external files load correctly
4. Validate dashboard module configuration

## 📝 **Next Steps**

1. **Content Enhancement**: Add more learning modules
2. **Analytics Integration**: Detailed reporting system
3. **Mobile App**: Native mobile integration
4. **Advanced SSO**: Multi-provider authentication
5. **API Integration**: Backend service integration

---

**Portal SSO Sangsongko Engineering** - Platform Terpadu Pembelajaran & Penelitian Teknik Kelistrikan