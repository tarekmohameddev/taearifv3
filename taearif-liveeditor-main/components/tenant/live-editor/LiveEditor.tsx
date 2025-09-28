"use client";
import React from "react";

// استيراد الملفات المقسمة
import { useLiveEditorState, useLiveEditorComputed } from "./LiveEditorHooks";
import { useLiveEditorEffects } from "./LiveEditorEffects";
import { useLiveEditorHandlers } from "./LiveEditorHandlers";
import { LiveEditorUI } from "./LiveEditorUI";

// ============================================================================
// المكون الرئيسي - LiveEditor مقسم إلى ملفات أصغر
// ============================================================================

export default function LiveEditor() {
  // استخدام الـ hooks المقسمة
  const state = useLiveEditorState();
  const computed = useLiveEditorComputed(state);
  const handlers = useLiveEditorHandlers(state);

  // استخدام الـ effects
  useLiveEditorEffects(state);

  // عرض واجهة المستخدم
  return <LiveEditorUI state={state} computed={computed} handlers={handlers} />;
}
