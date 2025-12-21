"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorT } from "@/context-liveeditor/editorI18nStore";
import {
  getAvailableSectionsTranslated,
  getSectionIconTranslated,
} from "@/components/tenant/live-editor/EditorSidebar/constants";
import { DraggableDrawerItem } from "@/services-liveeditor/live-editor/dragDrop";

// Animation variants
const collapseVariants = {
  hidden: { height: 0, opacity: 0 },
  show: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

const slideInFromLeft = {
  hidden: { x: "-100%", opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeInOut" },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const listContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      when: "beforeChildren",
    },
  },
};

const listItem = {
  hidden: { y: 6, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.18 } },
};

export const ComponentsSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const t = useEditorT();

  // الحصول على الأقسام المترجمة
  const availableSections = useMemo(() => {
    return getAvailableSectionsTranslated(t);
  }, [t]);

  const filteredSections = useMemo(
    () =>
      availableSections.filter(
        (section) =>
          section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      ),
    [availableSections, searchTerm],
  );

  return (
    <motion.div
      key="components-sidebar"
      variants={slideInFromLeft}
      initial="hidden"
      animate="show"
      exit="exit"
      className="fixed left-0 top-15 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-30"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("live_editor.components")}
          </h2>
          <motion.button
            onClick={() => setIsExpanded((v) => !v)}
            className="p-1 rounded-md hover:bg-gray-100"
            whileTap={{ scale: 0.95 }}
            aria-expanded={isExpanded}
            aria-label="Toggle sidebar"
          >
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: "tween", duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </motion.button>
        </div>

        {/* Search */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="search"
              variants={collapseVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative"
              layout
            >
              <input
                type="text"
                placeholder={t("live_editor.search_components")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Components List - Coming Soon Overlay */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="list"
            variants={collapseVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex-1 overflow-y-auto p-4 relative"
            layout
          >
            <div className="relative">
              <motion.div
                variants={listContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-1.5"
              >
                {filteredSections.length > 0 ? (
                  filteredSections.map((section) => (
                    <motion.div
                      key={section.type}
                      variants={listItem}
                      className="group relative"
                    >
                      <DraggableDrawerItem
                        componentType={section.component}
                        section={section.section}
                        data={{
                          label: section.name,
                          description: section.description,
                          icon: section.type,
                        }}
                      >
                        <div className="p-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-grab active:cursor-grabbing">
                          <div className="flex flex-col items-center justify-center text-center space-y-1">
                            <div className="text-xl">
                              {getSectionIconTranslated(section.type, t)}
                            </div>
                            <h3 className="font-medium text-gray-900 text-xs leading-tight">
                              {section.name}
                            </h3>
                          </div>
                        </div>
                      </DraggableDrawerItem>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    variants={listItem}
                    className="col-span-2 text-center py-8 text-gray-500"
                  >
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p>{t("live_editor.no_components_found")}</p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

