'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText, 
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

// Types
interface InputField {
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'currency';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  icon?: React.ReactNode;
  description?: string;
}

interface InputCard {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  customColors?: {
    primary?: string;
    secondary?: string;
    hover?: string;
    shadow?: string;
  };
  fields: InputField[];
  isCollapsible?: boolean;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddNew?: () => void;
  onSave?: (data: any) => void;
  onDelete?: (id: string) => void;
}

interface InputsProps {
  cards: InputCard[];
  onSubmit?: (data: any) => void;
  submitButtonText?: string;
  showSubmitButton?: boolean;
  className?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    submitButtonGradient?: string;
  };
}

// Dynamic color system - Fully customizable from props
const getDynamicColors = (card: InputCard, theme?: InputsProps['theme']) => {
  // If custom colors are provided, use them
  if (card.customColors) {
    return {
      primary: card.customColors.primary || '#3b82f6',
      secondary: card.customColors.secondary || '#2563eb',
      hover: card.customColors.hover || '#1d4ed8',
      shadow: card.customColors.shadow || 'rgba(59, 130, 246, 0.1)'
    };
  }

  // Default color palette
  const colorPalettes: Record<string, any> = {
    'blue': {
      primary: '#3b82f6',
      secondary: '#2563eb',
      hover: '#1d4ed8',
      shadow: 'rgba(59, 130, 246, 0.1)'
    },
    'indigo': {
      primary: '#6366f1',
      secondary: '#4f46e5',
      hover: '#4338ca',
      shadow: 'rgba(99, 102, 241, 0.1)'
    },
    'purple': {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      hover: '#6d28d9',
      shadow: 'rgba(139, 92, 246, 0.1)'
    },
    'pink': {
      primary: '#ec4899',
      secondary: '#db2777',
      hover: '#be185d',
      shadow: 'rgba(236, 72, 153, 0.1)'
    },
    'red': {
      primary: '#ef4444',
      secondary: '#dc2626',
      hover: '#b91c1c',
      shadow: 'rgba(239, 68, 68, 0.1)'
    },
    'green': {
      primary: '#10b981',
      secondary: '#059669',
      hover: '#047857',
      shadow: 'rgba(16, 185, 129, 0.1)'
    },
    'yellow': {
      primary: '#f59e0b',
      secondary: '#d97706',
      hover: '#b45309',
      shadow: 'rgba(245, 158, 11, 0.1)'
    },
    'orange': {
      primary: '#f97316',
      secondary: '#ea580c',
      hover: '#c2410c',
      shadow: 'rgba(249, 115, 22, 0.1)'
    },
    'teal': {
      primary: '#14b8a6',
      secondary: '#0d9488',
      hover: '#0f766e',
      shadow: 'rgba(20, 184, 166, 0.1)'
    },
    'cyan': {
      primary: '#06b6d4',
      secondary: '#0891b2',
      hover: '#0e7490',
      shadow: 'rgba(6, 182, 212, 0.1)'
    },
    'emerald': {
      primary: '#10b981',
      secondary: '#059669',
      hover: '#047857',
      shadow: 'rgba(16, 185, 129, 0.1)'
    },
    'violet': {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      hover: '#6d28d9',
      shadow: 'rgba(139, 92, 246, 0.1)'
    },
    'fuchsia': {
      primary: '#d946ef',
      secondary: '#c026d3',
      hover: '#a21caf',
      shadow: 'rgba(217, 70, 239, 0.1)'
    },
    'rose': {
      primary: '#f43f5e',
      secondary: '#e11d48',
      hover: '#be123c',
      shadow: 'rgba(244, 63, 94, 0.1)'
    },
    'sky': {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      hover: '#0369a1',
      shadow: 'rgba(14, 165, 233, 0.1)'
    },
    'lime': {
      primary: '#84cc16',
      secondary: '#65a30d',
      hover: '#4d7c0f',
      shadow: 'rgba(132, 204, 22, 0.1)'
    },
    'amber': {
      primary: '#f59e0b',
      secondary: '#d97706',
      hover: '#b45309',
      shadow: 'rgba(245, 158, 11, 0.1)'
    },
    'slate': {
      primary: '#64748b',
      secondary: '#475569',
      hover: '#334155',
      shadow: 'rgba(100, 116, 139, 0.1)'
    },
    'gray': {
      primary: '#6b7280',
      secondary: '#4b5563',
      hover: '#374151',
      shadow: 'rgba(107, 114, 128, 0.1)'
    },
    'zinc': {
      primary: '#71717a',
      secondary: '#52525b',
      hover: '#3f3f46',
      shadow: 'rgba(113, 113, 122, 0.1)'
    },
    'neutral': {
      primary: '#737373',
      secondary: '#525252',
      hover: '#404040',
      shadow: 'rgba(115, 115, 115, 0.1)'
    },
    'stone': {
      primary: '#78716c',
      secondary: '#57534e',
      hover: '#44403c',
      shadow: 'rgba(120, 113, 108, 0.1)'
    }
  };

  // Get colors from palette or use theme colors
  const palette = colorPalettes[card.color || 'blue'] || colorPalettes['blue'];
  
  // Override with theme colors if provided
  if (theme) {
    return {
      primary: theme.primaryColor || palette.primary,
      secondary: theme.secondaryColor || palette.secondary,
      hover: theme.accentColor || palette.hover,
      shadow: palette.shadow
    };
  }

  return palette;
};

