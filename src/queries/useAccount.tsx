import accountApiRequest from '@/apiRequests/account'
import { QueryKey, QueryOptions } from '@/constants/type'
import {
  AccountListResType,
  AccountResType,
  UpdateEmployeeAccountBodyType,
} from '@/schemaValidations/account.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAccountMe = () => {
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: accountApiRequest.me,
  })
}

// export const useAccountMe = (onSuccess?: (data: AccountResType) => void) => {
//   return useQuery({
//     queryKey: ['account-profile'],
//     queryFn: () =>
//       accountApiRequest.me().then((res) => {
//         onSuccess && onSuccess(res.payload)
//         return res
//       }),
//   })
// }

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword,
  })
}

export const useGetAccountList = (
  options?: QueryOptions<AccountListResType>,
) => {
  return useQuery({
    queryKey: [QueryKey.ACCOUNTS],
    queryFn: accountApiRequest.list,
    ...options,
  })
}

export const useGetAccount = ({
  id,
  enabled,
  ...options
}: { id: number; enabled: boolean } & QueryOptions<AccountResType>) => {
  return useQuery({
    queryKey: [QueryKey.ACCOUNTS, id],
    queryFn: () => accountApiRequest.getEmployee(id),
    enabled,
    ...options,
  })
}

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.ACCOUNTS],
      })
    },
  })
}

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.ACCOUNTS],
        exact: true,
      })
    },
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.ACCOUNTS],
      })
    },
  })
}
