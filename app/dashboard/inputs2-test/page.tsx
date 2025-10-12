"use client";

import React from "react";
import { Inputs2, Inputs2Example } from "@/components/tenant/inputs";

const Inputs2TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            اختبار Inputs2 Component
          </h1>
          <p className="text-lg text-gray-600">
            صفحة اختبار لمكون Inputs2 الجديد
          </p>
        </div>

        <div className="space-y-8">
          {/* Test 1: Basic Inputs2 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              اختبار 1: Inputs2 الأساسي
            </h2>
            <Inputs2
              useStore={false}
              variant="inputs2"
              id="test1"
              apiEndpoint="/api/test-form"
            />
          </div>

          {/* Test 2: Inputs2 with Store */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              اختبار 2: Inputs2 مع Store
            </h2>
            <Inputs2
              useStore={true}
              variant="inputs2"
              id="test2"
              apiEndpoint="/api/test-form"
            />
          </div>

          {/* Test 3: Inputs2Example */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              اختبار 3: Inputs2Example
            </h2>
            <Inputs2Example />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inputs2TestPage;