// Main Component
const Inputs1: React.FC<InputsProps> = ({
  cards,
  onSubmit,
  submitButtonText = "حفظ البيانات",
  showSubmitButton = true,
  className = "",
  theme
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [collapsedCards, setCollapsedCards] = useState<Set<string>>(new Set());
  const [showPasswords, setShowPasswords] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  useEffect(() => {
    const initialData: Record<string, any> = {};
    cards.forEach(card => {
      card.fields.forEach(field => {
        initialData[field.id] = field.type === 'select' ? '' : '';
      });
    });
    setFormData(initialData);
  }, [cards]);

  // Handle input changes
  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  // Toggle card collapse
  const toggleCardCollapse = (cardId: string) => {
    setCollapsedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };


  // Toggle password visibility
  const togglePasswordVisibility = (fieldId: string) => {
    setShowPasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  };

  // Validate field
  const validateField = (field: InputField, value: any): string => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} مطلوب`;
    }

    if (field.validation) {
      const { min, max, pattern, message } = field.validation;
      
      if (min !== undefined && value && value < min) {
        return message || `القيمة يجب أن تكون أكبر من أو تساوي ${min}`;
      }
      
      if (max !== undefined && value && value > max) {
        return message || `القيمة يجب أن تكون أقل من أو تساوي ${max}`;
      }
      
      if (pattern && value && !new RegExp(pattern).test(value)) {
        return message || `تنسيق ${field.label} غير صحيح`;
      }
    }

    return '';
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    cards.forEach(card => {
      card.fields.forEach(field => {
        const error = validateField(field, formData[field.id]);
        if (error) {
          newErrors[field.id] = error;
          hasErrors = true;
        }
      });
    });

    setErrors(newErrors);

    if (!hasErrors && onSubmit) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }

    setIsSubmitting(false);
  };

  // Render input field
  const renderInputField = (field: InputField) => {
    const hasError = !!errors[field.id];
    const isPassword = field.type === 'password';
    const showPassword = showPasswords.has(field.id);

    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 mr-1">*</span>}
        </label>
        
        {field.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {field.description}
          </p>
        )}

        <div className="relative">
          {field.icon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {field.icon}
            </div>
          )}
          
          {field.type === 'textarea' ? (
            <textarea
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={`
                w-full px-4 py-3 pr-10 border rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-gray-800 dark:border-gray-600 dark:text-white
                ${hasError 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                }
              `}
              rows={4}
            />
          ) : field.type === 'select' ? (
            <select
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`
                w-full px-4 py-3 pr-10 border rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-gray-800 dark:border-gray-600 dark:text-white
                ${hasError 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                }
              `}
            >
              <option value="">اختر {field.label}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={isPassword && !showPassword ? 'password' : field.type}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={`
                w-full px-4 py-3 pr-10 border rounded-xl transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-gray-800 dark:border-gray-600 dark:text-white
                ${hasError 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                }
              `}
            />
          )}
          
          {isPassword && (
            <button
              type="button"
              onClick={() => togglePasswordVisibility(field.id)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center mt-2 text-red-500 text-sm"
          >
            <AlertCircle size={16} className="mr-1" />
            {errors[field.id]}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Render card
  const renderCard = (card: InputCard) => {
    const isCollapsed = collapsedCards.has(card.id);
    const colors = getDynamicColors(card, theme);

    return (
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
        style={{
          boxShadow: `0 10px 25px -5px ${colors.shadow}, 0 10px 10px -5px ${colors.shadow}`
        }}
      >
        {/* Card Header */}
        <div 
          className="p-6 text-white transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {card.icon && (
                <div className="p-2 bg-white/20 rounded-lg">
                  {card.icon}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold">{card.title}</h3>
                {card.description && (
                  <p className="text-white/80 text-sm mt-1">{card.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {card.isCollapsible && (
                <button
                  onClick={() => toggleCardCollapse(card.id)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <motion.div
                    animate={{ rotate: isCollapsed ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingUp size={20} />
                  </motion.div>
                </button>
              )}
              
            </div>
          </div>
        </div>

        {/* Card Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {card.fields.map(renderInputField)}
              </div>
              
              {card.showAddButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                  <button
                    onClick={card.onAddNew}
                    className="w-full py-3 px-4 text-white rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse font-medium"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                    }}
                  >
                    <Plus size={20} />
                    <span>{card.addButtonText || 'إضافة جديد'}</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className={`w-full max-w-7xl mx-auto p-4 ${className}`}>
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="space-y-8">
        {cards.map(renderCard)}
      </div>
      
      {showSubmitButton && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-4 text-white rounded-xl transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: theme?.submitButtonGradient || 
                'linear-gradient(135deg, #3b82f6 0%, #6366f1 25%, #8b5cf6 50%, #ec4899 75%, #f59e0b 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite'
            }}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <CheckCircle size={24} />
                <span>{submitButtonText}</span>
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Inputs1;
