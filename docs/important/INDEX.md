# Documentation Index - Website Builder Dashboard

## 📚 Complete Documentation Map

This is the **master index** for all system documentation. Use this to quickly find what you need.

**Last Updated:** 2025-10-26

---

## 🎯 START HERE

### **New to the Project?**
1. Read: `liveEditor/README.md` - System overview
2. Read: `liveEditor/QUICK_START.md` - Get started quickly
3. Study: `components/README.md` - Component system
4. Review: `.cursorrules` - Project conventions

### **Working on Components?**
→ Jump to [Components Documentation](#-components-documentation)

### **Working on Live Editor?**
→ Jump to [Live Editor Documentation](#-live-editor-documentation)

### **Working on Dashboard?**
→ Jump to [Dashboard Documentation](#-dashboard-documentation)

---

## 📂 DOCUMENTATION STRUCTURE

```
docs/important/
├── 📁 components/          ← Component system (CREATE & FIX)
├── 📁 liveEditor/          ← Live Editor system (CORE)
│   ├── 📁 context/         ← Context & stores
│   └── 📁 editorSidebar/   ← EditorSidebar system
├── 📁 dashboard/           ← Dashboard system
├── 📁 GA4/                 ← Google Analytics
└── 📄 [System Docs]        ← System-wide features
```

---

## 🔴 COMPONENTS DOCUMENTATION

**Location:** `docs/important/components/`

| File | Purpose | Use When |
|------|---------|----------|
| `README.md` | Complete overview & decision tree | Choosing which doc to read |
| `ADD_NEW_COMPONENT.md` | Full guide (2003 lines) | Creating new component manually |
| `ADD_NEW_COMPONENT_PROMPT.md` | AI prompts & templates | Creating component with AI |
| `FIX_COMPONENT_PROMPT.md` | Diagnostic & repair system | Fixing broken component |
| `FIX_COMPONENT_QUICK_START.md` | Quick repair reference | Fast fixes for common issues |

**Key Topics:**
- 9-step component creation process
- 7-step React component pattern
- 4 required functions (ensureVariant, getData, setData, updateByPath)
- 7 diagnostic layers for repair
- Integration with editorStore
- Structure definitions
- Common patterns and pitfalls

**Quick Commands:**
```bash
# Create component
@docs/important/components/ADD_NEW_COMPONENT_PROMPT.md

# Fix component
@docs/important/components/FIX_COMPONENT_PROMPT.md

# Quick fix
@docs/important/components/FIX_COMPONENT_QUICK_START.md
```

---

## 🔴 LIVE EDITOR DOCUMENTATION

**Location:** `docs/important/liveEditor/`

### **Core Documentation**

| File | Lines | Purpose | Priority |
|------|-------|---------|----------|
| `README.md` | - | Start here | 🔴 HIGH |
| `OVERVIEW.md` | - | System overview | 🔴 HIGH |
| `QUICK_START.md` | - | Quick start guide | 🔴 HIGH |
| `COMPONENT_ARCHITECTURE.md` | 1551 | Component system deep dive | 🔴 HIGH |
| `STATE_MANAGEMENT.md` | 1347 | Zustand state management | 🔴 HIGH |
| `DATA_FLOW.md` | - | Data flow patterns | 🔴 HIGH |
| `CORE_CONCEPTS.md` | - | Core concepts explained | 🟡 MEDIUM |
| `COMMON_PATTERNS.md` | - | Common patterns | 🟡 MEDIUM |
| `PRACTICAL_EXAMPLES.md` | - | Real-world examples | 🟡 MEDIUM |
| `TROUBLESHOOTING.md` | - | Problem solving | 🟢 LOW |

### **Advanced Topics**

| File | Purpose |
|------|---------|
| `API_REFERENCE.md` | API documentation |
| `CONTEXT_PROVIDERS.md` | Context providers |
| `DEBUG_AND_LOGGING.md` | Debugging system |
| `DRAG_DROP_SYSTEM.md` | Drag & drop mechanics |
| `I18N_TRANSLATION_SYSTEM.md` | Translation system |
| `IFRAME_SYSTEM.md` | IFrame integration |
| `TENANT_STORE_AND_API.md` | Tenant data management |

### **Context System**

**Location:** `docs/important/liveEditor/context/`

| File | Purpose | Priority |
|------|---------|----------|
| `README.md` | Context overview | 🔴 HIGH |
| `COMPONENT_INTEGRATION.md` | Component integration guide | 🔴 HIGH |
| `EDITOR_STORE_FUNCTIONS.md` | Store functions reference | 🔴 HIGH |
| `STORES_OVERVIEW.md` | All stores explained | 🟡 MEDIUM |
| `SUMMARY.md` | Quick summary | 🟢 LOW |
| `INDEX.md` | Context index | 🟢 LOW |

### **EditorSidebar System**

**Location:** `docs/important/liveEditor/editorSidebar/`

| File | Purpose | Priority |
|------|---------|----------|
| `README.md` | EditorSidebar overview | 🔴 HIGH |
| `OVERVIEW.md` | System overview | 🔴 HIGH |
| `COMPONENTS.md` | Components breakdown | 🟡 MEDIUM |
| `DATA_FLOW.md` | Data flow in sidebar | 🟡 MEDIUM |
| `FIELD_RENDERERS.md` | Field rendering system | 🟡 MEDIUM |

---

## 🟡 DASHBOARD DOCUMENTATION

**Location:** `docs/important/dashboard/`

| File | Purpose | Priority |
|------|---------|----------|
| `README.md` | Dashboard overview | 🔴 HIGH |
| `CORE_INFRASTRUCTURE.md` | Core infrastructure | 🔴 HIGH |
| `AUTHENTICATION.md` | Auth system | 🟡 MEDIUM |
| `DATA_FLOWS.md` | Data flows | 🟡 MEDIUM |
| `MODULES.md` | Module breakdown | 🟡 MEDIUM |
| `DEBUGGING.md` | Debugging guide | 🟢 LOW |
| `RELATED_SYSTEMS.md` | Related systems | 🟢 LOW |

---

## 🟡 GOOGLE ANALYTICS (GA4)

**Location:** `docs/important/GA4/`

| File | Lines | Purpose |
|------|-------|---------|
| `README.md` | 207 | GA4 overview |
| `ARCHITECTURE.md` | 996 | GA4 architecture |

**Key Topics:**
- GA4 integration
- Event tracking
- Custom events
- Analytics setup

---

## 🟢 SYSTEM-WIDE DOCUMENTATION

**Location:** `docs/important/`

### **Project Setup & Maintenance**

| File | Purpose |
|------|---------|
| `INDEX.md` | This file - Master documentation index |
| `MAINTENANCE_GUIDE.md` | How to keep docs updated |
| `HOW_TO_USE_CURSORRULES.md` | Guide to using .cursorrules |
| `.cursorrules` (root) | Cursor AI instruction file |

### **Loading & Caching**

| File | Lines | Purpose |
|------|-------|---------|
| `COMPONENT_LOADING_SYSTEM.md` | 1042 | How components load |
| `componentsCachingSystem.md` | - | Caching strategy |
| `ifDataDoesntExistPutTheDefaultDataOnTheEditorSidebar.md` | - | Default data handling |

### **Authentication & Security**

| File | Lines | Purpose |
|------|-------|---------|
| `AUTHENTICATION_SYSTEMS.md` | - | Auth systems overview |
| `RECAPTCHA_SYSTEM.md` | 1802 | reCAPTCHA integration |

### **Routing & Localization**

| File | Purpose |
|------|---------|
| `LOCALE_ROUTING_SYSTEM.md` | Routing & locales |
| `MIDDLEWARE_TENANT_DETECTION.md` | Tenant detection |
| `URL_QUERY_PARAMETERS.md` | URL params for property listings |

### **Other Systems**

| File | Purpose |
|------|---------|
| `metaDataIntegration.md` | SEO metadata system |
| `editorSidebarTranslationSystem.md` | Translation in sidebar |

---

## 🔍 SEARCH BY TOPIC

### **State Management**
- `liveEditor/STATE_MANAGEMENT.md` - Complete guide
- `liveEditor/context/STORES_OVERVIEW.md` - Store overview
- `liveEditor/context/EDITOR_STORE_FUNCTIONS.md` - Functions reference

### **Component Creation**
- `components/ADD_NEW_COMPONENT.md` - Manual creation
- `components/ADD_NEW_COMPONENT_PROMPT.md` - AI creation
- `liveEditor/COMPONENT_ARCHITECTURE.md` - Architecture

### **Component Repair**
- `components/FIX_COMPONENT_PROMPT.md` - Full diagnostic
- `components/FIX_COMPONENT_QUICK_START.md` - Quick fixes

### **Data Flow**
- `liveEditor/DATA_FLOW.md` - Data flow patterns
- `liveEditor/editorSidebar/DATA_FLOW.md` - Sidebar data flow
- `dashboard/DATA_FLOWS.md` - Dashboard data flows

### **Integration**
- `liveEditor/context/COMPONENT_INTEGRATION.md` - Component integration
- `liveEditor/CONTEXT_PROVIDERS.md` - Context providers

### **Debugging**
- `liveEditor/DEBUG_AND_LOGGING.md` - Debug system
- `liveEditor/TROUBLESHOOTING.md` - Troubleshooting
- `dashboard/DEBUGGING.md` - Dashboard debugging

### **Authentication**
- `AUTHENTICATION_SYSTEMS.md` - Auth overview
- `dashboard/AUTHENTICATION.md` - Dashboard auth

### **Translations & Routing**
- `liveEditor/I18N_TRANSLATION_SYSTEM.md` - i18n system
- `editorSidebarTranslationSystem.md` - Sidebar translations
- `LOCALE_ROUTING_SYSTEM.md` - Locale routing
- `URL_QUERY_PARAMETERS.md` - URL query parameters (filters)

---

## 🎯 DOCUMENTATION BY TASK

### **Task: Create New Component**
```
READ:
1. components/README.md (Overview)
2. components/ADD_NEW_COMPONENT.md (Steps 1-9)
3. liveEditor/COMPONENT_ARCHITECTURE.md (Architecture)

USE:
- components/ADD_NEW_COMPONENT_PROMPT.md (AI)

REFERENCE:
- liveEditor/context/COMPONENT_INTEGRATION.md
- liveEditor/STATE_MANAGEMENT.md
```

### **Task: Fix Broken Component**
```
READ:
1. components/FIX_COMPONENT_QUICK_START.md (Quick ref)
2. components/FIX_COMPONENT_PROMPT.md (Full protocol)

REFERENCE:
- components/ADD_NEW_COMPONENT.md (Correct patterns)
- liveEditor/TROUBLESHOOTING.md
```

### **Task: Modify editorStore**
```
READ:
1. liveEditor/STATE_MANAGEMENT.md (State patterns)
2. liveEditor/context/EDITOR_STORE_FUNCTIONS.md (Functions)
3. liveEditor/context/STORES_OVERVIEW.md (Store structure)

REFERENCE:
- liveEditor/COMPONENT_ARCHITECTURE.md
```

### **Task: Add EditorSidebar Field**
```
READ:
1. liveEditor/editorSidebar/README.md
2. liveEditor/editorSidebar/FIELD_RENDERERS.md
3. componentsStructure/types.ts (Field types)

REFERENCE:
- liveEditor/editorSidebar/DATA_FLOW.md
```

### **Task: Add Analytics Event**
```
READ:
1. GA4/README.md
2. GA4/ARCHITECTURE.md

REFERENCE:
- Existing analytics implementations
```

### **Task: Modify Authentication**
```
READ:
1. AUTHENTICATION_SYSTEMS.md
2. dashboard/AUTHENTICATION.md

REFERENCE:
- Existing auth flows
```

### **Task: Add Tenant Feature**
```
READ:
1. liveEditor/TENANT_STORE_AND_API.md
2. MIDDLEWARE_TENANT_DETECTION.md

REFERENCE:
- dashboard/DATA_FLOWS.md
```

### **Task: Implement URL-based Filtering**
```
READ:
1. URL_QUERY_PARAMETERS.md (Complete guide)
2. LOCALE_ROUTING_SYSTEM.md (Query params preservation)
3. URL_PARAMETERS_TEST_CHECKLIST.md (Testing)

REFERENCE:
- store/propertiesStore.ts (Filter state)
- hooks-liveeditor/use-url-filters.ts (Hook implementation)

CRITICAL:
- middleware.ts must preserve query params during redirects
- See line 329-331 for correct implementation
```

---

## 📊 DOCUMENTATION METRICS

```
Total Documentation Files: 59+
Total Lines of Documentation: 16,500+
Main Categories: 6
Average Doc Length: 280 lines
Most Detailed Doc: RECAPTCHA_SYSTEM.md (1802 lines)
Largest Section: liveEditor/ (25+ files)
Recent Additions: URL Query Parameters System (Oct 2025)
```

---

## 🔄 MAINTENANCE

### **Keep Docs Updated:**
- When architecture changes → Update architecture docs
- When patterns change → Update pattern docs
- When adding features → Update relevant docs
- When fixing bugs → Update troubleshooting docs

**See:** `MAINTENANCE_GUIDE.md` for full maintenance protocol

---

## 🎓 LEARNING PATH

### **Day 1: Basics**
```
1. liveEditor/README.md
2. liveEditor/OVERVIEW.md
3. components/README.md
4. .cursorrules
```

### **Day 2: Components**
```
1. components/ADD_NEW_COMPONENT.md (Overview)
2. liveEditor/COMPONENT_ARCHITECTURE.md
3. Study existing component (hero1.tsx)
4. Create simple component
```

### **Day 3: State**
```
1. liveEditor/STATE_MANAGEMENT.md
2. liveEditor/context/STORES_OVERVIEW.md
3. liveEditor/context/EDITOR_STORE_FUNCTIONS.md
4. Examine store code
```

### **Day 4: Integration**
```
1. liveEditor/context/COMPONENT_INTEGRATION.md
2. liveEditor/DATA_FLOW.md
3. Create component with full integration
```

### **Day 5+: Advanced**
```
1. liveEditor/COMMON_PATTERNS.md
2. liveEditor/PRACTICAL_EXAMPLES.md
3. Specialized docs as needed
```

---

## 🚀 QUICK ACTIONS

```bash
# Find doc about X
grep -r "X" docs/important/

# List all markdown files
find docs/important/ -name "*.md"

# Count total lines
find docs/important/ -name "*.md" -exec wc -l {} + | sort -n

# Search specific section
grep -r "component" docs/important/liveEditor/
```

---

## 📞 GETTING HELP

### **Can't Find What You Need?**
1. Use search functionality above
2. Check related topics section
3. Look at task-based docs
4. Review similar existing code
5. Check .cursorrules

### **Doc Needs Update?**
1. Note what's wrong/missing
2. Check MAINTENANCE_GUIDE.md
3. Update accordingly
4. Test examples still work
5. Update "Last Updated" date

---

## 🔗 EXTERNAL RESOURCES

### **Technologies Used:**
- Next.js: https://nextjs.org/docs
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/docs/
- Zustand: https://github.com/pmndrs/zustand
- Tailwind CSS: https://tailwindcss.com/docs

### **Related Patterns:**
- Component-based architecture
- State management patterns
- React hooks patterns
- TypeScript best practices

---

## 📋 DOCUMENTATION CHECKLIST

**Good Documentation Has:**
- [ ] Clear purpose statement
- [ ] Table of contents (if >300 lines)
- [ ] Code examples
- [ ] Use cases
- [ ] Common pitfalls
- [ ] Related docs links
- [ ] Last updated date
- [ ] Consistent formatting

**Check Before Publishing:**
- [ ] Examples work
- [ ] Links are valid
- [ ] Formatting correct
- [ ] No typos
- [ ] Added to this index
- [ ] Referenced in .cursorrules if important

---

## 🎯 PRIORITY READING

### **🔴 Must Read (Everyone):**
1. `.cursorrules`
2. `liveEditor/README.md`
3. `components/README.md`

### **🔴 Must Read (Component Work):**
1. `components/ADD_NEW_COMPONENT.md`
2. `liveEditor/COMPONENT_ARCHITECTURE.md`
3. `liveEditor/STATE_MANAGEMENT.md`

### **🟡 Should Read (Regular Development):**
1. `liveEditor/COMMON_PATTERNS.md`
2. `liveEditor/DATA_FLOW.md`
3. `liveEditor/TROUBLESHOOTING.md`

### **🟢 Reference As Needed:**
- All other docs based on specific task

---

## 📝 VERSION HISTORY

**v1.0** - Initial documentation structure
**v2.0** - Added component repair system
**v2.1** - Added this comprehensive index
**v2.2** - Added .cursorrules for Cursor AI
**v2.3** - Added maintenance guide and how-to-use guide

---

## 🔚 FOOTER

**Maintained By:** Development Team  
**Last Review:** 2025-10-26  
**Next Review:** When significant changes made

**Questions?** Check relevant docs or .cursorrules first.

---

**END OF INDEX**

Use Ctrl+F / Cmd+F to search within this document.

