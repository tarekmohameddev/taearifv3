"use client";

import { useMemo, useState, useEffect } from "react";
import Select, { MultiValue, StylesConfig } from "react-select";
import { getPermissionGroupAr } from "@/lib/permissionGroupsTranslation";

// Types
interface Permission {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  guard_name: string;
  team_id: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  pivot?: {
    model_id: number;
    permission_id: number;
    model_type: string;
    team_id: number;
  };
}

interface PermissionsResponse {
  status: string;
  data: Permission[];
  grouped: {
    [key: string]: Permission[];
  };
  templates: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

interface OptionType {
  value: string;
  label: string;
  isGroup?: boolean;
  groupName?: string;
  permission?: Permission;
}

interface PermissionsDropdownProps {
  permissions: PermissionsResponse | null;
  selectedPermissions: { [key: string]: boolean };
  handlePermissionChange: (permissionName: string, checked: boolean) => void;
  handleGroupPermissionChange: (groupName: string, checked: boolean) => void;
  isLoading?: boolean;
}

export function PermissionsDropdown({
  permissions,
  selectedPermissions,
  handlePermissionChange,
  handleGroupPermissionChange,
  isLoading = false,
}: PermissionsDropdownProps) {
  const [menuPortalTarget, setMenuPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMenuPortalTarget(document.body);
  }, []);

  // Convert permissions data to react-select format
  const options = useMemo(() => {
    if (!permissions || !permissions.grouped) return [];

    const formattedOptions: OptionType[] = [];

    Object.entries(permissions.grouped).forEach(([groupName, groupPermissions]) => {
      // Add parent option (group)
      const groupLabel = getPermissionGroupAr(groupName) || groupName.replace(/\./g, " ");
      formattedOptions.push({
        value: `group:${groupName}`,
        label: `${groupLabel} (${groupPermissions.length} صلاحية)`,
        isGroup: true,
        groupName: groupName,
      });

      // Add child options (permissions)
      groupPermissions.forEach((permission) => {
        const permissionLabel =
          permission.name_ar || permission.name_en || permission.name;
        formattedOptions.push({
          value: `permission:${permission.name}`,
          label: permissionLabel,
          isGroup: false,
          groupName: groupName,
          permission: permission,
        });
      });
    });

    return formattedOptions;
  }, [permissions]);

  // Get currently selected values
  const selectedValues = useMemo(() => {
    const values: OptionType[] = [];

    if (!permissions || !permissions.grouped) return values;

    Object.entries(permissions.grouped).forEach(([groupName, groupPermissions]) => {
      // Check if all permissions in group are selected
      const allSelected = groupPermissions.every(
        (p) => selectedPermissions[p.name] === true
      );
      const someSelected = groupPermissions.some(
        (p) => selectedPermissions[p.name] === true
      );

      if (allSelected && groupPermissions.length > 0) {
        // Add group if all children selected
        const groupLabel = getPermissionGroupAr(groupName) || groupName.replace(/\./g, " ");
        values.push({
          value: `group:${groupName}`,
          label: `${groupLabel} (${groupPermissions.length} صلاحية)`,
          isGroup: true,
          groupName: groupName,
        });
      } else if (someSelected) {
        // Add individual permissions if only some selected
        groupPermissions.forEach((permission) => {
          if (selectedPermissions[permission.name]) {
            const permissionLabel =
              permission.name_ar || permission.name_en || permission.name;
            values.push({
              value: `permission:${permission.name}`,
              label: permissionLabel,
              isGroup: false,
              groupName: groupName,
              permission: permission,
            });
          }
        });
      }
    });

    return values;
  }, [permissions, selectedPermissions]);

  // Handle selection change
  const handleChange = (selected: MultiValue<OptionType>) => {
    if (!permissions || !permissions.grouped) return;

    const selectedArray = selected || [];
    const newSelectedPermissions: { [key: string]: boolean } = {};

    // Initialize all permissions as false
    Object.values(permissions.grouped).forEach((groupPermissions) => {
      groupPermissions.forEach((permission) => {
        newSelectedPermissions[permission.name] = false;
      });
    });

    // Process selected items
    selectedArray.forEach((option) => {
      if (option.isGroup && option.groupName) {
        // If group selected, select all its permissions
        const groupPermissions = permissions.grouped[option.groupName] || [];
        groupPermissions.forEach((permission) => {
          newSelectedPermissions[permission.name] = true;
        });
      } else if (option.permission) {
        // If individual permission selected
        newSelectedPermissions[option.permission.name] = true;
      }
    });

    // Update all permissions that changed
    Object.keys(newSelectedPermissions).forEach((permissionName) => {
      const isSelected = newSelectedPermissions[permissionName];
      const wasSelected = selectedPermissions[permissionName] === true;
      if (isSelected !== wasSelected) {
        handlePermissionChange(permissionName, isSelected);
      }
    });
  };

  // Custom styles for react-select
  const customStyles: StylesConfig<OptionType, true> = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#000" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #000" : "none",
      "&:hover": {
        borderColor: "#000",
      },
      minHeight: "32px",
      maxWidth: "400px",
      width: "100%",
      padding: "2px 4px",
      fontSize: "12px",
    }),
    menu: (provided) => ({
      ...provided,
      maxWidth: "400px",
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#000"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#111827",
      paddingRight: state.data.isGroup ? "12px" : "36px",
      paddingLeft: state.data.isGroup ? "12px" : "12px",
      paddingTop: "4px",
      paddingBottom: "4px",
      fontSize: "12px",
      fontWeight: state.data.isGroup ? "600" : "400",
      lineHeight: "1.4",
      direction: "rtl",
      textAlign: "right",
      "&:active": {
        backgroundColor: state.isSelected ? "#000" : "#e5e7eb",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
      margin: "2px",
      padding: "0",
      fontSize: "11px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#111827",
      padding: "2px 4px",
      fontSize: "11px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#111827",
      padding: "2px 4px",
      fontSize: "11px",
      "&:hover": {
        backgroundColor: "#e5e7eb",
        color: "#111827",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "12px",
    }),
    input: (provided) => ({
      ...provided,
      fontSize: "12px",
      margin: "0",
      padding: "0",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "12px",
    }),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          <span className="text-sm text-gray-600 font-medium">
            جاري تحميل الصلاحيات...
          </span>
        </div>
      </div>
    );
  }

  if (!permissions || Object.keys(permissions.grouped).length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-gray-600">لا توجد صلاحيات متاحة</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px]">
      <Select<OptionType, true>
        isMulti
        options={options}
        value={selectedValues}
        onChange={handleChange}
        styles={customStyles}
        placeholder="اختر الصلاحيات..."
        isSearchable
        isClearable
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        className="react-select-container"
        classNamePrefix="react-select"
        noOptionsMessage={() => "لا توجد خيارات"}
        loadingMessage={() => "جاري التحميل..."}
        menuPortalTarget={menuPortalTarget}
        menuPosition="fixed"
        menuShouldScrollIntoView={false}
      />
    </div>
  );
}

