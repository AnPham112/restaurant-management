import accountApiRequest from '@/apiRequests/account'
import { useMutation, useQuery } from '@tanstack/react-query'

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
