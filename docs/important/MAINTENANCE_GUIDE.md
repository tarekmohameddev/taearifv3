# Documentation Maintenance Guide

## 🎯 Purpose

This guide explains **how and when to update documentation** to keep it in sync with the codebase.

**Critical Rule:** Documentation MUST stay in sync with code. Outdated docs are worse than no docs.

---

## 📋 WHEN TO UPDATE DOCUMENTATION

### **🔴 MUST UPDATE (Critical)**

Update documentation **IMMEDIATELY** when:

```typescript
✅ Adding new component type
   → Update: components/ADD_NEW_COMPONENT.md (if pattern changed)
   → Update: INDEX.md (add to list)

✅ Changing component creation process
   → Update: components/ADD_NEW_COMPONENT.md
   → Update: components/ADD_NEW_COMPONENT_PROMPT.md
   → Update: .cursorrules

✅ Modifying editorStore structure
   → Update: liveEditor/STATE_MANAGEMENT.md
   → Update: liveEditor/context/EDITOR_STORE_FUNCTIONS.md
   → Update: liveEditor/context/STORES_OVERVIEW.md

✅ Changing data flow patterns
   → Update: liveEditor/DATA_FLOW.md
   → Update: liveEditor/context/COMPONENT_INTEGRATION.md

✅ Adding/removing required steps
   → Update: Relevant step-by-step guides
   → Update: Checklists
   → Update: Templates

✅ Changing file structure
   → Update: All docs with file paths
   → Update: INDEX.md
   → Update: .cursorrules

✅ Modifying integration points
   → Update: Integration docs
   → Update: Architecture docs
```

---

### **🟡 SHOULD UPDATE (High Priority)**

Update documentation **SOON** when:

```typescript
✅ Adding new features
   → Update: Feature-specific docs
   → Add examples
   → Update INDEX.md

✅ Changing patterns/conventions
   → Update: COMMON_PATTERNS.md
   → Update: .cursorrules
   → Update: Component guides

✅ Fixing major bugs
   → Update: TROUBLESHOOTING.md
   → Add to common issues

✅ Adding new best practices
   → Update: Best practices sections
   → Update: .cursorrules

✅ Changing TypeScript types
   → Update: Type references
   → Update: Code examples
```

---

### **🟢 CAN UPDATE (Medium Priority)**

Update documentation **EVENTUALLY** when:

```typescript
✅ Improving performance
   → Update: Performance sections
   → Add tips

✅ Adding convenience functions
   → Update: API reference
   → Add examples

✅ Refactoring (no behavior change)
   → Update: Code examples if affected

✅ Adding tests
   → Update: Testing sections

✅ Improving error messages
   → Update: Troubleshooting docs
```

---

### **⚪ NO UPDATE NEEDED**

These changes DON'T require doc updates:

```typescript
❌ Bug fixes (no pattern change)
❌ Internal refactoring (same API)
❌ Code formatting
❌ Minor variable renaming
❌ Adding comments to code
❌ Fixing typos in code
❌ Updating dependencies (same usage)
```

---

## 🔄 UPDATE WORKFLOW

### **Step-by-Step Process:**

```
1. MAKE CODE CHANGE
   ↓
2. IDENTIFY AFFECTED DOCS
   - What changed?
   - Which docs describe this?
   - Are there code examples?
   ↓
3. UPDATE DOCUMENTATION
   - Fix descriptions
   - Update code examples
   - Update diagrams/flowcharts
   - Update checklists
   ↓
4. UPDATE METADATA
   - Add "Last Updated" date
   - Note what changed (optional)
   ↓
5. UPDATE INDEX
   - Update INDEX.md if needed
   - Update .cursorrules if critical
   ↓
6. VERIFY EXAMPLES
   - Test code examples still work
   - Check links are valid
   ↓
7. COMMIT TOGETHER
   - Commit code + docs together
   - Mention doc update in commit message
```

---

## 📝 DOCUMENTATION UPDATE TEMPLATES

### **Template 1: Adding New Component Pattern**

```markdown
## AFFECTED DOCS:
- components/ADD_NEW_COMPONENT.md
- .cursorrules
- INDEX.md

## UPDATES NEEDED:

### In ADD_NEW_COMPONENT.md:
- [ ] Add pattern to "Common Patterns" section
- [ ] Add example
- [ ] Update relevant steps if needed
- [ ] Add to troubleshooting if applicable

### In .cursorrules:
- [ ] Add to component rules if critical
- [ ] Add to checklist if required step

### In INDEX.md:
- [ ] Update if new file created
- [ ] Add to search by topic if significant

## AFTER UPDATE:
- [ ] Test example code
- [ ] Verify formatting
- [ ] Update "Last Updated"
```

---

### **Template 2: Changing Store Structure**

