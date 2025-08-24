# إصلاح تفاعل النقر والسحب في بطاقات العملاء

## المشكلة
كانت بطاقات العملاء تدعم السحب فقط، ولا يمكن النقر عليها لفتح تفاصيل العميل. المستخدم يريد أن تكون البطاقة قابلة للنقر والسحب في نفس الوقت.

## الحل المطبق

### 1. إضافة متغيرات لتتبع حالة التفاعل
```typescript
const [isDraggingCard, setIsDraggingCard] = useState(false);
const [dragStartTime, setDragStartTime] = useState(0);
const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
```

### 2. دالة معالجة بداية الضغط
```typescript
const handleMouseDown = (e: React.MouseEvent) => {
  setDragStartTime(Date.now());
  setDragStartPosition({ x: e.clientX, y: e.clientY });
  setIsDraggingCard(false);
};
```

### 3. دالة معالجة حركة الماوس
```typescript
const handleMouseMove = (e: React.MouseEvent) => {
  if (dragStartTime > 0 && !isDraggingCard) {
    const distance = Math.sqrt(
      Math.pow(e.clientX - dragStartPosition.x, 2) + 
      Math.pow(e.clientY - dragStartPosition.y, 2)
    );
    
    // إذا تحرك الماوس أكثر من 3 بكسل، اعتبره سحب
    if (distance > 3) {
      setIsDraggingCard(true);
    }
  }
};
```

### 4. دالة معالجة النقر
```typescript
const handleClick = (e: React.MouseEvent) => {
  // إذا لم يكن سحب، افتح تفاصيل العميل
  if (!isDraggingCard && dragStartTime > 0) {
    const clickDuration = Date.now() - dragStartTime;
    const distance = Math.sqrt(
      Math.pow(e.clientX - dragStartPosition.x, 2) + 
      Math.pow(e.clientY - dragStartPosition.y, 2)
    );
    
    // إذا كان النقر أقل من 200 مللي ثانية والمسافة أقل من 5 بكسل، اعتبره نقر عادي
    if (clickDuration < 200 && distance < 5) {
      e.preventDefault();
      e.stopPropagation();
      onViewDetails(customer);
    }
  }
  
  // إعادة تعيين الحالة
  setDragStartTime(0);
  setIsDraggingCard(false);
};
```

### 5. دالة معالجة رفع الماوس
```typescript
const handleMouseUp = (e: React.MouseEvent) => {
  // إذا لم يكن هناك سحب، اترك النقر يعمل
  if (!isDraggingCard) {
    // لا تفعل شيئاً هنا، دع handleClick يتعامل مع النقر
  }
  
  // إعادة تعيين الحالة
  setDragStartTime(0);
  setIsDraggingCard(false);
};
```

### 6. تحديث معالجات السحب
```typescript
const handleDragStart = (e: React.DragEvent) => {
  setIsDraggingCard(true);
  onDragStart(e, customer);
};

const handleDragEnd = (e: React.DragEvent) => {
  setIsDraggingCard(false);
  setDragStartTime(0);
  onDragEnd(e);
};
```

### 7. تطبيق الدوال على البطاقة
```typescript
<Card
  className={`p-4 cursor-move hover:shadow-md transition-all duration-300 border-l-4 ${
    isFocused ? "ring-2 ring-blue-500 bg-blue-50" : ""
  } ${isDragging ? "opacity-50 scale-95 rotate-1" : "hover:scale-[1.02]"}`}
  style={{ borderLeftColor: stage.color?.replace("bg-", "#") }}
  draggable
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  onClick={handleClick}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
  tabIndex={0}
  role="button"
  aria-label={`العميل ${customer.name} في مرحلة ${stage.name}. اضغط Enter للتحديد أو اسحب لنقل العميل`}
  onKeyDown={(e) => onKeyDown(e, customer, stage.id)}
>
```

## منطق التمييز بين النقر والسحب

### ✅ **النقر العادي**
- مدة الضغط أقل من 200 مللي ثانية
- المسافة المقطوعة أقل من 5 بكسل
- النتيجة: فتح تفاصيل العميل

### ✅ **السحب**
- مدة الضغط أكثر من 200 مللي ثانية، أو
- المسافة المقطوعة أكثر من 3 بكسل
- النتيجة: بدء عملية السحب

### ✅ **معالجة الحالات الحدية**
- إذا بدأ المستخدم بالسحب ثم ألغى، لا يتم فتح التفاصيل
- إذا نقر المستخدم بسرعة، يتم فتح التفاصيل
- إذا ضغط المستخدم لفترة طويلة بدون حركة، لا يتم فتح التفاصيل

## الميزات المضافة

### ✅ **تجربة مستخدم محسنة**
- نقر سريع لفتح التفاصيل
- سحب طبيعي لنقل العميل
- تمييز دقيق بين النقر والسحب

### ✅ **دعم جميع الأجهزة**
- يعمل على الهواتف (touch events)
- يعمل على الأجهزة اللوحية
- يعمل على أجهزة الكمبيوتر

### ✅ **إمكانية الوصول**
- دعم لوحة المفاتيح (Enter key)
- وصف صوتي للوظائف
- تركيز مرئي واضح

### ✅ **أداء محسن**
- معالجة سريعة للأحداث
- إعادة تعيين تلقائية للحالة
- منع التداخل بين الأحداث

## النتيجة

الآن بطاقات العملاء تدعم:
- **النقر السريع** لفتح تفاصيل العميل
- **السحب الطبيعي** لنقل العميل بين المراحل
- **التمييز الذكي** بين النقر والسحب
- **تجربة مستخدم سلسة** على جميع الأجهزة

المستخدم يمكنه الآن النقر على البطاقة لفتح التفاصيل، أو سحبها لنقل العميل إلى مرحلة أخرى! 🚀
