// lib/final-quality-check.ts - التحقق النهائي الشامل من الجودة

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// أنواع التحقق
export interface QualityCheckResult {
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export interface QualityReport {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  successRate: number;
  results: QualityCheckResult[];
  recommendations: string[];
}

// التحقق من الملفات الأساسية
export const checkEssentialFiles = (): QualityCheckResult[] => {
  const results: QualityCheckResult[] = [];
  
  const essentialFiles = [
    'app/live-editor/page.tsx',
    'components/live-editor/LiveEditorPage.tsx',
    'context/StoreWithLiveEditor.js',
    'context-liveeditor/editorStore.ts',
    'context-liveeditor/tenantStore.jsx',
    'components/tenant/live-editor/LiveEditor.tsx',
    'components/tenant/live-editor/LiveEditorUI.tsx'
  ];
  
  essentialFiles.forEach(file => {
    const exists = existsSync(file);
    results.push({
      category: 'Essential Files',
      item: file,
      status: exists ? 'pass' : 'fail',
      message: exists ? 'File exists' : 'File missing',
      details: { path: file, exists }
    });
  });
  
  return results;
};

// التحقق من API Endpoints
export const checkAPIEndpoints = (): QualityCheckResult[] => {
  const results: QualityCheckResult[] = [];
  
  const apiEndpoints = [
    'pages/api/tenant/components.js',
    'pages/api/tenant/getTenant.js',
    'pages/api/tenant/save-pages.js',
    'pages/api/tenant/component-variants.js'
  ];
  
  apiEndpoints.forEach(endpoint => {
    const exists = existsSync(endpoint);
    results.push({
      category: 'API Endpoints',
      item: endpoint,
      status: exists ? 'pass' : 'fail',
      message: exists ? 'API endpoint exists' : 'API endpoint missing',
      details: { path: endpoint, exists }
    });
  });
  
  return results;
};

// التحقق من ملفات التوثيق
export const checkDocumentation = (): QualityCheckResult[] => {
  const results: QualityCheckResult[] = [];
  
  const documentationFiles = [
    'docs/live-editor-integration-guide.md',
    'docs/user-guide.md',
    'docs/api-reference.md',
    'docs/components-documentation.md',
    'docs/troubleshooting-guide.md',
    'docs/final-integration-report.md',
    'README-LiveEditor.md'
  ];
  
  documentationFiles.forEach(file => {
    const exists = existsSync(file);
    results.push({
      category: 'Documentation',
      item: file,
      status: exists ? 'pass' : 'fail',
      message: exists ? 'Documentation exists' : 'Documentation missing',
      details: { path: file, exists }
    });
  });
  
  return results;
};

// التحقق من ملفات التحسينات
export const checkEnhancementFiles = (): QualityCheckResult[] => {
  const results: QualityCheckResult[] = [];
  
  const enhancementFiles = [
    'lib/performance-optimizations.ts',
    'lib/security-enhancements.ts',
    'lib/code-quality-enhancements.ts',
    'lib/final-testing-suite.ts',
    'lib/deployment-setup.ts',
    'lib/final-quality-check.ts'
  ];
  
  enhancementFiles.forEach(file => {
    const exists = existsSync(file);
    results.push({
      category: 'Enhancement Files',
      item: file,
      status: exists ? 'pass' : 'fail',
      message: exists ? 'Enhancement file exists' : 'Enhancement file missing',
      details: { path: file, exists }
    });
  });
  
  return results;
};

// التحقق من جودة الكود
export const checkCodeQuality = (): QualityCheckResult[] => {
  const results: QualityCheckResult[] = [];
  
  // التحقق من وجود TypeScript
  const hasTypeScript = existsSync('tsconfig.json');
  results.push({
    category: 'Code Quality',
    item: 'TypeScript Configuration',
    status: hasTypeScript ? 'pass' : 'warning',
    message: hasTypeScript ? 'TypeScript configured' : 'TypeScript not configured',
    details: { hasTypeScript }
  });
  
  // التحقق من وجود ESLint
  const hasESLint = existsSync('.eslintrc.json') || existsSync('.eslintrc.js');
  results.push({
    category: 'Code Quality',
    item: 'ESLint Configuration',
    status: hasESLint ? 'pass' : 'warning',
    message: hasESLint ? 'ESLint configured' : 'ESLint not configured',
    details: { hasESLint }
  });
  
  // التحقق من وجود Prettier
  const hasPrettier = existsSync('.prettierrc') || existsSync('prettier.config.js');
  results.push({
    category: 'Code Quality',
    item: 'Prettier Configuration',
    status: hasPrettier ? 'pass' : 'warning',
    message: hasPrettier ? 'Prettier configured' : 'Prettier not configured',
    details: { hasPrettier }
  });
  
  return results;
};

// التحقق من الأمان
export const checkSecurity = (): QualityCheckResult[] => {
  const results: QualityCheckResult[] = [];
  
  // التحقق من وجود ملفات الأمان
  const securityFiles = [
    'lib/security-enhancements.ts',
    'middleware/authMiddleware.js'
  ];
  
  securityFiles.forEach(file => {
    const exists = existsSync(file);
    results.push({
      category: 'Security',
      item: file,
      status: exists ? 'pass' : 'warning',
      message: exists ? 'Security file exists' : 'Security file missing',
      details: { path: file, exists }
    });
  });
  
  // التحقق من وجود متغيرات البيئة
  const hasEnvExample = existsSync('.env.example');
  results.push({
    category: 'Security',
    item: 'Environment Variables',
    status: hasEnvExample ? 'pass' : 'warning',
    message: hasEnvExample ? 'Environment variables documented' : 'Environment variables not documented',
    details: { hasEnvExample }
  });
  
  return results;
};

// التحقق من الأداء
export const checkPerformance = (): QualityCheckResult[] => {
  const results: QualityCheckResult[] = [];
  
  // التحقق من وجود ملفات تحسين الأداء
  const performanceFiles = [
    'lib/performance-optimizations.ts',
    'next.config.mjs'
  ];
  
  performanceFiles.forEach(file => {
    const exists = existsSync(file);
    results.push({
      category: 'Performance',
      item: file,
      status: exists ? 'pass' : 'warning',
      message: exists ? 'Performance file exists' : 'Performance file missing',
      details: { path: file, exists }
    });
  });
  
  return results;
};

// التحقق من التكامل
export const checkIntegration = (): QualityCheckResult[] => {
  const results: QualityCheckResult[] = [];
  
  // التحقق من وجود ملفات التكامل
  const integrationFiles = [
    'context/StoreWithLiveEditor.js',
    'components/live-editor/LiveEditorPage.tsx',
    'app/live-editor/page.tsx'
  ];
  
  integrationFiles.forEach(file => {
    const exists = existsSync(file);
    results.push({
      category: 'Integration',
      item: file,
      status: exists ? 'pass' : 'fail',
      message: exists ? 'Integration file exists' : 'Integration file missing',
      details: { path: file, exists }
    });
  });
  
  return results;
};

// التحقق من جاهزية النشر
export const checkDeploymentReadiness = (): QualityCheckResult[] => {
  const results: QualityCheckResult[] = [];
  
  // التحقق من وجود ملفات النشر
  const deploymentFiles = [
    'lib/deployment-setup.ts',
    'package.json',
    'next.config.mjs'
  ];
  
  deploymentFiles.forEach(file => {
    const exists = existsSync(file);
    results.push({
      category: 'Deployment',
      item: file,
      status: exists ? 'pass' : 'fail',
      message: exists ? 'Deployment file exists' : 'Deployment file missing',
      details: { path: file, exists }
    });
  });
  
  // التحقق من وجود Docker
  const hasDocker = existsSync('Dockerfile') || existsSync('docker-compose.yml');
  results.push({
    category: 'Deployment',
    item: 'Docker Configuration',
    status: hasDocker ? 'pass' : 'warning',
    message: hasDocker ? 'Docker configured' : 'Docker not configured',
    details: { hasDocker }
  });
  
  return results;
};

// تشغيل جميع التحققات
export const runAllQualityChecks = (): QualityReport => {
  const allResults: QualityCheckResult[] = [
    ...checkEssentialFiles(),
    ...checkAPIEndpoints(),
    ...checkDocumentation(),
    ...checkEnhancementFiles(),
    ...checkCodeQuality(),
    ...checkSecurity(),
    ...checkPerformance(),
    ...checkIntegration(),
    ...checkDeploymentReadiness()
  ];
  
  const totalChecks = allResults.length;
  const passedChecks = allResults.filter(r => r.status === 'pass').length;
  const failedChecks = allResults.filter(r => r.status === 'fail').length;
  const warningChecks = allResults.filter(r => r.status === 'warning').length;
  const successRate = (passedChecks / totalChecks) * 100;
  
  // توليد التوصيات
  const recommendations: string[] = [];
  
  if (failedChecks > 0) {
    recommendations.push('Fix failed checks before deployment');
  }
  
  if (warningChecks > 0) {
    recommendations.push('Address warnings for better quality');
  }
  
  if (successRate < 90) {
    recommendations.push('Improve overall quality score');
  }
  
  return {
    totalChecks,
    passedChecks,
    failedChecks,
    warningChecks,
    successRate,
    results: allResults,
    recommendations
  };
};

// تقرير مفصل
export const generateDetailedReport = (): string => {
  const report = runAllQualityChecks();
  
  let reportText = `# تقرير التحقق النهائي من الجودة\n\n`;
  reportText += `## ملخص النتائج\n\n`;
  reportText += `- **إجمالي التحققات:** ${report.totalChecks}\n`;
  reportText += `- **التحققات الناجحة:** ${report.passedChecks}\n`;
  reportText += `- **التحققات الفاشلة:** ${report.failedChecks}\n`;
  reportText += `- **التحققات التحذيرية:** ${report.warningChecks}\n`;
  reportText += `- **معدل النجاح:** ${report.successRate.toFixed(2)}%\n\n`;
  
  reportText += `## النتائج التفصيلية\n\n`;
  
  // تجميع النتائج حسب الفئة
  const categories = [...new Set(report.results.map(r => r.category))];
  
  categories.forEach(category => {
    reportText += `### ${category}\n\n`;
    const categoryResults = report.results.filter(r => r.category === category);
    
    categoryResults.forEach(result => {
      const statusIcon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
      reportText += `- ${statusIcon} **${result.item}:** ${result.message}\n`;
    });
    
    reportText += `\n`;
  });
  
  if (report.recommendations.length > 0) {
    reportText += `## التوصيات\n\n`;
    report.recommendations.forEach(rec => {
      reportText += `- ${rec}\n`;
    });
  }
  
  return reportText;
};

// تصدير جميع الوظائف
export const qualityCheck = {
  checkEssentialFiles,
  checkAPIEndpoints,
  checkDocumentation,
  checkEnhancementFiles,
  checkCodeQuality,
  checkSecurity,
  checkPerformance,
  checkIntegration,
  checkDeploymentReadiness,
  runAllQualityChecks,
  generateDetailedReport
};

export default qualityCheck;