```markdown
## AFFECTED DOCS:
- liveEditor/STATE_MANAGEMENT.md
- liveEditor/context/EDITOR_STORE_FUNCTIONS.md
- liveEditor/context/STORES_OVERVIEW.md
- .cursorrules

## UPDATES NEEDED:

### In STATE_MANAGEMENT.md:
- [ ] Update interface definition
- [ ] Update state structure diagram
- [ ] Update code examples
- [ ] Update explanations

### In EDITOR_STORE_FUNCTIONS.md:
- [ ] Update function signatures
- [ ] Update examples
- [ ] Add new functions if any

### In STORES_OVERVIEW.md:
- [ ] Update overview diagram
- [ ] Update state properties list

### In .cursorrules:
- [ ] Update state management rules if needed

## AFTER UPDATE:
- [ ] Verify all examples correct
- [ ] Check no broken references
- [ ] Update dates
```

---

### **Template 3: Adding New Feature**

```markdown
## AFFECTED DOCS:
- Feature-specific doc (or create new)
- INDEX.md
- README.md (if major)
- .cursorrules (if has rules)

## UPDATES NEEDED:

### Create/Update Feature Doc:
- [ ] Purpose/overview
- [ ] How to use
- [ ] API reference
- [ ] Examples
- [ ] Common issues

### In INDEX.md:
- [ ] Add to appropriate section
- [ ] Add to search by topic
- [ ] Update documentation metrics

### In README.md:
- [ ] Add to features list (if major)
- [ ] Update quick start (if affects it)

### In .cursorrules:
- [ ] Add rules if critical
- [ ] Add to checklists if required

## AFTER UPDATE:
- [ ] Examples work
- [ ] Links valid
- [ ] Formatting consistent
```

---

## 🔍 FINDING AFFECTED DOCUMENTATION

### **Quick Search Commands:**

```bash
# Find all mentions of a component
grep -r "componentName" docs/important/

# Find all code examples
grep -r "```typescript" docs/important/

# Find all links to a file
grep -r "filename.ts" docs/important/

# Find all step-by-step guides
grep -r "STEP [0-9]" docs/important/

