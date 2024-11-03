import { AccountListResType } from '@/schemaValidations/account.schema'
import { create } from 'zustand'

type AccountItem = AccountListResType['data'][0]

interface EmployeeManagementState {
  employeeIdEdit: number | undefined
  employeeDelete: AccountItem | null
  setEmployeeIdEdit: (value: number | undefined) => void
  setEmployeeDelete: (value: AccountItem | null) => void
}

export const useEmployeeManagementStore = create<EmployeeManagementState>()(
  (set) => ({
    employeeIdEdit: undefined,
    employeeDelete: null,
    setEmployeeIdEdit: (value) => set({ employeeIdEdit: value }),
    setEmployeeDelete: (value) => set({ employeeDelete: value }),
  }),
)
