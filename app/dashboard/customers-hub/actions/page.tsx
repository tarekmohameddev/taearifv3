"use client";

import React, { useEffect } from "react";
import { ActionsPage } from "@/components/customers-hub/actions/ActionsPage";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import mockCustomers from "@/lib/mock/customers-hub-data";
import { createIncomingAction } from "@/lib/utils/action-helpers";

export default function CustomersHubActionsPage() {
  const { setCustomers, customers, actions, setActions } = useUnifiedCustomersStore();

  // Load mock data on mount
  useEffect(() => {
    if (customers.length === 0) {
      setCustomers(mockCustomers);
      
      // Create incoming actions for all customers without existing actions
      const incomingActions = mockCustomers.map((customer) => 
        createIncomingAction(customer)
      );
      setActions(incomingActions);
    }
  }, [setCustomers, setActions, customers.length]);

  return <ActionsPage />;
}
