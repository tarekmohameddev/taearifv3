// context/store/userAuth.js
const userAuth = (set) => ({
  // بيانات المستخدم
  userIdentifier: "",
  userMethod: "email", // "email" أو "phone"

  // حالة إعادة تعيين كلمة المرور
  resetCode: "",
  isCodeVerified: false,
  resetAttempts: 3,
  isBlocked: false,

  // دوال التحديث
  setUserIdentifier: (identifier) => set({ userIdentifier: identifier }),
  setUserMethod: (method) => set({ userMethod: method }),
  setResetCode: (code) => set({ resetCode: code }),
  setIsCodeVerified: (verified) => set({ isCodeVerified: verified }),
  setResetAttempts: (attempts) => set({ resetAttempts: attempts }),
  setIsBlocked: (blocked) => set({ isBlocked: blocked }),

  // إعادة تعيين البيانات
  resetUserAuth: () =>
    set({
      userIdentifier: "",
      userMethod: "email",
      resetCode: "",
      isCodeVerified: false,
      resetAttempts: 3,
      isBlocked: false,
    }),
});

module.exports = userAuth;
