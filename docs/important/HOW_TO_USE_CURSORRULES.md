# How to Use .cursorrules - Quick Guide

## 🎯 What is .cursorrules?

`.cursorrules` is a special file that **trains Cursor AI** to understand your project deeply. It tells Cursor:
- What documentation to reference
- What patterns to follow
- What rules to enforce
- When to update docs

---

## ✅ What We've Set Up For You

### **1. `.cursorrules` File**
**Location:** Project root  
**Purpose:** Main AI instruction file

Contains:
- ✅ All 56+ documentation files indexed
- ✅ Priority system (Tier 1/2/3)
- ✅ Critical rules that must never be broken
- ✅ Component patterns
- ✅ State management rules
- ✅ Integration checklists
- ✅ Auto-update protocol

---

### **2. `docs/important/INDEX.md`**
**Purpose:** Complete documentation map

Contains:
- ✅ All 56+ files listed and categorized
- ✅ Search by topic
- ✅ Search by task
- ✅ Quick links
- ✅ Priority reading guide

---

### **3. `docs/important/MAINTENANCE_GUIDE.md`**
**Purpose:** How to keep docs updated

Contains:
- ✅ When to update documentation
- ✅ Update workflow
- ✅ Templates for common updates
- ✅ Quality checklists
- ✅ Common mistakes to avoid

---

## 🚀 How Cursor Will Use This

### **Before Any Change:**
```
Cursor AI will:
1. ✅ Read relevant documentation from .cursorrules
2. ✅ Understand the architecture
3. ✅ Follow existing patterns
4. ✅ Check all integration points
```

### **During Changes:**
```
Cursor AI will:
1. ✅ Follow the 7-step component pattern
2. ✅ Use proper state management
3. ✅ Update all required files
4. ✅ Maintain consistency
```

### **After Changes:**
```
Cursor AI will:
1. ✅ Verify all integration points
2. ✅ Check for documentation updates needed
3. ✅ Prompt you if docs need updating
4. ✅ Run quality checks
```

---

## 💬 How to Talk to Cursor Now

### **Method 1: Simple Commands** (Cursor knows context)

```
You: "Create pricing component"
Cursor: [Reads .cursorrules] → [Reads ADD_NEW_COMPONENT.md] → Creates perfectly

You: "Fix testimonials component"
Cursor: [Reads .cursorrules] → [Runs FIX_COMPONENT_PROMPT.md] → Fixes with report

You: "Add field to hero component"
Cursor: [Follows patterns from .cursorrules] → Updates correctly
```

---

### **Method 2: Reference Docs Explicitly**

```
You: "Create gallery component following @ADD_NEW_COMPONENT.md"
Cursor: [Uses specific guide] → Creates with all steps

You: "Fix pricing using @FIX_COMPONENT_PROMPT.md"
Cursor: [Runs full diagnostic] → Repairs systematically
```

---

### **Method 3: Ask for Explanation**

```
You: "Explain the 7-step component pattern"
Cursor: [References .cursorrules + docs] → Detailed explanation with examples

You: "Why do we use mergedData instead of props?"
Cursor: [References documentation] → Clear explanation with code examples
```

---

## 🎯 What Changed For You

### **Before .cursorrules:**
```
You: "Create pricing component"
Cursor: "How should I structure it?"
You: [Explains entire pattern]
Cursor: [Maybe gets it right]
You: [Fixes mistakes]
```

### **After .cursorrules:**
```
You: "Create pricing component"
Cursor: [Automatically knows pattern from .cursorrules]
Cursor: [Creates perfectly following all 9 steps]
Cursor: [Asks if you want to verify checklist]
You: ✅ Done!
```

---

## 📚 Documentation Always Available

Cursor now **automatically knows** about:

### **Component Work:**
- How to create components (9 steps)
- How to fix components (7 diagnostic layers)
- 7-step React pattern
- 4 required functions
- Integration points

### **State Management:**
- Zustand patterns
- Store structure
- Data flow
- Update patterns

### **Architecture:**
- Component architecture
- File organization
- Naming conventions
- Integration requirements

---

## 🔄 Auto-Update Protocol

### **When You Make Changes:**

```
1. Cursor detects code change
   ↓
2. Cursor checks .cursorrules for affected docs
   ↓
3. Cursor prompts you:
   "I've changed [X]. These docs may need updating:
   - docs/important/[Y].md
   - docs/important/[Z].md
   
   Should I update them?"
   ↓
4. You say "yes"
   ↓
5. Cursor updates docs automatically
   ↓
6. Cursor reports what was updated
```

---

## 🎓 Examples of What Cursor Can Do Now

### **Example 1: Complex Component Creation**

```
You: "Create multi-variant gallery component with 3 layouts"

Cursor automatically:
✅ Creates galleryFunctions.ts with 3 default data functions
✅ Creates gallery.ts structure with 3 variants
✅ Creates gallery1.tsx, gallery2.tsx, gallery3.tsx
✅ Updates editorStore.ts (import, state, 4 switch cases, functions)
✅ Updates ComponentsList.tsx (import, entries)
✅ Updates index files
✅ Adds translations
✅ Verifies checklist
✅ Reports completion with verification steps
```

---

### **Example 2: Fix Broken Component**

```
You: "Testimonials component not updating"

Cursor automatically:
✅ Runs 7 diagnostic layers
✅ Detects: Missing updateByPath switch case in editorStore
✅ Detects: Component using props instead of mergedData
✅ Fixes both issues
✅ Verifies fixes work
✅ Reports: "Fixed 2 critical issues. Component now functional."
```

---

### **Example 3: Maintain Documentation**