# Find all checklists
grep -r "- \[ \]" docs/important/
```

---

### **Documentation Impact Map:**

```
CODE CHANGE                    → AFFECTED DOCS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Component files changed        → components/*
                               → liveEditor/COMPONENT_ARCHITECTURE.md

editorStore.ts changed         → liveEditor/STATE_MANAGEMENT.md
                               → liveEditor/context/*

ComponentsList.tsx changed     → liveEditor/COMPONENT_ARCHITECTURE.md
                               → components/ADD_NEW_COMPONENT.md

componentsStructure/* changed  → components/ADD_NEW_COMPONENT.md
                               → liveEditor/COMPONENT_ARCHITECTURE.md

Functions files changed        → liveEditor/context/EDITOR_STORE_FUNCTIONS.md
                               → components/ADD_NEW_COMPONENT.md

Integration changed            → liveEditor/context/COMPONENT_INTEGRATION.md
                               → components/ADD_NEW_COMPONENT.md

Data flow changed              → liveEditor/DATA_FLOW.md
                               → liveEditor/editorSidebar/DATA_FLOW.md

EditorSidebar changed          → liveEditor/editorSidebar/*

Dashboard changed              → dashboard/*

Auth changed                   → AUTHENTICATION_SYSTEMS.md
                               → dashboard/AUTHENTICATION.md

GA4 changed                    → GA4/*

System-wide change             → Multiple docs + .cursorrules
```

---

## ✅ DOCUMENTATION QUALITY CHECKLIST

### **Before Updating:**
```
□ Understand what changed completely
□ Identify all affected documentation
□ Have new code examples ready (tested)
□ Know if patterns/conventions changed
```

### **During Update:**
```
□ Update descriptions accurately
□ Update ALL code examples
□ Update diagrams if present
□ Update checklists
□ Update file paths if changed
□ Update function signatures
□ Keep formatting consistent
□ Add examples if new feature
```

### **After Update:**
```
□ Test all code examples work
□ Verify all links are valid
□ Check formatting correct
□ No typos or grammar errors
□ Updated "Last Updated" date
□ Updated INDEX.md if needed
□ Updated .cursorrules if critical
□ Mentioned in commit message
```

---

## 🎯 DOCUMENTATION STANDARDS

### **Code Examples:**

```typescript
// ✅ GOOD - Complete, tested example
export const myFunction = (param: string): ReturnType => {
  // Clear implementation
  return result;
};

// ✅ GOOD - Shows context
// In heroFunctions.ts:
export const heroFunctions = {
  getData: (state, variantId) => state.heroStates[variantId] || {}
};

// ❌ BAD - Incomplete
export const myFunction = ...

// ❌ BAD - No context
getData: (state, variantId) => ...
```

---

### **File Paths:**

```markdown
✅ GOOD - Full relative path from root
context-liveeditor/editorStore.ts
components/tenant/hero/hero1.tsx

✅ GOOD - Clear directory
In `context-liveeditor/editorStoreFunctions/` directory

❌ BAD - Ambiguous
editorStore.ts
hero1.tsx
```

---

### **Step-by-Step Guides:**

```markdown
✅ GOOD - Clear numbered steps
STEP 1: Create functions file
STEP 2: Create structure file
STEP 3: Update editorStore

✅ GOOD - With code examples
STEP 1: Create functions file
```typescript
export const myFunctions = {
  // implementation
};
```

❌ BAD - Vague
1. Create file
2. Update store
```

---

### **Diagrams:**

```markdown
✅ GOOD - ASCII diagrams for flow
┌─────────────┐
│  Component  │
└──────┬──────┘
       ↓
┌─────────────┐
│    Store    │
└─────────────┘

✅ GOOD - Tree structures
components/
├── tenant/
│   └── hero/
│       └── hero1.tsx
└── ui/

❌ BAD - Too complex or unclear
[Complex diagram that's hard to maintain]
```

---

## 🚨 COMMON MISTAKES

### **Mistake 1: Updating Code, Forgetting Docs**

```typescript
// WRONG WORKFLOW:
1. Change code ✓
2. Test ✓
3. Commit ✓
4. [Documentation still outdated] ✗

// CORRECT WORKFLOW:
1. Change code ✓
2. Update documentation ✓
3. Test code + verify examples ✓
4. Commit code + docs together ✓
```

---

### **Mistake 2: Updating Only One Doc**

```typescript
// WRONG:
- Update STATE_MANAGEMENT.md ✓
- Forget EDITOR_STORE_FUNCTIONS.md ✗
- Forget code examples in other docs ✗

// CORRECT:
- Update STATE_MANAGEMENT.md ✓
- Update EDITOR_STORE_FUNCTIONS.md ✓
- Update all code examples ✓
- Update .cursorrules if needed ✓
```

---

### **Mistake 3: Breaking Examples**

```typescript
// WRONG:
- Update code ✓
- Update docs ✓
- Don't test examples ✗
- Examples don't work anymore ✗

// CORRECT:
- Update code ✓
- Update docs ✓
- Test all examples ✓
- Fix broken examples ✓
```

---

### **Mistake 4: Inconsistent Updates**

```markdown
WRONG:
- Update function signature in one place ✓
- Leave old signature in examples ✗
- Update some docs but not others ✗

CORRECT:
- Find ALL mentions (use grep) ✓
- Update consistently everywhere ✓
- Verify no old signatures remain ✓
```

---

## 🔄 VERSION CONTROL FOR DOCS

### **Commit Message Format:**

```bash
# For code + doc changes
feat: Add new component pattern

- Added multi-variant support
- Updated ADD_NEW_COMPONENT.md with new pattern
- Added example in COMMON_PATTERNS.md
- Updated .cursorrules

# For doc-only changes
docs: Update state management guide

- Updated store structure
- Fixed outdated code examples
- Added new patterns section

# For doc fixes
docs: Fix broken links in INDEX.md
```

---

### **What to Include in Commit:**

```bash
✅ Code changes + related doc changes together
✅ Multiple doc updates for same change
✅ INDEX.md update if structure changed

❌ Code change without doc update
❌ Unrelated doc changes mixed in
❌ Partial doc updates
```

---

## 📊 DOCUMENTATION REVIEW SCHEDULE

### **Regular Reviews:**

```
WEEKLY:
□ Check recent code changes
□ Verify docs were updated
□ Fix any inconsistencies

MONTHLY:
□ Review all code examples
□ Check all links
□ Update stale sections
□ Review metrics/statistics

QUARTERLY:
□ Major documentation audit
□ Reorganize if needed
□ Update architecture docs
□ Review all patterns
□ Update .cursorrules
```

---

## 🎓 DOCUMENTATION BEST PRACTICES

### **1. Write for the Reader**

```markdown
✅ GOOD - Clear and specific
To add a new component, follow these 9 steps...

❌ BAD - Vague
Add component somehow...
```

---

### **2. Show, Don't Just Tell**

```markdown
✅ GOOD - With example
Use mergedData instead of props:
```typescript
// ✓ Correct
<h1>{mergedData.content?.title}</h1>

// ✗ Wrong
<h1>{props.content?.title}</h1>
```

❌ BAD - Just telling
Use mergedData instead of props
```

---

### **3. Anticipate Questions**

```markdown
✅ GOOD - Answers why
We use mergedData because it merges defaults, store, and props in correct priority order.

❌ BAD - No explanation
Use mergedData.
```

---

### **4. Keep It Current**

```markdown
✅ GOOD
Last Updated: 2025-10-26
[Current, working examples]

❌ BAD
[No date]
[Outdated examples that don't work]
```

---

## 🔗 DOCUMENTATION LINKS

### **Internal Links:**

```markdown
✅ GOOD - Relative paths
See [Component Architecture](./liveEditor/COMPONENT_ARCHITECTURE.md)

✅ GOOD - Section links
See [Step 5](#step-5-update-structure)

❌ BAD - Absolute paths
See file:///C:/Users/...

❌ BAD - Broken links
See [Broken Link](./nonexistent.md)
```

---

### **External Links:**

```markdown
✅ GOOD - Official docs
Next.js: https://nextjs.org/docs

✅ GOOD - Stable URLs
React Hooks: https://react.dev/reference/react

❌ BAD - Temporary URLs
https://myblog.com/post-123
```

---

## 🎯 PRIORITY MATRIX

```
URGENCY vs IMPACT

HIGH IMPACT, HIGH URGENCY (Do First):
- Breaking changes
- New required steps
- Architecture changes
- Pattern changes

HIGH IMPACT, LOW URGENCY (Schedule):
- New features
- Major refactoring
- New best practices

LOW IMPACT, HIGH URGENCY (Do Quick):
- Bug fixes affecting docs
- Broken links
- Typos in critical sections

LOW IMPACT, LOW URGENCY (Backlog):
- Minor improvements
- Optional examples
- Style improvements
```

---

## 📞 GETTING HELP WITH DOCS

### **Questions to Ask:**

```
1. What exactly changed in the code?
2. Which documentation describes this?
3. Are there code examples affected?
4. Do patterns/conventions change?
5. Do users need to do something different?
6. Is this a breaking change?
7. Should .cursorrules be updated?
```

---

### **Resources:**

```
- INDEX.md - Find related docs
- .cursorrules - Check conventions
- Existing docs - Follow format
- Git history - See past doc updates
- grep - Find all mentions
```

---

## 🎯 MAINTENANCE CHECKLIST

### **After Every Code Change:**

```
□ Identified affected documentation
□ Updated all affected docs
□ Tested all code examples
□ Verified all links work
□ Updated INDEX.md if needed
□ Updated .cursorrules if critical
□ Added "Last Updated" dates
□ Mentioned in commit message
```

---

### **Monthly Maintenance:**

```
□ Reviewed recent changes
□ Fixed broken links
□ Updated stale examples
□ Checked formatting consistency
□ Reviewed metrics/statistics
□ Updated search/index sections
```

---

### **Quarterly Audit:**

```
□ Full documentation review
□ Reorganize if needed
□ Major updates to outdated sections
□ Review all patterns/conventions
□ Update architecture docs
□ Comprehensive link check
□ Review and update .cursorrules
```

---

## 🔚 CONCLUSION

**Remember:**

1. 📝 **Documentation is code** - Treat it with same care
2. ⏱️ **Update immediately** - Don't delay doc updates
3. ✅ **Test examples** - All code must work
4. 🔗 **Check links** - Broken links are unacceptable
5. 📊 **Stay organized** - Use templates and checklists
6. 🎯 **Think of readers** - Write for understanding
7. 🔄 **Review regularly** - Docs need maintenance too

**Good documentation = Maintainable codebase**

---

## 📝 RECENT CHANGES LOG

### October 26, 2025 - URL Query Parameters System

**Feature Added:** URL-based filtering for property listing pages

**Files Modified:**
- `middleware.ts` (Line 329-331) - **CRITICAL:** Preserve query params during locale redirect
- `store/propertiesStore.ts` (Line 250-255) - Add `search` and `type_id` to API requests
- `components/tenant/hero/hero1.tsx` - URL params integration, removed keywords field
- `components/tenant/grid/grid1.tsx` - Auto-apply URL params
- `components/property-filter.tsx` - Store integration

**Files Created:**
- `hooks-liveeditor/use-url-filters.ts` - Custom hook for URL parameter management
- `docs/important/URL_QUERY_PARAMETERS.md` - Complete documentation
- `docs/important/URL_PARAMETERS_TEST_CHECKLIST.md` - Testing guide
- `docs/important/URL_PARAMETERS_IMPLEMENTATION_SUMMARY.md` - Quick reference

**Documentation Updated:**
- `docs/important/LOCALE_ROUTING_SYSTEM.md` - Added query params preservation notes
- `docs/important/INDEX.md` - Added new documentation references

**Impact:**
- ✅ Users can now share filtered property searches via URL
- ✅ Search forms auto-fill from URL parameters
- ✅ Bookmarkable search results
- ✅ Deep linking with filters supported

**Testing Required:**
- See `URL_PARAMETERS_TEST_CHECKLIST.md` for 20 test cases

---

**Last Updated:** 2025-10-26  
**Next Review:** When significant changes made

---

**END OF MAINTENANCE GUIDE**