```
You: "Add new field 'rating' to testimonials"

Cursor automatically:
✅ Updates default data in testimonialsFunctions.ts
✅ Adds field to testimonials.ts structure
✅ Uses field in testimonials1.tsx with mergedData
✅ Prompts: "Should I update ADD_NEW_COMPONENT.md 
            to show this field type as an example?"
```

---

## 🚨 Critical Rules Cursor Will Enforce

### **Component Rules:**
```
✅ Always follow 7-step pattern
✅ Always use 4 required functions
✅ Always use uniqueId (props.id) not variantId
✅ Always use mergedData in render, NOT props
❌ Never skip switch cases
❌ Never use props.* directly in render
```

### **State Rules:**
```
✅ Always update both componentStates AND pageComponentsByPage
✅ Always use Zustand correctly
❌ Never mutate state directly
❌ Never bypass store functions
```

### **Integration Rules:**
```
✅ Always update all 7 integration files
✅ Always export in index files
✅ Always follow exact checklist
❌ Never skip integration steps
```

---

## 📊 What's Indexed in .cursorrules

### **56+ Documentation Files:**
```
✅ All component documentation (5 files)
✅ All Live Editor docs (25+ files)
✅ All dashboard docs (7 files)
✅ All system docs (15+ files)
✅ All patterns and examples
✅ All troubleshooting guides
```

### **Organized by Priority:**
```
🔴 Tier 1: Must read for component work
🟡 Tier 2: Reference for specific features
🟢 Tier 3: System-wide references
```

---

## 🎯 Practical Usage Tips

### **Tip 1: Trust the System**
```
Old way: "Let me check the docs first..."
New way: Just ask Cursor - it knows!
```

### **Tip 2: Be Specific When Needed**
```
Generic: "Fix this component"
Better: "Fix this component not updating"
Cursor: [Knows to check updateByPath + store subscriptions]
```

### **Tip 3: Ask for Explanations**
```
You: "Why are we doing it this way?"
Cursor: [Explains with references to docs]
```

### **Tip 4: Let Cursor Verify**
```
After changes:
You: "Verify this component is correct"
Cursor: [Runs through checklist] → Reports any issues
```

---

## 🔍 How to Verify It's Working

### **Test 1: Ask About Pattern**
```
You: "What's the 7-step component pattern?"
Expected: Cursor lists all 7 steps correctly
```

### **Test 2: Create Component**
```
You: "Create a simple banner component"
Expected: Cursor follows all 9 steps automatically
```

### **Test 3: Ask About Architecture**
```
You: "Where should I put component functions?"
Expected: Cursor says "context-liveeditor/editorStoreFunctions/"
```

### **Test 4: Ask About Rules**
```
You: "Can I use props directly in render?"
Expected: Cursor says "No, always use mergedData"
```

---

## 📝 Quick Reference Commands

```bash
# Create component
"Create [name] component"

# Fix component  
"Fix [name] component"

# Explain pattern
"Explain [pattern/concept]"

# Verify correctness
"Verify [name] component is correct"

# Update documentation
"Update docs for [what changed]"

# Find documentation
"Where is documentation about [topic]?"
```

---

## 🎓 Learning More

### **To Understand .cursorrules:**
```
Read: .cursorrules file itself
Read: docs/important/INDEX.md
Read: docs/important/MAINTENANCE_GUIDE.md
```

### **To Understand System:**
```
Read: docs/important/liveEditor/README.md
Read: docs/important/components/README.md
Read: .cursorrules (Rules section)
```

---

## 🔄 Keeping It Updated

### **The system updates itself:**
```
1. You make code changes
2. Cursor detects affected docs
3. Cursor prompts for updates
4. You approve
5. Cursor updates docs
6. Documentation stays current ✅
```

### **Manual updates (if needed):**
```
See: docs/important/MAINTENANCE_GUIDE.md
```

---

## 🎯 Benefits You Get

### **For You:**
```
✅ Faster development
✅ Fewer mistakes
✅ Consistent patterns
✅ Less repetition
✅ Better code quality
✅ Up-to-date documentation
```

### **For Team:**
```
✅ Same patterns everywhere
✅ Easy onboarding
✅ Self-documenting system
✅ Less code review issues
✅ Maintainable codebase
```

### **For Project:**
```
✅ Scalable architecture
✅ Consistent quality
✅ Easy to extend
✅ Well documented
✅ Future-proof
```

---

## 🚀 Next Steps

### **1. Try It Out:**
```
Ask Cursor: "Create a simple testimonials variant"
Watch: Cursor follows all patterns automatically
```

### **2. Explore Documentation:**
```
Open: docs/important/INDEX.md
Browse: All available documentation
```

### **3. Learn Patterns:**
```
Ask Cursor: "Explain the component system"
Read: Cursor's explanation with references
```

### **4. Start Building:**
```
You're ready! Cursor knows everything.
Just ask naturally and it will follow all rules.
```

---

## 🎉 You're All Set!

**Cursor AI now has:**
- ✅ Complete project knowledge
- ✅ All patterns and conventions
- ✅ All documentation indexed
- ✅ Quality enforcement rules
- ✅ Auto-update capability

**You can now:**
- 💬 Ask naturally
- 🚀 Build faster
- ✅ Get consistent results
- 📚 Access docs instantly
- 🔄 Keep docs updated automatically

---

## 📞 Questions?

```
"How do I [X]?" → Ask Cursor
"Where is [Y]?" → Ask Cursor
"Why do we [Z]?" → Ask Cursor

Cursor now knows everything! 🎯
```

---

**Enjoy your enhanced Cursor AI experience! 🚀**

---

**Last Updated:** 2025-10-26  
**System Version:** 2.2

